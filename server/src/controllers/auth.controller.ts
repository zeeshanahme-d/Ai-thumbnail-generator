import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import {
  hashPassword,
  matchHashedPassword,
  simulatePasswordCheck,
} from "../helper/halper-functions.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  REFRESH_TOKEN_MAX_AGE,
  ACCESS_TOKEN_MAX_AGE,
} from "../helper/token-helpers.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AuthErrorCode } from "../constants/enums.js";
import { sendOtpEmail } from "../utils/email.js";
import { generateOtp, generateUniqueUsername, isDisposableEmail } from "../utils/helpers.js";
import { CREDIT_COST, MAX_OTP_ATTEMPTS, OTP_EXPIRY_MS } from "../constants/constants.js";

// ────────────────────────────────────────────── Helpers

type UserId = mongoose.Types.ObjectId | string;

interface SessionUser {
  _id: UserId;
  email: string;
  tokenVersion?: number;
}

const authCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge,
});

function setAccessCookie(res: Response, user: SessionUser) {
  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
    tv: user.tokenVersion ?? 0,
  });
  res.cookie("accessToken", accessToken, authCookieOptions(ACCESS_TOKEN_MAX_AGE));
}

function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}

// Ends every session of a user at once: access tokens fail the version check in
// authenticationToken, and refresh tokens are deleted so they cannot mint new ones.
async function revokeAllSessions(userId: UserId) {
  await userModel.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
  await refreshTokenModel.deleteMany({ userId });
}

async function resolveUserFromRefreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  // Only a plain string can be a token. cookie-parser turns "j:{...}" cookies into
  // objects, which would otherwise act as query operators in the lookup below.
  if (typeof token !== "string" || !token) {
    ApiResponse.error(res, 401, "No refresh token provided.", AuthErrorCode.RefreshMissing);
    return null;
  }

  // Must still exist in the DB (i.e. not logged out / revoked).
  const storedToken = await refreshTokenModel.findOne({ token });

  if (!storedToken) {
    ApiResponse.error(res, 401, "Invalid refresh token. Please log in again.", AuthErrorCode.RefreshInvalid);
    return null;
  }

  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    // Refresh token expired or tampered — drop it and require a new login.
    await refreshTokenModel.deleteOne({ token });
    res.clearCookie("refreshToken");
    ApiResponse.error(res, 401, "Refresh token expired. Please log in again.", AuthErrorCode.RefreshExpired);
    return null;
  }

  const user = await userModel.findById(payload.userId).select("+tokenVersion");

  if (!user) {
    ApiResponse.error(res, 401, "User no longer exists.", "Unauthorized");
    return null;
  }

  if ((payload.tv ?? 0) !== (user.tokenVersion ?? 0)) {
    await refreshTokenModel.deleteOne({ token });
    clearAuthCookies(res);
    ApiResponse.error(res, 401, "Your session has ended. Please log in again.", AuthErrorCode.RefreshInvalid);
    return null;
  }

  return user;
}

// ────────────────────────────────────────────── One-time codes

type OtpPurpose = "reset-password" | "verify-email";

const OTP_FIELDS = {
  "reset-password": {
    hash: "resetPasswordOtp",
    expiresAt: "resetPasswordOtpExpiresAt",
    attempts: "resetPasswordOtpAttempts",
  },
  "verify-email": {
    hash: "emailVerificationOtp",
    expiresAt: "emailVerificationOtpExpiresAt",
    attempts: "emailVerificationOtpAttempts",
  },
} as const;

// Same text for every failure, so it never reveals whether the account exists.
const OTP_ERROR = "Invalid or expired code. Request a new code if this one keeps failing.";

async function clearOtp(userId: UserId, purpose: OtpPurpose) {
  const fields = OTP_FIELDS[purpose];
  await userModel.updateOne(
    { _id: userId },
    { $unset: { [fields.hash]: 1, [fields.expiresAt]: 1, [fields.attempts]: 1 } },
  );
}

