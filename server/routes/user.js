const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");

router.get("/", appController.getSelectors);
router.get("/api/data", appController.getIndicatorData);

module.exports = router;
