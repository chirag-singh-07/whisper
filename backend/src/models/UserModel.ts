import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  clerkId: string;
  lastSeen: Date;
  isOnline: boolean;
  about?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: { type: String, default: "" },
    clerkId: { type: String, required: true, unique: true },
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    about: { type: String, default: "" },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ clerkId: 1 });

// ✅ Prevents model overwrite errors in dev
export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
