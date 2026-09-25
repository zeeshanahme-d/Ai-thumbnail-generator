import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";
import { AuthErrorCode } from "../constants/enums.js";
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AccessTokenPayload } from "../helper/token-helpers.js";
import userModel from "../models/user.model.js";

const authenticationToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken;
  // Only a plain string can be a token; cookie-parser turns "j:{...}" cookies into objects.
  if (typeof accessToken !== "string" || !accessToken) {
    return ApiResponse.error(res, 401, "Access denied. No token provided.", AuthErrorCode.TokenMissing);
  }

  let decoded: AccessTokenPayload;
  try {
    decoded = verifyAccessToken(accessToken);
  } catch (error) {
    // Signal expiry distinctly so the client knows to hit /auth/refresh.
    if (error instanceof jwt.TokenExpiredError) {
      return ApiResponse.error(res, 401, "Access token expired.", AuthErrorCode.TokenExpired);
    }
    return ApiResponse.error(res, 401, "Invalid token.", AuthErrorCode.TokenInvalid);
  }

  // One indexed lookup per request so revoked sessions stop working immediately,
  // instead of lasting until the access token expires.
  const user = await userModel.findById(decoded.userId).select("+tokenVersion").lean();

  if (!user) {
    return ApiResponse.error(res, 401, "This account no longer exists.", AuthErrorCode.TokenInvalid);
  }

  // Tokens issued before versioning carry no `tv`, which counts as version 0.
  if ((decoded.tv ?? 0) !== (user.tokenVersion ?? 0)) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return ApiResponse.error(res, 401, "Your session has ended. Please log in again.", AuthErrorCode.TokenRevoked);
  }

  req.user = decoded as Request["user"];
  next();
};

export default authenticationToken;
