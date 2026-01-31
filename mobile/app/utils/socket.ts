import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(token: string, url?: string) {
  if (socket) return socket;
  const baseUrl = url || (process.env.EXPO_PUBLIC_API_URL as string) || "http://localhost:3000";

  socket = io(baseUrl, {
    auth: { token },
    transports: ["websocket"],
    // RN tip: ensure you use websocket transport and match server settings
  });

  socket.on("connect", () => {
    console.log("Socket connected", socket!.id);
  });

  socket.on("disconnect", (reason: unknown) => {
    console.log("Socket disconnected", reason);
  });

  return socket;
}

export function getSocket() {
  if (!socket) throw new Error("Socket not initialized. Call initializeSocket first.");
  return socket;
}

export function closeSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
