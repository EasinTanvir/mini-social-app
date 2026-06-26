const express = require("express");

const {
  registerController,
  loginController,
  saveFcmTokenController,
} = require("../controllers/auth.controller");
const { prismaCli } = require("../utils/prismaCli");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/fcm-token", protectRoute, saveFcmTokenController);

module.exports = router;
