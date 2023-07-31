const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");

router.get("/", appController.getHome);
router.get("/dataQuery", appController.getSelectors);
router.get("/api/data", appController.getIndicatorData);

module.exports = router;
