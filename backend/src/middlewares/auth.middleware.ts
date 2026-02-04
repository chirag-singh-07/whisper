import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { sendError } from "../utils/sendResponse";

/**
 * Extend Express Request to include userId
 * This allows downstream middleware and controllers to access the authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token from cookies and attaches userId to request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * Security features:
 * - Reads token from HTTP-only cookie (XSS protection)
 * - Verifies token signature and expiration
 * - Generic error messages (prevents user enumeration)
 * - Attaches userId to request for downstream use
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extract access token from cookies
    let accessToken = req.cookies?.accessToken;

    // Fallback: Check Authorization header
    if (!accessToken && req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.split(" ")[1];
    }

    if (!accessToken) {
      sendError(res, "Authentication required", 401);
      return;
    }

    // Verify token and extract payload
    const payload = verifyAccessToken(accessToken);

    // Attach userId to request for downstream use
    req.userId = payload.userId;

    next();
  } catch (error) {
    // Generic error message to prevent information leakage
    // Don't reveal if token is expired, invalid, or tampered
    sendError(res, "Invalid or expired token", 401);
  }
}
