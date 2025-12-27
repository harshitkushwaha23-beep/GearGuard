import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import { initDB } from "./src/utils/db.util.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Initialize database & tables
initDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});
