import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "./jwt";
import { MessageModel } from "../models/MessageModel";
import { ChatModel } from "../models/ChatModel";
import { UserModel } from "../models/UserModel";

let io: SocketServer | null = null;
const userSockets = new Map<string, Set<string>>(); // userId -> socketIds

export function getIO(): SocketServer {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: "*", // Adjust this in production for security
    },
    // optional: pingTimeout, transports, etc
  });

  // Simple token-based socket authentication using JWT access tokens
  io.use(async (socket, next) => {
    try {
      console.log("🔐 Socket authentication attempt...");
      console.log("  - Socket ID:", socket.id);
      console.log("  - Handshake auth:", socket.handshake.auth);
      console.log(
        "  - Authorization header:",
        socket.handshake.headers?.authorization,
      );

      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization || "").split(" ")[1];

      if (!token) {
        console.error("❌ Authentication failed: token missing");
        return next(new Error("Authentication error: token missing"));
      }

      console.log("  - Token received:", token.substring(0, 30) + "...");
      console.log("  - Token length:", token.length);

      const payload = verifyAccessToken(token);
      console.log("✅ Token verified successfully");
      console.log("  - User ID:", payload.userId);

      // attach userId to socket for later use
      (socket as any).userId = payload.userId;

      // Optionally: ensure user exists
      const user = await UserModel.findById(payload.userId).select("_id name");
      if (!user) {
        console.error(
          "❌ Authentication failed: user not found for ID:",
          payload.userId,
        );
        return next(new Error("Authentication error: user not found"));
      }

      console.log("✅ User found:", user.name);
      return next();
    } catch (err) {
      console.error("❌ Socket authentication error:", err);
      if (err instanceof Error) {
        console.error("  - Error name:", err.name);
        console.error("  - Error message:", err.message);
      }
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const userId = (socket as any).userId as string;
    if (!userId) {
      console.log("❌ Socket connection rejected - No userId");
      return socket.disconnect(true);
    }

    console.log(
      `✅ Socket connected - User ID: ${userId}, Socket ID: ${socket.id}`,
    );

    // Register socket id for the user
    const sockets = userSockets.get(userId) || new Set<string>();
    sockets.add(socket.id);
    userSockets.set(userId, sockets);

    console.log(
      `📊 User ${userId} now has ${sockets.size} active connection(s)`,
    );

    // If this is first socket for the user, set user online
    if (sockets.size === 1) {
      await UserModel.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
      });
      io!.emit("user:online", { userId });
      console.log(`🟢 User ${userId} is now ONLINE`);
    }

    // Acknowledge and send current online users (lightweight)
    socket.emit("connected", { userId });
    console.log(`📤 Sent 'connected' acknowledgment to ${userId}`);

    // Join chat room
    socket.on("chat:join", async (data: { chatId: string }) => {
      if (!data?.chatId) return;
      socket.join(data.chatId);
      console.log(`🚪 User ${userId} joined chat room: ${data.chatId}`);
    });

    // Leave chat room
    socket.on("chat:leave", async (data: { chatId: string }) => {
      if (!data?.chatId) return;
      socket.leave(data.chatId);
      console.log(`🚪 User ${userId} left chat room: ${data.chatId}`);
    });

    // Typing indicator
    socket.on("typing", (data: { chatId: string; isTyping: boolean }) => {
      if (!data?.chatId) return;
      socket.to(data.chatId).emit("typing", {
        chatId: data.chatId,
        userId,
        isTyping: !!data.isTyping,
      });
    });

    // Send message (persist and broadcast)
    socket.on(
      "message:send",
      async (
        payload: {
          chatId: string;
          type?: "text" | "image" | "video" | "audio" | "file";
          text?: string;
          mediaUrl?: string;
          mediaMeta?: any;
        },
        ack?: (response: any) => void,
      ) => {
        try {
          if (!payload?.chatId) throw new Error("chatId is required");

          const message = await MessageModel.create({
            chat: payload.chatId,
            sender: userId,
            type: payload.type || "text",
            text: payload.text,
            mediaUrl: payload.mediaUrl,
            mediaMeta: payload.mediaMeta,
          });

          // update chat last message
          await ChatModel.findByIdAndUpdate(payload.chatId, {
            lastMessage: message._id,
            lastMessageAt: message.createdAt || new Date(),
          });

          const fullMessage = await MessageModel.findById(message._id).populate(
            "sender",
            "name avatarUrl",
          );

          // broadcast to participants in the room
          io!.to(payload.chatId).emit("message:new", fullMessage);

          // optionally send push/notification to other devices of participants (not implemented here)

          ack && ack({ status: "ok", message: fullMessage });
        } catch (err: any) {
          ack &&
            ack({
              status: "error",
              error: err?.message || "Failed to send message",
            });
        }
      },
    );

    // Mark message as read
    socket.on("message:read", async (data: { messageId: string }) => {
      try {
        if (!data?.messageId) return;
        const msg = await MessageModel.findByIdAndUpdate(
          data.messageId,
          { $addToSet: { readBy: userId } },
          { new: true },
        );
        if (!msg) return;
        io!
          .to(msg.chat.toString())
          .emit("message:read", { messageId: data.messageId, userId });
      } catch (err) {
        // ignore
      }
    });

    // Delivered ack
    socket.on("message:delivered", async (data: { messageId: string }) => {
      try {
        if (!data?.messageId) return;
        const msg = await MessageModel.findById(data.messageId);
        if (!msg) return;
        io!
          .to(msg.chat.toString())
          .emit("message:delivered", { messageId: data.messageId, userId });
      } catch (err) {
        // ignore
      }
    });

    socket.on("disconnect", async () => {
      console.log(
        `🔌 Socket disconnected - User ID: ${userId}, Socket ID: ${socket.id}`,
      );

      // Remove socket id
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
          await UserModel.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });
          io!.emit("user:offline", { userId });
          console.log(`🔴 User ${userId} is now OFFLINE`);
        } else {
          userSockets.set(userId, sockets);
          console.log(
            `📊 User ${userId} still has ${sockets.size} active connection(s)`,
          );
        }
      }
    });
  });

  return io;
};
