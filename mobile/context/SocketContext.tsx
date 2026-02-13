import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { getValidAccessToken } from "../utils/tokenRefresh";

// Replace with your machine's IP address for physical device / emulator
// localhost works for iOS simulator, but for Android emulator use 10.0.2.2
const SOCKET_URL = "http://192.168.1.13:5000"; // Update this with your local IP

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const initSocket = async () => {
      // Get a valid token (will refresh if expired)
      const token = await getValidAccessToken();

      if (!token) {
        console.error("❌ Unable to get valid access token");
        console.error("   → Please log in again");
        return;
      }

      console.log("🔌 Initializing socket connection to:", SOCKET_URL);
      console.log("🔑 Using valid access token");

      socketInstance = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketInstance.on("connect", () => {
        console.log("✅ Mobile Socket connected:", socketInstance?.id);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("❌ Mobile Socket Connection Error:", err.message);
        console.error("Error details:", {
          name: err.name,
          message: err.message,
          description: (err as any).description,
          context: (err as any).context,
        });
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected. Reason:", reason);
      });

      socketInstance.on("reconnect_attempt", (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      });

      socketInstance.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed after all attempts");
      });

      setSocket(socketInstance);
    };

    initSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
