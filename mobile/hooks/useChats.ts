import { useState, useEffect, useCallback } from "react";
import { client } from "../api/client";
import { useSocket } from "../context/SocketContext";

export interface Chat {
  _id: string;
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  participants: {
    _id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
}

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await client<{ formattedChats: Chat[] }>("/chats");
      // Deduplicate chats by _id to prevent duplicate key warnings
      const uniqueChats = data.formattedChats.filter(
        (chat, index, self) =>
          index === self.findIndex((c) => c._id === chat._id),
      );
      setChats(uniqueChats);
    } catch (err: any) {
      setError(err?.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Socket integration for real-time chat list updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      setChats((prevChats) => {
        // Find the chat this message belongs to
        const chatIndex = prevChats.findIndex(
          (c) =>
            c._id === newMessage.chat ||
            c._id === (newMessage.chat as any)?._id,
        );

        // If chat not found, don't modify state here
        // The user will need to refresh or we handle it elsewhere
        if (chatIndex === -1) {
          console.log("Message for unknown chat, ignoring:", newMessage.chat);
          return prevChats;
        }

        const updatedChats = [...prevChats];
        const chatToUpdate = { ...updatedChats[chatIndex] };

        // Update last message
        chatToUpdate.lastMessage = {
          text: newMessage.text,
          createdAt: newMessage.createdAt,
        };
        chatToUpdate.lastMessageAt = newMessage.createdAt;

        // Move to top
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chatToUpdate);

        // Deduplicate to ensure no duplicates
        const uniqueChats = updatedChats.filter(
          (chat, index, self) =>
            index === self.findIndex((c) => c._id === chat._id),
        );

        return uniqueChats;
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket]);

  return { chats, loading, error, refresh: fetchChats };
};
