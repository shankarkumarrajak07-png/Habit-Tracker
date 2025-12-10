import React from "react";
import { FiMapPin, FiMail } from "react-icons/fi";
import "../components/styles/Footer.css";

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>Habitus</h3>
          <p>Track your habits, improve your health — one step at a time.</p>
        </div>

        <div className="footer-right">
          <div className="footer-item">
            <FiMapPin className="footer-icon" />
            <span className="footer-text">
              Mrs. KMPM College, Bistupur, Jamshedpur, Jharkhand – India
            </span>
          </div>

          <div className="footer-item">
            <FiMail className="footer-icon" />
            <span className="footer-text">support@habitus.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Habitus — All Rights Reserved
      </div>
    </footer>
  );
};
