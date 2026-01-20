import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],

    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],

    isGroup: { type: Boolean, default: false },

    groupName: { type: String, trim: true },
    groupAvatar: { type: String },

    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);


ChatSchema.index({ participants: 1 });

// ✅ Prevents model overwrite errors in dev
export const ChatModel =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
