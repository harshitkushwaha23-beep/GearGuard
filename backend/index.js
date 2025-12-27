import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route Imports
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import equipmentRoutes from "./src/routes/equipment.routes.js";
import requestRoutes from "./src/routes/request.routes.js";

// Utility Imports
import { initDB } from "./src/utils/db.util.js";

dotenv.config();
const app = express();

// CORS Configuration
// Fixed the split error by adding a fallback to ensure origin is always an array
const allowedOrigins = (process.env.ORIGIN_URLS || "http://localhost:5173").split(",");

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true, // Required to allow cookies (jwtCookie) to be sent from the frontend
    })
);

app.use(express.json());
app.use(cookieParser());

// Initialize database & tables
// This ensures that Equipment, Teams, and Maintenance Request tables are created on startup
initDB();

// API Routes
// Standardized with /api prefix to match frontend axios configuration
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
    res.send("GearGuard: Maintenance Tracker Server is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
