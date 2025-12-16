import React from "react";
export default function Features() {
  return (
    <section className="features">
      <h2 className="section-title">Why you'll love it</h2>

      <div className="feature-grid">
        <div className="card">
          <h3 className="h3">Smart Reminders</h3>
          <p>Never miss a habit again. Set daily notifications or let the app suggest the best time.</p>
        </div>

        <div className="card">
          <h3 className="h3">Progress Analytics</h3>
          <p>See your growth with weekly reports, streaks, and visual heatmaps.</p>
        </div>

        <div className="card">
          <h3 className="h3">Streak Tracking</h3>
          <p>Stay motivated by building unbreakable streaks and unlocking milestones.</p>
        </div>
      </div>
    </section>
  );
}
