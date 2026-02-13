# WebSocket Authentication Error - Resolution Summary

## Problem Evolution

### Initial Error
```
ERROR Mobile Socket Connection Error: [Error: websocket error]
```
**Cause**: IP address mismatch (mobile app trying to connect to `192.168.1.4` instead of `192.168.1.13`)

### Current Error  
```
ERROR ❌ Mobile Socket Connection Error: Authentication error
```
**Cause**: Most likely **expired JWT access token**

## What We Fixed

### 1. ✅ IP Address Configuration
- **Updated**: `mobile/context/SocketContext.tsx` line 8
- **Old**: `http://192.168.1.4:5000`
- **New**: `http://192.168.1.13:5000`
- **Result**: Socket now successfully reaches the backend

### 2. ✅ Enhanced Error Logging
- **Mobile side**: Added detailed connection logs with reconnection tracking
- **Backend side**: Added comprehensive authentication debugging in `backend/src/utils/socket.ts`
- **Result**: We can now see exactly where authentication fails

### 3. ✅ Token Expiration Detection
- **Added**: Client-side token expiration check before connection attempt
- **Location**: `mobile/context/SocketContext.tsx`
- **Result**: App will detect and warn about expired tokens

## Root Cause: Token Expiration

JWT access tokens expire after **15 minutes** (configured in `backend/src/config/env.ts`).

### Why This Happens
1. User logs in → receives access token (valid for 15 min)
2. Token is stored in SecureStore
3. App is restarted or reopened later
4. Socket tries to connect with the old, expired token
5. Backend rejects it with "Authentication error"

## Solution: Implement Token Refresh

You need to implement automatic token refresh. Here's how:

### Option 1: Refresh on App Start (Recommended)
Add token refresh logic in `AuthContext.tsx`:

```typescript
useEffect(() => {
  const loadSession = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
      const storedUser = await SecureStore.getItemAsync("user");

      if (storedToken && storedUser) {
        // Check if token is expired or about to expire
        const tokenParts = storedToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Date.now() / 1000;
          const expiresIn = payload.exp - now;
          
          // If token expires in less than 5 minutes, refresh it
          if (expiresIn < 300 && storedRefreshToken) {
            console.log("🔄 Token expiring soon, refreshing...");
            const newTokens = await refreshAccessToken(storedRefreshToken);
            if (newTokens) {
              await SecureStore.setItemAsync("accessToken", newTokens.accessToken);
              await SecureStore.setItemAsync("refreshToken", newTokens.refreshToken);
              setToken(newTokens.accessToken);
            }
          } else {
            setToken(storedToken);
          }
        }
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  };

  loadSession();
}, []);

// Add this function
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch("http://192.168.1.13:5000/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data.tokens;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
  return null;
}
```

### Option 2: Refresh Before Socket Connection
Modify `SocketContext.tsx` to refresh token before connecting:

```typescript
const initSocket = async () => {
  let token = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if (token) {
    // Check expiration
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const now = Date.now() / 1000;
      
      if (payload.exp < now) {
        console.log("🔄 Token expired, refreshing...");
        // Refresh the token
        const newTokens = await refreshAccessToken(refreshToken);
        if (newTokens) {
          token = newTokens.accessToken;
          await SecureStore.setItemAsync("accessToken", token);
        } else {
          console.error("❌ Failed to refresh token");
          return;
        }
      }
    }
    
    // Now connect with valid token
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      // ... rest of config
    });
  }
};
```

## Quick Test: Re-login

**Immediate fix to test**: Simply log out and log back in to get a fresh token.

1. In your mobile app, log out
2. Log back in
3. Try the socket connection again
4. It should work for the next 15 minutes

## Monitoring

### Check Backend Logs
When you restart the mobile app, you should now see in the backend console:

```
🔐 Socket authentication attempt...
  - Socket ID: abc123
  - Handshake auth: { token: 'eyJ...' }
  - Token received: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
  - Token length: 180
✅ Token verified successfully
  - User ID: 507f1f77bcf86cd799439011
✅ User found: John Doe
✅ Socket connected - User ID: 507f1f77bcf86cd799439011, Socket ID: abc123
```

If token is expired, you'll see:
```
🔐 Socket authentication attempt...
  - Token received: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
❌ Socket authentication error: TokenExpiredError
  - Error name: TokenExpiredError
  - Error message: jwt expired
```

### Check Mobile Logs
You should see:
```
🔌 Initializing socket connection to: http://192.168.1.13:5000
🔑 Token found: eyJhbGciOiJIUzI1NiIs...
✅ Token is valid. Expires in 14 minutes
✅ Mobile Socket connected: abc123
```

Or if expired:
```
🔌 Initializing socket connection to: http://192.168.1.13:5000
🔑 Token found: eyJhbGciOiJIUzI1NiIs...
❌ TOKEN IS EXPIRED! Expired 45 minutes ago
   → Please re-login to get a new token
```

## Files Modified

1. **mobile/context/SocketContext.tsx**
   - Updated IP address
   - Added token expiration check
   - Enhanced error logging
   - Added reconnection logic

2. **backend/src/utils/socket.ts**
   - Added detailed authentication logging
   - Better error messages

3. **mobile/WEBSOCKET_TROUBLESHOOTING.md** (NEW)
   - Comprehensive troubleshooting guide

4. **mobile/utils/debugSocketToken.ts** (NEW)
   - Token debugging utility

## Next Steps

1. **Immediate**: Test by logging out and back in
2. **Short-term**: Implement token refresh logic (Option 1 or 2 above)
3. **Long-term**: Consider implementing:
   - Automatic token refresh on 401 errors
   - Token refresh interceptor for API calls
   - Background token refresh timer

## Additional Notes

- Access tokens expire in 15 minutes (security best practice)
- Refresh tokens last 7 days
- The backend `/api/auth/refresh` endpoint is already implemented
- You just need to call it from the mobile app when needed
