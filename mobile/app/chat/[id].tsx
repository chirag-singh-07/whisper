import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_MESSAGES = [
  {
    id: "1",
    text: "Hey! How's the project going?",
    sender: "other",
    time: "10:00 AM",
  },
  {
    id: "2",
    text: "It's going great! Just finished the UI polish. ✨",
    sender: "me",
    time: "10:05 AM",
  },
  {
    id: "3",
    text: "That's awesome! Can't wait to see the final version.",
    sender: "other",
    time: "10:06 AM",
  },
  {
    id: "4",
    text: "I'll send you a preview in a bit. Just cleaning up some code.",
    sender: "me",
    time: "10:10 AM",
  },
  { id: "5", text: "Perfect. No rush! 👍", sender: "other", time: "10:12 AM" },
];

export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === "me";
    return (
      <View
        className={`flex-row mb-4 ${isMe ? "justify-end" : "justify-start"}`}
      >
        {!isMe && (
          <Image
            source={{ uri: avatar as string }}
            className="w-8 h-8 rounded-full mr-2 self-end mb-1"
          />
        )}
        <View
          className={`max-w-[75%] px-4 py-3 rounded-[20px] ${
            isMe
              ? "bg-primary rounded-br-none"
              : "bg-surface-card border border-surface-light rounded-bl-none"
          }`}
        >
          <Text
            className={`${isMe ? "text-white" : "text-gray-100"} text-[15px] leading-5`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-[10px] mt-1 ${isMe ? "text-white/60" : "text-muted-foreground"} self-end`}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ paddingTop: 0 }}>
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center px-4 pb-4 border-b border-surface-light bg-surface"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row items-center flex-1 ml-2">
          <View className="relative">
            <Image
              source={{ uri: avatar as string }}
              className="w-10 h-10 rounded-full"
            />
            <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-surface" />
          </View>
          <View className="ml-3">
            <Text className="text-white font-bold text-base">{name}</Text>
            <Text className="text-green-500 text-[10px] font-medium">
              Online
            </Text>
          </View>
        </View>

        <TouchableOpacity className="p-2">
          <Ionicons name="ellipsis-vertical" size={20} color="#6B6B70" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={MOCK_MESSAGES}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Area */}
        <View
          style={{
            paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
            paddingTop: 12,
          }}
          className="px-4 bg-surface border-t border-surface-light flex-row items-end"
        >
          <TouchableOpacity className="bg-surface-card w-11 h-11 rounded-full items-center justify-center mr-3 mb-1">
            <Ionicons name="add" size={26} color="#F4A261" />
          </TouchableOpacity>

          <View className="flex-1 bg-surface-card border border-surface-light rounded-[24px] px-4 py-2 min-h-[44px] justify-center">
            <TextInput
              placeholder="Message..."
              placeholderTextColor="#6B6B70"
              className="text-white text-base max-h-32"
              multiline
              value={message}
              onChangeText={setMessage}
              cursorColor="#F4A261"
              selectionColor="#F4A261"
            />
          </View>

          <TouchableOpacity
            disabled={!message.trim()}
            className={`ml-3 w-11 h-11 rounded-full items-center justify-center mb-1 ${
              message.trim() ? "bg-primary" : "bg-surface-card opacity-50"
            }`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
