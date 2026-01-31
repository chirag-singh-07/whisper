import e, { Router } from "express";
import {
  getChats,
  getChatWithParticipant,
} from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth,getChats);
router.post("/with/:participantId",requireAuth, getChatWithParticipant);

export default router;
