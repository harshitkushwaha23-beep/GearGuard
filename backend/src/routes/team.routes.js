import express from "express";
import { createTeam, addTechToTeam, getTeams } from "../controllers/team.controller.js";
import { protectedRoute, isManager } from "../middleware/protected.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, isManager, createTeam); // Admin only
router.post("/assign", protectedRoute, isManager, addTechToTeam); // Admin only
router.get("/", protectedRoute, getTeams); // Anyone logged in

export default router;
