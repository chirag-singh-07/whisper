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

import { useChats, Chat } from "../../hooks/useChats";
import { BASE_URL } from "../../api/client";
import { RefreshControl } from "react-native";

const ChatsTab = () => {
  const { chats, loading, error, refresh } = useChats();
  const router = useRouter();

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

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getAvatarUrl = (user: any) => {
    if (!user?.avatarUrl) return null;
    if (user.avatarUrl.startsWith("http")) return { uri: user.avatarUrl };
    return { uri: `${BASE_URL.replace("/api", "")}${user.avatarUrl}` };
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-3xl font-bold">Chats</Text>
            <Text className="text-muted-foreground text-sm">
              {chats.length} active conversation{chats.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/search")}
            className="w-10 h-10 rounded-full bg-surface-card border border-surface-light items-center justify-center"
          >
            <Ionicons name="create-outline" size={22} color="#F4A261" />
          </TouchableOpacity>
        </View>

        {/* Search Bar Placeholder */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center bg-surface-card border border-surface-light rounded-2xl h-12 px-4 opacity-60">
            <Ionicons name="search-outline" size={20} color="#6B6B70" />
            <Text className="ml-3 text-[#6B6B70] text-base">
              Search messages...
            </Text>
          </View>
        </View>

        {/* Chat List */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refresh}
              tintColor="#F4A261"
            />
          }
        >
          {loading && chats.length === 0
            ? Array(4)
                .fill(0)
                .map((_, i) => <ChatSkeleton key={i} />)
            : chats.map((chat) => (
                <TouchableOpacity
                  key={chat._id}
                  className="flex-row items-center mb-6"
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/chat/[id]",
                      params: {
                        id: chat._id,
                        name: chat.participants.name,
                        avatar: chat.participants.avatarUrl || "",
                      },
                    } as any)
                  }
                >
                  {/* Avatar Container */}
                  <View className="relative">
                    {getAvatarUrl(chat.participants) ? (
                      <Image
                        source={getAvatarUrl(chat.participants)!}
                        className="w-16 h-16 rounded-[24px]"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-[24px] bg-surface-card border border-surface-light items-center justify-center">
                        <Ionicons name="person" size={28} color="#6B6B70" />
                      </View>
                    )}
                  </View>

                  {/* Chat Info */}
                  <View className="flex-1 ml-4 justify-center">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text
                        className="text-white text-lg font-bold"
                        numberOfLines={1}
                      >
                        {chat.participants.name}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        {formatTime(chat.lastMessageAt)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text
                        className="text-sm flex-1 mr-2 text-muted-foreground"
                        numberOfLines={1}
                      >
                        {chat.lastMessage?.text || "New conversation"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

          {!loading && chats.length === 0 && (
            <View className="flex-1 items-center justify-center mt-20">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={60}
                color="#2D2D30"
              />
              <Text className="text-white text-xl font-bold mt-4">
                No chats yet
              </Text>
              <Text className="text-muted-foreground text-center mt-2 px-10">
                Search for friends to start a beautiful conversation
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/search")}
                className="mt-6 bg-primary/10 border border-primary/20 px-6 py-2 rounded-full"
              >
                <Text className="text-primary font-bold">Find Friends</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default ChatsTab;
