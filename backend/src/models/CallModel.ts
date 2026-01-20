import mongoose , {type Document, Schema} from "mongoose";

export interface ICall extends Document {
  chat: mongoose.Types.ObjectId;
  caller: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  type: "voice" | "video";
  status: "missed" | "answered" | "ended";
  startedAt?: Date;
  endedAt?: Date;
}

const CallSchema = new Schema<ICall>({
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    caller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    type: { type: String, enum: ["voice", "video"], required: true },
    status: { type: String, enum: ["missed", "answered", "ended"], required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },

}, { timestamps: true })

CallSchema.index({ chat: 1, startedAt: -1 });
// ✅ Prevents model overwrite errors in dev
export const CallModel =
    mongoose.models.Call || mongoose.model<ICall>("Call", CallSchema);
