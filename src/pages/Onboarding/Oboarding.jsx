// Onboarding.jsx
import React, { useState } from "react";
import "./Onboarding.css";
import  Header  from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/ui/Button";

export default function Onboarding() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = () => {
    if (!age || !weight || !height) {
      toast.error("Please fill all fields");
      return;
    }

    // BMI calculation
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    let status = "";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 24.9) status = "Normal Weight";
    else if (bmi < 29.9) status = "Overweight";
    else status = "Obese";

    toast.success("Profile details saved!");

    // Redirect to suggestions page
    navigate("/suggestions", {
      state: {
        bmi,
        status,
      },
    });
  };

  return (
    <div className="onboarding-page">
      <Toaster position="top-right" />
      <Header />

      <div className="onboarding-container">
        <h2 className="onboarding-title">Let’s Get To Know You Better</h2>
        <p className="onboarding-sub">
          This helps us give you better health suggestions ✨
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

          <div className="onboarding-btn-wrapper">
            <Buttons className="onboarding-btn" onClick={handleSubmit}>
              Continue
            </Buttons>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
