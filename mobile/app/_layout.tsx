import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { SocketProvider } from "@/context/SocketContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
              contentStyle: { backgroundColor: "#0D0D0F" },
            }}
          />
        </SocketProvider>
      </AuthProvider>
      <Toast />
    </QueryClientProvider>
  );
}
