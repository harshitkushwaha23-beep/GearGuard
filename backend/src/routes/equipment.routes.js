import express from "express";
import { createEquipment, getEquipment, scrapEquipment } from "../controllers/equipment.controller.js";
import { protectedRoute, isManager } from "../middleware/protected.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createEquipment); // Allow all authenticated users to add equipment
router.get("/", protectedRoute, getEquipment);
router.patch("/:id/scrap", protectedRoute, isManager, scrapEquipment);

export default router;
