import type { Response } from "express";
import { config } from "../config/env";

/**
 * Standard success response structure
 */
interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
}

/**
 * Standard error response structure
 */
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
}

/**
 * Send a standardized success response
 *
 * @param res - Express response object
 * @param data - Response data (optional)
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export function sendSuccess<T = any>(
  res: Response,
  data: T | null = null,
  message = "Success",
  statusCode = 200,
): void {
  const response: SuccessResponse<T> = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
}

/**
 * Send a standardized error response
 *
 * @param res - Express response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @param errors - Additional error details (optional)
 *
 * Security: Hides sensitive error details in production
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors: any[] = [],
): void {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Only include detailed errors in development
  if (!config.server.isProduction && errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}
