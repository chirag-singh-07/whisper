import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { initializeSocket } from "../utils/socket";

export default function SocketDemo({ token, chatId }: { token: string; chatId: string }) {
  useEffect(() => {
    const socket = initializeSocket(token);
    socket.emit("chat:join", { chatId });

    const onNew = (msg: any) => {
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

  return (
    <View>
      <Text>Socket demo connected</Text>
    </View>
  );
}
