import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";
import chatRoutes from "./routes/chat.routes";
import requestRoutes from "./routes/request.routes";

const app = express();

/**
 * Security Middleware
 */
// Helmet sets various HTTP headers for security
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: "*", // Only allow requests from client URL
    credentials: true, // Allow cookies to be sent
  }),
);

/**
 * Body Parsing Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Cookie Parsing Middleware
 * Required for reading JWT tokens from cookies
 */
app.use(cookieParser());

/**
 * Health Check Endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */

// Serve uploaded files statically from /uploads

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/requests", requestRoutes);

/**
 * Centralized Error Handler
 * Must be last middleware
 */
app.use(errorHandler);

export default app;
