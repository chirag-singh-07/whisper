import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLogout } from "../../hooks/useAuth";

interface LogoutButtonProps {
  showLabel?: boolean;
  className?: string;
  variant?: "ghost" | "outline" | "danger";
}

export default function LogoutButton({
  showLabel = true,
  className = "",
  variant = "ghost",
}: LogoutButtonProps) {
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return "border border-red-500/20 bg-red-500/5 px-4 py-2 rounded-xl";
      case "danger":
        return "bg-red-500 px-4 py-2 rounded-xl";
      default:
        return "px-2 py-2";
    }
  };

  const getTextColor = () => {
    return variant === "danger" ? "text-white" : "text-red-500";
  };

  const getIconColor = () => {
    return variant === "danger" ? "white" : "#ef4444";
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      disabled={isPending}
      activeOpacity={0.7}
      className={`flex-row items-center justify-center ${getVariantStyles()} ${className}`}
    >
      {isPending ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={20} color={getIconColor()} />
          {showLabel && (
            <Text className={`ml-2 font-semibold ${getTextColor()}`}>
              Logout
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
