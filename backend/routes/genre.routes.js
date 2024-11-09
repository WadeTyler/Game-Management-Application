const express = require('express');
const router = express();
const genreController = require('../controllers/genre.controller.js');

router.get('/', genreController.getAllGenres);
router.post("/create", genreController.createGenre);
router.delete("/delete/:genreid", genreController.deleteGenre);

module.exports = router;