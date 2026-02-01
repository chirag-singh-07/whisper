import { View, Text, StatusBar, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenWrapperProps {
  children: React.ReactNode;
  bg?: string; // Optional custom background color
  withGradient?: boolean; // Whether to use the signature gradient
  style?: any;
}

export default function ScreenWrapper({
  children,
  bg,
  withGradient = false, // Default to flat color for standard screens, true for auth/onboarding
  style,
}: ScreenWrapperProps) {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 15 : 50; // Added more breathing room for top status bar area

  if (withGradient) {
    // Premium gradient background for auth/onboarding
    return (
      <LinearGradient
        colors={["#1A1A1D", "#2D2D30", "#1A1A1D"]} // Surface to Surface Light to Surface
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop }}
        className="flex-1"
      >
        <StatusBar barStyle="light-content" />
        <View className={`flex-1 ${style}`}>{children}</View>
      </LinearGradient>
    );
  }

  return (
    <View className="flex-1 bg-surface" style={[{ paddingTop }, style]}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1D" />
      {children}
    </View>
  );
}
