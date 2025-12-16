import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import habitus from "../../assets/habitus.png";
import Buttons from "../ui/Button";
import "./Header.css";

export default function Header({ variant = "app" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">

        {/* LOGO */}
        <Link to={variant === "landing" ? "/" : "/dashboard"} className="header-logo-wrapper">
          <img src={habitus} alt="Habitus logo" className="logo-img" />
          <h1 className="header-logo-text">
            Habit<span className="gradient-text">us</span>
          </h1>
        </Link>

        {/* NAV */}
        <nav className="header-nav">

          {variant === "landing" ? (
            <>
              <a href="#home" className="header-link">Home</a>
              <a href="#feature" className="header-link">Features</a>
              <a href="#about" className="header-link">About Us</a>

              <Link to="/login">
                <Buttons className="login-btn">Login</Buttons>
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "header-link active" : "header-link"}>
                Dashboard
              </NavLink>

              <NavLink to="/suggestions" className={({ isActive }) => isActive ? "header-link active" : "header-link"}>
                Suggestions
              </NavLink>

              <NavLink to="/history" className={({ isActive }) => isActive ? "header-link active" : "header-link"}>
                History
              </NavLink>

              <NavLink to="/profile" className={({ isActive }) => isActive ? "header-link active" : "header-link"}>
                Profile
              </NavLink>
              
              <Buttons className="logout-btn" onClick={handleLogout}>
                Log Out
              </Buttons>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}
