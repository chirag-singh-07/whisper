import e, { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { handleGetMessagesByChatId } from "../controllers/message.controller";

const router = Router();

router.get("/chat/:chatId", requireAuth, handleGetMessagesByChatId);

export default router;