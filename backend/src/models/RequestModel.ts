import mongoose, { Schema, type Document } from "mongoose";

export interface IRequest extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Index for fast lookups
RequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
RequestSchema.index({ receiver: 1, status: 1 });

export const RequestModel =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);
