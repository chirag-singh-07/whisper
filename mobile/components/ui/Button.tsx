import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import { cn } from "nativewind"; // Assuming standard cn utility or I'll just use template literals if not setup.
// Note: nativewind/cn might not be setup. I'll stick to template literals for simplicity unless I see a utils folder.

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
}: ButtonProps) {
  const baseStyles =
    "rounded-2xl flex-row items-center justify-center active:opacity-80";

  const variants = {
    primary: "bg-primary border border-primary",
    secondary: "bg-surface-light border border-surface-light",
    outline: "bg-transparent border border-muted-foreground",
    ghost: "bg-transparent border-none",
  };

  const textVariants = {
    primary: "text-white font-bold",
    secondary: "text-foreground font-semibold",
    outline: "text-muted-foreground font-medium",
    ghost: "text-primary font-medium",
  };

  const sizes = {
    sm: "py-2 px-4",
    md: "py-4 px-6",
    lg: "py-5 px-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Styles handling
  const containerStyle = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? "opacity-50" : ""} ${className}`;
  const textStyle = `${textVariants[variant]} ${textSizes[size]}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={containerStyle}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost" ? "#F4A261" : "#FFFFFF"
          }
        />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
