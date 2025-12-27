import { pool } from "../utils/db.util.js";

export const getProfile = async (req, res) => {
    try {
        // console.log(req);
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters." });
        }

        await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name.trim(), userId]);

        res.json({ success: true, message: "Name updated successfully." });
    } catch (error) {
        console.log("Update name error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.query("DELETE FROM users WHERE id = $1", [userId]);

        res.cookie("jwtCookie", "", { maxAge: 0 });

        res.json({ success: true, message: "Account deleted successfully." });
    } catch (error) {
        console.log("Delete account error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
