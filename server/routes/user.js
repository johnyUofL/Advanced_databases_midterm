const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");

router.get("/", appController.getSelectors);
router.get("/graph", appController.getGraphData);

module.exports = router;
