/**
 * Token Refresh Utility
 *
 * Handles automatic refresh of expired or expiring JWT access tokens
 * using the refresh token stored in SecureStore.
 */

import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://192.168.1.13:5000";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Check if a JWT token is expired or will expire soon
 * @param token - JWT token to check
 * @param bufferMinutes - Consider token expired if it expires within this many minutes (default: 5)
 * @returns true if token is expired or expiring soon
 */
export function isTokenExpiringSoon(
  token: string,
  bufferMinutes: number = 5,
): boolean {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.warn("⚠️ Invalid token format");
      return true;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const now = Date.now() / 1000;
    const expiresIn = payload.exp - now;

    // Consider expired if it expires within buffer time
    return expiresIn < bufferMinutes * 60;
  } catch (error) {
    console.error("❌ Error checking token expiration:", error);
    return true; // Assume expired if we can't decode
  }
}

/**
 * Refresh the access token using the refresh token
 * @returns New tokens if successful, null otherwise
 */
export async function refreshAccessToken(): Promise<TokenResponse | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!refreshToken) {
      console.error("❌ No refresh token found");
      return null;
    }

    console.log("🔄 Refreshing access token...");

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("❌ Token refresh failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.success && data.data) {
      console.log("✅ Token refreshed successfully");

      // Store new tokens
      await SecureStore.setItemAsync("accessToken", data.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", data.data.refreshToken);

      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    }

    return null;
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    return null;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 * @returns Valid access token or null if unable to get one
 */
export async function getValidAccessToken(): Promise<string | null> {
  try {
    let accessToken = await SecureStore.getItemAsync("accessToken");

    if (!accessToken) {
      console.warn("⚠️ No access token found");
      return null;
    }

    // Check if token is expired or expiring soon
    if (isTokenExpiringSoon(accessToken)) {
      console.log("🔄 Token expired or expiring soon, refreshing...");
      const newTokens = await refreshAccessToken();

      if (newTokens) {
        return newTokens.accessToken;
      } else {
        console.error("❌ Failed to refresh token");
        return null;
      }
    }

    return accessToken;
  } catch (error) {
    console.error("❌ Error getting valid access token:", error);
    return null;
  }
}
