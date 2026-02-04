import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  handleSendRequest,
  handleGetRequests,
  handleAcceptRequest,
  handleRejectRequest,
} from "../controllers/request.controller";

const router = Router();

router.post("/send", requireAuth, handleSendRequest);
router.get("/pending", requireAuth, handleGetRequests);
router.post("/accept", requireAuth, handleAcceptRequest);
router.post("/reject", requireAuth, handleRejectRequest);

export default router;
