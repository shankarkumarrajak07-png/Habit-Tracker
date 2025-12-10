import React from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";
import "../styles/History.css";


/*
   FUTURE: We will fetch history from MongoDB.
   For now: show placeholders representing past logs.
*/
export const History = () => {
  // Sample history (temporary)
  const habitHistory = [
    { date: "Jan 14", habits: ["Drink Water", "Walk", "Meditate"] },
    { date: "Jan 13", habits: ["Gym", "Read Book"] },
    { date: "Jan 12", habits: ["Stretching", "Yoga"] },
  ];

  const healthHistory = [
    { date: "Jan 14", sleep: "7 hrs", steps: "5,200", water: "2.3L", mood: "Happy" },
    { date: "Jan 13", sleep: "6.5 hrs", steps: "4,100", water: "2.0L", mood: "Neutral" },
    { date: "Jan 12", sleep: "8 hrs", steps: "6,200", water: "2.6L", mood: "Energetic" },
  ];

  return (
    <div className="history-page">
      <Header />

      <div className="history-container">
        {/* SECTION TITLE */}
        <div className="section-header-pill">History Overview</div>




        {/* =================== HABIT HISTORY =================== */}
        <div className="history-section">
          <h2 className="history-title">Daily Habit History</h2>

          <div className="history-card-grid">
            {habitHistory.map((entry, index) => (
              <div key={index} className="history-card">
                <h3 className="history-date">{entry.date}</h3>

                <ul className="history-list">
                  {entry.habits.map((h, i) => (
                    <li key={i} className="history-item">• {h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* =================== HEALTH HISTORY =================== */}

        
        <div className="history-section">
          <h2 className="history-title">Daily Health Log History</h2>

          <div className="history-card-grid">
            {healthHistory.map((entry, index) => (
              <div key={index} className="history-card">
                <h3 className="history-date">{entry.date}</h3>

                <p className={entry.sleep >= "7" ? "highlight" : ""}>
  <strong>Sleep:</strong> {entry.sleep}
</p>

<p className={parseInt(entry.steps) >= 5000 ? "highlight" : ""}>
  <strong>Steps:</strong> {entry.steps}
</p>

<p className={parseFloat(entry.water) >= 2 ? "highlight" : ""}>
  💧 <strong>Water:</strong> {entry.water}
</p>

<p className={["Happy", "Energetic"].includes(entry.mood) ? "highlight" : ""}>
  🙂 <strong>Mood:</strong> {entry.mood}
</p>

              </div>
            ))}
          </div>
        </div>
      </div>
                    {/* DASHBOARD BUTTON */}
<div className="history-back-btn-wrapper">
  <a href="/" className="history-back-btn">
    ← Go To Dashboard
  </a>
</div>

      <Footer />
    </div>
  );
};