// Stores a new hashed code with a fresh expiry and attempt counter, then emails it.
// If sending fails the code is removed so it can never be used.
async function issueOtp(userId: UserId, email: string, purpose: OtpPurpose) {
  const fields = OTP_FIELDS[purpose];
  const otp = generateOtp();

  await userModel.updateOne(
    { _id: userId },
    {
      $set: {
        [fields.hash]: await hashPassword(otp),
        [fields.expiresAt]: new Date(Date.now() + OTP_EXPIRY_MS),
        [fields.attempts]: 0,
      },
    },
  );

  try {
    await sendOtpEmail(email, otp, purpose);
  } catch (error) {
    await clearOtp(userId, purpose);
    throw error;
  }
}

// Replies never wait for the email, so every address gets the same answer in the same time.
function sendOtpInBackground(userId: UserId, email: string, purpose: OtpPurpose) {
  issueOtp(userId, email, purpose).catch((error) => {
    console.error(`Failed to send ${purpose} email:`, error);
  });
}

// Counts the attempt before comparing, in one atomic update, so parallel guesses
// cannot get past MAX_OTP_ATTEMPTS. Returns the user only when the code matches.
async function consumeOtp(email: string, otp: string, purpose: OtpPurpose, extraSelect = "") {
  const fields = OTP_FIELDS[purpose];

  const user = await userModel
    .findOneAndUpdate(
      {
        email,
        [fields.expiresAt]: mongoose.trusted({ $gt: new Date() }),
        // $not also matches codes issued before the counter existed.
        [fields.attempts]: mongoose.trusted({ $not: { $gte: MAX_OTP_ATTEMPTS } }),
      },
      { $inc: { [fields.attempts]: 1 } },
      { returnDocument: "after" },
    )
    .select(`+${fields.hash} ${extraSelect}`.trim());

  const storedHash = user?.get(fields.hash) as string | undefined;
  if (!user || !storedHash) {
    await simulatePasswordCheck(otp);
    return null;
  }

  return (await matchHashedPassword(otp, storedHash)) ? user : null;
}

// ────────────────────────────────────────────── Login

async function handleLoginUser(req: Request, res: Response) {
  const { email, password } = req.validated?.body ?? req.body;

  const user = await userModel.findOne({ email }).select("+password +tokenVersion");

  if (!user) {
    await simulatePasswordCheck(password);
    return ApiResponse.error(res, 401, "Invalid email or password.", "Unauthorized");
  }

  // Google (or other provider) accounts have no password set.
  if (!user.password) {
    return ApiResponse.error(res, 401, "This account uses a different sign-in method.", "Unauthorized");
  }

  const isPasswordValid = await matchHashedPassword(password, user.password);

  if (!isPasswordValid) {
    return ApiResponse.error(res, 401, "Invalid email or password.", "Unauthorized");
  }

  setAccessCookie(res, user);

  const refreshToken = generateRefreshToken({
    userId: user._id,
    tv: user.tokenVersion ?? 0,
  });

  // Persist the refresh token so it can be verified/revoked later.
  await refreshTokenModel.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
  });

  res.cookie("refreshToken", refreshToken, authCookieOptions(REFRESH_TOKEN_MAX_AGE));

  const safeUser = await userModel.findById(user._id);

  return ApiResponse.success(res, 200, "Login successful.", {
    user: safeUser,
  });
}

// ────────────────────────────────────────────── Refresh

// Called when the access token expired: issue a fresh access token if the
// refresh token is still valid and known to the DB, otherwise force re-login.
async function handleRefreshToken(req: Request, res: Response) {
  const user = await resolveUserFromRefreshToken(req, res);
  if (!user) return; // error response already sent

  setAccessCookie(res, user);

  return ApiResponse.success(res, 200, "Access token refreshed.", {
    user,
  });
}

// ────────────────────────────────────────────── Verify (session restore)

