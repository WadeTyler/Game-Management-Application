const db = require('../db/pool');

// Get all developers
const getAllDevelopers = async (req, res) => {
    try {
        const { rows:developers } = await db.query("SELECT * FROM developer");
        return res.status(200).json(developers);
    } catch (error) {
        console.error("Error fetching all developers", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Create a Developer
const createDeveloper = async (req, res) => {
    try {
        const {name} = req.body || {};

        // Check if name
        if (!name) {
            return res.status(400).json({ error: "A name is required" });
        }

        // Check if exists
        const { rows:developers } = await db.query("SELECT developer_name FROM developer WHERE LOWER(developer_name) = LOWER($1)", [name]);
        if (developers.length > 0) {
            return res.status(400).json({ error: "That name already exists" });
        }

        // Add to DB
        const { rows:developer } = await db.query("INSERT INTO developer (developer_name) VALUES ($1) RETURNING *", [name]);
        return res.status(201).json(developer[0]);
    } catch (error) {
        console.error("Error creating developer", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete a Developer
const deleteDeveloper = async (req, res) => {
    try {
        const developerid = req.params.developerid;
        if (!developerid) {
            return res.status(400).json({ error: "A developerid is required" });
        }

        // Check if exists
        const { rows:developers } = await db.query("SELECT * FROM developer WHERE developerid = ($1)", [developerid]);
        if (developers.length === 0) {
            return res.status(404).json({ error: "No developer with that developerid found" });
        }

        await db.query("DELETE FROM developer WHERE developerid = ($1)", [developerid]);

        return res.status(202).json({ message: "Developer successfully deleted" });

        
    } catch (error) {
        console.error("Error deleting developer", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getAllDevelopers,
    createDeveloper,
    deleteDeveloper
}