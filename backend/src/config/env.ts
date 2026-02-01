import "dotenv/config";
import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Database
  DB_URI: z.string().min(1, "Database URI is required"),

  // Server
  PORT: z.string().default("5000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // JWT Secrets (must be different for security)
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT Access Secret must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT Refresh Secret must be at least 32 characters"),

  // Security
  BCRYPT_SALT_ROUNDS: z.string().default("12"),

  // CORS
  CLIENT_URL: z.string().url("Client URL must be a valid URL"),
});

/**
 * Validate and parse environment variables
 * Throws an error if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      console.error("❌ Environment variable validation failed:");
      missingVars.forEach((msg) => console.error(`  - ${msg}`));
      process.exit(1);
    }
    throw error;
  }
}

// Validate on module load
const env = validateEnv();

/**
 * Type-safe environment configuration
 * Use this instead of process.env for better type safety
 */
export const config = {
  // Database
  db: {
    uri: env.DB_URI,
  },

  // Server
  server: {
    port: parseInt(env.PORT, 10),
    nodeEnv: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === "development",
    isProduction: env.NODE_ENV === "production",
  },

  // JWT
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiry: "15m", // 15 minutes
    refreshExpiry: "7d", // 7 days
  },

  // Security
  security: {
    bcryptSaltRounds: parseInt(env.BCRYPT_SALT_ROUNDS, 10),
  },

  // CORS
  cors: {
    clientUrl: env.CLIENT_URL,
  },
} as const;
