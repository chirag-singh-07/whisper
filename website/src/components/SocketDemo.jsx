import React, { useEffect } from "react";
import { initializeSocket, getSocket } from "../utils/socket";

export default function SocketDemo({ token, chatId }) {
  useEffect(() => {
    const socket = initializeSocket(token);
    socket.emit("chat:join", { chatId });

    const onNew = (msg) => {
      console.log("new message", msg);
    };

    socket.on("message:new", onNew);

    return () => {
      try {
        socket.emit("chat:leave", { chatId });
        socket.off("message:new", onNew);
      } catch (e) {}
    };
  }, [token, chatId]);

  return <div>Socket demo connected</div>;
}
