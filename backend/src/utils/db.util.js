import pkg from "pg";
import dotenv from "dotenv";
import { hashPassword } from "./bcrypt.util.js";

dotenv.config();

const { Pool } = pkg;

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

        // Generate admin password hash inside the function for safety
        const hashedAdminPassword = await hashPassword("admin");

        // 1. Create ENUM role type if not exists
        // Includes 'technician' and 'employee' as required by the GearGuard brief
        await pool.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                    CREATE TYPE user_role AS ENUM ('manager', 'technician', 'employee');
                END IF;
            END $$;
        `);

        // 2. Users Table
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

        // Seed Default Admin
        await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ('admin', 'admin@example.com', '${hashedAdminPassword}', 'manager')
            ON CONFLICT (email) DO NOTHING;
        `);

        // 3. Teams Table (Specialized teams like IT, Mechanics, etc.)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        // 4. Team Members Table (Linking Technicians to Teams)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS team_members (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                UNIQUE(user_id, team_id)
            );
        `);

        // 5. Equipment Table (Central asset database)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS equipment (
                id SERIAL PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                category VARCHAR(120) NOT NULL,
                serial_number VARCHAR(120),
                location VARCHAR(150),
                purchase_date DATE,
                warranty_end DATE,
                team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
                is_scrapped BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 6. Maintenance Requests Table (Transactional repair jobs)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS maintenance_requests (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(200) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('corrective', 'preventive')),
                equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
                requested_by INTEGER REFERENCES users(id),
                assigned_to INTEGER REFERENCES users(id),
                status VARCHAR(20) NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'in_progress', 'repaired', 'scrap')),
                scheduled_date DATE,
                duration_hours FLOAT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        // 7. Password Reset Codes Table
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
