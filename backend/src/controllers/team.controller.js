import { pool } from "../utils/db.util.js";

// Create a new Maintenance Team (e.g., Mechanics, IT Support, Electricians)
export const createTeam = async (req, res) => {
    try {
        const { name } = req.body;
        // Requirement: Ability to define specialized teams [cite: 22]
        const result = await pool.query(
            "INSERT INTO teams (name) VALUES ($1) RETURNING *",
            [name]
        );

        res.status(201).json({ message: "Maintenance team created successfully", team: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Link specific users (Technicians) to these teams
export const addTechToTeam = async (req, res) => {
    try {
        const { user_id, team_id } = req.body;
        // Requirement: Link specific users (Technicians) to these teams [cite: 23]
        await pool.query(
            "INSERT INTO team_members (user_id, team_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [user_id, team_id]
        );

        res.json({ message: "Technician successfully added to the team" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all teams with technician counts and identify a default technician
export const getTeams = async (_, res) => {
    try {
        // Requirement: Workflow Logic - only team members should pick up specific requests [cite: 24]
        // Requirement: Each equipment must have a technician assigned by default 
        const result = await pool.query(`
            SELECT 
                t.id, 
                t.name, 
                COUNT(tm.user_id) AS technician_count,
                (SELECT user_id FROM team_members WHERE team_id = t.id LIMIT 1) as default_technician_id
            FROM teams t
            LEFT JOIN team_members tm ON t.id = tm.team_id
            GROUP BY t.id
            ORDER BY t.id ASC
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
