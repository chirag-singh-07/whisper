import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useSocket } from "../context/SocketContext";
import Toast from "react-native-toast-message";

// Basic API utility since we don't have the web's axios instance here yet
// In a real app, this should be a shared utility
const API_URL = "http://192.168.1.4:5000/api"; // Sync with SocketContext URL

export const useRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const getHeaders = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/requests/pending`, { headers });
      const data = await res.json();

      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendRequest = async (receiverId: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/requests/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({ receiverId }),
      });
      const data = await res.json();

      if (res.ok) {
        Toast.show({ type: "success", text1: "Request sent!" });
        return data.request;
      } else {
        throw new Error(data.message || "Failed to send");
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to send request",
      });
      throw err;
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/requests/accept`, {
        method: "POST",
        headers,
        body: JSON.stringify({ requestId }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        Toast.show({ type: "success", text1: "Request accepted!" });
      } else {
        Toast.show({ type: "error", text1: "Failed to accept" });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Error accepting request" });
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/requests/reject`, {
        method: "POST",
        headers,
        body: JSON.stringify({ requestId }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        Toast.show({ type: "info", text1: "Request rejected" });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to reject" });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (newRequest: any) => {
      setRequests((prev) => [newRequest, ...prev]);
      Toast.show({
        type: "info",
        text1: `New request from ${newRequest.sender?.name}`,
      });
    };

    socket.on("request:new", handleNewRequest);

    return () => {
      socket.off("request:new", handleNewRequest);
    };
  }, [socket]);

  return {
    requests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    refreshRequests: fetchRequests,
  };
};
