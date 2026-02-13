/**
 * Socket Token Debugger
 *
 * This script helps debug socket authentication issues by:
 * 1. Reading the stored access token
 * 2. Decoding it to check expiration and payload
 * 3. Testing the socket connection
 *
 * Add this to your mobile app temporarily for debugging
 */

import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode"; // You may need to install: npm install jwt-decode

export async function debugSocketToken() {
  console.log("=== SOCKET TOKEN DEBUGGER ===");

  try {
    // 1. Get the stored token
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      console.error("❌ No access token found in SecureStore");
      console.log("   → User may not be logged in");
      return null;
    }

    console.log("✅ Token found in SecureStore");
    console.log("   → Token length:", token.length);
    console.log("   → First 30 chars:", token.substring(0, 30) + "...");

    // 2. Decode the token (without verification)
    try {
      const decoded: any = jwtDecode(token);
      console.log("\n📋 Token Payload:");
      console.log("   → User ID:", decoded.userId);
      console.log(
        "   → Issued At:",
        new Date(decoded.iat * 1000).toISOString(),
      );
      console.log(
        "   → Expires At:",
        new Date(decoded.exp * 1000).toISOString(),
      );

      // 3. Check if token is expired
      const now = Date.now() / 1000;
      const isExpired = decoded.exp < now;

      if (isExpired) {
        const expiredMinutesAgo = Math.floor((now - decoded.exp) / 60);
        console.error(`\n❌ TOKEN IS EXPIRED!`);
        console.error(`   → Expired ${expiredMinutesAgo} minutes ago`);
        console.error(`   → You need to refresh the token or re-login`);
        return null;
      } else {
        const expiresInMinutes = Math.floor((decoded.exp - now) / 60);
        console.log(`\n✅ Token is valid`);
        console.log(`   → Expires in ${expiresInMinutes} minutes`);
      }

      return { token, decoded, isExpired };
    } catch (decodeError) {
      console.error("\n❌ Failed to decode token");
      console.error("   → Token may be malformed");
      console.error("   → Error:", decodeError);
      return null;
    }
  } catch (error) {
    console.error("\n❌ Error accessing SecureStore:", error);
    return null;
  }
}

// Usage: Call this before initializing socket
// await debugSocketToken();
