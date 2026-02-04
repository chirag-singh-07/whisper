import type { Request, Response } from "express";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";
import { getIO } from "../utils/socket";

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

    const messages = await MessageModel.find({ chat: chatId })
      .populate("sender", "name email avatarUrl")
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const handleSendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { chatId, text, type = "text" } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!chatId || !text) {
      return res.status(400).json({ message: "Chat ID and text are required" });
    }

    // Verify chat exists and user is a participant
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found or access denied" });
    }

    // Create message
    const newMessage = new MessageModel({
      chat: chatId,
      sender: userId,
      text,
      type,
    });

    await newMessage.save();

    // Update chat last message
    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id,
      lastMessageAt: newMessage.createdAt,
    });

    // Populate sender for immediate UI feedback
    const populatedMessage = await MessageModel.findById(
      newMessage._id,
    ).populate("sender", "name email avatarUrl");

    // Emit socket event to the chat room
    try {
      const io = getIO();
      io.to(chatId).emit("message:new", populatedMessage);
    } catch (err) {
      console.warn("Socket IO not initialized or failed to emit", err);
    }

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message", error });
  }
};
