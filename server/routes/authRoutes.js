const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  signup,
  login,
  logout,
  getCurrentUser,
  updatePassword,
  updateUserInfo,
  uploadProfilePicture,
  deleteProfilePicture
} = require("../controllers/authController");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", auth, getCurrentUser);
router.put("/update-password", auth, updatePassword);
router.put("/update-info", auth, updateUserInfo);
router.post("/logout", auth, logout);

// Profile picture routes
router.post(
  "/upload-profile-picture", 
  auth,
  upload.single("profilePicture"),
  uploadProfilePicture
);

router.delete("/delete-profile-picture", auth, deleteProfilePicture);

module.exports = router;