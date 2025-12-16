import "./Suggestions.css";
import  Header  from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import Buttons from "../../components/ui/Button"
import React from "react";


export default function Suggestions() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const hasData = state && state.bmi && state.status;

  const suggestionList = {
    Underweight: {
      diet: [
        "Eat more frequently",
        "Include healthy fats",
        "Drink calorie-rich smoothies",
        "Add nuts and seeds",
      ],
      activity: [
        "Focus on strength training",
        "Avoid excessive cardio",
        "Ensure proper rest",
        "Be consistent",
      ],
    },
    "Normal Weight": {
      diet: [
        "Maintain a balanced diet",
        "Eat fruits & vegetables",
        "Stay hydrated",
        "Limit junk food",
      ],
      activity: [
        "30 minutes daily exercise",
        "Mix cardio & strength",
        "Stay active",
        "Play a sport",
      ],
    },
    Overweight: {
      diet: [
        "Practice portion control",
        "Reduce sugar intake",
        "Eat more protein",
        "Avoid late-night snacks",
      ],
      activity: [
        "Brisk walking daily",
        "Light jogging",
        "Yoga & stretching",
        "Use stairs",
      ],
    },
    Obese: {
      diet: [
        "Avoid fried foods",
        "Increase vegetables",
        "Cut sugary drinks",
        "Choose low-fat meals",
      ],
      activity: [
        "Start with walking",
        "Gentle stretching",
        "Low-impact exercises",
        "Stay hydrated",
      ],
    },
  };

  return (
    <div className="suggestions-page">
      <Header />

      <div className="suggestions-container">
        {!hasData ? (
          /* ================= NO DATA STATE ================= */
          <div className="no-data-card">
            <h2>🤔 No Health Data Found</h2>
            <p>
              We don’t have enough information to generate your health
              suggestions yet.
            </p>
            <p className="no-data-sub">
              Please complete the onboarding form so we can personalize your
              diet and activity plan.
            </p>

            <div className="suggestion-btn-wrapper">
              <Buttons onClick={() => navigate("/dashboard")}>
  ← Go to Dashboard
</Buttons>

            </div>
          </div>
        ) : (
          /* ================= NORMAL FLOW ================= */
          <>
            <div className="suggestions-title-card">
              <h2>Your Health Suggestions</h2>
              <p>Personalized diet & activity guidance based on your BMI</p>
            </div>

            <div className="bmi-summary-card">
              <div className="bmi-value">{state.bmi}</div>
              <div className="bmi-status">{state.status}</div>
            </div>

            <div className="suggestions-section-pill">
              Diet & Activity Recommendations
            </div>

            <div className="suggestions-grid">
              <div className="suggestion-card">
                <h3>🍽️ Diet Suggestions</h3>
                <ul>
                  {suggestionList[state.status].diet.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="suggestion-card">
                <h3>🏃 Activity Suggestions</h3>
                <ul>
                  {suggestionList[state.status].activity.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="suggestion-btn-wrapper">
              <Buttons
                className="login-btn"
                onClick={() => navigate("/dashboard")}
              >
                ← Go to Dashboard
              </Buttons>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
