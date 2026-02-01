import { View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterIndex() {
  const router = useRouter();
  // TODO: Use Context for multi-step form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validatePassword = (text: string) => {
    setPassword(text);
    // Regex: At least one special character, and implicit length requirement usually
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one special character",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleNext = () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      });
      return;
    }

    if (errors.password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: errors.password,
      });
      return;
    }
    // Validate password complexity here if needed

    // Navigate to next step
    // Pass data via params or context. For now, we assume context or params.
    router.push({
      pathname: "/(auth)/register/username",
      params: { email, password },
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
            Create Account
          </Text>
          <Text className="text-muted-foreground text-base">
            Join the community today!
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
            placeholder="Create a password"
            value={password}
            onChangeText={validatePassword}
            icon="lock-closed-outline"
            secureTextEntry
            className="mb-4"
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon="lock-closed-outline"
            secureTextEntry
            className="mb-4"
          />
        </View>

        <Button
          title="Next"
          onPress={handleNext}
          size="lg"
          icon={<Ionicons name="arrow-forward" size={20} color="white" />}
          className="mb-8"
        />

        {/* Footer */}
        <View className="flex-row justify-center mt-auto mb-6">
          <Text className="text-muted-foreground text-sm">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-primary font-bold text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
