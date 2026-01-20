import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: "text" | "image" | "video" | "audio" | "file";
  text?: string;
  mediaUrl?: string;
  mediaMeta?: {
    size?: number;
    duration?: number; // audio/video
    mimeType?: string;
  };
  readBy: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  deletedFor: mongoose.Types.ObjectId[]; // per-user delete
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },

    text: { type: String, trim: true },

    mediaUrl: { type: String },
    mediaMeta: {
      size: Number,
      duration: Number,
      mimeType: String,
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

    isDeleted: { type: Boolean, default: false },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

MessageSchema.index({ chat: 1, createdAt: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ createdAt: -1 });

// ✅ Prevents model overwrite errors in dev
export const MessageModel =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
