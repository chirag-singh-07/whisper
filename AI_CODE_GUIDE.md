# 🤖 AI Code Guide - Real-Chat System

**Purpose:** This guide helps AI coders understand the project structure, architecture, coding patterns, and conventions used throughout the Real-Chat System. Use this to quickly understand how to contribute, fix bugs, or add new features.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Authentication Flow](#authentication-flow)
8. [Real-Time Communication (Socket.IO)](#real-time-communication)
9. [Database Models](#database-models)
10. [Key Coding Patterns](#key-coding-patterns)
11. [Common Rules & Conventions](#common-rules--conventions)
12. [Important Files Reference](#important-files-reference)
13. [Development Workflow](#development-workflow)
14. [Debugging Tips](#debugging-tips)

---

## 🎯 Project Overview

**Real-Chat System** is a modern real-time messaging platform with:
- ✅ User authentication (JWT-based)
- ✅ Real-time messaging via WebSocket (Socket.IO)
- ✅ Friend request system
- ✅ File uploads (images, documents)
- ✅ Typing indicators & read receipts
- ✅ Online/offline status tracking
- ✅ Multi-platform support (Web, Mobile)

**Key Features:**
- Instant messaging with real-time updates
- User discovery and friend requests
- File sharing (images & documents)
- Message delivery & read acknowledgments
- Responsive UI for web and mobile

---

## 🏗️ Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend Layer                      │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Website    │  │   Mobile     │        │
│  │   (Vite)     │  │   (Expo)     │        │
│  └──────────────┘  └──────────────┘        │
└──────────────┬──────────────────────────────┘
               │ HTTP + WebSocket
┌──────────────▼──────────────────────────────┐
│    Backend API Server (Express + Node)      │
│  - REST API endpoints                       │
│  - Socket.IO server                         │
│  - JWT authentication                       │
│  - File upload handling                     │
└──────────────┬──────────────────────────────┘
               │ Database Connection
┌──────────────▼──────────────────────────────┐
│    MongoDB Database                         │
│  - User documents                           │
│  - Chat rooms                               │
│  - Messages                                 │
│  - Friend requests                          │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (via Bun)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Bcrypt, Helmet, CORS, Rate Limiting
- **File Upload**: Multer

### Frontend (Website)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + NativeWind
- **Routing**: React Router
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

### Mobile (Expo)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: React Context + React Query
- **Secure Storage**: Expo SecureStore
- **Real-time**: Socket.IO Client

---

## 📁 Project Structure

```
real-chat-system/
├── backend/                          # Express.js Backend
│   ├── src/
│   │   ├── app.ts                   # Express app setup
│   │   ├── index.ts                 # Entry point
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection
│   │   │   └── env.ts               # Environment validation
│   │   ├── models/                  # Mongoose models
│   │   │   ├── UserModel.ts
│   │   │   ├── ChatModel.ts
│   │   │   ├── MessageModel.ts
│   │   │   ├── RequestModel.ts
│   │   │   ├── CallModel.ts
│   │   │   └── StoryModel.ts
│   │   ├── controllers/             # Business logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── message.controller.ts
│   │   │   ├── request.controller.ts
│   │   │   └── upload.controller.ts
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── message.routes.ts
│   │   │   ├── request.routes.ts
│   │   │   └── upload.routes.ts
│   │   ├── middlewares/             # Custom middlewares
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   ├── error.middleware.ts  # Error handling
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── upload.middleware.ts # File validation
│   │   ├── utils/
│   │   │   ├── socket.ts            # Socket.IO configuration
│   │   │   ├── jwt.ts               # JWT utilities
│   │   │   ├── hash.ts              # Password hashing
│   │   │   └── sendResponse.ts      # Response formatting
│   │   ├── validations/             # Zod schemas
│   │   │   └── auth.validation.ts
│   │   └── scripts/
│   │       └── seed.ts              # Database seeding
│   ├── uploads/                     # Uploaded files storage
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── website/                         # React Website
│   ├── src/
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.jsx                  # Main component
│   │   ├── components/
│   │   │   ├── ChatDashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MessageArea.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useChat.js
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── socket.ts            # Socket.IO client
│   │   │   └── api.js               # API calls
│   │   ├── lib/
│   │   ├── assets/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── mobile/                          # React Native (Expo)
│   ├── app/
│   │   ├── _layout.tsx              # Root layout
│   │   ├── index.tsx                # Home screen
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── welcome.tsx
│   │   │   └── register/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── calls.tsx
│   │   │   ├── index.tsx            # Messages
│   │   │   ├── profile.tsx
│   │   │   ├── requests.tsx
│   │   │   └── search.tsx
│   │   └── chat/
│   │       └── [id].tsx             # Chat screen
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   └── ...
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth state
│   │   └── SocketContext.tsx        # Real-time state
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useChats.ts
│   │   └── ...
│   ├── api/
│   │   └── client.ts                # API client
│   ├── assets/
│   ├── package.json
│   ├── expo-env.d.ts
│   ├── app.json
│   ├── tailwind.config.js
│   └── README.md
│
├── admin-website/                   # Admin dashboard (if present)
├── AI_CODE_GUIDE.md                 # This file
├── SOCKET_AUTH_FIX_SUMMARY.md       # Socket auth documentation
├── implementation_summary.md         # Implementation notes
└── auth-plan.txt                    # Authentication plan
```

---

## 🔧 Backend Architecture

### Key Concepts

#### 1. **Models (Mongoose Schemas)**
Located in `backend/src/models/`

Each model represents a MongoDB collection:
- **UserModel.ts**: User documents (username, email, password, avatar)
- **ChatModel.ts**: Chat rooms (participants, metadata)
- **MessageModel.ts**: Messages (content, sender, attachments, timestamps)
- **RequestModel.ts**: Friend requests (sender, receiver, status)
- **CallModel.ts**: Call records (participants, duration)
- **StoryModel.ts**: User stories (temporary content)

**Pattern:**
```typescript
// Example Model Structure
interface User extends Document {
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({...});
export const UserModel = mongoose.model<User>("User", userSchema);
```

#### 2. **Controllers (Business Logic)**
Located in `backend/src/controllers/`

Handle HTTP requests and call models:
- **auth.controller.ts**: Login, register, refresh token
- **user.controller.ts**: Get profile, update profile, upload avatar
- **chat.controller.ts**: Create chat, get chats, get chat details
- **message.controller.ts**: Get messages, search messages
- **request.controller.ts**: Send/accept/reject friend requests
- **upload.controller.ts**: Handle file uploads

**Pattern:**
```typescript
export async function registerUser(req: Request, res: Response) {
  try {
    // Validate input
    // Hash password
    // Save to database
    // Send response
  } catch (error) {
    // Error handling
  }
}
```

#### 3. **Routes (API Endpoints)**
Located in `backend/src/routes/`

Define REST endpoints:
```typescript
// Example: auth.routes.ts
router.post("/register", validateInput, authController.register);
router.post("/login", validateInput, authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", requireAuth, authController.logout);
```

#### 4. **Middlewares**
Located in `backend/src/middlewares/`

- **auth.middleware.ts**: `requireAuth` - Verifies JWT token
- **error.middleware.ts**: Centralized error handling
- **rateLimit.middleware.ts**: Rate limiting protection
- **upload.middleware.ts**: File validation & storage

**Important Pattern:**
```typescript
// Middleware that checks JWT token
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({success: false, message: "Unauthorized"});
  
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({success: false, message: "Invalid token"});
  }
}
```

#### 5. **Socket.IO Configuration**
Located in `backend/src/utils/socket.ts`

How it works:
```
Client connects with JWT token
     ↓
Server verifies token
     ↓
User joins their private room (by userId)
     ↓
User emits/listens to events
     ↓
Server broadcasts to chat rooms or individual users
```

**Key Events:**
- `message:send` - Send message to chat room
- `message:read` - Mark message as read
- `typing` - User is typing
- `user:online` / `user:offline` - Presence updates
- `chat:join` / `chat:leave` - Room management

---

## 💻 Frontend Architecture

### Website (React + Vite)

**Key Components:**
- `AuthContext.jsx`: Manages user state, login/logout
- `ChatDashboard.jsx`: Main chat interface
- `MessageArea.jsx`: Message display and input
- `Sidebar.jsx`: Chat list + online status
- `Login.jsx`: Authentication form

**State Management Pattern:**
```javascript
// Using Context API
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage
export function useAuth() {
  return useContext(AuthContext);
}
```

**Socket Connection Pattern:**
```javascript
// Socket initialized after authentication
function initializeSocket(accessToken) {
  const socket = io("http://localhost:5000", {
    auth: { token: accessToken },
    reconnection: true
  });
  
  socket.on("message:receive", (data) => { /* handle */ });
  return socket;
}
```

### Mobile (React Native + Expo)

**Key Components:**
- `AuthContext.tsx`: Auth state + token refresh
- `SocketContext.tsx`: Real-time messaging state
- Chat screens: `app/chat/[id].tsx`
- Tab navigation: `app/(tabs)/_layout.tsx`

**Secure Storage Pattern:**
```typescript
// Store sensitive data safely
async function saveToken(token: string) {
  await SecureStore.setItemAsync("accessToken", token);
}

async function loadToken() {
  return await SecureStore.getItemAsync("accessToken");
}
```

**Socket Connection (Mobile):**
```typescript
// Mobile must use correct IP address (not localhost)
const socket = io("http://192.168.1.13:5000", {
  auth: { token: accessToken },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

---

## 🔐 Authentication Flow

### Complete Authentication Lifecycle

```
User Registration:
  1. User submits username, email, password
  2. Backend validates input with Zod
  3. Password hashed with Bcrypt (salt: 12)
  4. User saved to MongoDB
  5. Response with user data

User Login:
  1. User submits email & password
  2. Backend finds user, compares passwords
  3. Generates JWT tokens:
     - Access Token (15 minutes)
     - Refresh Token (7 days)
  4. Tokens sent via HTTP-only cookies
  5. Frontend stores tokens

Socket Authentication:
  1. Frontend connects with access token
  2. Backend verifies token signature
  3. User automatically joins private room (userId)
  4. Connection now receives real-time events

Token Refresh (when expired):
  1. Frontend detects expired token
  2. Sends refresh token to /api/auth/refresh
  3. Backend validates refresh token
  4. Generates new access token
  5. Socket reconnects with new token
```

### JWT Token Structure

```javascript
Access Token Payload:
{
  userId: "64a1b2c3d4e5f6g7h8i9j0k1",
  email: "user@example.com",
  iat: 1234567890,      // issued at
  exp: 1234569690       // expires 15 min later
}

Refresh Token Payload:
{
  userId: "64a1b2c3d4e5f6g7h8i9j0k1",
  iat: 1234567890,
  exp: 1234740690       // expires 7 days later
}
```

### Environment Variables Needed

```bash
# Backend (.env)
DB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development

JWT_ACCESS_SECRET=your-32-character-secret-key-here-min
JWT_REFRESH_SECRET=another-32-character-secret-key-here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

BCRYPT_SALT_ROUNDS=12
CLIENT_URL=http://localhost:3000
```

---

## 🔌 Real-Time Communication

### Socket.IO Server Setup

**Location:** `backend/src/utils/socket.ts`

**Key Features:**
1. **Token-based authentication** - Verifies JWT on connection
2. **Room management** - Users join private rooms by ID
3. **Event broadcasting** - Messages sent to specific rooms
4. **Typing indicators** - Real-time UX feedback
5. **Online status** - Track user presence
6. **Message acknowledgments** - Delivery & read receipts

### Socket Events Reference

#### **Send Events (Client → Server)**
```javascript
// Join a chat room
socket.emit("chat:join", { chatId });

// Send a message
socket.emit("message:send", 
  { chatId, text: "Hello!", attachments: [...] }, 
  (ack) => { /* server response */ }
);

// Mark message as read
socket.emit("message:read", { messageId, chatId });

// Typing indicator
socket.emit("typing", { chatId, isTyping: true });

// Leave chat
socket.emit("chat:leave", { chatId });
```

#### **Listen Events (Server → Client)**
```javascript
// Receive message from chat room
socket.on("message:receive", (data) => {
  // { id, sender, content, timestamp, attachments }
});

// Someone is typing
socket.on("typing", (data) => {
  // { userId, chatId, isTyping }
});

// User online/offline
socket.on("user:online", (data) => {
  // { userId, timestamp }
});

socket.on("user:offline", (data) => {
  // { userId, timestamp }
});

// Message delivered
socket.on("message:delivered", (data) => {
  // { messageId }
});
```

### Socket Connection Pattern

**Backend:**
```typescript
// Socket.IO server listens for connections
socketIO.on("connection", (socket) => {
  // Verify token
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  const userId = decoded.userId;
  
  // User joins their private room
  socket.join(`user:${userId}`);
  
  // Listen for chat:join event
  socket.on("chat:join", async ({ chatId }) => {
    socket.join(`chat:${chatId}`);
  });
  
  // Listen for message:send
  socket.on("message:send", async ({ chatId, text }, ack) => {
    const message = new MessageModel({ 
      chatId, 
      sender: userId, 
      content: text 
    });
    await message.save();
    
    // Broadcast to room
    socketIO.to(`chat:${chatId}`).emit("message:receive", message);
    ack({ success: true, messageId: message._id });
  });
});
```

**Frontend:**
```javascript
// Initialize after login
function setupSocket(accessToken) {
  const socket = io("http://localhost:5000", {
    auth: { token: accessToken }
  });
  
  socket.on("connect", () => {
    console.log("Connected!");
    socket.emit("chat:join", { chatId: "123" });
  });
  
  socket.on("message:receive", (msg) => {
    setMessages(prev => [...prev, msg]);
  });
  
  return socket;
}
```

---

## 📊 Database Models

### User Model
```typescript
{
  _id: ObjectId,
  username: string (unique),
  email: string (unique),
  passwordHash: string,
  avatar?: string (URL or path),
  bio?: string,
  isOnline: boolean,
  lastSeen: Date,
  friends: ObjectId[] (user IDs),
  blockedUsers: ObjectId[] (user IDs),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Model
```typescript
{
  _id: ObjectId,
  name?: string (for group chats),
  participants: ObjectId[] (user IDs),
  lastMessage?: ObjectId (message ID),
  lastMessageTime?: Date,
  isGroup: boolean,
  avatar?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```typescript
{
  _id: ObjectId,
  chatId: ObjectId (chat ID),
  sender: ObjectId (user ID),
  content: string,
  attachments?: [{
    type: string (image/pdf/doc),
    url: string,
    name: string
  }],
  status: string (sending/sent/delivered/read),
  readBy: ObjectId[] (user IDs who read),
  createdAt: Date,
  updatedAt: Date
}
```

### Request Model (Friend Request)
```typescript
{
  _id: ObjectId,
  sender: ObjectId (user ID),
  receiver: ObjectId (user ID),
  status: string (pending/accepted/rejected),
  message?: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Key Coding Patterns

### 1. **Error Handling Pattern**

**Backend:**
```typescript
// Always use try-catch in controllers
export async function getUser(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}
```

**Frontend:**
```javascript
// Always handle promises with catch
async function login(email, password) {
  try {
    const response = await api.post("/auth/login", { email, password });
    setToken(response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message);
    showError("Login failed");
  }
}
```

### 2. **Input Validation Pattern**

**Backend (Zod):**
```typescript
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters")
});

export async function login(req: Request, res: Response) {
  try {
    const validated = loginSchema.parse(req.body);
    // Use validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        errors: error.errors 
      });
    }
  }
}
```

### 3. **Response Format Pattern**

**Standard Response Structure:**
```json
{
  "success": true/false,
  "message": "Human-readable message",
  "data": { /* actual data */ },
  "error": { /* error details if failed */ }
}
```

**Always use consistent response format:**
```typescript
// Success response
res.status(200).json({
  success: true,
  message: "User created successfully",
  data: user
});

// Error response
res.status(400).json({
  success: false,
  message: "Email already exists",
  error: { field: "email", reason: "duplicate" }
});
```

### 4. **Async/Await Pattern**

```typescript
// Use async/await for cleaner code
async function getAllMessages(chatId: string) {
  const messages = await MessageModel
    .find({ chatId })
    .populate("sender", "username avatar")
    .sort({ createdAt: -1 })
    .limit(50);
  
  return messages;
}

// In routes
router.get("/:chatId", requireAuth, async (req, res) => {
  const messages = await messageController.getMessages(req.params.chatId);
  res.json({ success: true, data: messages });
});
```

### 5. **Database Query Pattern**

```typescript
// Always specify fields to return
const user = await UserModel
  .findById(userId)
  .select("-passwordHash") // Exclude password
  .lean(); // Return plain JS object

// Use populate for references
const messages = await MessageModel
  .find({ chatId })
  .populate("sender", "username avatar")
  .populate("chatId", "name");

// Use aggregate for complex queries
const stats = await UserModel.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: { _id: null, count: { $sum: 1 } } }
]);
```

### 6. **Frontend Hook Pattern (React)**

```javascript
// Custom hook for data fetching
function useChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await api.get("/chats");
        setChats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchChats();
  }, []);
  
  return { chats, loading };
}

// Usage
function ChatList() {
  const { chats, loading } = useChats();
  
  if (loading) return <LoadingScreen />;
  
  return chats.map(chat => <ChatItem key={chat._id} chat={chat} />);
}
```

### 7. **File Upload Pattern**

**Backend:**
```typescript
const uploadHandler = upload.single("avatar");

router.post("/avatar", requireAuth, uploadHandler, 
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file provided" 
      });
    }
    
    // File is at req.file.path
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    await UserModel.findByIdAndUpdate(req.userId, { avatar: avatarUrl });
    
    res.json({ 
      success: true, 
      avatarUrl 
    });
  }
);
```

**Frontend (React):**
```javascript
function AvatarUpload() {
  const [uploading, setUploading] = useState(false);
  
  async function handleUpload(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    
    setUploading(true);
    try {
      const response = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAvatar(response.data.avatarUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }
  
  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

---

## 📝 Common Rules & Conventions

### 1. **Naming Conventions**

**Files:**
- Controllers: `{feature}.controller.ts`
- Routes: `{feature}.routes.ts`
- Models: `{Feature}Model.ts` (PascalCase)
- Middlewares: `{feature}.middleware.ts`
- Utilities: `{feature}.ts`
- Components: `{ComponentName}.jsx` or `.tsx` (PascalCase)
- Hooks: `use{Feature}.ts` or `.js` (PascalCase + "use" prefix)
- Context: `{Feature}Context.jsx` or `.tsx`

**Variables/Functions:**
- Use camelCase: `getUserProfile`, `sendMessage`
- Constants: `UPPERCASE_WITH_UNDERSCORES`
- Private functions: prefix with `_`
- Event handlers: prefix with `handle` or `on`: `handleClick`, `onSubmit`

### 2. **Folder Organization**

- **Controllers** contain business logic only
- **Routes** only define endpoints, delegate to controllers
- **Middlewares** are single-responsibility
- **Models** only define schema, no business logic
- **Utils** are for reusable helper functions
- **Components** should be modular and single-purpose

### 3. **Module Imports Order**

```typescript
// 1. Third-party imports
import express from "express";
import mongoose from "mongoose";

// 2. Internal imports
import { UserModel } from "../models/UserModel";
import { requireAuth } from "../middlewares/auth.middleware";

// 3. Types/Interfaces
import type { Request, Response } from "express";
```

### 4. **Documentation Comments**

```typescript
/**
 * Register a new user
 * @param {Request} req - Express request with email, username, password
 * @param {Response} res - Express response
 * @returns {void} JSON response with user data or error
 */
export async function register(req: Request, res: Response) {
  // Implementation
}
```

### 5. **Error Handling Style**

- Always provide meaningful error messages
- Use appropriate HTTP status codes:
  - `200`: Success
  - `201`: Created
  - `400`: Bad request (validation error)
  - `401`: Unauthorized (no token)
  - `403`: Forbidden (no permission)
  - `404`: Not found
  - `500`: Server error

### 6. **Environment Variables**

- All sensitive data in `.env`
- Validate all env vars on startup
- Never hardcode secrets or API keys
- Use `env.ts` for centralized validation

### 7. **TypeScript Usage**

- Always use types for function parameters
- Export interfaces from models
- Avoid `any` type, use `unknown` or proper types
- Use `?` for optional properties

### 8. **Git Commit Messages**

```
Format: <type>: <description>

Examples:
feat: add user avatar upload
fix: correct socket authentication error
refactor: simplify message controller
docs: update socket.io documentation
```

---

## 📚 Important Files Reference

### Must-Read Files for Understanding

1. **[backend/src/app.ts](backend/src/app.ts)** - Express app setup, all middlewares, routes
2. **[backend/src/utils/socket.ts](backend/src/utils/socket.ts)** - Socket.IO server configuration
3. **[backend/src/middlewares/auth.middleware.ts](backend/src/middlewares/auth.middleware.ts)** - JWT verification logic
4. **[backend/src/config/env.ts](backend/src/config/env.ts)** - Environment variable definitions
5. **[mobile/context/AuthContext.tsx](mobile/context/AuthContext.tsx)** - Mobile auth state management
6. **[mobile/context/SocketContext.tsx](mobile/context/SocketContext.tsx)** - Mobile socket management
7. **[website/src/context/AuthContext.jsx](website/src/context/AuthContext.jsx)** - Website auth state
8. **[SOCKET_AUTH_FIX_SUMMARY.md](SOCKET_AUTH_FIX_SUMMARY.md)** - Known socket issues and fixes

### Controllers (Business Logic)

- [backend/src/controllers/auth.controller.ts](backend/src/controllers/auth.controller.ts)
- [backend/src/controllers/user.controller.ts](backend/src/controllers/user.controller.ts)
- [backend/src/controllers/message.controller.ts](backend/src/controllers/message.controller.ts)
- [backend/src/controllers/chat.controller.ts](backend/src/controllers/chat.controller.ts)

### Models (Data Schemas)

- [backend/src/models/UserModel.ts](backend/src/models/UserModel.ts)
- [backend/src/models/MessageModel.ts](backend/src/models/MessageModel.ts)
- [backend/src/models/ChatModel.ts](backend/src/models/ChatModel.ts)
- [backend/src/models/RequestModel.ts](backend/src/models/RequestModel.ts)

---

## 🚀 Development Workflow

### Backend Development

```bash
# 1. Install dependencies
cd backend
bun install
# or npm install

# 2. Create .env file
# Set DB_URI, JWT_SECRETS, etc.

# 3. Run development server
bun run index.ts
# or npm run dev

# 4. Server runs on http://localhost:5000

# 5. Test Socket.IO connection
# Visit http://localhost:5000/health (should return success)
```

### Frontend Development (Website)

```bash
# 1. Install dependencies
cd website
npm install

# 2. Start development server
npm run dev

# 3. Website runs on http://localhost:5173

# 4. Update API_BASE_URL if backend on different port
```

### Mobile Development (Expo)

```bash
# 1. Install dependencies
cd mobile
npm install

# 2. Start development server
npm start

# 3. Choose platform:
#    i - iOS simulator
#    a - Android simulator
#    w - Web

# 4. Update SOCKET_URL in SocketContext.tsx
#    Use your machine's IP: http://192.168.x.x:5000
```

### Testing Socket.IO Connection

```bash
# Test from another terminal
curl http://localhost:5000/health

# Response should be:
# {"success": true, "message": "Backend is running!"}
```

### Common Development Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Check CORS in [backend/src/app.ts](backend/src/app.ts) line 33 |
| Socket auth fails | Token expired? See SOCKET_AUTH_FIX_SUMMARY.md |
| Mobile can't connect | Check IP in [mobile/context/SocketContext.tsx](mobile/context/SocketContext.tsx) |
| Upload fails | Check folder permissions, multer config in [backend/src/middlewares/upload.middleware.ts](backend/src/middlewares/upload.middleware.ts) |
| Token issues | Implement refresh logic in `useEffect` of AuthContext |

---

## 🐛 Debugging Tips

### 1. **Backend Debugging**

```typescript
// Add debug logs
console.log("🔍 Debug:", JSON.stringify(data, null, 2));
console.error("❌ Error:", error);
console.warn("⚠️ Warning:", message);

// Check MongoDB connection
mongoose.connection.on("connected", () => console.log("✅ DB connected"));
mongoose.connection.on("error", (err) => console.error("❌ DB error:", err));

// Log Socket.IO events
socket.on("message:send", (data) => {
  console.log("📨 Message received:", data);
});
```

### 2. **Frontend Debugging**

```javascript
// React DevTools for state inspection
// Open browser DevTools → Components tab

// Add console logs
console.log("🔍 State:", user);
console.error("❌ Error:", error);

// Check Network tab for API calls
// Check for CORS errors

// Check local storage
console.log(localStorage.getItem("accessToken"));
```

### 3. **Socket Debugging**

```javascript
// Monitor all Socket events
socket.onAny((event, ...args) => {
  console.log(`📡 Socket event: ${event}`, args);
});

// Check connection status
console.log("Connected:", socket.connected);
console.log("Socket ID:", socket.id);

// Check rooms joined
console.log("Rooms:", socket.rooms);
```

### 4. **Common Debug Commands**

```bash
# Backend logs
# Look in terminal where you ran: bun run index.ts

# See network requests (Browser)
# Open DevTools → Network tab → filter by XHR

# Check JWT token
# In console: JSON.parse(atob(token.split('.')[1]))

# Test API endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/user/profile
```

### 5. **Log Levels**

```typescript
// Structured logging approach
const log = {
  info: (msg: string, data?: any) => console.log(`ℹ️ ${msg}`, data),
  success: (msg: string, data?: any) => console.log(`✅ ${msg}`, data),
  warn: (msg: string, data?: any) => console.warn(`⚠️ ${msg}`, data),
  error: (msg: string, error?: any) => console.error(`❌ ${msg}`, error),
  debug: (msg: string, data?: any) => {
    if (process.env.DEBUG) console.log(`🐛 ${msg}`, data);
  }
};
```

---

## 🎓 Quick Reference Cheat Sheet

### JWT Token Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate tokens

### User Endpoints
- `GET /api/user/profile` - Get current user
- `PUT /api/user/profile` - Update profile
- `POST /api/user/avatar` - Upload avatar
- `GET /api/user/search` - Search users

### Chat Endpoints
- `GET /api/chats` - Get all chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get chat details
- `GET /api/chats/:id/messages` - Get messages

### Request Endpoints
- `GET /api/requests/pending` - Get friend requests
- `POST /api/requests` - Send friend request
- `PUT /api/requests/:id/accept` - Accept request
- `PUT /api/requests/:id/reject` - Reject request

### Socket Events
- **Send**: `chat:join`, `message:send`, `typing`, `message:read`
- **Listen**: `message:receive`, `typing`, `user:online`, `user:offline`

---

## 📖 Documentation Files in Project

- **[SOCKET_AUTH_FIX_SUMMARY.md](SOCKET_AUTH_FIX_SUMMARY.md)** - WebSocket authentication issues and fixes
- **[implementation_summary.md](implementation_summary.md)** - Features implemented
- **[backend/README.md](backend/README.md)** - Backend setup instructions
- **[mobile/README.md](mobile/README.md)** - Mobile setup instructions
- **[website/README.md](website/README.md)** - Website setup instructions
- **[mobile/SOCKET.md](mobile/SOCKET.md)** - Socket.IO mobile documentation
- **[website/SOCKET.md](website/SOCKET.md)** - Socket.IO web documentation

---

## 💡 Pro Tips for AI Coders

1. **Always read error messages carefully** - They often contain the full context
2. **Check types first** - Understanding TypeScript interfaces prevents bugs
3. **Follow existing patterns** - Consistency matters for maintainability
4. **Test endpoints manually** - Use curl or Postman before integrating
5. **Keep responses consistent** - Always use the standard response format
6. **Validate all inputs** - Use Zod schemas like in the project
7. **Don't hardcode values** - Use environment variables and configuration
8. **Comments for "why"** - Code shows "what", comments explain "why"
9. **Check Socket.IO docs** - Real-time issues are often in configuration
10. **Monitor JWT expiration** - Most auth issues come from expired tokens

---

## 🎯 Next Steps

1. **Understand the flow**: Login → Token → Socket Connection → Real-time messaging
2. **Explore controllers**: See how requests are handled
3. **Check models**: Understand data structure
4. **Review Socket.IO**: Most complex part, read `backend/src/utils/socket.ts`
5. **Test endpoints**: Use curl/Postman to understand API responses
6. **Read SOCKET_AUTH_FIX_SUMMARY**: Critical for troubleshooting

---

**Last Updated:** March 4, 2026
**Project Status:** Active Development
**Questions?** Check corresponding README files or documentation in the root folder