// Session restore in one call: if the access token is still valid it is
// returned as-is with the user; if it expired we fall back to the refresh
// token and mint a new access token. Not behind authenticationToken, since
// that middleware rejects expired tokens before we can handle them.
async function handleVerifyToken(req: Request, res: Response) {
  const accessToken = req.cookies?.accessToken;

  if (typeof accessToken === "string" && accessToken) {
    try {
      const payload = verifyAccessToken(accessToken);
      const user = await userModel.findById(payload.userId).select("+tokenVersion");

      if (!user) {
        return ApiResponse.error(res, 401, "User no longer exists.", "Unauthorized");
      }

      if ((payload.tv ?? 0) === (user.tokenVersion ?? 0)) {
        return ApiResponse.success(res, 200, "Access token is valid.", {
          user,
        });
      }
      // Revoked token: fall through. The refresh check below fails for the same reason.
    } catch (error) {
      if (!(error instanceof jwt.TokenExpiredError)) {
        return ApiResponse.error(res, 401, "Invalid access token.", AuthErrorCode.TokenInvalid);
      }
    }
  }

  // Access token missing, expired or revoked — fall back to the refresh token.
  const user = await resolveUserFromRefreshToken(req, res);
  if (!user) return; // error response already sent

  setAccessCookie(res, user);

  return ApiResponse.success(res, 200, "Access token refreshed.", {
    user,
  });
}

// ────────────────────────────────────────────── Get Me

async function handleGetMe(req: Request, res: Response) {
  const user = await userModel.findById(req.user?.userId);

  if (!user) {
    return ApiResponse.error(res, 404, "User not found.", "Not Found");
  }

  return ApiResponse.success(res, 200, "Authenticated.", { user });
}

// ────────────────────────────────────────────── Logout

async function handleLogoutUser(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (typeof token === "string" && token) {
    await refreshTokenModel.deleteOne({ token });
  }

  clearAuthCookies(res);

  return ApiResponse.success(res, 200, "Logged out successfully.");
}

// ────────────────────────────────────────────── Signup

async function handleSignupUser(req: Request, res: Response) {
  const { fullName, email, password } = req.validated?.body ?? req.body;

  if (isDisposableEmail(email)) {
    return ApiResponse.error(
      res,
      400,
      "Temporary email addresses can't be used. Sign up with an email you keep.",
      AuthErrorCode.DisposableEmail,
    );
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return ApiResponse.error(res, 409, "User with this email already exists.", "Conflict");
  }

  const hashedPassword = await hashPassword(password);
  const username = await generateUniqueUsername(fullName, userModel);

  // totalcredits starts at 0; verifying the email grants the signup bonus.
  const user = await userModel.create({
    fullName,
    username,
    email,
    password: hashedPassword,
  });

  try {
    await issueOtp(user._id, email, "verify-email");
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
    return ApiResponse.success(
      res,
      201,
      "Account created, but we couldn't send the verification email. Use Resend code on the next screen.",
    );
  }

  return ApiResponse.success(
    res,
    201,
    `Account created. Enter the 6-digit code we emailed you to get your ${CREDIT_COST.SIGNUP_BONUS} free credits.`,
  );
}

// ────────────────────────────────────────────── Verify Email

async function handleVerifyEmail(req: Request, res: Response) {
  const { email, otp } = req.validated!.body;

  const user = await consumeOtp(email, otp, "verify-email");

  if (!user) {
    return ApiResponse.error(res, 400, OTP_ERROR, "BadRequest");
  }

  const grantedCredits = Math.max(0, CREDIT_COST.SIGNUP_BONUS - (user.totalcredits ?? 0));

  // The isVerified filter makes a repeated request a no-op, and $max tops up to the
  // bonus without adding credits to accounts that already received them.
  await userModel.updateOne(
    { _id: user._id, isVerified: false },
    {
      $set: { isVerified: true },
      $max: { totalcredits: CREDIT_COST.SIGNUP_BONUS },
      $unset: {
        emailVerificationOtp: 1,
        emailVerificationOtpExpiresAt: 1,
        emailVerificationOtpAttempts: 1,
      },
    },
  );

  return ApiResponse.success(
    res,
    200,
    grantedCredits > 0
      ? `Email verified. ${grantedCredits} free credits added.`
      : "Email verified.",
  );
}

