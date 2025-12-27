import jwt from "jsonwebtoken";
import { pool } from "../utils/db.util.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtCookie;

        if (!token) {
            return res.status(401).json({ message: "No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "token invalid" });
        }

        const user = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.userId]);

        if (!user.rows.length) {
            return res.status(404).json({ message: "user not found" });
        }

        req.user = user.rows[0];

        next();
    } catch (error) {
        console.log("Error in protected middleware", error.message);
        return res.status(500).json({ message: "internal server error" });
    }
};
