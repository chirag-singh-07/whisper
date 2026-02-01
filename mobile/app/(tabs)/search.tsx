import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import Skeleton from "../../components/ui/Skeleton";
import { useSearch, SearchUser } from "../../hooks/useSearch";
import { useRouter } from "expo-router";
import { BASE_URL } from "../../api/client";

const { width } = Dimensions.get("window");

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { results, loading, error } = useSearch(query);
  const router = useRouter();

  const [creatingChat, setCreatingChat] = useState(false);

  const startChat = async (user: SearchUser) => {
    try {
      setCreatingChat(true);
      const response = await client<{ chat: any }>(`/chats/with/${user._id}`, {
        method: "POST",
      });

      router.push({
        pathname: "/chat/[id]",
        params: {
          id: response.chat._id,
          name: user.name,
          avatar: user.avatarUrl || "",
        },
      } as any);
    } catch (err) {
      console.error("Failed to start chat:", err);
    } finally {
      setCreatingChat(false);
    }
  };

  const UserSkeleton = () => (
    <View className="flex-row items-center mb-6 px-6">
      <Skeleton width={56} height={56} borderRadius={28} />
      <View className="ml-4 flex-1">
        <Skeleton width="40%" height={16} borderRadius={4} className="mb-2" />
        <Skeleton width="60%" height={12} borderRadius={4} />
      </View>
    </View>
  );

  const renderUser = ({ item }: { item: SearchUser }) => {
    // Basic fix for avatar URL if it's a relative path from backend
    const avatarSource = item.avatarUrl
      ? item.avatarUrl.startsWith("http")
        ? { uri: item.avatarUrl }
        : { uri: `${BASE_URL.replace("/api", "")}${item.avatarUrl}` }
      : null;

    return (
      <TouchableOpacity
        className="flex-row items-center mb-6 px-6"
        activeOpacity={0.7}
        onPress={() => startChat(item)}
        disabled={creatingChat}
      >
        <View className="relative">
          {avatarSource ? (
            <Image
              source={avatarSource}
              className="w-14 h-14 rounded-full border border-surface-light"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-surface-card border border-surface-light items-center justify-center">
              <Ionicons name="person" size={24} color="#6B6B70" />
            </View>
          )}
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-white text-base font-bold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-muted-foreground text-sm" numberOfLines={1}>
            @{item.username}
          </Text>
        </View>

        <TouchableOpacity className="bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
          <Text className="text-primary text-sm font-semibold">Chat</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pb-6">
          <Text className="text-white text-3xl font-bold mb-4">Discover</Text>

          <View className="flex-row items-center bg-surface-card border border-surface-light rounded-2xl h-12 px-4 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#6B6B70" />
            <TextInput
              placeholder="Search by name or username..."
              placeholderTextColor="#6B6B70"
              className="flex-1 ml-3 text-white text-base"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B6B70" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View>
            {[1, 2, 3, 4, 5].map((i) => (
              <UserSkeleton key={i} />
            ))}
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-10">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-white text-center mt-4 text-base">
              {error}
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10">
            {query.trim().length > 0 ? (
              <>
                <View className="w-20 h-20 bg-surface-card rounded-full items-center justify-center mb-4">
                  <Ionicons name="search" size={40} color="#2D2D30" />
                </View>
                <Text className="text-white text-xl font-bold">
                  No users found
                </Text>
                <Text className="text-muted-foreground text-center mt-2">
                  Try searching for a different name or username
                </Text>
              </>
            ) : (
              <>
                <View className="w-20 h-20 bg-surface-card rounded-full items-center justify-center mb-4">
                  <Ionicons name="people-outline" size={40} color="#2D2D30" />
                </View>
                <Text className="text-white text-xl font-bold">
                  Find Friends
                </Text>
                <Text className="text-muted-foreground text-center mt-2">
                  Search for people you know to start a conversation
                </Text>
              </>
            )}
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderUser}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
