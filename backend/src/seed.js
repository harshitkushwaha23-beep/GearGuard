import { pool, initDB } from "./utils/db.util.js";
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
    try {
        // Ensure database schema exists
        await initDB();

        console.log("🌱 Starting database seeding...");

        // Clear existing data (optional - comment out if you want to keep existing data)
        await pool.query("DELETE FROM requests");
        await pool.query("DELETE FROM equipment");
        await pool.query("DELETE FROM team_members");
        await pool.query("DELETE FROM teams");
        await pool.query("DELETE FROM users WHERE email != 'admin@example.com'");
        console.log("✅ Cleared existing data");

        // 1. Create Teams
        const teamsData = [
            { name: "Mechanical Team" },
            { name: "Electrical Team" },
            { name: "IT Support" },
            { name: "HVAC Team" }
        ];

        const teams = [];
        for (const team of teamsData) {
            const result = await pool.query(
                "INSERT INTO teams (name) VALUES ($1) RETURNING *",
                [team.name]
            );
            teams.push(result.rows[0]);
        }
        console.log(`✅ Created ${teams.length} teams`);

        // 2. Create Users
        const hashedPassword = await bcrypt.hash("password123", 10);
        const usersData = [
            { name: "John Smith", email: "tech1@example.com", role: "technician", password: hashedPassword },
            { name: "Sarah Johnson", email: "tech2@example.com", role: "technician", password: hashedPassword },
            { name: "Mike Davis", email: "tech3@example.com", role: "technician", password: hashedPassword },
            { name: "Emily Wilson", email: "emp1@example.com", role: "employee", password: hashedPassword },
            { name: "David Brown", email: "emp2@example.com", role: "employee", password: hashedPassword },
            { name: "Lisa Anderson", email: "emp3@example.com", role: "employee", password: hashedPassword },
            { name: "Robert Martinez", email: "manager2@example.com", role: "manager", password: hashedPassword }
        ];

        const users = [];
        for (const user of usersData) {
            const result = await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
                [user.name, user.email, user.password, user.role]
            );
            users.push(result.rows[0]);
        }
        console.log(`✅ Created ${users.length} users`);

        // 3. Assign Technicians to Teams
        const teamAssignments = [
            { userId: users[0].id, teamId: teams[0].id }, // John -> Mechanical
            { userId: users[1].id, teamId: teams[1].id }, // Sarah -> Electrical
            { userId: users[2].id, teamId: teams[2].id }, // Mike -> IT Support
        ];

        for (const assignment of teamAssignments) {
            await pool.query(
                "INSERT INTO team_members (user_id, team_id) VALUES ($1, $2)",
                [assignment.userId, assignment.teamId]
            );
        }
        console.log(`✅ Assigned technicians to teams`);

        // 4. Create Equipment
        const equipmentData = [
            {
                name: "CNC Machine #1",
                category: "Machinery",
                serial_number: "CNC-2024-001",
                location: "Factory Floor A",
                purchase_date: "2023-01-15",
                warranty_end: "2026-01-15",
                team_id: teams[0].id,
                status: "active"
            },
            {
                name: "Industrial Pump J-45",
                category: "Hydraulics",
                serial_number: "PUMP-J45-789",
                location: "Warehouse B",
                purchase_date: "2023-06-20",
                warranty_end: "2025-06-20",
                team_id: teams[0].id,
                status: "active"
            },
            {
                name: "Power Generator 5000W",
                category: "Electrical",
                serial_number: "GEN-5K-2023",
                location: "Power Room",
                purchase_date: "2022-11-10",
                warranty_end: "2024-11-10",
                team_id: teams[1].id,
                status: "active"
            },
            {
                name: "Server Rack SR-12",
                category: "IT Equipment",
                serial_number: "SR12-ITX-901",
                location: "Data Center",
                purchase_date: "2024-01-05",
                warranty_end: "2027-01-05",
                team_id: teams[2].id,
                status: "active"
            },
            {
                name: "HVAC Unit North Wing",
                category: "Climate Control",
                serial_number: "HVAC-NW-456",
                location: "North Wing Roof",
                purchase_date: "2021-08-12",
                warranty_end: "2024-08-12",
                team_id: teams[3].id,
                status: "active"
            },
            {
                name: "Conveyor Belt System",
                category: "Machinery",
                serial_number: "CONV-SYS-234",
                location: "Assembly Line 1",
                purchase_date: "2023-03-22",
                warranty_end: "2025-03-22",
                team_id: teams[0].id,
                status: "active"
            },
            {
                name: "Air Compressor AC-200",
                category: "Pneumatics",
                serial_number: "AC200-PSI-567",
                location: "Workshop",
                purchase_date: "2023-09-15",
                warranty_end: "2025-09-15",
                team_id: teams[0].id,
                status: "active"
            },
            {
                name: "Emergency Lighting Panel",
                category: "Electrical",
                serial_number: "ELP-2024-120",
                location: "Main Building",
                purchase_date: "2024-02-01",
                warranty_end: "2029-02-01",
                team_id: teams[1].id,
                status: "active"
            }
        ];

        const equipment = [];
        for (const eq of equipmentData) {
            const result = await pool.query(
                `INSERT INTO equipment 
                (name, category, serial_number, location, purchase_date, warranty_end, team_id, status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [eq.name, eq.category, eq.serial_number, eq.location, eq.purchase_date, eq.warranty_end, eq.team_id, eq.status]
            );
            equipment.push(result.rows[0]);
        }
        console.log(`✅ Created ${equipment.length} equipment items`);

        // 5. Create Maintenance Requests
        const requestsData = [
            {
                subject: "Oil leak in hydraulic system",
                type: "corrective",
                equipment_id: equipment[1].id,
                requested_by: users[3].id, // Employee
                assigned_to: users[0].id,   // Technician
                status: "in_progress",
                scheduled_date: null
            },
            {
                subject: "Monthly inspection and lubrication",
                type: "preventive",
                equipment_id: equipment[0].id,
                requested_by: users[4].id,
                assigned_to: users[0].id,
                status: "new",
                scheduled_date: "2025-01-15"
            },
            {
                subject: "Power fluctuation - needs diagnosis",
                type: "corrective",
                equipment_id: equipment[2].id,
                requested_by: users[5].id,
                assigned_to: users[1].id,
                status: "new",
                scheduled_date: null
            },
            {
                subject: "Server backup verification",
                type: "preventive",
                equipment_id: equipment[3].id,
                requested_by: users[3].id,
                assigned_to: users[2].id,
                status: "repaired",
                scheduled_date: "2024-12-25"
            },
            {
                subject: "Strange noise during operation",
                type: "corrective",
                equipment_id: equipment[5].id,
                requested_by: users[4].id,
                assigned_to: users[0].id,
                status: "new",
                scheduled_date: null
            },
            {
                subject: "Quarterly maintenance check",
                type: "preventive",
                equipment_id: equipment[4].id,
                requested_by: users[5].id,
                assigned_to: null,
                status: "new",
                scheduled_date: "2025-02-01"
            },
            {
                subject: "Replace air filters",
                type: "preventive",
                equipment_id: equipment[6].id,
                requested_by: users[3].id,
                assigned_to: users[0].id,
                status: "repaired",
                scheduled_date: "2024-12-20"
            },
            {
                subject: "Emergency lights not turning on",
                type: "corrective",
                equipment_id: equipment[7].id,
                requested_by: users[4].id,
                assigned_to: users[1].id,
                status: "in_progress",
                scheduled_date: null
            }
        ];

        for (const req of requestsData) {
            await pool.query(
                `INSERT INTO requests 
                (subject, type, equipment_id, requested_by, assigned_to, status, scheduled_date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [req.subject, req.type, req.equipment_id, req.requested_by, req.assigned_to, req.status, req.scheduled_date]
            );
        }
        console.log(`✅ Created ${requestsData.length} maintenance requests`);

        console.log("\n🎉 Database seeding completed successfully!");
        console.log("\n📝 Login Credentials:");
        console.log("Manager: admin@example.com / admin");
        console.log("Technician: tech1@example.com / password123");
        console.log("Employee: emp1@example.com / password123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
