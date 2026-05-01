import { Router } from "express";
import { getDashboard } from "../controller/userControl";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/dashboard", authMiddleware, getDashboard);

export default router;