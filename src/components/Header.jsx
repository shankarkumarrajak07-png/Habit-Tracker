import React from "react";
import { Link } from "react-router-dom";
import "../components/styles/Header.css";

export const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-logo">Habitus</div>

        <nav className="header-nav">
          <Link to="/" className="header-link">
            Home
          </Link>
          <Link to="/suggestions" className="header-link">
            Suggestions
          </Link>
          
            <Link to="/onboarding" className="header-link">
              Onboarding
            </Link>
          

          <Link to="/history" className="header-link">
            History
          </Link>
          <Link to="/profile" className="header-link">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};
