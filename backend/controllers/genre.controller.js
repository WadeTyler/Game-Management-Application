const db = require('../db/pool');

// Get All genres
const getAllGenres = async (req, res) => {
    try {
        const { rows:genres } = await db.query("SELECT * FROM genre");
        return res.status(200).json(genres);
    } catch (error) {
        console.error("Error getting all genres", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

// Create a Genre
const createGenre = async (req, res) => {
    try {
        const { name } = req.body || {};

        if (!name) {
            return res.status(400).json({error: "A name is required" });
        }

        // Check if exists
        const { rows:genres } = await db.query("SELECT * FROM genre WHERE LOWER(genre_name) = LOWER($1)", [name]);
        if (genres.length > 0) {
            return res.status(400).json({ error: "Genre already exists" });
        }

        // Add to database
        const { rows:genre } = await db.query("INSERT INTO genre (genre_name) VALUES ($1) RETURNING *", [name]);
        return res.status(201).json(genre[0]);

    } catch (error) {
        console.error("Error creating genre", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete a Genre
const deleteGenre = async (req, res) => {
    try {
        const genreid = req.params.genreid;

        // Check if exists
        const { rows:genres } = await db.query("SELECT * FROM genre WHERE genreid = ($1)", [genreid]);
        if (genres.length === 0) {
            return res.status(404).json({ error: "Genre doesn't exist" });
        }

        // Delete Genre
        await db.query("DELETE FROM genre WHERE genreid = ($1)", [genreid]);

        return res.status(202).json({ message: "Genre successfully deleted" });


    } catch (error) {
        console.error("Error creating genre", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getAllGenres,
    createGenre,
    deleteGenre
}