import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import {
  hashPassword,
  matchHashedPassword,
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
import { generateOtp } from "../utils/helpers.js";
import { OTP_EXPIRY_MS } from "../constants/constants.js";

// ────────────────────────────────────────────── Helpers

async function resolveUserFromRefreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    ApiResponse.error(res, 401, "No refresh token provided.", AuthErrorCode.RefreshMissing);
    return null;
  }

  // Must still exist in the DB (i.e. not logged out / revoked).
  const storedToken = await refreshTokenModel.findOne({ token });

  if (!storedToken) {
    ApiResponse.error(res, 401, "Invalid refresh token. Please log in again.", AuthErrorCode.RefreshInvalid);
    return null;
  }

  let payload: any;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    // Refresh token expired or tampered — drop it and require a new login.
    await refreshTokenModel.deleteOne({ token });
    res.clearCookie("refreshToken");
    ApiResponse.error(res, 401, "Refresh token expired. Please log in again.", AuthErrorCode.RefreshExpired);
    return null;
  }

  const user = await userModel.findById(payload.userId);

  if (!user) {
    ApiResponse.error(res, 401, "User no longer exists.", "Unauthorized");
    return null;
  }

  return user;
}

// ────────────────────────────────────────────── Login

async function handleLoginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.validated?.body ?? req.body;

    const user = await userModel.findOne({ email })?.select("+password");

    // SECURITY: Use the same generic message for both "user not found" and
    // "wrong password" to prevent email enumeration.
    if (!user) {
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

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Persist the refresh token so it can be verified/revoked later.
    await refreshTokenModel.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    const safeUser = await userModel.findById(user._id);

    return ApiResponse.success(res, 200, "Login successful.", {
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

// ────────────────────────────────────────────── Refresh

// Called when the access token expired: issue a fresh access token if the
// refresh token is still valid and known to the DB, otherwise force re-login.
async function handleRefreshToken(req: Request, res: Response) {
  try {
    const user = await resolveUserFromRefreshToken(req, res);
    if (!user) return; // error response already sent

    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return ApiResponse.success(res, 200, "Access token refreshed.", {
      user,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

// ────────────────────────────────────────────── Verify (session restore)

// Session restore in one call: if the access token is still valid it is
// returned as-is with the user; if it expired we fall back to the refresh
// token and mint a new access token. Not behind authenticationToken, since
// that middleware rejects expired tokens before we can handle them.
async function handleVerifyToken(req: Request, res: Response) {
  try {
    const accessToken = req.cookies?.accessToken;

    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken) as { userId?: string };
        const user = await userModel.findById(payload.userId);

        if (!user) {
          return ApiResponse.error(res, 401, "User no longer exists.", "Unauthorized");
        };

        return ApiResponse.success(res, 200, "Access token is valid.", {
          user,
        });

      } catch (error) {
        if (!(error instanceof jwt.TokenExpiredError)) {
          return ApiResponse.error(res, 401, "Invalid access token.", AuthErrorCode.TokenInvalid);
        }
      }
    }

    // Access token missing or expired — fall back to the refresh token.
    const user = await resolveUserFromRefreshToken(req, res);
    if (!user) return; // error response already sent

    const newAccessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return ApiResponse.success(res, 200, "Access token refreshed.", {
      user,
    });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

// ────────────────────────────────────────────── Get Me

async function handleGetMe(req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.user?.userId);

    if (!user) {
      return ApiResponse.error(res, 404, "User not found.", "Not Found");
    }

    return ApiResponse.success(res, 200, "Authenticated.", { user });
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

// ────────────────────────────────────────────── Logout

async function handleLogoutUser(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await refreshTokenModel.deleteOne({ token });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return ApiResponse.success(res, 200, "Logged out successfully.");
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

// ────────────────────────────────────────────── Signup

async function handleSignupUser(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.validated?.body ?? req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return ApiResponse.error(res, 409, "User with this email already exists.", "Conflict");
    }

    const hashedPassword = await hashPassword(password);

    await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return ApiResponse.success(res, 201, "User registered successfully.");
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

// ────────────────────────────────────────────── Forgot Password

async function handleForgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.validated!.body;

    const genericMessage = "If an account with that email exists, a reset code has been sent.";

    const user = await userModel.findOne({ email });

    if (!user) {
      return ApiResponse.success(res, 200, genericMessage);
    }

    // Google/provider accounts cannot reset a password they never set.
    if (!user.password && user.provider !== "email") {
      return ApiResponse.success(res, 200, genericMessage);
    }

    const otp = generateOtp();
    const hashedOtp = await hashPassword(otp);

    await userModel.updateOne(
      { _id: user._id },
      {
        resetPasswordOtp: hashedOtp,
        resetPasswordOtpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      },
    );

    try {
      await sendOtpEmail(email, otp, "reset-password");
    } catch (emailError) {
      // If email sending fails, clear the OTP so it can't be used.
      await userModel.updateOne(
        { _id: user._id },
        {
          $unset: {
            resetPasswordOtp: 1,
            resetPasswordOtpExpiresAt: 1,
          },
        },
      );
      console.error("Failed to send reset email:", emailError);
      return ApiResponse.error(res, 500, "Unable to send reset email. Please try again later.",);
    }

    return ApiResponse.success(res, 200, genericMessage);
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

// ────────────────────────────────────────────── Reset Password

async function handleVerifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.validated!.body;

    const genericError = "Invalid or expired OTP.";

    // Select the hidden OTP fields explicitly.
    const user = await userModel.findOne({ email }).select("+resetPasswordOtp +resetPasswordOtpExpiresAt");

    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      return ApiResponse.error(res, 400, genericError, "BadRequest");
    }

    // Check expiry first — if expired, clear the OTP fields immediately.
    if (user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
      await userModel.updateOne(
        { _id: user._id },
        {
          $unset: {
            resetPasswordOtp: 1,
            resetPasswordOtpExpiresAt: 1,
          },
        },
      );
      return ApiResponse.error(res, 400, genericError, "BadRequest");
    }

    // Compare the plaintext OTP against the stored bcrypt hash.
    const isOtpValid = await matchHashedPassword(otp, user.resetPasswordOtp);

    if (!isOtpValid) {
      return ApiResponse.error(res, 400, genericError, "BadRequest");
    }

    return ApiResponse.success(res, 200, "OTP verified successfully.");
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
}

// ────────────────────────────────────────────── Reset Password

async function handleResetPassword(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.validated!.body;

    const genericError = "Invalid or expired reset code.";

    // Select the hidden OTP fields explicitly.
    const user = await userModel.findOne({ email }).select("+resetPasswordOtp +resetPasswordOtpExpiresAt +password");

    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpiresAt) {
      return ApiResponse.error(res, 400, genericError, "BadRequest");
    }

    // Check expiry first — if expired, clear the OTP fields immediately.
    if (user.resetPasswordOtpExpiresAt.getTime() < Date.now()) {
      await userModel.updateOne(
        { _id: user._id },
        {
          $unset: {
            resetPasswordOtp: 1,
            resetPasswordOtpExpiresAt: 1,
          },
        },
      );
      return ApiResponse.error(res, 400, genericError, "BadRequest");
    }

    // Compare the plaintext OTP against the stored bcrypt hash.
    const isOtpValid = await matchHashedPassword(otp, user.resetPasswordOtp);

    if (!isOtpValid) {
      return ApiResponse.error(res, 400, genericError, "BadRequest");
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

    // Hash the new password and clear the OTP in a single atomic update.
    const hashedNewPassword = await hashPassword(newPassword);

    await userModel.updateOne(
      { _id: user._id },
      {
        password: hashedNewPassword,
        $unset: {
          resetPasswordOtp: 1,
          resetPasswordOtpExpiresAt: 1,
        },
      },
    );

    // Revoke ALL refresh tokens for this user — force re-login everywhere.
    await refreshTokenModel.deleteMany({ userId: user._id });

    return ApiResponse.success(
      res,
      200,
      "Password reset successful. Please log in with your new password.",
    );
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
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
};

