import { useState, useEffect, useRef } from "react";
import { client } from "../api/client";
import { useSocket } from "../context/SocketContext";

export interface Message {
  _id: string;
  text: string;
  sender: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  chat?: string; // Chat ID that this message belongs to
  type: string;
  createdAt: string;
}

export const useChat = (chatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

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

  // Socket integration for real-time messages
  useEffect(() => {
    if (!socket || !chatId) return;

    // Join the chat room to receive messages
    socket.emit("chat:join", { chatId });

    const handleNewMessage = (newMessage: Message) => {
      // Only append if it belongs to this chat and isn't a duplicate
      if (
        newMessage.chat === chatId ||
        (newMessage.chat as any)?._id === chatId
      ) {
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
