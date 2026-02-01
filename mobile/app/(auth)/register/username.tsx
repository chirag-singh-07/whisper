import { View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterUsername() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; password: string }>();
  const { email, password } = params;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ username?: string; name?: string }>(
    {},
  );

  const validateUsername = (text: string) => {
    setUsername(text);
    if (!/^[a-zA-Z0-9_]+$/.test(text)) {
      setErrors((prev) => ({
        ...prev,
        username: "Username can only contain letters, numbers, and underscores",
      }));
    } else {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handleRegister = async () => {
    // Final check before submit
    if (errors.username) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: errors.username,
      });
      return;
    }

    if (!username || !name) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Missing registration data. Please restart.",
      });
      router.replace("/(auth)/register");
      return;
    }

    // Navigate to next step (Avatar & About)
    router.push({
      pathname: "/(auth)/register/avatar",
      params: { email, password, username, name },
    });
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

        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">
            Profile Details
          </Text>
          <Text className="text-muted-foreground text-base">
            Tell us a bit about yourself.
          </Text>
        </View>

        {/* Form */}
        <View className="w-full mb-6">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            autoCapitalize="words"
            className="mb-4"
          />
          <Input
            label="Username"
            placeholder="Choose a unique username"
            value={username}
            onChangeText={validateUsername}
            icon="at-outline"
            autoCapitalize="none"
            className="mb-4"
            error={errors.username}
          />
        </View>

        <Button
          title="Next"
          onPress={handleRegister}
          size="lg"
          icon={<Ionicons name="arrow-forward" size={20} color="white" />}
          className="mb-8"
        />
      </View>
    </ScreenWrapper>
  );
}
