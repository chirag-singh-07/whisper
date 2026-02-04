import type { Request, Response } from "express";
import { RequestModel } from "../models/RequestModel";
import { ChatModel } from "../models/ChatModel";
import { UserModel } from "../models/UserModel";
import { getIO } from "../utils/socket";

export const handleSendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { receiverId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!receiverId)
      return res.status(400).json({ message: "Receiver ID is required" });

    if (userId === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    // Check if request already exists
    const existingRequest = await RequestModel.findOne({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }, // Check reverse too? Usually separate, but let's prevent dupes
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "Request already pending" });
      }
      if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "You are already friends" });
      }
      // If rejected, maybe allow re-sending? For now strict.
      return res.status(400).json({ message: "Request exists" });
    }

    // Create new request
    const newRequest = await RequestModel.create({
      sender: userId,
      receiver: receiverId,
      status: "pending",
    });

    // Notify receiver via socket
    try {
      const io = getIO();
      // Populate sender info for the notification
      const populatedRequest = await RequestModel.findById(
        newRequest._id,
      ).populate("sender", "name username avatarUrl");
      io.to(receiverId).emit("request:new", populatedRequest);
    } catch (e) {}

    res.status(201).json({ message: "Request sent", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to send request", error });
  }
};

export const handleGetRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const requests = await RequestModel.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name username avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error });
  }
};

export const handleAcceptRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { requestId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const request = await RequestModel.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending",
    });
    if (!request)
      return res.status(404).json({ message: "Request not found or invalid" });

    request.status = "accepted";
    await request.save();

    // Create a chat between them
    // Check if chat exists first (idempotency)
    let chat = await ChatModel.findOne({
      participants: { $all: [request.sender, request.receiver] },
      isGroup: false,
    });

    if (!chat) {
      chat = await ChatModel.create({
        participants: [request.sender, request.receiver],
        isGroup: false,
      });
    }

    // Notify sender via socket
    try {
      const io = getIO();
      io.to(request.sender.toString()).emit("request:accepted", {
        requestId: request._id,
        accepterId: userId,
        chatId: chat._id,
      });
    } catch (e) {}

    res.status(200).json({ message: "Request accepted", chat });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept request", error });
  }
};

export const handleRejectRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { requestId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Actually delete it or mark rejected? Deleting allows re-sending later.
    // Marking rejected blocks future requests usually. Let's delete/reject.
    // Let's mark rejected for now.
    const request = await RequestModel.findOneAndUpdate(
      { _id: requestId, receiver: userId, status: "pending" },
      { status: "rejected" },
      { new: true },
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request", error });
  }
};
