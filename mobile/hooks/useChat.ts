import { useState, useEffect, useRef } from "react";
import { client } from "../api/client";

export interface Message {
  _id: string;
  text: string;
  sender: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  type: string;
  createdAt: string;
}

export const useChat = (chatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      setLoading(true);
      const data = await client<{ messages: Message[] }>(
        `/messages/chat/${chatId}`,
      );
      setMessages(data.messages);
    } catch (err: any) {
      setError(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!chatId || !text.trim()) return;
    try {
      setSending(true);
      const data = await client<{ message: Message }>("/messages", {
        method: "POST",
        body: { chatId, text },
      });
      setMessages((prev) => [...prev, data.message]);
      return data.message;
    } catch (err: any) {
      setError(err?.message || "Failed to send message");
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
