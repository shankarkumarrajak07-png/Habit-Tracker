const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getRecentHistory,
  searchHistory,
  debugDatabase // Add this
} = require("../controllers/historyController");

// Get recent history (last 3 days)
router.get("/recent", auth, getRecentHistory);

// Search history with filters
router.post("/search", auth, searchHistory);

// Debug endpoint (remove in production)
router.get("/debug", auth, debugDatabase);

module.exports = router;