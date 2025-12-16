import React, { useState } from "react";
import { FiEye, FiEyeOff, FiCamera } from "react-icons/fi";
import "./ProfileEdit.css";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const navigate = useNavigate();

  // Show/hide password fields
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState("Amrita Kumari");

  // Profile picture preview (no backend yet)
  const [profilePic, setProfilePic] = useState(null);

  // Handle image selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);

    // 🔮 Later when backend is ready:
    // send `file` to API and save URL in DB.
  };

  // Handle Save (for now just a placeholder)
  const handleSaveChanges = () => {
    // Here you’ll later:
    // - send form data to backend
    // - update user profile in DB
    alert("Changes saved (frontend only for now) ✨");
    navigate("/profile");
  };

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-card">
        {/* LEFT SECTION – avatar + save button */}
        <div className="profile-edit-left">
          <div className="profile-pic-wrapper">
            {/* Circular image preview */}
            <div className="profile-pic-ring">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile preview"
                  className="profile-pic-img"
                />
              ) : (
                <div className="profile-pic-placeholder">
                  {/* Simple initials-style placeholder */}
                  <span>{fullName.charAt(0) || "U"}</span>
                </div>
              )}
            </div>

            {/* Camera / edit icon */}
            <label className="profile-pic-edit-icon">
              <FiCamera size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <button className="profile-save-btn" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>

        {/* RIGHT SECTION – name banner + fields */}
        <div className="profile-edit-right">
          {/* Name banner */}
          <div className="name-banner">
            {isEditingName ? (
              <div className="edit-name-box">
                <input
                  className="edit-name-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <button
                  className="name-save-icon"
                  onClick={() => setIsEditingName(false)}
                  type="button"
                >
                  ✔
                </button>
              </div>
            ) : (
              <div className="name-display">
                <span>{fullName}</span>
                <button
                  className="name-edit-icon"
                  onClick={() => setIsEditingName(true)}
                  type="button"
                >
                  ✎
                </button>
              </div>
            )}
          </div>

          {/* Details form */}
          <div className="details-list">
            {/* Age */}
            <div className="detail-row">
              <span className="label">Age</span>
              <input className="input-field" defaultValue="20" />
            </div>

            {/* Gender */}
            <div className="detail-row">
              <span className="label">Gender</span>
              <select className="input-field" defaultValue="Female">
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>

            {/* Email */}
            <div className="detail-row">
              <span className="label">Email</span>
              <input className="input-field" defaultValue="JDoe@gmail.com" />
            </div>

            {/* Old Password */}
            <div className="detail-row">
              <span className="label">Old Password</span>
              <div className="password-wrapper">
                <input
                  type={showOldPass ? "text" : "password"}
                  className="input-field"
                  placeholder="Enter old password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowOldPass((prev) => !prev)}
                >
                  {showOldPass ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="detail-row">
              <span className="label">New Password</span>
              <div className="password-wrapper">
                <input
                  type={showNewPass ? "text" : "password"}
                  className="input-field"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowNewPass((prev) => !prev)}
                >
                  {showNewPass ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            {/* Height */}
            <div className="detail-row">
              <span className="label">Height</span>
              <input className="input-field" defaultValue="165 cm" />
            </div>

            {/* Weight */}
            <div className="detail-row">
              <span className="label">Weight</span>
              <input className="input-field" defaultValue="61 kg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
