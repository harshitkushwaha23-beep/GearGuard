import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.util.js";
import { pool } from "../utils/db.util.js";
import { hashPassword } from "../utils/bcrypt.util.js";
import crypto from "crypto";

import nodemailer from "nodemailer";
import { Reset_Email_Template, Password_Reset_Notification } from "../utils/emailTemplates.js";

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passRegex.test(password);
};

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Required fields validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Email validation
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        // Password validation
        if (!validatePassword(password)) {
            return res.status(400).json({ message: "Password requirements are not met." });
        }

        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userExists.rows.length > 0) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await hashPassword(password);

        const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email", [
            name,
            email,
            hashedPassword,
        ]);

        res.status(201).json({ message: "User registered" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const token = await generateToken(user.rows[0].id, res);

        res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwtCookie", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// reset password part
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows.length) {
        return res.status(404).json({ message: "Email not found." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const logo = "https://xpkiqrcqymrsekjuixlr.supabase.co/storage/v1/object/public/images/logo.png";

    await pool.query("INSERT INTO password_reset_codes (email, code) VALUES ($1, $2)", [email, code]);

    // Send Email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Gear Guard" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your Password Reset OTP",
        html: Reset_Email_Template(code, logo, user.rows[0].name),
    });

    res.json({ success: true, message: "OTP sent successfully." });
};

export const verifyOtp = async (req, res) => {
    const { email, code } = req.body;

    const result = await pool.query(
        `
        SELECT * FROM password_reset_codes 
        WHERE email = $1 
        ORDER BY created_at DESC LIMIT 1`,
        [email]
    );

    if (!result.rows.length || result.rows[0].code !== code) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    // generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    await pool.query(
        `UPDATE password_reset_codes
         SET reset_token = $1
         WHERE id = $2`,
        [resetToken, result.rows[0].id]
    );

    res.json({
        success: true,
        resetToken, // frontend must store temporarily
        message: "OTP verified",
    });
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;

        if (!email || !newPassword || !resetToken) {
            return res.status(400).json({ message: "Invalid request." });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Password does not meet security requirements.",
            });
        }

        // validate reset token
        const tokenResult = await pool.query(
            `SELECT * FROM password_reset_codes
             WHERE email = $1
             AND reset_token = $2`,
            [email, resetToken]
        );

        if (!tokenResult.rows.length) {
            return res.status(403).json({ message: "Reset token invalid or expired." });
        }

        // hash password
        const hashed = await hashPassword(newPassword);

        await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashed, email]);

        // delete reset record (single-use)
        await pool.query(`DELETE FROM password_reset_codes WHERE email = $1`, [email]);

        //send notification email
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const logo = "https://xpkiqrcqymrsekjuixlr.supabase.co/storage/v1/object/public/images/logo.png";

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Gear Guard" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your Password Has Been Reset",
            html: Password_Reset_Notification(logo, user.rows[0].name),
        });

        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.log("Reset password error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPasswordWithLogin = async (req, res) => {
    try {
        const { newPassword } = req.body;

        // Logged-in user's email
        const email = req.user.email;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required." });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Password does not meet security requirements.",
            });
        }

        const hashed = await hashPassword(newPassword);

        await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashed, email]);

        //send notification email
        const logo = "https://xpkiqrcqymrsekjuixlr.supabase.co/storage/v1/object/public/images/logo.png";

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Gear Guard" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your Password Has Been Reset",
            html: Password_Reset_Notification(logo, req.user.name),
        });

        res.json({
            success: true,
            message: "Password updated successfully.",
        });
    } catch (error) {
        console.log("Reset password error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
