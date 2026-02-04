import { useState, useEffect } from "react";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";

export const useChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/chats");
      setChats(data.formattedChats || []);
    } catch (err) {
      setError(err.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setChats((prevChats) => {
        // Find the chat this message belongs to
        const chatIndex = prevChats.findIndex(
          (c) => c._id === newMessage.chat || c._id === newMessage.chat._id,
        );

        if (chatIndex === -1) {
          // New chat or not in list ?? Reload list to be safe or ignore
          // Ideally we fetch the single chat and prepend, but simpler:
          fetchChats();
          return prevChats;
        }

        const updatedChats = [...prevChats];
        const chatToUpdate = { ...updatedChats[chatIndex] };

        // Update last message
        chatToUpdate.lastMessage = newMessage;
        chatToUpdate.lastMessageAt = newMessage.createdAt;

        // Move to top
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chatToUpdate);

        return updatedChats;
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket]);

  return { chats, loading, error, refresh: fetchChats };
};
