import express from "express";
import { signup, login, logout, forgotPassword, verifyOtp, resetPassword, resetPasswordWithLogin } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protected.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/reset-password-with-login", protectedRoute, resetPasswordWithLogin);

export default router;
