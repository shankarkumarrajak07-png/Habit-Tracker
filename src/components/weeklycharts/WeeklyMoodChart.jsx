import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/WeeklyMoodChart.css";

export const WeeklyMoodChart = () => {
  // SAMPLE WEEKLY MOOD DATA (numeric scale)
  const data = [
    { day: "MO", mood: 5 },  // Happy
    { day: "TU", mood: 3 },  // Tired
    { day: "WE", mood: 4 },  // Neutral
    { day: "TH", mood: 2 },  // Sad
    { day: "FR", mood: 5 },  // Happy
    { day: "SA", mood: 1 },  // Angry
    { day: "SU", mood: 4 },  // Neutral
  ];

  const moodLabels = {
    5: "Happy",
    4: "Neutral",
    3: "Tired",
    2: "Sad",
    1: "Angry",
  };

  return (
    <div className="weekly-card">
      <div className="weekly-title">Weekly Mood Trend</div>
      <div className="weekly-average">Daily emotional patterns</div>

      <div className="weekly-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="day" />

            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(v) => moodLabels[v]}
              width={60}
            />

            <Tooltip
              formatter={(value) => moodLabels[value]}
            />

            <Line
              type="monotone"
              dataKey="mood"
              stroke="#f268d1"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 9 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
