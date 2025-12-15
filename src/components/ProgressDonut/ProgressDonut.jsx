import React from "react";
import "./ProgressDonut.css"

export const ProgressDonut = ({ progress }) => {
  const radius = 90;
  const stroke = 18;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="donut-card">
      
      {/* CARD TITLE */}
      <h2 className="donut-title">Habit Progress</h2>

      {/* DONUT + LABEL */}
      <div className="donut-wrapper">
  <div className="donut-inner">
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#e6e6f5"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#grad1)"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
      />
      <defs>
        <linearGradient id="grad1">
          <stop offset="0%" stopColor="#2396e9" />
          <stop offset="100%" stopColor="#f369d0" />
        </linearGradient>
      </defs>
    </svg>

    {/* LABEL INSIDE DONUT */}
    <div className="donut-label">{progress}% complete</div>
  </div>
</div>

    </div>
  );
};
