import { Router } from "express";
import {
  handleLoginUser,
  handleLogoutUser,
  handleRegisterUser,
  handleRefreshToken,
  handleGetCurrentUser,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
} from "../middlewares/rateLimit.middleware";

const router = Router();

/**
 * Public routes (no authentication required)
 */
router.post("/register", registerLimiter, handleRegisterUser);
router.post("/login", loginLimiter, handleLoginUser);
router.post("/refresh", refreshLimiter, handleRefreshToken);

/**
 * Protected routes (authentication required)
 */
router.post("/logout", requireAuth, handleLogoutUser);
router.get("/me", requireAuth, handleGetCurrentUser);

export default router;
