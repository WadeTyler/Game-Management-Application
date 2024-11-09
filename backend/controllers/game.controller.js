const db = require('../db/pool');

// Get all Games
const getAllGames = async (req, res) => {
    try {
        const {rows:games} = await db.query(`
            SELECT 
                game.name, 
                game.genreid, 
                genre.genre_name, 
                game.developerid, 
                developer.developer_name
            FROM game
            JOIN genre ON game.genreid = genre.genreid
            JOIN developer ON game.developerid = developer.developerid
            `);

        return res.status(200).json(games);
    } catch (error) {
        console.error("Error getting all games", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

// Create a Game
const createGame = async (req, res) => {
    try {
        const { name, genreid, developerid } = req.body || {};

        // Check all fields
        if (!name || !genreid || !developerid) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check name exists
        const {rows:games} = await db.query("SELECT * FROM game WHERE LOWER(name) = LOWER($1)", [name]);
        if (games.length > 0) {
            return res.status(400).json({ error: "Game already exists" });
        }

        // Check genre exists
        const {rows:genres} = await db.query("SELECT * FROM genre WHERE genreid = ($1)", [genreid]);
        if (genres.length === 0) {
            return res.status(404).json({ error: "Genre not found" });
        }

        // Check developer exists
        const {rows:developers} = await db.query("SELECT * FROM developer WHERE developerid = ($1)", [developerid]);
        if (genres.length === 0) {
            return res.status(404).json({ error: "Developer not found" });
        }

        // Create new Game
        const { rows:game } = await db.query("INSERT INTO game (name, genreid, developerid) VALUES (($1), ($2), ($3)) RETURNING *", [name, genreid, developerid]);

        return res.status(201).json(game[0]);

    } catch (error) {
        console.error("Error create a game", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

// Delete a Game
const deleteGame = async (req, res) => {
    try {
        const gameid = req.params.gameid;
        if (!gameid) {
            return res.status(400).json({ error: "gameid is required" });
        }

        // Check if gameid exists
        const {rows:games} = await db.query("SELECT * FROM game WHERE gameid = ($1)", [gameid]);
        if (games.length === 0) {
            return res.status(404).json({error: "Game not found"});
        }        

        // Delete game
        await db.query("DELETE FROM game WHERE gameid = ($1)", [gameid]);

        return res.status(202).json({ message: "Game successfully deleted" });
    } catch (error) {
        console.error("Error deleting game", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    getAllGames,
    createGame,
    deleteGame
}