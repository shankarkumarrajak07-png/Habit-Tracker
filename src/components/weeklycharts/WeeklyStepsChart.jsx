import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/WeeklyStepsChart.css";

export const WeeklyStepsChart = () => {
  // SAMPLE WEEKLY STEP DATA (Later: MongoDB)
  const data = [
    { day: "MO", steps: 6200 },
    { day: "TU", steps: 3100 },
    { day: "WE", steps: 4500 },
    { day: "TH", steps: 3800 },
    { day: "FR", steps: 9100 },
    { day: "SA", steps: 2500 },
    { day: "SU", steps: 4800 },
  ];

  // 🧮 Calculate average
  const avgSteps = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.steps, 0);
    return Math.round(total / data.length);
  }, [data]);

  return (
    <div className="weekly-card">
      <div className="weekly-title">Weekly Step Count</div>
      <div className="weekly-average">
        {avgSteps.toLocaleString()} avg steps/day
      </div>

      <div className="weekly-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis
              tickFormatter={(v) => `${v.toLocaleString()}`}
              width={55}
            />
            <Tooltip
              formatter={(value) =>
                `${value.toLocaleString()} steps`
              }
            />
            <Bar
              dataKey="steps"
              fill="#1c95e8"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
