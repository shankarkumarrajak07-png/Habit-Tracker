const HealthLog = require("../models/HealthLog");
const streakController = require("./streakController");

// ================= CREATE (once per day) =================
exports.createHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ CHECK: All health items must be provided for NEW log
    const { water, sleep, steps, mood } = req.body;
    if (water === undefined || sleep === undefined || steps === undefined || mood === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please complete all health fields (sleep, water, steps, mood)"
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingLog = await HealthLog.findOne({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: "Today's health log already exists. You can edit it.",
      });
    }

    const newLog = await HealthLog.create({
      user: userId,
      water: req.body.water,
      sleep: req.body.sleep,
      steps: req.body.steps,
      mood: req.body.mood,
      date: new Date(),
    });

    console.log("✅ Health log created, updating streak automatically...");
    
    // ✅ AUTO-UPDATE STREAK when complete health log is created
    await streakController.updateStreakAutomatically(userId);

    res.status(201).json({
      success: true,
      message: "Health log saved successfully!",
      data: newLog
    });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ 
      success: false,
      message: "Health log failed" 
    });
  }
};

// ================= UPDATE (anytime today) - WITH PARTIAL UPDATES =================
exports.updateTodayHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ FIX: Accept partial updates - don't require all fields
    const { water, sleep, steps, mood } = req.body;
    
    // Check if at least one field is provided
    if (water === undefined && sleep === undefined && steps === undefined && mood === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update (sleep, water, steps, or mood)"
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Find today's log
    const todayLog = await HealthLog.findOne({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (!todayLog) {
      return res.status(404).json({ 
        success: false,
        message: "No health log found for today. Please create a new log first." 
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (water !== undefined) {
      updateData.water = water;
      console.log(`📝 Updating water to: ${water}`);
    }
    if (sleep !== undefined) {
      updateData.sleep = sleep;
      console.log(`📝 Updating sleep to: ${sleep}`);
    }
    if (steps !== undefined) {
      updateData.steps = steps;
      console.log(`📝 Updating steps to: ${steps}`);
    }
    if (mood !== undefined) {
      updateData.mood = mood;
      console.log(`📝 Updating mood to: ${mood}`);
    }

    console.log("🔄 Final update data:", updateData);

    // Update the log with only changed fields
    const updatedLog = await HealthLog.findOneAndUpdate(
      { user: userId, date: { $gte: todayStart, $lte: todayEnd } },
      { $set: updateData }, // Use $set operator to update only specified fields
      { new: true }
    );

    console.log("✅ Health log partially updated, updating streak...");
    
    // ✅ AUTO-UPDATE STREAK when health log is updated
    await streakController.updateStreakAutomatically(userId);

    res.json({
      success: true,
      message: "Health log updated successfully!",
      data: updatedLog
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ 
      success: false,
      message: "Update failed" 
    });
  }
};

// ================= GET ALL LOGS =================
exports.getHealthLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user.id })
      .sort({ date: -1 });

    // ✅ CRITICAL FIX: Return DIRECT ARRAY for frontend compatibility
    // Charts expect array, not wrapped object
    res.json(logs);
    
  } catch (err) {
    console.error("Get logs error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch health logs" 
    });
  }
};

// ================= GET WEEKLY HEALTH =================
exports.getWeeklyHealth = async (req, res) => {
  try {
    const userId = req.user.id;

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const logs = await HealthLog.find({
      user: userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    // ✅ CRITICAL FIX: Return DIRECT ARRAY for frontend compatibility
    // Weekly charts expect array, not wrapped object
    res.json(logs);
    
  } catch (err) {
    console.error("Weekly fetch error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch weekly health data" 
    });
  }
};

// ================= GET SINGLE LOG BY ID (Optional - for future use) =================
exports.getHealthLogById = async (req, res) => {
  try {
    const log = await HealthLog.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Health log not found"
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (err) {
    console.error("Get by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch health log"
    });
  }
};

// ================= UPDATE LOG BY ID (Optional - for future use) =================
exports.updateHealthLogById = async (req, res) => {
  try {
    const userId = req.user.id;
    const logId = req.params.id;

    // Check if log exists and belongs to user
    const existingLog = await HealthLog.findOne({
      _id: logId,
      user: userId
    });

    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: "Health log not found"
      });
    }

    // Accept partial updates
    const { water, sleep, steps, mood } = req.body;
    
    // Check if at least one field is provided
    if (water === undefined && sleep === undefined && steps === undefined && mood === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update"
      });
    }

    // Build update object
    const updateData = {};
    if (water !== undefined) updateData.water = water;
    if (sleep !== undefined) updateData.sleep = sleep;
    if (steps !== undefined) updateData.steps = steps;
    if (mood !== undefined) updateData.mood = mood;

    const updatedLog = await HealthLog.findByIdAndUpdate(
      logId,
      { $set: updateData },
      { new: true }
    );

    // Update streak if this is today's log
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logDate = new Date(existingLog.date);
    logDate.setHours(0, 0, 0, 0);
    
    if (logDate.getTime() === today.getTime()) {
      console.log("✅ Updating streak for today's edited log");
      await streakController.updateStreakAutomatically(userId);
    }

    res.json({
      success: true,
      message: "Health log updated successfully",
      data: updatedLog
    });
  } catch (err) {
    console.error("Update by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};