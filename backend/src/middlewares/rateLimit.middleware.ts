import rateLimit from "express-rate-limit";

/**
 * Rate limiter for login endpoint
 *
 * Limits: 5 requests per 15 minutes per IP
 *
 * Security: Prevents brute force attacks on login
 * Note: For production, consider using Redis store for distributed rate limiting
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip successful requests (only count failed attempts)
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for registration endpoint
 *
 * Limits: 3 requests per hour per IP
 *
 * Security: Prevents spam account creation
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per window
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for token refresh endpoint
 *
 * Limits: 10 requests per 15 minutes per IP
 *
 * Security: Prevents token refresh abuse
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: "Too many token refresh attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
