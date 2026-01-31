import e, { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { handleGetAllUsers, handleUploadAvatar } from "../controllers/user.controller";
import { uploadAvatar } from "../middlewares/upload.middleware";

const router = Router();

router.get("/get-all-users", requireAuth, handleGetAllUsers);

// Upload avatar (multipart/form-data). Field name: `avatar`
router.post("/upload-avatar", requireAuth, uploadAvatar.single("avatar"), handleUploadAvatar);

export default router;