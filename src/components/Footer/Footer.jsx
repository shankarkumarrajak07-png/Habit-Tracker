// Footer.jsx
import React from "react";
import { FiMapPin, FiMail } from "react-icons/fi";
import "./Footer.css";

export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT BRAND SECTION */}
        <div className="footer-brand">
          <h1 className="footer-logo">
            Habit<span className="gradient-text">us</span>
          </h1>

          <p className="footer-description">
            Track daily routines and turn goals into habits — all in one beautiful app.
          </p>
        </div>

        {/* RIGHT CONTACT SECTION */}
        <div className="footer-contact">
          <div className="footer-contact-item">
            <FiMapPin className="footer-icon" />
            <span>
              Mrs. KMPM College, Bistupur,<br />
              Jamshedpur, Jharkhand – India
            </span>
          </div>

          <div className="footer-contact-item">
            <FiMail className="footer-icon" />
            <span>support@habitus.com</span>
          </div>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Habitus. All rights reserved.
      </div>
    </footer>
  );
};