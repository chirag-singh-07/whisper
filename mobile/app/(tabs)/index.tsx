import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import Skeleton from "../../components/ui/Skeleton";
import { useRouter } from "expo-router";

const MOCK_CHATS = [
  {
    id: "1",
    name: "Sarah Wilson",
    lastMessage: "Hey, are we still meeting today?",
    time: "12:45 PM",
    unreadCount: 2,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    online: true,
  },
  {
    id: "2",
    name: "Design Team",
    lastMessage: "The new mockups are ready for review!",
    time: "Yesterday",
    unreadCount: 0,
    avatar:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
    online: false,
  },
  {
    id: "3",
    name: "Michael Chen",
    lastMessage: "Thanks for the help earlier.",
    time: "Yesterday",
    unreadCount: 0,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    online: true,
  },
];

const ChatsTab = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate initial loading to show off premium skeletons
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const ChatSkeleton = () => (
    <View className="flex-row items-center mb-6">
      <Skeleton width={64} height={64} borderRadius={24} />
      <View className="flex-1 ml-4 justify-center">
        <View className="flex-row justify-between items-center mb-2">
          <Skeleton width="40%" height={16} />
          <Skeleton width="15%" height={12} />
        </View>
        <Skeleton width="70%" height={14} />
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-3xl font-bold">Chats</Text>
            <Text className="text-muted-foreground text-sm">
              3 active conversations
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-card border border-surface-light items-center justify-center">
            <Ionicons name="create-outline" size={22} color="#F4A261" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center bg-surface-card border border-surface-light rounded-2xl h-12 px-4">
            <Ionicons name="search-outline" size={20} color="#6B6B70" />
            <TextInput
              placeholder="Search messages..."
              placeholderTextColor="#6B6B70"
              className="flex-1 ml-3 text-white text-base"
              editable={!loading}
            />
          </View>
        </View>

        {/* Chat List */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <ChatSkeleton key={i} />)
            : MOCK_CHATS.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  className="flex-row items-center mb-6"
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/chat/[id]",
                      params: {
                        id: chat.id,
                        name: chat.name,
                        avatar: chat.avatar,
                      },
                    } as any)
                  }
                >
                  {/* Avatar Container */}
                  <View className="relative">
                    <Image
                      source={{ uri: chat.avatar }}
                      className="w-16 h-16 rounded-[24px]"
                    />
                    {chat.online && (
                      <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-surface" />
                    )}
                  </View>

                  {/* Chat Info */}
                  <View className="flex-1 ml-4 justify-center">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text
                        className="text-white text-lg font-bold"
                        numberOfLines={1}
                      >
                        {chat.name}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        {chat.time}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text
                        className={`text-sm flex-1 mr-2 ${chat.unreadCount > 0 ? "text-white font-semibold" : "text-muted-foreground"}`}
                        numberOfLines={1}
                      >
                        {chat.lastMessage}
                      </Text>
                      {chat.unreadCount > 0 && (
                        <View className="bg-primary px-1.5 min-w-[20px] h-5 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">
                            {chat.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default ChatsTab;
