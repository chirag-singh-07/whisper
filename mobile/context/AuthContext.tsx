import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import LoadingScreen from "../components/ui/LoadingScreen";

type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, user: User, refreshToken: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

export const useSession = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("accessToken");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        // --- ARTIFICIAL DELAY FOR UI APPRECIATION ---
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // --------------------------------------------
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const hideSplash = async () => {
      // Give a small delay for a smooth transition if needed,
      // but here we just hide it once we know where we are going.
      await SplashScreen.hideAsync();
    };

    const inAuthGroup = segments[0] === "(auth)";

    if (token && inAuthGroup) {
      router.replace("/(tabs)");
      hideSplash();
    } else if (!token && !inAuthGroup) {
      router.replace("/(auth)/welcome");
      hideSplash();
    } else if (isReady) {
      // If we are already in the right place, just hide it
      hideSplash();
    }
  }, [user, token, isReady, segments]);

  const signIn = async (
    newToken: string,
    newUser: User,
    newRefreshToken: string,
  ) => {
    try {
      setToken(newToken);
      setUser(newUser);
      await SecureStore.setItemAsync("accessToken", newToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      await SecureStore.setItemAsync("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const signOut = async () => {
    try {
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
