import bcrypt from "bcrypt";
import { config } from "../config/env";

/**
 * Hash a plain text password using bcrypt
 * Uses async method to avoid blocking the event loop
 *
 * @param password - Plain text password to hash
 * @returns Promise resolving to hashed password
 *
 * Security: Uses 12 salt rounds (recommended for 2024+)
 * Each round doubles the time, making brute force attacks exponentially harder
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.security.bcryptSaltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * Uses constant-time comparison to prevent timing attacks
 *
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns Promise resolving to true if passwords match
 *
 * Security: bcrypt.compare() is resistant to timing attacks
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
