import type { Request, Response } from "express";
import { ChatModel } from "../models/ChatModel";

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chats = await ChatModel.find({
      participants: userId,
    })
      .populate("participants", "name email username avatarUrl")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p: any) => p._id.toString() !== userId,
      );
      return {
        _id: chat._id,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        participants: otherParticipant,
        createdAt: chat.createdAt,
      };
    });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found" });
    }

    res.status(200).json({ formattedChats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatWithParticipant = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { participantId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    if (userId === participantId) {
      return res
        .status(400)
        .json({ message: "Cannot create chat with yourself" });
    }

    // check if chat already exists
    let chat = await ChatModel.findOne({
      participants: { $all: [userId, participantId] },
      isGroup: false, // Ensure we don't pick up group chats
    })
      .populate("participants", "name email username avatarUrl")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new ChatModel({
        participants: [userId, participantId],
        isGroup: false,
      });
      await newChat.save();

      // Re-fetch with population
      chat = await ChatModel.findById(newChat._id).populate(
        "participants",
        "name email username avatarUrl",
      );
    }

    if (!chat) {
      return res
        .status(500)
        .json({ message: "Failed to create or retrieve chat" });
    }

    const otherParticipant = chat.participants.find(
      (p: any) => p._id.toString() !== userId,
    );

    res.status(200).json({
      chat: {
        _id: chat._id,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        participants: otherParticipant ?? null,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching chat with participant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
