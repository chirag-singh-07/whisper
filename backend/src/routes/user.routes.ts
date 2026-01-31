import e, { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { handleGetAllUsers } from "../controllers/user.controller";

const router = Router();

router.get("/get-all-users", requireAuth,handleGetAllUsers);

export default router;