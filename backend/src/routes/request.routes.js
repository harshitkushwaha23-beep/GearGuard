import express from "express";
import { protectedRoute, isManager } from "../middleware/protected.middleware.js";
import { createRequest, assignTech, updateStatus, getRequests } from "../controllers/request.controller.js";

const router = express.Router();

// Anyone logged in can create a request
router.post("/", protectedRoute, createRequest);

// Manager assigns technician
router.post("/assign", protectedRoute, isManager, assignTech);

// Technician updates status
router.patch("/:id/status", protectedRoute, updateStatus);

// Everyone in company sees requests
router.get("/", protectedRoute, getRequests);

export default router;
