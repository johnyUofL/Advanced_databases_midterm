const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");

//Routers for home page
router.get("/", appController.getHome);

//Routers for first APP. 
router.get("/dataQuery", appController.getSelectorsDataQuery);
router.get("/api/data", appController.getIndicatorData);


router.get("/datacountryindicator", appController.getSelectorsCountryIndicatorData);
router.get("/api/datacountryindicator", appController.getCountryIndicatorData);

module.exports = router;
