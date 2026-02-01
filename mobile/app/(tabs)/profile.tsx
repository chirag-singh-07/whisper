import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import LogoutButton from "../../components/ui/LogoutButton";
import { useSession } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useSession();

  const ActionItem = ({
    icon,
    label,
    onPress,
    color = "white",
    danger = false,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-surface-card border border-surface-light rounded-2xl p-4 mb-3"
      activeOpacity={0.7}
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center ${danger ? "bg-red-500/10" : "bg-primary/10"}`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? "#ef4444" : "#F4A261"}
        />
      </View>
      <Text
        className={`flex-1 ml-4 text-base font-semibold ${danger ? "text-red-500" : "text-white"}`}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <View className="w-32 h-32 rounded-full bg-surface-card border-4 border-surface-light items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  className="w-full h-full"
                />
              ) : (
                <Text className="text-4xl">👤</Text>
              )}
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full items-center justify-center border-4 border-surface">
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-white text-2xl font-bold mt-4">
            {user?.name || "Anonymous"}
          </Text>
          <Text className="text-muted-foreground text-sm">
            @{user?.username || "unknown"}
          </Text>

          <View className="flex-row mt-6 w-full">
            <View className="flex-1 items-center border-r border-surface-light">
              <Text className="text-white font-bold text-lg">12</Text>
              <Text className="text-muted-foreground text-xs">Contacts</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-white font-bold text-lg">2.4k</Text>
              <Text className="text-muted-foreground text-xs">Messages</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="mb-6">
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4 ml-1">
            Account
          </Text>
          <ActionItem icon="person-outline" label="Edit Profile's Details" />
          <ActionItem icon="notifications-outline" label="Notifications" />
          <ActionItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
          />
        </View>

        {/* App Section */}
        <View className="mb-10">
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4 ml-1">
            Support
          </Text>
          <ActionItem icon="help-circle-outline" label="Help Center" />
          <ActionItem
            icon="log-out-outline"
            label="Logout Session"
            danger
            onPress={() => {}}
          />
          <View className="mt-2">
            <LogoutButton
              variant="danger"
              showLabel={true}
              className="h-14 rounded-2xl"
            />
          </View>
        </View>

        <View className="items-center pb-10">
          <Text className="text-muted-foreground text-xs italic">
            Whisper v1.0.0
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Profile;
