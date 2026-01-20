import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();

/**
 * Security Middleware
 */
// Helmet sets various HTTP headers for security
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.clientUrl, // Only allow requests from client URL
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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

/**
 * Centralized Error Handler
 * Must be last middleware
 */
app.use(errorHandler);

export default app;
