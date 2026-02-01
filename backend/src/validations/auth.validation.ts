import { z } from "zod";

/**
 * Password validation requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 *
 * Security: Strong password requirements prevent weak passwords
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

/**
 * Email validation with normalization
 * Security: Prevents duplicate accounts with different email cases
 */
const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase()
  .trim();

/**
 * Username validation
 * - 3-30 characters
 * - Alphanumeric and underscores only
 * - No spaces
 */
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  )
  .trim();

/**
 * User registration validation schema
 *
 * Security features:
 * - Email normalization (lowercase, trim)
 * - Strong password requirements
 * - Username format validation
 * - Prevents NoSQL injection through strict typing
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .trim(),
  about: z.string().max(500, "About must not exceed 500 characters").optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * User login validation schema
 *
 * Security: Validates input format before database query
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
