import { useState, useEffect } from "react";
import api from "../utils/api";

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

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
      setMessages((prev) => [...prev, data.message]);
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

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
};
