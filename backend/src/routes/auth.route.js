const express = require("express");

const {
  registerController,
  loginController,
} = require("../controllers/auth.controller");
const { prismaCli } = require("../utils/prismaCli");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.post("/fcm-token", protectRoute, async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) return res.status(400).json({ message: "fcmToken required" });

  await prismaCli.user.update({
    where: { id: req.userId },
    data: { fcmToken },
  });

  return res.json({ success: true });
});

module.exports = router;
