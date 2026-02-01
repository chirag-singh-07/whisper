import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import Skeleton from "../../components/ui/Skeleton";

interface CallLog {
  id: string;
  name: string;
  avatar?: string;
  type: "voice" | "video";
  status: "incoming" | "outgoing" | "missed";
  timestamp: string;
}

const MOCK_CALLS: CallLog[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    type: "video",
    status: "missed",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    type: "voice",
    status: "incoming",
    timestamp: "Yesterday, 8:45 PM",
  },
  {
    id: "3",
    name: "Alex Rivera",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    type: "video",
    status: "outgoing",
    timestamp: "Jan 30, 2:15 PM",
  },
  {
    id: "4",
    name: "Design Team",
    avatar:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
    type: "voice",
    status: "missed",
    timestamp: "Jan 28, 11:20 AM",
  },
];

export default function CallsScreen() {
  const [loading, setLoading] = useState(false);

  const CallSkeleton = () => (
    <View className="flex-row items-center mb-6 px-6">
      <Skeleton width={56} height={56} borderRadius={24} />
      <View className="ml-4 flex-1">
        <Skeleton width="40%" height={16} borderRadius={4} className="mb-2" />
        <Skeleton width="60%" height={12} borderRadius={4} />
      </View>
      <Skeleton width={32} height={32} borderRadius={16} />
    </View>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "incoming":
        return { name: "call-outline", color: "#10B981" }; // Green
      case "outgoing":
        return { name: "arrow-redo-outline", color: "#6B6B70" }; // Gray
      case "missed":
        return { name: "close-outline", color: "#EF4444" }; // Red
      default:
        return { name: "call-outline", color: "#6B6B70" };
    }
  };

  const renderCall = ({ item }: { item: CallLog }) => {
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center mb-6 px-6"
      >
        <Image
          source={{ uri: item.avatar }}
          className="w-14 h-14 rounded-[24px] border border-surface-light"
        />

        <View className="ml-4 flex-1">
          <Text className="text-white text-base font-bold mb-1">
            {item.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons
              name={statusIcon.name as any}
              size={14}
              color={statusIcon.color}
            />
            <Text
              className="text-muted-foreground text-xs ml-1"
              style={{
                color: item.status === "missed" ? "#EF4444" : "#6B6B70",
              }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)} •{" "}
              {item.timestamp}
            </Text>
          </View>
        </View>

        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-card border border-surface-light items-center justify-center">
          <Ionicons
            name={item.type === "video" ? "videocam-outline" : "call-outline"}
            size={20}
            color="#F4A261"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-3xl font-bold">Calls</Text>
            <Text className="text-muted-foreground text-sm">
              Recent history
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-card border border-surface-light items-center justify-center">
            <Ionicons name="add-outline" size={24} color="#F4A261" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CallSkeleton key={i} />
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={MOCK_CALLS}
            renderItem={renderCall}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20 px-10">
                <View className="w-20 h-20 bg-surface-card rounded-full items-center justify-center mb-4">
                  <Ionicons name="call-outline" size={40} color="#2D2D30" />
                </View>
                <Text className="text-white text-xl font-bold">
                  No calls yet
                </Text>
                <Text className="text-muted-foreground text-center mt-2">
                  When you make or receive calls, they will appear here.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
