import { useState, useEffect } from "react";
import { client } from "../api/client";

export interface SearchUser {
  _id: string;
  name: string;
  username: string;
  avatarUrl: string;
  about?: string;
}

export const useSearch = (query: string) => {
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await client<{ users: SearchUser[] }>(
          `/users/search?query=${encodeURIComponent(query)}`,
        );
        setResults(response.users);
      } catch (err: any) {
        setError(err?.message || "Something went wrong while searching");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
};
