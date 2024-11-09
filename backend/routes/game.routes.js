const express = require("express");
const router = express();
const gameController = require('../controllers/game.controller');

router.get("/", gameController.getAllGames);
router.post("/create", gameController.createGame);
router.delete("/delete/:gameid", gameController.deleteGame);

module.exports = router;