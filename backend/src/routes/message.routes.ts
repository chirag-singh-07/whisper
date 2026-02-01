import {
  handleGetMessagesByChatId,
  handleSendMessage,
} from "../controllers/message.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/chat/:chatId", requireAuth, handleGetMessagesByChatId);
router.post("/", requireAuth, handleSendMessage);

export default router;
