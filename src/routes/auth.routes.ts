import express from "express";
import { signup, login, refreshToken, logout } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = express.Router();

router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);
router.post("/logout", authRateLimiter, logout);
router.post("/refresh-token", refreshToken);

export default router;