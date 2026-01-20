import type { Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { sendError } from "../utils/sendResponse";

/**
 * Centralized error handling middleware
 * Catches all errors thrown in the application
 *
 * @param err - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * Security: Hides stack traces and sensitive error details in production
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Log error for debugging (in production, use proper logging service)
  console.error("Error:", err);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Determine error message
  let message = "Internal server error";

  if (statusCode < 500) {
    // Client errors (4xx) - safe to show message
    message = err.message || message;
  } else if (config.server.isDevelopment) {
    // Server errors (5xx) - only show in development
    message = err.message || message;
  }

  // Send error response
  sendError(
    res,
    message,
    statusCode,
    config.server.isDevelopment ? [{ stack: err.stack }] : [],
  );
}
