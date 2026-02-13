import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller";
import { upload } from "../middlewares/upload.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Protect upload route with auth middleware
router.post("/", requireAuth, upload.single("file"), uploadFile);

export default router;
