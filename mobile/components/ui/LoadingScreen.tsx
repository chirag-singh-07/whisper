import React, { useEffect, useRef } from "react";
import { View, Text, Animated, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-surface">
      <LinearGradient
        colors={["#1A1A1D", "#0D0D0F"]}
        className="flex-1 items-center justify-center"
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          className="items-center"
        >
          {/* Logo Placeholder */}
          <View className="w-24 h-24 bg-primary/20 rounded-[40px] items-center justify-center mb-6 border border-primary/30">
            <Ionicons name="chatbubble-ellipses" size={48} color="#F4A261" />
          </View>

          <Text className="text-white text-4xl font-bold tracking-[4px] mb-2">
            WHISPER
          </Text>
          <View className="flex-row items-center">
            <View className="h-[1px] w-8 bg-primary/40 mr-3" />
            <Text className="text-muted-foreground text-xs uppercase tracking-[2px]">
              Encrypted Messaging
            </Text>
            <View className="h-[1px] w-8 bg-primary/40 ml-3" />
          </View>
        </Animated.View>

        <View className="absolute bottom-16 items-center">
          <ActivityIndicator color="#F4A261" size="small" />
          <Text className="text-muted-foreground text-[10px] mt-4 uppercase tracking-[1px]">
            Securing Connection...
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
