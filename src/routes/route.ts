const express = require("express");

const router = express.Router();
const controllers = require("../controllers/controller");

router.get("/", controllers.Home);
router.post("/generateOTP", controllers.generateOTP);
router.post("/verifyOTP", controllers.verifyOTP);

module.exports = router;
