import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Adjust Base URL based on environment
const getBaseUrl = () => {
  // For Android Emulator, use 10.0.2.2
  // For iOS Simulator, use localhost
  // For physical device, replace with your LAN IP
  if (Platform.OS === "android") {
    return "http://192.168.1.4:5000/api";
  }
  return "http://localhost:5000/api";
};

export const BASE_URL = getBaseUrl();

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

/**
 * Enhanced fetch client with auto-header injection
 */
export async function client<T>(
  endpoint: string,
  { body, ...customConfig }: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Inject token unless skipped
  if (!customConfig.skipAuth) {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data as T;
    } else {
      return Promise.reject(data);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
