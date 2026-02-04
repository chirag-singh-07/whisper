import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import { useRequests } from "../../hooks/useRequests";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Helper to get full avatar URL
const getAvatar = (uri: string) => {
  if (!uri) return "https://ui-avatars.com/api/?background=random";
  if (uri.startsWith("http")) return uri;
  // Replace with your local machine IP
  return `http://192.168.1.5:5000${uri}`;
};

export default function Requests() {
  const { requests, loading, acceptRequest, rejectRequest, refreshRequests } =
    useRequests();

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between p-4 bg-surface-card mb-3 rounded-2xl border border-surface-light shadow-sm">
      <View className="flex-row items-center flex-1 mr-3">
        <Image
          source={{ uri: getAvatar(item.sender?.avatarUrl) }}
          className="w-12 h-12 rounded-[18px] border border-surface-light"
        />
        <View className="ml-3 flex-1">
          <Text className="text-white font-bold text-base" numberOfLines={1}>
            {item.sender?.name}
          </Text>
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            @{item.sender?.username}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => acceptRequest(item._id)}
          className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center border border-primary/30"
        >
          <Ionicons name="checkmark" size={20} color="#F4A261" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => rejectRequest(item._id)}
          className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
        >
          <Ionicons name="close" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <View className="flex-1 px-6 pt-2">
        <View className="mb-6">
          <Text className="text-3xl font-black text-white tracking-tight mb-2">
            Friend Requests
          </Text>
          <Text className="text-muted-foreground text-sm">
            Manage your incoming connection requests
          </Text>
        </View>

        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={loading}
          onRefresh={refreshRequests}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20 opacity-50">
              <View className="w-20 h-20 bg-surface-card rounded-full items-center justify-center mb-4">
                <Ionicons name="people-outline" size={40} color="#F4A261" />
              </View>
              <Text className="text-white text-lg font-bold mb-2">
                No Pending Requests
              </Text>
              <Text className="text-muted-foreground text-center px-10">
                When people ask to connect with you, they'll appear here.
              </Text>
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
