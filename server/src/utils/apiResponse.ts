import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: unknown;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    statusCode = 200,
    message = "Success",
    data?: T,
    meta?: Record<string, unknown>,
  ): Response<SuccessResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    statusCode = 500,
    message = "Something went wrong",
    error?: unknown,
  ): Response<ErrorResponse> {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
