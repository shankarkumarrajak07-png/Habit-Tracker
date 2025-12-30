// controllers/historyController.js - UPDATED WITH EXACT VALUE FILTERS
const HealthLog = require("../models/HealthLog");
const HabitItem = require("../models/HabitItem");
const HabitList = require("../models/HabitList");

// Get recent history (last 3 days) - NO CHANGES NEEDED
exports.getRecentHistory = async (req, res) => {
  try {
    console.log("📊 GET RECENT HISTORY - User ID:", req.user._id);
    
    const userId = req.user._id;
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of day
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0); // Start of day

    console.log("📅 Date range:", threeDaysAgo, "to", today);

    // ================= HEALTH LOGS =================
    const healthLogs = await HealthLog.find({
      user: userId,
      date: { $gte: threeDaysAgo, $lte: today }
    })
    .sort({ date: -1 })
    .limit(10)
    .lean();

    console.log("🩺 Found health logs:", healthLogs.length);

    // ================= HABITS =================
    // First, get user's habit lists
    const userHabitLists = await HabitList.find({
      userId: userId
    }).select('_id').lean();

    const habitListIds = userHabitLists.map(list => list._id);
    console.log("📝 User's habit list IDs:", habitListIds);

    if (habitListIds.length === 0) {
      console.log("⚠️ User has no habit lists");
      return res.json({
        success: true,
        data: {
          healthLogs: healthLogs.map(log => ({
            id: log._id,
            date: log.date,
            sleep: log.sleep || "0",
            water: log.water || "0",
            steps: log.steps || "0",
            mood: log.mood || "No mood",
            notes: ""
          })),
          habits: []
        },
        message: "No habits found. Create some habits first!"
      });
    }

    // Get habit items from the last 3 days
    const habitItems = await HabitItem.find({
      listId: { $in: habitListIds },
      createdAt: { $gte: threeDaysAgo, $lte: today }
    })
    .populate({
      path: 'listId',
      select: 'title'
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    console.log("✅ Found habit items:", habitItems.length);

    // If no recent habits, get any habits for the user
    let fallbackHabits = [];
    if (habitItems.length === 0) {
      console.log("⚠️ No recent habits, getting all habits...");
      fallbackHabits = await HabitItem.find({
        listId: { $in: habitListIds }
      })
        .populate({
          path: 'listId',
          select: 'title'
        })
        .limit(5)
        .lean();
      console.log("📝 Found all habits:", fallbackHabits.length);
    }

    // Format the data
    const formattedHistory = {
      healthLogs: healthLogs.map(log => ({
        id: log._id,
        date: log.date,
        sleep: log.sleep || "0",
        water: log.water || "0",
        steps: log.steps || "0",
        mood: log.mood || "No mood",
        notes: ""
      })),
      habits: (habitItems.length > 0 ? habitItems : fallbackHabits).map(item => ({
        id: item._id,
        date: item.createdAt, // Use createdAt since no date field
        habitName: item.title || "Unnamed Habit",
        category: item.listId?.title || "General", // Use habit list title as category
        completed: item.completed || false,
        notes: ""
      }))
    };

    console.log("🎯 Sending:", {
      healthLogs: formattedHistory.healthLogs.length,
      habits: formattedHistory.habits.length
    });

    res.json({
      success: true,
      data: formattedHistory,
      message: "Recent history retrieved successfully"
    });

  } catch (error) {
    console.error("❌ Get recent history error:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Search history with filters - UPDATED WITH EXACT VALUE FILTERS
exports.searchHistory = async (req, res) => {
  try {
    console.log("🔍 SEARCH HISTORY - User ID:", req.user._id);
    console.log("Search filters:", req.body);
    
    const userId = req.user._id;
    const {
      startDate,
      endDate,
      habitType, // 'completed' or 'incomplete'
      healthMetric, // 'sleep', 'water', 'steps', 'mood' (backward compatibility)
      searchKeyword,
      sleep,        // NEW: exact sleep hours filter
      water,        // NEW: exact water liters filter  
      steps,        // NEW: exact steps filter
      mood,         // NEW: mood filter
      limit = 50
    } = req.body;

    // ================= GET USER'S HABIT LISTS =================
    const userHabitLists = await HabitList.find({
      userId: userId
    }).select('_id title').lean();

    const habitListIds = userHabitLists.map(list => list._id);
    console.log("📝 User's habit lists:", userHabitLists.length);

    // ================= BUILD DATE FILTER =================
    const dateFilter = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    let healthLogs = [];
    let habits = [];

    // ================= SEARCH HEALTH LOGS =================
    const healthQuery = { user: userId };
    
    // Add date filter if provided
    if (Object.keys(dateFilter).length > 0) {
      healthQuery.date = dateFilter;
    }
    
    // BACKWARD COMPATIBLE: Filter by specific health metric
    if (healthMetric && ['sleep', 'water', 'steps', 'mood'].includes(healthMetric)) {
      healthQuery[healthMetric] = { $exists: true, $ne: "" };
    }
    
    // NEW: Exact sleep hours filter
    if (sleep !== undefined && sleep !== "") {
      healthQuery.sleep = sleep;
    }
    
    // NEW: Exact water intake filter
    if (water !== undefined && water !== "") {
      healthQuery.water = water;
    }
    
    // NEW: Exact steps filter
    if (steps !== undefined && steps !== "") {
      healthQuery.steps = steps;
    }
    
    // NEW: Mood filter
    if (mood && mood !== "") {
      healthQuery.mood = { $regex: mood, $options: 'i' };
    }
    
    // Search by keyword in mood
    if (searchKeyword && searchKeyword !== "") {
      if (!healthQuery.$or) {
        healthQuery.$or = [];
      }
      healthQuery.$or.push({ mood: { $regex: searchKeyword, $options: 'i' } });
    }

    console.log("🩺 Health query:", JSON.stringify(healthQuery, null, 2));
    
    healthLogs = await HealthLog.find(healthQuery)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    console.log("🩺 Found health logs:", healthLogs.length);

    // ================= SEARCH HABITS =================
    if (habitListIds.length > 0) {
      const habitQuery = { listId: { $in: habitListIds } };
      
      // Add date filter if provided (use createdAt)
      if (Object.keys(dateFilter).length > 0) {
        habitQuery.createdAt = dateFilter;
      }
      
      // Filter by completion status
      if (habitType === 'completed') {
        habitQuery.completed = true;
      } else if (habitType === 'incomplete') {
        habitQuery.completed = false;
      }

      console.log("✅ Habit query:", JSON.stringify(habitQuery, null, 2));
      
      // First: Search habits by their fields
      habits = await HabitItem.find(habitQuery)
        .populate({
          path: 'listId',
          select: 'title'
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      console.log("✅ Found habits:", habits.length);

      // Second: If search keyword provided, search in habit titles
      if (searchKeyword && searchKeyword !== "") {
        console.log("🔍 Searching habit titles for:", searchKeyword);
        
        // Search in HabitItem titles
        const keywordHabitQuery = { 
          ...habitQuery,
          title: { $regex: searchKeyword, $options: 'i' }
        };
        
        const keywordHabits = await HabitItem.find(keywordHabitQuery)
          .populate({
            path: 'listId',
            select: 'title'
          })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();

        // Merge results, remove duplicates
        const existingIds = new Set(habits.map(h => h._id.toString()));
        keywordHabits.forEach(h => {
          if (!existingIds.has(h._id.toString())) {
            habits.push(h);
          }
        });
        
        console.log("📝 Total habits after title search:", habits.length);
        
        // Also search in HabitList titles
        const matchingHabitLists = await HabitList.find({
          _id: { $in: habitListIds },
          title: { $regex: searchKeyword, $options: 'i' }
        }).select('_id').lean();
        
        const matchingListIds = matchingHabitLists.map(list => list._id);
        
        if (matchingListIds.length > 0) {
          console.log("📝 Found habit lists with keyword:", matchingListIds.length);
          
          const listHabitQuery = {
            listId: { $in: matchingListIds }
          };
          
          if (Object.keys(dateFilter).length > 0) {
            listHabitQuery.createdAt = dateFilter;
          }
          
          const listHabits = await HabitItem.find(listHabitQuery)
            .populate({
              path: 'listId',
              select: 'title'
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

          // Merge results
          listHabits.forEach(h => {
            if (!existingIds.has(h._id.toString())) {
              habits.push(h);
            }
          });
          
          console.log("📝 Total habits after list search:", habits.length);
        }
      }
    }

    // Format the response
    const formattedResponse = {
      healthLogs: healthLogs.map(log => ({
        id: log._id,
        date: log.date,
        sleep: log.sleep || "0",
        water: log.water || "0",
        steps: log.steps || "0",
        mood: log.mood || "No mood",
        notes: ""
      })),
      habits: habits.map(item => ({
        id: item._id,
        date: item.createdAt,
        habitName: item.title || "Unnamed Habit",
        category: item.listId?.title || "General",
        completed: item.completed || false,
        notes: ""
      }))
    };

    console.log("🎯 Search results:", {
      healthLogs: formattedResponse.healthLogs.length,
      habits: formattedResponse.habits.length
    });

    res.json({
      success: true,
      data: formattedResponse,
      message: "Search results retrieved successfully"
    });

  } catch (error) {
    console.error("❌ Search history error:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Failed to search history",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Debug endpoint to see database structure - NO CHANGES NEEDED
exports.debugDatabase = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log("🔧 DEBUG DATABASE - User ID:", userId);
    
    // Count all records
    const healthLogCount = await HealthLog.countDocuments({ user: userId });
    const habitListCount = await HabitList.countDocuments({ userId: userId });
    
    // Get user's habit lists
    const userHabitLists = await HabitList.find({ userId: userId }).lean();
    const habitListIds = userHabitLists.map(list => list._id);
    const habitItemCount = await HabitItem.countDocuments({ listId: { $in: habitListIds } });
    
    // Get sample records
    const sampleHealthLog = await HealthLog.findOne({ user: userId }).lean();
    const sampleHabitList = await HabitList.findOne({ userId: userId }).lean();
    const sampleHabitItem = await HabitItem.findOne({ 
      listId: habitListIds.length > 0 ? habitListIds[0] : null 
    })
      .populate('listId')
      .lean();
    
    res.json({
      success: true,
      data: {
        counts: {
          healthLogs: healthLogCount,
          habitLists: habitListCount,
          habitItems: habitItemCount
        },
        userHabitLists: userHabitLists,
        sampleHealthLog,
        sampleHabitList,
        sampleHabitItem,
        schemaInfo: {
          healthLogFields: Object.keys(HealthLog.schema.paths),
          habitListFields: Object.keys(HabitList.schema.paths),
          habitItemFields: Object.keys(HabitItem.schema.paths)
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({
      success: false,
      message: "Debug failed",
      error: error.message
    });
  }
};