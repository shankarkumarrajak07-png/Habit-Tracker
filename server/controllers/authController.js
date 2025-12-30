const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    console.log("🔥 SIGNUP ROUTE HIT");
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required: name, email, password" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered. Please login instead." 
      });
    }

    // Hash password manually (no middleware)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ User created:", user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false,
        message: "Validation error: " + Object.values(error.errors).map(e => e.message).join(", ")
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error during signup. Please try again." 
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    console.log("🔑 LOGIN ROUTE HIT");
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Check password manually (no middleware)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ User logged in:", user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak || 0,
        lastStreakDate: user.lastStreakDate,
        profilePicture: user.profilePicture || "",
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during login. Please try again." 
    });
  }
};

// ================= GET CURRENT USER =================
exports.getCurrentUser = async (req, res) => {
  try {
    console.log("👤 GET CURRENT USER - User ID:", req.user._id);
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak || 0,
        lastStreakDate: user.lastStreakDate,
        profilePicture: user.profilePicture || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user information" 
    });
  }
};

// ================= UPDATE PASSWORD =================
exports.updatePassword = async (req, res) => {
  try {
    console.log("🔐 UPDATE PASSWORD - User ID:", req.user._id);
    console.log("Request body:", req.body);

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All password fields are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 6 characters" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "New passwords do not match" 
      });
    }

    // Get fresh user from database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update using findByIdAndUpdate (NO save() to avoid middleware)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");

    console.log("✅ Password updated for user:", updatedUser.email);

    res.json({ 
      success: true, 
      message: "Password updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ UPDATE PASSWORD ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update password"
    });
  }
};

// ================= UPDATE USER INFO =================
exports.updateUserInfo = async (req, res) => {
  try {
    console.log("📝 UPDATE USER INFO - User ID:", req.user._id);
    
    const { name, email } = req.body;
    const updates = {};

    // Only update provided fields
    if (name) updates.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is already in use" 
        });
      }
      updates.email = email.toLowerCase();
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    console.log("✅ User info updated:", updatedUser.email);

    res.json({
      success: true,
      message: "Profile information updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ Update user info error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile information" 
    });
  }
};

// ================= UPLOAD PROFILE PICTURE =================
exports.uploadProfilePicture = async (req, res) => {
  try {
    console.log("🖼️ UPLOAD PROFILE PICTURE - User ID:", req.user._id);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Construct file path
    const filePath = `/uploads/profile-pictures/${req.file.filename}`;
    console.log("✅ File saved at:", req.file.path);
    console.log("✅ Public URL will be:", filePath);
    
    // Delete old profile picture if exists
    if (req.user.profilePicture && req.user.profilePicture.trim() !== "") {
      try {
        const oldFilePath = path.join(__dirname, '..', req.user.profilePicture);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("🗑️ Deleted old profile picture:", oldFilePath);
        }
      } catch (deleteError) {
        console.log("⚠️ Could not delete old file:", deleteError.message);
      }
    }

    // Update user with new profile picture path
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: filePath },
      { new: true }
    ).select("-password");

    console.log("✅ Profile picture updated in database");

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: filePath,
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ Profile picture upload error:", error);
    
    // Delete the uploaded file if there was an error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// ================= DELETE PROFILE PICTURE =================
exports.deleteProfilePicture = async (req, res) => {
  try {
    console.log("🗑️ DELETE PROFILE PICTURE - User ID:", req.user._id);
    
    if (!req.user.profilePicture || req.user.profilePicture.trim() === "") {
      return res.json({
        success: true,
        message: "No profile picture to delete"
      });
    }

    // Delete file from server
    const filePath = path.join(__dirname, '..', req.user.profilePicture);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ Deleted file:", filePath);
    }

    // Clear profile picture from user using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: "" },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile picture deleted successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ Delete profile picture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete profile picture"
    });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};