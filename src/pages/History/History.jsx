import "./History.css";
import  Header  from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/ui/Button";
import React from "react";

export default function History() {
  const navigate = useNavigate();

  const latestHealthLogs = [
    {
      sleep: "7 hours",
      water: "2.5L",
      steps: "4500",
      mood: "Happy",
      date: "Jan 23",
    },
    {
      sleep: "6 hours",
      water: "3L",
      steps: "3000",
      mood: "Calm",
      date: "Jan 22",
    },
    {
      sleep: "7.5 hours",
      water: "2L",
      steps: "5000",
      mood: "Energized",
      date: "Jan 21",
    },
  ];

  return (
    <div className="history-page">
      {/* HEADER */}
      <Header />

      <div className="history-container">
        {/* TITLE CARD */}
        <div className="history-title-card">
          <h2>📊 Your Daily History</h2>
          <p>Review and track your previous habit & health records</p>
        </div>

        {/* FILTER BAR */}
        <div className="filter-card">
          <select className="filter-dropdown">
            <option>Search by...</option>
            <option>Habit</option>
            <option>Health Log</option>
            <option>Mood</option>
            <option>Date</option>
          </select>

          <input
            type="text"
            placeholder="Enter search keyword..."
            className="filter-input"
          />

          <button className="filter-button">
            <span>Search</span>
          </button>
        </div>

        {/* RECENT HISTORY CARDS */}
        <div className="history-section-title">Latest Habit History</div>

        <div className="history-cards-grid">
          <div className="history-card">
            <h3>✔ Reading Daily</h3>
            <p>Completed: Yes</p>
            <p>Date: Jan 23</p>
          </div>

          <div className="history-card">
            <h3>✔ Workout</h3>
            <p>Completed: No</p>
            <p>Date: Jan 22</p>
          </div>

          <div className="history-card">
            <h3>✔ Drink Water</h3>
            <p>Completed: Yes</p>
            <p>Date: Jan 21</p>
          </div>
        </div>

        <div className="history-section-title">Latest Health Log History</div>
        <div className="history-cards-grid">
          {latestHealthLogs.map((item, index) => (
            <div className="health-history-card" key={index}>
              <h3 className="card-title">🧍 Daily Health Log</h3>

              <p className="card-item">
                😴 Sleep: <b>{item.sleep}</b>
              </p>
              <p className="card-item">
                💧 Water: <b>{item.water}</b>
              </p>
              <p className="card-item">
                🚶 Steps: <b>{item.steps}</b>
              </p>
              <p className="card-item">
                🙂 Mood: <b>{item.mood}</b>
              </p>

              <p className="card-date">📅 {item.date}</p>
            </div>
          ))}
        </div>

        {/* GO BACK BUTTON */}
        <div className="history-btn-wrapper">
          <Buttons className="login-btn" onClick={() => navigate("/dashboard")}>
            ← Go to Dashboard
          </Buttons>
        </div>
      </div>

      <Footer />
    </div>
  );
}
