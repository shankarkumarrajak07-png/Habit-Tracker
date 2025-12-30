// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  saveProfile,
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Main profile routes
router.post("/", auth, saveProfile);
router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);

// Debug route (temporary)
router.get("/test", auth, (req, res) => {
  console.log("Profile test route hit - User ID:", req.user._id);
  res.json({ 
    success: true, 
    message: "Profile route is working",
    userId: req.user._id 
  });
});

module.exports = router;