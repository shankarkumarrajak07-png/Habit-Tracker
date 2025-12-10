// Onboarding.jsx
import React, { useState } from "react";
import "../styles/Onboarding.css";
import { Header } from "../Header";
import { Footer } from "../Footer";
import toast, { Toaster } from "react-hot-toast";

export const Onboarding = ({ onComplete }) => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = () => {
    if (!age || !weight || !height) {
      toast.error("Please fill all fields");
      return;
    }

    const data = { age, weight, height };
    localStorage.setItem("userProfile", JSON.stringify(data));

    toast.success("Profile saved successfully!");

    if (onComplete) onComplete(); // OPTIONAL – navigate later
  };

  return (
    <div className="onboarding-page">
      <Toaster position="top-right" />

      <Header />

      <div className="onboarding-container">
        <h2 className="onboarding-title">Let’s Get To Know You Better</h2>
        <p className="onboarding-sub">
          Your health insights will become more accurate with this data ✨
        </p>

        <div className="onboarding-form">

          <label>Age</label>
          <input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label>Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter your weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <label>Height (cm)</label>
          <input
            type="number"
            placeholder="Enter your height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          <button className="onboarding-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};
