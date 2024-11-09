const express = require('express');
const app = express();

// routes
const developerRoutes = require('./routes/developer.routes');
const genreRoutes = require('./routes/genre.routes');
const gameRoutes = require('./routes/game.routes');

// middleware
app.use(express.json());


// routes
app.use("/api/developers", developerRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/games", gameRoutes);

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});