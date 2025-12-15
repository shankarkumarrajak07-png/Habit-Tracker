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
import "./WeeklyWaterChart.css";

export const WeeklyWaterChart = () => {
  // SAMPLE WEEKLY WATER DATA (liters per day)
  const data = [
    { day: "MO", water: 2.5 },
    { day: "TU", water: 1.8 },
    { day: "WE", water: 2.0 },
    { day: "TH", water: 1.3 },
    { day: "FR", water: 3.2 },
    { day: "SA", water: 1.0 },
    { day: "SU", water: 2.1 },
  ];

  // 🧮 Calculate average
  const avgWater = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.water, 0);
    return (total / data.length).toFixed(2);
  }, [data]);

  return (
    <div className="weekly-card">
      <div className="weekly-title">Weekly Water Intake</div>
      <div className="weekly-average">
        {avgWater} L/day
      </div>

      <div className="weekly-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis
              tickFormatter={(v) => `${v} L`}
              width={38}
            />
            <Tooltip
              formatter={(v) => `${v} L`}
            />
            <Bar
              dataKey="water"
              fill="#2396e9"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
