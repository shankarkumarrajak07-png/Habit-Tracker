import "./Profile.css";
import  Header  from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import React from "react";

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-page-wrapper">
      <Header />

      <div className="profile-content">
        <div className="profile-card">

          {/* ==== LEFT AREA ==== */}
          <div className="profile-left">
            <div className="profile-photo"></div>

            <button
              className="edit-profile-btn"
              onClick={() => navigate("/profile-edit")}
            >
              <FiEdit3 size={18} />
              Edit Profile
            </button>
          </div>

          {/* ==== RIGHT AREA ==== */}
          <div className="profile-right">
            {/* ==== NAME BANNER - NEW STYLE ==== */}
            <div className="profile-name-banner">
              <div className="profile-name-display">
                <span>Jane Doe</span>
                <button
                  className="profile-name-edit-icon"
                  onClick={() => navigate("/profile-edit")}
                  type="button"
                  aria-label="Edit profile"
                >
                  <FiEdit3 size={16} />
                </button>
              </div>
            </div>

            {/* Info Table with streak classes */}
            <div className="profile-info-grid">
              <label>Age</label>         <p>27</p>
              <label>Gender</label>      <p>Female</p>
              <label>Email</label>       <p>JDoe@gmail.com</p>
              <label>Height</label>      <p>165 cm</p>
              <label>Weight</label>      <p>61 kg</p>
              <label>BMI</label>         <p>18.5</p>
              <label className="streak-label">Daily Streak</label>
              <p className="streak-value">71 days</p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;