import mongoose, { type Document, Schema } from "mongoose";

export interface IStory extends Document {
  user: mongoose.Types.ObjectId;
  mediaUrl: string;
  type: "image" | "video" | "text";
  caption?: string;
  viewers: mongoose.Types.ObjectId[];
  expiresAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "text"], required: true },
    caption: String,
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Prevents model overwrite errors in dev
export const StoryModel =
    mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);