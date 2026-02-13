# WebSocket Connection Troubleshooting Guide

## Issue Fixed ✅
**Problem**: Mobile Socket Connection Error: [Error: websocket error]

**Root Cause**: IP address mismatch in the mobile app's socket configuration.

## Changes Made

### 1. Updated Socket URL (SocketContext.tsx)
- **Old IP**: `192.168.1.4:5000`
- **New IP**: `192.168.1.13:5000` (your actual machine IP)

### 2. Enhanced Error Handling
Added comprehensive error logging and reconnection logic:
- Automatic reconnection (up to 5 attempts)
- Detailed error messages with context
- Connection state logging
- Token validation logging

## How to Verify the Fix

### Step 1: Check Your Current IP Address
Run this command to verify your IP hasn't changed:
```bash
ipconfig
```
Look for "Wireless LAN adapter WiFi" → "IPv4 Address"

### Step 2: Ensure Backend is Running
```bash
cd backend
npm run dev
```
The server should be running on port 5000.

### Step 3: Restart Mobile App
```bash
cd mobile
npm start
```
Then reload the app on your device/emulator.

### Step 4: Check Console Logs
You should now see:
- ✅ "🔌 Initializing socket connection to: http://192.168.1.13:5000"
- ✅ "🔑 Token found: ..."
- ✅ "✅ Mobile Socket connected: [socket-id]"

## Common Issues & Solutions

### Issue 1: IP Address Changed
**Symptom**: Connection still fails after fix
**Solution**: Your router may have assigned a new IP. Check with `ipconfig` and update `SOCKET_URL` in `mobile/context/SocketContext.tsx`

### Issue 2: Firewall Blocking Connection
**Symptom**: Connection timeout
**Solution**: 
1. Open Windows Defender Firewall
2. Allow Node.js through the firewall
3. Or temporarily disable firewall for testing

### Issue 3: Backend Not Running
**Symptom**: "connect_error" with ECONNREFUSED
**Solution**: Start the backend server:
```bash
cd backend
npm run dev
```

### Issue 4: Token Issues
**Symptom**: "Authentication error"
**Solution**: 
1. Check if user is logged in
2. Verify token is stored in SecureStore
3. Check backend JWT verification

### Issue 5: Using Android Emulator
**Symptom**: Connection fails on Android emulator
**Solution**: Android emulator uses special IP:
- Change `SOCKET_URL` to `http://10.0.2.2:5000`

### Issue 6: Using iOS Simulator
**Symptom**: Connection fails on iOS simulator
**Solution**: iOS simulator can use localhost:
- Change `SOCKET_URL` to `http://localhost:5000`

## Network Configuration

### Current Setup
- **Backend Server**: `http://192.168.1.13:5000`
- **Transport**: WebSocket only
- **CORS**: Enabled for all origins (*)
- **Authentication**: JWT token via socket.handshake.auth

### Socket.IO Configuration
```typescript
{
  auth: { token },
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
}
```

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] IP address in SocketContext.tsx matches your machine's IP
- [ ] User is logged in and has a valid access token
- [ ] Mobile app has been restarted after changes
- [ ] Console shows socket initialization logs
- [ ] No firewall blocking port 5000
- [ ] Device/emulator is on the same network as your machine

## Debug Logs to Monitor

### Success Pattern:
```
🔌 Initializing socket connection to: http://192.168.1.13:5000
🔑 Token found: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ Mobile Socket connected: abc123xyz
```

### Error Pattern:
```
🔌 Initializing socket connection to: http://192.168.1.13:5000
🔑 Token found: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
❌ Mobile Socket Connection Error: websocket error
Error details: { name: 'Error', message: 'websocket error', ... }
🔄 Reconnection attempt 1...
```

## Additional Notes

- The socket connection is initialized when the app starts and a valid token exists
- If no token is found, you'll see: "⚠️ No access token found. Socket not initialized."
- The socket will automatically attempt to reconnect if the connection drops
- All socket events are logged for debugging purposes

## Quick Fix Commands

### Update IP Address (if changed):
1. Find your new IP: `ipconfig`
2. Edit `mobile/context/SocketContext.tsx`
3. Update line 8: `const SOCKET_URL = "http://YOUR_NEW_IP:5000";`
4. Restart the mobile app

### Restart Everything:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Mobile
cd mobile
npm start
# Then press 'r' to reload the app
```
