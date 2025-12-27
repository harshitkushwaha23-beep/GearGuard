import { pool } from "../utils/db.util.js";

// Create request with Auto-Fill Logic [cite: 40, 41]
export const createRequest = async (req, res) => {
    try {
        const { subject, type, equipment_id, scheduled_date } = req.body;
        const userId = req.user.id;

        // Auto-Fill Logic: Fetch Maintenance Team and Category from the equipment record [cite: 40, 41]
        const equipmentInfo = await pool.query(
            "SELECT category, team_id FROM equipment WHERE id = $1 AND is_scrapped = FALSE",
            [equipment_id]
        );

        if (equipmentInfo.rows.length === 0) {
            return res.status(400).json({ message: "Equipment not found or is already scrapped." });
        }

        // The system automatically uses the Team associated with the equipment 
        const result = await pool.query(
            `INSERT INTO maintenance_requests (subject, type, equipment_id, requested_by, scheduled_date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [subject, type, equipment_id, userId, scheduled_date || null]
        );

        res.status(201).json({ 
            message: "Request created", 
            request: result.rows[0],
            autoFilledInfo: {
                category: equipmentInfo.rows[0].category,
                team_id: equipmentInfo.rows[0].team_id
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Assign technician (Manager only) [cite: 43]
export const assignTech = async (req, res) => {
    try {
        const { request_id, user_id } = req.body;

        await pool.query(
            `UPDATE maintenance_requests
             SET assigned_to = $1, status = 'in_progress'
             WHERE id = $2`,
            [user_id, request_id]
        );

        res.json({ message: "Technician assigned and stage moved to In Progress" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Change status (Technician) with Scrap Logic [cite: 45, 74, 76]
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, duration_hours } = req.body;

        // Requirement: Record Duration (Hours Spent) when moving to 'repaired' [cite: 45]
        // Requirement: If moved to 'scrap', indicate equipment is no longer usable [cite: 74, 76]
        if (status === 'scrap') {
            const request = await pool.query("SELECT equipment_id FROM maintenance_requests WHERE id = $1", [id]);
            if (request.rows.length > 0) {
                await pool.query("UPDATE equipment SET is_scrapped = TRUE WHERE id = $1", [request.rows[0].equipment_id]);
            }
        }

        await pool.query(
            `UPDATE maintenance_requests
             SET status = $1, duration_hours = $2
             WHERE id = $3`,
            [status, duration_hours || null, id]
        );

        res.json({ message: `Request updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all requests for Kanban and Reports [cite: 53, 64]
export const getRequests = async (_, res) => {
    try {
        const result = await pool.query(`
            SELECT mr.*, eq.name AS equipment_name, eq.category, u.name AS requester, tech.name AS technician
            FROM maintenance_requests mr
            LEFT JOIN equipment eq ON mr.equipment_id = eq.id
            LEFT JOIN users u ON mr.requested_by = u.id
            LEFT JOIN users tech ON mr.assigned_to = tech.id
            ORDER BY mr.id ASC;
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
