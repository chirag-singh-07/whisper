import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRegister } from "../../../hooks/useAuth";
import Toast from "react-native-toast-message";

export default function RegisterAvatar() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email: string;
    password: string;
    username: string;
    name: string;
  }>();

  const [image, setImage] = useState<string | null>(null);
  const [about, setAbout] = useState("");
  const { mutate: register, isPending: loading } = useRegister();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCompleteRegistration = async (skipImage: boolean = false) => {
    const registrationData = {
      ...params,
      about,
      // For now, we are sending the local URI as a mock.
      // Real apps would upload to S3/Cloudinary first.
      avatarUrl: !skipImage && image ? image : undefined,
    };

    register(registrationData, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Welcome!",
          text2: "Account created successfully.",
        });
        // AuthContext will handle navigation to (tabs) automatically
        // once it detects the token in SecureStore
      },
    });
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 px-6 pt-4 items-center">
        {/* Header */}
        <View className="mb-8 w-full mt-6">
          <Text className="text-3xl font-bold text-white mb-2 text-center">
            Almost Done!
          </Text>
          <Text className="text-muted-foreground text-base text-center">
            Tell us about yourself and add a photo.
          </Text>
        </View>

        {/* Avatar Placeholder / Preview */}
        <TouchableOpacity
          onPress={pickImage}
          className="w-32 h-32 rounded-full bg-surface-card border-2 border-dashed border-surface-light justify-center items-center mb-8 overflow-hidden"
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={32} color="#F4A261" />
              <Text className="text-primary text-xs mt-1">Upload</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* About Field */}
        <View className="w-full mb-6">
          <Input
            label="About You"
            placeholder="What's on your mind? (Optional)"
            value={about}
            onChangeText={setAbout}
            icon="information-circle-outline"
            className="mb-4"
          />
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-y-4 mt-auto mb-10">
          <Button
            title="Complete Setup"
            onPress={() => handleCompleteRegistration(false)}
            loading={loading}
            size="lg"
          />

          <Button
            title="Skip photo for now"
            onPress={() => handleCompleteRegistration(true)}
            variant="ghost"
            size="md"
            disabled={loading}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
