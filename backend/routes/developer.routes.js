const express = require('express');
const router = express();

const developerController = require('../controllers/developer.controller');

router.get("/", developerController.getAllDevelopers);
router.post("/create", developerController.createDeveloper);
router.delete("/delete/:developerid", developerController.deleteDeveloper);

module.exports = router;