import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse.js";

interface AppError extends Error {
  statusCode?: number;
  status?: number;
  code?: number | string;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("Global Error Handler:", err);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Something went wrong.";
  let errorCode: string | undefined = undefined;

  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier format.";
    errorCode = "INVALID_ID";
  }

  // Handle Mongoose schema ValidationError
  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ") || "Validation failed.";
    errorCode = "VALIDATION_ERROR";
  }

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    if (field === "username") {
      message = "Username is already taken.";
      errorCode = "DUPLICATE_USERNAME";
    } else if (field === "email") {
      message = "User with this email already exists.";
      errorCode = "DUPLICATE_EMAIL";
    } else {
      message = `Duplicate value entered for ${field}.`;
      errorCode = "DUPLICATE_KEY";
    }
  }

  // Handle JSON Web Token errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
    errorCode = "TOKEN_INVALID";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
    errorCode = "TOKEN_EXPIRED";
  }

  // Unexpected failures can carry internal details; the full error is logged above.
  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Something went wrong. Please try again later.";
  }

  return ApiResponse.error(res, statusCode, message, errorCode);
};

export default errorHandler;
