import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Using Expo vector icons which are pre-installed
import { colors } from '../../tailwind.config'; // We verified tailwind config structure

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  className?: string; // Additional container classes
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  label,
  error,
  icon,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  className = '',
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine border color based on focus/error
  const borderColor = error
    ? 'border-red-500'
    : isFocused
    ? 'border-primary'
    : 'border-surface-card';

  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && (
        <Text className="text-muted-foreground text-sm font-medium mb-2 ml-1">
          {label}
        </Text>
      )}

      <View
        className={`flex-row items-center bg-surface-card rounded-2xl border ${borderColor} h-14 px-4`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? '#F4A261' : '#A0A0A5'}
            style={{ marginRight: 10 }}
          />
        )}

        <TextInput
          className="flex-1 text-foreground text-base h-full"
          placeholder={placeholder}
          placeholderTextColor="#6B6B70"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#A0A0A5"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
