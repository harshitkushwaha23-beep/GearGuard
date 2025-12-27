import jwt from "jsonwebtoken";
import { pool } from "../utils/db.util.js";

/**
 * Middleware to restrict access to users with the 'manager' role.
 * Required for sensitive actions like equipment creation and technician assignment.
 */
export const isManager = (req, res, next) => {
    // Check if user object exists and has the manager role
    if (!req.user || req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied: Managers only" });
    }
    next();
};

/**
 * Middleware to protect routes by verifying the JWT cookie.
 * Injects the authenticated user's data into the request object.
 */
export const protectedRoute = async (req, res, next) => {
    try {
        // Retrieve token from the specific cookie name used in your logout controller
        const token = req.cookies.jwtCookie;

        if (!token) {
            return res.status(401).json({ message: "No Token Provided" });
        }

        // Verify the token using your environment secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Token invalid" });
        }

        /**
         * IMPORTANT: Your token utility (token.util.js) signs tokens with { id }.
         * We query based on decoded.id to match that payload.
         */
        const user = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id = $1", 
            [decoded.id]
        );

        if (!user.rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user data to the request for use in controllers (e.g., req.user.id)
        req.user = user.rows[0];

        next();
    } catch (error) {
        console.log("Error in protected middleware:", error.message);
        
        // Handle specific JWT errors for clearer client feedback
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        
        return res.status(500).json({ message: "Internal server error" });
    }
};
