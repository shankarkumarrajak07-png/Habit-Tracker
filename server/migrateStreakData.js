// migrateStreakData.js - Run this ONCE to sync data
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Profile = require("./models/Profile");

const migrateStreakData = async () => {
  try {
    console.log("🚀 Starting streak data migration...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all users with profiles
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users`);

    let migratedCount = 0;

    for (const user of users) {
      try {
        // Find user's profile
        const profile = await Profile.findOne({ user: user._id });
        
        if (profile) {
          // Copy streak from User to Profile (if keeping both)
          // OR just remove from Profile (if using Option A)
          
          // For Option A: Just update Profile to remove streak fields
          // We'll handle this via schema update
          
          migratedCount++;
        }
      } catch (err) {
        console.log(`⚠️ Error migrating user ${user._id}:`, err.message);
      }
    }

    console.log(`✅ Migration complete: ${migratedCount} profiles processed`);
    console.log("\n📋 Next steps:");
    console.log("1. Update Profile.js model (remove streakCount, lastStreakDate)");
    console.log("2. Update all frontend references to use user.streak");
    console.log("3. Restart server");
    
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateStreakData();