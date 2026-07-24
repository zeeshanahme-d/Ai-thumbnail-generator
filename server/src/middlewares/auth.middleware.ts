import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";
import { AuthErrorCode } from "../constants/enums.js";
import { NextFunction, Request, Response } from "express";

const authenticationToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokken = req.headers["authorization"]?.split(" ")[1];
  if (!tokken) {
    return ApiResponse.error(
      res,
      401,
      "Access denied. No token provided.",
      AuthErrorCode.TokenMissing,
    );
  }
  const secret = process.env.SECRET || "";
  try {
    const decoded = jwt.verify(tokken, secret);
    req.user = decoded as Request["user"];
    next();
  } catch (error) {
    // Signal expiry distinctly so the client knows to hit /auth/refresh.
    if (error instanceof jwt.TokenExpiredError) {
      return ApiResponse.error(
        res,
        401,
        "Access token expired.",
        AuthErrorCode.TokenExpired,
      );
    }
    return ApiResponse.error(res, 401, "Invalid token.", AuthErrorCode.TokenInvalid);
  }
};

export default authenticationToken;
