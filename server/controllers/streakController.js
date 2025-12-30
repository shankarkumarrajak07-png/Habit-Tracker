// controllers/streakController.js - AUTO-STREAK VERSION
const User = require("../models/User");
const HealthLog = require("../models/HealthLog");

// ✅ PRIVATE: Check if health log is complete
const isHealthLogComplete = (healthLog) => {
  if (!healthLog) return false;
  return (
    healthLog.water !== undefined &&
    healthLog.sleep !== undefined &&
    healthLog.steps !== undefined &&
    healthLog.mood !== undefined &&
    healthLog.water !== null &&
    healthLog.sleep !== null &&
    healthLog.steps !== null &&
    healthLog.mood !== null &&
    healthLog.water !== "" &&
    healthLog.sleep !== "" &&
    healthLog.steps !== "" &&
    healthLog.mood !== ""
  );
};

// ✅ AUTO-UPDATE STREAK (called from healthLogController)
exports.updateStreakAutomatically = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Check if user has a complete health log for today
    const todayHealthLog = await HealthLog.findOne({
      user: userId,
      date: { $gte: todayStart, $lte: now }
    });

    // User must have a COMPLETE health log for today
    if (!todayHealthLog || !isHealthLogComplete(todayHealthLog)) {
      console.log("❌ No complete health log found for today");
      return;
    }

    console.log(`✅ Complete health log found for user ${userId}`);

    // If this is the first health log ever
    if (!user.lastCompleteHealthLogDate) {
      console.log("🔥 First health log! Starting streak at 1");
      await User.findByIdAndUpdate(userId, {
        streak: 1,
        lastCompleteHealthLogDate: now,
        streakUpdatedAt: now,
        lastStreakDate: now
      });
      return;
    }

    const lastLogDate = new Date(user.lastCompleteHealthLogDate);
    const hoursSinceLastLog = (now - lastLogDate) / (1000 * 60 * 60);

    // Check if last log was yesterday
    const lastLogDay = new Date(lastLogDate);
    lastLogDay.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isDifferentDay = lastLogDay.getTime() !== today.getTime();
    const isWithin24Hours = hoursSinceLastLog <= 24;

    console.log(`📅 Hours since last log: ${hoursSinceLastLog.toFixed(2)}`);
    console.log(`🔥 Current streak: ${user.streak}`);
    console.log(`📆 Different day? ${isDifferentDay}`);

    // CASE 1: Within 24 hours AND different calendar day (consecutive day)
    if (isWithin24Hours && isDifferentDay) {
      const newStreak = (user.streak || 0) + 1;
      console.log(`✅ Consecutive day! Streak: ${user.streak} → ${newStreak}`);
      
      await User.findByIdAndUpdate(userId, {
        streak: newStreak,
        lastCompleteHealthLogDate: now,
        streakUpdatedAt: now,
        lastStreakDate: now
      });
    }
    // CASE 2: Same day, don't increment (already counted)
    else if (!isDifferentDay) {
      console.log("✅ Same day, keeping streak at", user.streak);
      await User.findByIdAndUpdate(userId, {
        lastCompleteHealthLogDate: now,
        streakUpdatedAt: now,
        lastStreakDate: now
      });
    }
    // CASE 3: More than 24 hours - BREAK STREAK (RESET TO 0)
    else {
      console.log("❌ More than 24 hours! Resetting streak to 0");
      await User.findByIdAndUpdate(userId, {
        streak: 0,
        lastCompleteHealthLogDate: now,
        streakUpdatedAt: now,
        lastStreakDate: now
      });
    }

    console.log("✅ Streak update completed");

  } catch (err) {
    console.error("❌ Auto streak update error:", err);
  }
};

// ✅ GET CURRENT STREAK (for display - NO MANUAL MAINTENANCE)
exports.getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const now = new Date();
    
    // Check if user has logged health today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayHealthLog = await HealthLog.findOne({
      user: req.user.id,
      date: { $gte: todayStart, $lte: now }
    });

    const hasLoggedToday = !!(todayHealthLog && isHealthLogComplete(todayHealthLog));

    // Check if streak needs to be reset (no health log today AND >24 hours since last update)
    if (user.streakUpdatedAt) {
      const hoursSinceUpdate = (now - new Date(user.streakUpdatedAt)) / (1000 * 60 * 60);
      
      // If >24 hours without health log AND streak > 0, reset to 0
      if (hoursSinceUpdate > 24 && !hasLoggedToday && user.streak > 0) {
        console.log(`⚠️ Streak break detected! Resetting from ${user.streak} to 0`);
        await User.findByIdAndUpdate(req.user.id, {
          streak: 0,
          streakUpdatedAt: now
        });
      }
    }

    const updatedUser = await User.findById(req.user.id);
    
    res.json({
      success: true,
      streak: updatedUser.streak || 0,
      lastUpdated: updatedUser.streakUpdatedAt,
      hasLoggedToday: hasLoggedToday,
      message: "Streak updates automatically when you complete your daily health log"
    });
    
  } catch (err) {
    console.error("❌ Get streak error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch streak" 
    });
  }
};