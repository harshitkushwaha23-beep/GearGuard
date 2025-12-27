import pkg from "pg";
import dotenv from "dotenv";
import { hashPassword } from "./bcrypt.util.js";
dotenv.config();

const { Pool } = pkg;

const hashed = await hashPassword("admin");

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

export const initDB = async () => {
    try {
        console.log("📦 Checking & Initializing Database...");

        // Create ENUM role type if not exists
        await pool.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                    CREATE TYPE user_role AS ENUM ('manager', 'technician','employee');
                END IF;
            END $$;
        `);

        // Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role user_role NOT NULL DEFAULT 'employee',
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ('admin', 'admin@example.com', '${hashed}', 'manager')
            ON CONFLICT (email) DO NOTHING;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS password_reset_codes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(150) NOT NULL,
                code VARCHAR(6) NOT NULL,
                reset_token TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        // Optional: Auto-clean OTPs older than 15 minutes
        await pool.query(`
            DELETE FROM password_reset_codes
            WHERE created_at < NOW() - INTERVAL '15 minutes';
        `);

        console.log("✅ Database initialized successfully!");
    } catch (err) {
        console.error("❌ Error initializing DB:", err);
    }
};
