import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";
import { AuthErrorCode } from "../constants/enums.js";
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../helper/token-helpers.js";

const authenticationToken = (req: Request, res: Response, next: NextFunction,) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return ApiResponse.error(res, 401, "Access denied. No token provided.", AuthErrorCode.TokenMissing,);
  }
  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded as Request["user"];
    next();
  } catch (error) {
    // Signal expiry distinctly so the client knows to hit /auth/refresh.
    if (error instanceof jwt.TokenExpiredError) {
      return ApiResponse.error(res, 401, "Access token expired.", AuthErrorCode.TokenExpired,);
    }
    return ApiResponse.error(res, 401, "Invalid token.",
      AuthErrorCode.TokenInvalid,
    );
  }
};

export default authenticationToken;
