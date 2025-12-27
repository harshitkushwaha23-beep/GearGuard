import express from "express";
import { getProfile, updateName, deleteAccount } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/protected.middleware.js";

const router = express.Router();

router.get("/getProfile", protectedRoute, getProfile);
router.patch("/update-name", protectedRoute, updateName);
router.delete("/delete-account", protectedRoute, deleteAccount);

export default router;
