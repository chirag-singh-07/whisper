import { useState, useEffect } from "react";
import { client } from "../api/client";

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

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await client<{ formattedChats: Chat[] }>("/chats");
      setChats(data.formattedChats);
    } catch (err: any) {
      setError(err?.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return { chats, loading, error, refresh: fetchChats };
};
