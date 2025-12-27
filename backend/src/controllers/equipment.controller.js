import { pool } from "../utils/db.util.js";

// Create equipment with all required technical details 
export const createEquipment = async (req, res) => {
    try {
        const { name, category, serial_number, location, purchase_date, warranty_end, team_id } = req.body;

        // Requirement: Tracks ownership and technical details 
        const result = await pool.query(
            `INSERT INTO equipment (name, category, serial_number, location, purchase_date, warranty_end, team_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [name, category, serial_number, location, purchase_date, warranty_end, team_id]
        );

        res.status(201).json({ message: "Equipment added", equipment: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get active equipment with smart badge data 
export const getEquipment = async (_, res) => {
    try {
        // Requirement: Smart Button/Badge logic - show count of open requests 
        const result = await pool.query(`
            SELECT e.*, 
            (SELECT COUNT(*) FROM requests r 
             WHERE r.equipment_id = e.id AND r.status IN ('new', 'in_progress')) as open_requests_count
            FROM equipment e 
            WHERE e.status = 'active'
            ORDER BY e.id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logical Scrap Automation 
export const scrapEquipment = async (req, res) => {
    try {
        const { id } = req.params;

        // Requirement: Logically indicate equipment is no longer usable 
        await pool.query(
            "UPDATE equipment SET is_scrapped = TRUE WHERE id = $1",
            [id]
        );

        res.json({ message: "Equipment marked as scrapped and unavailable for further requests" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
