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


async function resolveUserFromRefreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    ApiResponse.error(
      res,
      401,
      "No refresh token provided.",
      AuthErrorCode.RefreshMissing,
    );
    return null;
  }

  // Must still exist in the DB (i.e. not logged out / revoked).
  const storedToken = await refreshTokenModel.findOne({ token });

  if (!storedToken) {
    ApiResponse.error(
      res,
      401,
      "Invalid refresh token. Please log in again.",
      AuthErrorCode.RefreshInvalid,
    );
    return null;
  }

  let payload: any;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    // Refresh token expired or tampered — drop it and require a new login.
    await refreshTokenModel.deleteOne({ token });
    res.clearCookie("refreshToken");
    ApiResponse.error(
      res,
      401,
      "Refresh token expired. Please log in again.",
      AuthErrorCode.RefreshExpired,
    );
    return null;
  }

  const user = await userModel.findById(payload.userId);

  if (!user) {
    ApiResponse.error(res, 401, "User no longer exists.", "Unauthorized");
    return null;
  }

  return user;
}

async function handleLoginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })?.select("+password");

    if (!user) {
      return ApiResponse.error(
        res,
        401,
        "No account found with this email. Please sign up first.",
        "Unauthorized",
      );
    }

    // Google (or other provider) accounts have no password set.
    if (!user.password) {
      return ApiResponse.error(
        res,
        401,
        "This account uses a different sign-in method.",
        "Unauthorized",
      );
    }

    const isPasswordValid = await matchHashedPassword(password, user.password);

    if (!isPasswordValid) {
      return ApiResponse.error(
        res,
        401,
        "Invalid email or password.",
        "Unauthorized",
      );
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
          return ApiResponse.error(
            res,
            401,
            "User no longer exists.",
            "Unauthorized",
          );
        };

        return ApiResponse.success(res, 200, "Access token is valid.", {
          user,
        });

      } catch (error) {
        if (!(error instanceof jwt.TokenExpiredError)) {
          return ApiResponse.error(
            res,
            401,
            "Invalid access token.",
            AuthErrorCode.TokenInvalid,
          );
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

// Session bootstrap: returns the user behind the current access token.
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

async function handleLogoutUser(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

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

async function handleSignupUser(req: Request, res: Response) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return ApiResponse.error(
        res,
        409,
        "User with this email already exists.",
        "Conflict",
      );
    }

    const hashedPassword = await hashPassword(password);

    await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return ApiResponse.success(res, 201, "User created successfully.");
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Something went wrong.");
  }
};

export {
  handleSignupUser,
  handleLoginUser,
  handleRefreshToken,
  handleVerifyToken,
  handleGetMe,
  handleLogoutUser,
};
