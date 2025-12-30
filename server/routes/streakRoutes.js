const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const streakController = require("../controllers/streakController");

// GET current streak (auto-updates based on health logs)
router.get("/", auth, streakController.getStreak);

// NO MORE MANUAL STREAK MAINTENANCE ROUTE
// router.post("/maintain", auth, streakController.maintainStreak);

module.exports = router;