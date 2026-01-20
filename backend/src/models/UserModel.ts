import mongoose, { Schema, type Document } from "mongoose";

/**
 * User interface with authentication and security fields
 */
export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string; // Hashed password
  avatarUrl?: string;
  lastSeen: Date;
  isOnline: boolean;
  about?: string;

  // Security fields
  refreshToken?: string; // For token rotation
  loginAttempts: number; // Track failed login attempts
  lockUntil?: Date; // Account lock expiration time

  // Virtual field
  isAccountLocked: boolean; // Computed from lockUntil

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password in queries by default
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      default: "",
    },

    // Security fields
    refreshToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  { timestamps: true },
);

/**
 * Virtual field to check if account is locked
 * Security: Prevents login during lock period
 */
UserSchema.virtual("isAccountLocked").get(function (this: IUser) {
  // Check if lockUntil exists and is in the future
  return !!(this.lockUntil && this.lockUntil > new Date());
});

/**
 * Indexes for performance and uniqueness
 * Security: Fast lookups prevent timing attacks
 */
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// ✅ Prevents model overwrite errors in dev
export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
