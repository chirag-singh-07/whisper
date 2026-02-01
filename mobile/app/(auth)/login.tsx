import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useLogin } from "../../hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending: loading } = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          // Navigation is handled by AuthContext useEffect, but we can double check or show success
          // router.replace("/(tabs)"); // Handled by context
        },
      },
    );
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 px-6 pt-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-light justify-center items-center mb-6"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-10">
          <Text className="text-3xl font-bold text-white mb-2">
            Let's Sign You In
          </Text>
          <Text className="text-muted-foreground text-base">
            Welcome back, you've been missed!
          </Text>
        </View>

        {/* Form */}
        <View className="w-full mb-6">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            className="mb-4"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
            className="mb-2"
          />

          <TouchableOpacity
            className="self-end mb-6"
            onPress={() => Alert.alert("TODO", "Forgot Password Flow")}
          >
            <Text className="text-primary font-medium text-sm">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          size="lg"
          className="mb-8"
        />

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-[1px] bg-surface-light" />
          <Text className="text-muted-foreground px-4 text-sm">
            OR CONTINUE WITH
          </Text>
          <View className="flex-1 h-[1px] bg-surface-light" />
        </View>

        {/* Social Login */}
        <View className="flex-row justify-center gap-x-6 mb-8">
          <TouchableOpacity className="w-14 h-14 rounded-2xl bg-surface-card border border-surface-light justify-center items-center">
            <Ionicons name="logo-google" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 rounded-2xl bg-surface-card border border-surface-light justify-center items-center">
            <Ionicons name="logo-apple" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 rounded-2xl bg-surface-card border border-surface-light justify-center items-center">
            <Ionicons name="logo-facebook" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-auto mb-6">
          <Text className="text-muted-foreground text-sm">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-primary font-bold text-sm">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
