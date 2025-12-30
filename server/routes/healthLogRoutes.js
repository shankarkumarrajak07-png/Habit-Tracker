// routes/healthLogRoutes.js - UPDATED
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createHealthLog,
  updateTodayHealthLog,
  getHealthLogs,
  getWeeklyHealth,
  getHealthLogById,          // Optional
  updateHealthLogById        // Optional
} = require("../controllers/healthLogController");

// GET all logs
router.get("/", auth, getHealthLogs);

// GET weekly logs for charts
router.get("/weekly", auth, getWeeklyHealth);

// CREATE new log (once per day)
router.post("/", auth, createHealthLog);

// UPDATE today's log (partial updates allowed)
router.put("/today", auth, updateTodayHealthLog);

// Optional: Get single log by ID
router.get("/:id", auth, getHealthLogById);

// Optional: Update log by ID
router.put("/:id", auth, updateHealthLogById);

module.exports = router;