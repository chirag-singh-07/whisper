import type { Request, Response } from "express";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";

export const handleGetMessagesByChatId = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found or access denied" });
    }

    const messages = await MessageModel.find({ chat: chatId }).populate("sender","name email avatarUrl").sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};