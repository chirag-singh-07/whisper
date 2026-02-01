import { useState, useEffect } from "react";
import api from "../utils/api";

export const useChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return { chats, loading, error, refresh: fetchChats };
};
