import { useState, useEffect } from "react";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";
import { toast } from "sonner";

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/requests/pending");
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (receiverId) => {
    try {
      const { data } = await api.post("/requests/send", { receiverId });
      toast.success("Request sent!");
      return data.request;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
      throw err;
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.post("/requests/accept", { requestId });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request accepted!");
      // Optionally trigger chat refresh here or rely on socket
    } catch (err) {
      toast.error("Failed to accept request");
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await api.post("/requests/reject", { requestId });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request rejected");
    } catch (err) {
      toast.error("Failed to reject request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (newRequest) => {
      setRequests((prev) => [newRequest, ...prev]);
      toast.info(`New friend request from ${newRequest.sender?.name}`);
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
