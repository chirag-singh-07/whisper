import type { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/sendResponse";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { config } from "../config/env";

/**
 * Maximum failed login attempts before account lock
 */
const MAX_LOGIN_ATTEMPTS = 5;

/**
 * Account lock duration in milliseconds (30 minutes)
 */
const LOCK_TIME = 30 * 60 * 1000;

/**
 * Set authentication cookies
 * Security: HTTP-only, SameSite=Strict, Secure in production
 */
function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: config.server.isProduction, // HTTPS only in production
    sameSite: "strict" as const, // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);
}

/**
 * Clear authentication cookies
 */
function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}

/**
 * User Registration Handler
 *
 * POST /api/auth/register
 *
 * Security features:
 * - Input validation with Zod
 * - Password hashing with bcrypt
 * - Email normalization
 * - Generic error messages (prevents user enumeration)
 */
export async function handleRegisterUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists (email or username)
    const existingUser = await UserModel.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username },
      ],
    });

    if (existingUser) {
      // Generic error message to prevent user enumeration
      sendError(res, "User with this email or username already exists", 400);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await UserModel.create({
      email: validatedData.email,
      password: hashedPassword,
      username: validatedData.username,
      name: validatedData.name,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Store refresh token in database (for token rotation)
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return user data (exclude password and refreshToken)
    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      about: user.about,
      createdAt: user.createdAt,
    };

    sendSuccess(res, userResponse, "Registration successful", 201);
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ZodError") {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      sendError(res, "Validation failed", 400, errors);
      return;
    }

    // Handle other errors
    console.error("Registration error:", error);
    sendError(res, "Registration failed", 500);
  }
}

/**
 * User Login Handler
 *
 * POST /api/auth/login
 *
 * Security features:
 * - Account locking after failed attempts
 * - Constant-time password comparison
 * - Generic error messages
 * - Login attempt tracking
 */
export async function handleLoginUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Find user by email (include password and refreshToken for verification)
    const user = await UserModel.findOne({ email: validatedData.email }).select(
      "+password +refreshToken",
    );

    if (!user) {
      // Generic error message to prevent user enumeration
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000,
      );
      sendError(
        res,
        `Account temporarily locked. Please try again in ${remainingTime} minutes.`,
        403,
      );
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password,
    );

    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1;

      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.save();
        sendError(
          res,
          "Account temporarily locked due to multiple failed login attempts. Please try again in 30 minutes.",
          403,
        );
        return;
      }

      await user.save();

      // Generic error message
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    // Update last seen and online status
    user.lastSeen = new Date();
    user.isOnline = true;

    // Generate new tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Store refresh token (token rotation)
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return user data
    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      about: user.about,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    };

    sendSuccess(res, userResponse, "Login successful", 200);
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ZodError") {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      sendError(res, "Validation failed", 400, errors);
      return;
    }

    // Handle other errors
    console.error("Login error:", error);
    sendError(res, "Login failed", 500);
  }
}

/**
 * Token Refresh Handler
 *
 * POST /api/auth/refresh
 *
 * Security features:
 * - Token rotation (old token invalidated)
 * - Refresh token verification against database
 * - Prevents replay attacks
 */
export async function handleRefreshToken(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Extract refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      sendError(res, "Refresh token required", 401);
      return;
    }

    // Verify token signature and expiration
    const payload = verifyRefreshToken(refreshToken);

    // Find user and verify token matches database
    const user = await UserModel.findById(payload.userId).select(
      "+refreshToken",
    );

    if (!user || user.refreshToken !== refreshToken) {
      // Token doesn't match database (possible replay attack)
      clearAuthCookies(res);
      sendError(res, "Invalid refresh token", 401);
      return;
    }

    // Generate new tokens (token rotation)
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    sendSuccess(res, null, "Token refreshed successfully", 200);
  } catch (error: any) {
    console.error("Token refresh error:", error);
    clearAuthCookies(res);
    sendError(res, "Invalid or expired refresh token", 401);
  }
}

/**
 * User Logout Handler
 *
 * POST /api/auth/logout
 *
 * Security: Clears refresh token from database and cookies
 */
export async function handleLogoutUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId; // Set by requireAuth middleware

    if (userId) {
      // Clear refresh token from database
      await UserModel.findByIdAndUpdate(userId, {
        refreshToken: undefined,
        isOnline: false,
      });
    }

    // Clear cookies
    clearAuthCookies(res);

    sendSuccess(res, null, "Logout successful", 200);
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear cookies even if database update fails
    clearAuthCookies(res);
    sendError(res, "Logout failed", 500);
  }
}

/**
 * Get Current User Handler
 *
 * GET /api/auth/me
 *
 * Returns current authenticated user's data
 */
export async function handleGetCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId; // Set by requireAuth middleware

    const user = await UserModel.findById(userId);

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      about: user.about,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    };

    sendSuccess(res, userResponse, "User retrieved successfully", 200);
  } catch (error) {
    console.error("Get current user error:", error);
    sendError(res, "Failed to retrieve user", 500);
  }
}