async function handleResendVerification(req: Request, res: Response) {
  const { email } = req.validated!.body;

  const genericMessage = "If this account still needs verification, a new code has been sent.";

  const user = await userModel.findOne({ email, isVerified: false });

  if (user) {
    sendOtpInBackground(user._id, email, "verify-email");
  }

  return ApiResponse.success(res, 200, genericMessage);
}

// ────────────────────────────────────────────── Forgot Password

async function handleForgotPassword(req: Request, res: Response) {
  const { email } = req.validated!.body;

  const genericMessage = "If an account with that email exists, a reset code has been sent.";

  const user = await userModel.findOne({ email });

  // Google/provider accounts cannot reset a password they never set.
  if (user && (user.password || user.provider === "email")) {
    sendOtpInBackground(user._id, email, "reset-password");
  }

  return ApiResponse.success(res, 200, genericMessage);
}

// ────────────────────────────────────────────── Verify OTP

async function handleVerifyOtp(req: Request, res: Response) {
  const { email, otp } = req.validated!.body;

  const user = await consumeOtp(email, otp, "reset-password");

  if (!user) {
    return ApiResponse.error(res, 400, OTP_ERROR, "BadRequest");
  }

  // A correct code resets the counter, so the reset step that follows has its own tries.
  await userModel.updateOne({ _id: user._id }, { $set: { resetPasswordOtpAttempts: 0 } });

  return ApiResponse.success(res, 200, "OTP verified successfully.");
}

// ────────────────────────────────────────────── Reset Password

async function handleResetPassword(req: Request, res: Response) {
  const { email, otp, newPassword } = req.validated!.body;

  const user = await consumeOtp(email, otp, "reset-password", "+password");

  if (!user) {
    return ApiResponse.error(res, 400, OTP_ERROR, "BadRequest");
  }

  // Prevent reusing the same password.
  if (user.password) {
    const isSamePassword = await matchHashedPassword(
      newPassword,
      user.password,
    );
    if (isSamePassword) {
      return ApiResponse.error(
        res,
        400,
        "New password cannot be the same as your current password.",
        "BadRequest",
      );
    }
  }

  await userModel.updateOne(
    { _id: user._id },
    { $set: { password: await hashPassword(newPassword) } },
  );
  await clearOtp(user._id, "reset-password");

  // Force re-login everywhere, including sessions whose access token has not expired yet.
  await revokeAllSessions(user._id);
  clearAuthCookies(res);

  return ApiResponse.success(
    res,
    200,
    "Password reset successful. Please log in with your new password.",
  );
}

// ────────────────────────────────────────────── Change Password

async function handleChangePassword(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    return ApiResponse.error(res, 401, "Unauthorized access.");
  }

  const { currentPassword, newPassword } = req.validated?.body ?? req.body;

  const user = await userModel.findById(userId).select("+password");
  if (!user) {
    return ApiResponse.error(res, 404, "User not found.", "USER_NOT_FOUND");
  }

  if (!user.password) {
    return ApiResponse.error(res, 400, "Account has no password set.", "NO_PASSWORD_SET");
  }

  const isMatch = await matchHashedPassword(currentPassword, user.password);

  if (!isMatch) {
    return ApiResponse.error(res, 400, "Current password is incorrect.", "INVALID_CURRENT_PASSWORD");
  }

  const isSamePassword = await matchHashedPassword(newPassword, user.password);
  if (isSamePassword) {
    return ApiResponse.error(res, 400, "New password cannot be the same as current password.", "PASSWORD_REUSED");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  // Sign out every session, this one included, so a stolen session cannot outlive the
  // password change. The client warns about this before submitting.
  await revokeAllSessions(user._id);
  clearAuthCookies(res);

  return ApiResponse.success(
    res,
    200,
    "Password changed. You've been signed out of every session. Log in with your new password.",
  );
}

export {
  handleSignupUser,
  handleLoginUser,
  handleRefreshToken,
  handleVerifyToken,
  handleGetMe,
  handleLogoutUser,
  handleForgotPassword,
  handleResetPassword,
  handleVerifyOtp,
  handleChangePassword,
  handleVerifyEmail,
  handleResendVerification,
};
