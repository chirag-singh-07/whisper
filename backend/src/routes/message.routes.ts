import {
  handleGetMessagesByChatId,
  handleSendMessage,
} from "../controllers/message.controller";

const router = Router();

router.get("/chat/:chatId", requireAuth, handleGetMessagesByChatId);
router.post("/", requireAuth, handleSendMessage);

export default router;
