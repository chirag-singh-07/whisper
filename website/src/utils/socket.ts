import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "./api";

let socket: Socket | null = null;

export function initializeSocket(token: string, url?: string) {
  if (socket) return socket;
  const baseUrl = url || SOCKET_URL;

  socket = io(baseUrl, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("socket connected", socket!.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected", reason);
  });

  return socket;
}

export function getSocket() {
  if (!socket)
    throw new Error("Socket not initialized. Call initializeSocket first.");
  return socket;
}

export function closeSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
