import jwt from "jsonwebtoken";
import { config } from "../config/env";

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

/**
 * Generate a short-lived access token (15 minutes)
 * Used for authenticating API requests
 *
 * @param userId - User's MongoDB ObjectId as string
 * @returns Signed JWT access token
 *
 * Security: Short expiry reduces risk if token is compromised
 */
export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId } as JWTPayload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });
}

/**
 * Generate a long-lived refresh token (7 days)
 * Used to obtain new access tokens without re-login
 *
 * @param userId - User's MongoDB ObjectId as string
 * @returns Signed JWT refresh token
 *
 * Security: Uses separate secret from access token (defense in depth)
 * Stored in HTTP-only cookie and database for token rotation
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId } as JWTPayload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });
}

/**
 * Verify and decode an access token
 *
 * @param token - JWT access token to verify
 * @returns Decoded payload if valid
 * @throws JsonWebTokenError if token is invalid or expired
 *
 * Security: Automatically checks signature and expiration
 */
export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
}

/**
 * Verify and decode a refresh token
 *
 * @param token - JWT refresh token to verify
 * @returns Decoded payload if valid
 * @throws JsonWebTokenError if token is invalid or expired
 *
 * Security: Uses separate secret from access token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
}
