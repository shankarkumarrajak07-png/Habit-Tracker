const Profile = require("../models/Profile");
const User = require("../models/User");

// BMI helper
const getBmiStatus = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    console.log("=== GET PROFILE REQUEST ===");
    console.log("User ID from auth:", req.user?._id || req.user?.id);
    
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID not found" 
      });
    }
    
    const profile = await Profile.findOne({ user: userId })
      .populate("user", "name email streak lastStreakDate profilePicture createdAt");
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: "Profile not found. Please complete onboarding." 
      });
    }
    
    // ✅ FIXED: Ensure profile picture URL is correct
    const userData = {
      id: profile.user?._id || userId,
      name: profile.user?.name || req.user.name,
      email: profile.user?.email || req.user.email,
      streak: profile.user?.streak || 0,
      lastStreakDate: profile.user?.lastStreakDate,
      profilePicture: profile.user?.profilePicture || "",
      createdAt: profile.user?.createdAt
    };
    
    res.status(200).json({
      success: true,
      profile: {
        _id: profile._id,
        user: userData,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        bmi: profile.bmi,
        bmiStatus: profile.bmiStatus,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });
    
  } catch (error) {
    console.error("❌ PROFILE FETCH ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch profile"
    });
  }
};

// ================= CREATE / UPDATE PROFILE =================
exports.saveProfile = async (req, res) => {
  try {
    console.log("=== SAVE PROFILE REQUEST ===");
    console.log("User ID:", req.user?._id || req.user?.id);

    const { age, height, weight } = req.body;

    if (!age || !height || !weight) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: age, height, and weight" 
      });
    }

    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID not found" 
      });
    }

    // ✅ FIXED: Proper BMI calculation
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
    const bmiStatus = getBmiStatus(bmi);

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        bmi,
        bmiStatus
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    const user = await User.findById(userId).select("name email streak lastStreakDate profilePicture");
    
    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile: {
        _id: profile._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          lastStreakDate: user.lastStreakDate,
          profilePicture: user.profilePicture || ""
        },
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        bmi: profile.bmi,
        bmiStatus: profile.bmiStatus,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });

  } catch (error) {
    console.error("❌ PROFILE SAVE ERROR:", error);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: "A profile already exists for this user"
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Failed to save profile"
    });
  }
};

// ================= UPDATE PROFILE (Health Info) =================
exports.updateProfile = async (req, res) => {
  try {
    console.log("=== UPDATE PROFILE REQUEST ===");
    console.log("User ID:", req.user?._id || req.user?.id);
    console.log("Request body:", req.body);

    const { age, height, weight } = req.body;
    const userId = req.user._id || req.user.id;

    // Validate at least one field is provided
    if (age === undefined && height === undefined && weight === undefined) {
      return res.status(400).json({ 
        success: false,
        message: "No data provided to update" 
      });
    }

    // Find existing profile
    const existingProfile = await Profile.findOne({ user: userId });
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create a profile first."
      });
    }

    // Build update object with current values as fallback
    const updateData = {
      age: age !== undefined ? Number(age) : existingProfile.age,
      height: height !== undefined ? Number(height) : existingProfile.height,
      weight: weight !== undefined ? Number(weight) : existingProfile.weight
    };

    // ✅ FIXED: Validate all values
    if (updateData.age < 1 || updateData.age > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 1 and 120"
      });
    }
    
    if (updateData.height < 50 || updateData.height > 300) {
      return res.status(400).json({
        success: false,
        message: "Height must be between 50 and 300 cm"
      });
    }
    
    if (updateData.weight < 10 || updateData.weight > 500) {
      return res.status(400).json({
        success: false,
        message: "Weight must be between 10 and 500 kg"
      });
    }

    // ✅ FIXED: Always recalculate BMI when updating health info
    const heightInMeters = updateData.height / 100;
    updateData.bmi = parseFloat((updateData.weight / (heightInMeters * heightInMeters)).toFixed(2));
    updateData.bmiStatus = getBmiStatus(updateData.bmi);

    // Update profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate("user", "name email streak lastStreakDate profilePicture");

    console.log("✅ Profile updated successfully:", updatedProfile._id);
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        _id: updatedProfile._id,
        user: {
          id: updatedProfile.user._id,
          name: updatedProfile.user.name,
          email: updatedProfile.user.email,
          streak: updatedProfile.user.streak,
          lastStreakDate: updatedProfile.user.lastStreakDate,
          profilePicture: updatedProfile.user.profilePicture || ""
        },
        age: updatedProfile.age,
        height: updatedProfile.height,
        weight: updatedProfile.weight,
        bmi: updatedProfile.bmi,
        bmiStatus: updatedProfile.bmiStatus,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt
      }
    });

  } catch (error) {
    console.error("❌ PROFILE UPDATE ERROR:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false,
        message: "Validation error: " + Object.values(error.errors).map(e => e.message).join(", ")
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Failed to update profile"
    });
  }
};