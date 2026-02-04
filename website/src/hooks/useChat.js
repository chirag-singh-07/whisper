import { useState, useEffect } from "react";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/messages/chat/${chatId}`);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!chatId || !text.trim()) return;
    try {
      setSending(true);
      const { data } = await api.post("/messages", { chatId, text });
      // Don't manually append here if we rely on socket event
      // But for better UX (instant feedback), we can keep it
      // For now, let's wait for socket event to prevent duplicate if needed,
      // OR optimistically update. Hybrid approach: API returns message, we append it.
      // And we filter duplicates in the socket listener.
      const isDuplicate = messages.some((m) => m._id === data.message._id);
      if (!isDuplicate) {
        setMessages((prev) => [...prev, data.message]);
      }
      return data.message;
    } catch (err) {
      setError(err.message || "Failed to send message");
      throw err;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("chat:join", { chatId });

    const handleNewMessage = (newMessage) => {
      // Only append if it belongs to this chat and isn't a duplicate
      if (newMessage.chat === chatId || newMessage.chat._id === chatId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.emit("chat:leave", { chatId });
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, chatId]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
};
