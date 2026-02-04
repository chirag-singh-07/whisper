import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Replace with your machine's IP address for physical device / emulator
// localhost works for iOS simulator, but for Android emulator use 10.0.2.2
const SOCKET_URL = "http://192.168.1.4:5000"; // Update this with your local IP

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const initSocket = async () => {
      const token = await SecureStore.getItemAsync("accessToken");

      if (token) {
        socketInstance = io(SOCKET_URL, {
          auth: { token },
          transports: ["websocket"],
        });

        socketInstance.on("connect", () => {
          console.log("Mobile Socket connected:", socketInstance?.id);
        });

        socketInstance.on("connect_error", (err) => {
          console.error("Mobile Socket Connection Error:", err);
        });

        setSocket(socketInstance);
      }
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
