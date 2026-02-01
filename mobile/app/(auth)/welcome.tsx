import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import Button from "../../components/ui/Button";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
// Add styled components or helper for the sign in button if needed
import { TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  const features = [
    {
      icon: "shield-checkmark-outline" as const,
      title: "Private & Secure",
      desc: "Your messages are end-to-end encrypted.",
    },
    {
      icon: "flash-outline" as const,
      title: "Lightning Fast",
      desc: "Experience real-time sync across all devices.",
    },
  ];

  return (
    <ScreenWrapper withGradient>
      <StatusBar style="light" />

      {/* Hero Section */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Animated Background Blob / Glow (CSSTransition equivalent) */}
        <View
          className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          style={{ top: "20%", left: "10%" }}
        />

        <View className="items-center mb-12">
          <View className="mb-8 items-center justify-center">
            <Image
              source={require("../../assets/app-images/logo.png")}
              style={{ width: width * 0.4, height: width * 0.4 }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-5xl font-bold text-white tracking-[6px] mb-3">
            WHISPER
          </Text>
          <View className="flex-row items-center mb-6">
            <View className="h-[1px] w-12 bg-primary/30 mr-3" />
            <Text className="text-primary text-xs uppercase tracking-[3px] font-semibold">
              The Art of Conversation
            </Text>
            <View className="h-[1px] w-12 bg-primary/30 ml-3" />
          </View>

          <Text className="text-muted-foreground text-center text-lg px-8 leading-6">
            Messaging made simple, private, and exceptionally beautiful.
          </Text>
        </View>

        {/* Feature Cards */}
        <View className="w-full flex-row justify-between px-2 mb-10">
          {features.map((feature, index) => (
            <View
              key={index}
              className="w-[48%] bg-surface-card/50 border border-surface-light p-4 rounded-3xl"
            >
              <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center mb-3">
                <Ionicons name={feature.icon} size={20} color="#F4A261" />
              </View>
              <Text className="text-white font-bold text-sm mb-1">
                {feature.title}
              </Text>
              <Text
                className="text-muted-foreground text-[10px] leading-4"
                numberOfLines={2}
              >
                {feature.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Section */}
      <View className="w-full px-6 pb-12">
        <View className="bg-surface-card/30 border border-surface-light p-6 rounded-[40px] items-center">
          <Button
            title="Get Started"
            onPress={() => router.push("/(auth)/register")}
            size="lg"
            className="w-full mb-4"
            icon={<Ionicons name="sparkles" size={18} color="white" />}
          />
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.6}
          >
            <Text className="text-muted-foreground text-sm font-medium">
              Already a member?{" "}
              <Text className="text-primary font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
