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
import "./WeeklySleepChart.css";

export const WeeklySleepChart = () => {
  // SAMPLE DATA (later: pull from MongoDB)
  const data = [
    { day: "MO", hours: 7.5 },
    { day: "TU", hours: 3.2 },
    { day: "WE", hours: 5.1 },
    { day: "TH", hours: 4.3 },
    { day: "FR", hours: 6.7 },
    { day: "SA", hours: 2.8 },
    { day: "SU", hours: 5.0 },
  ];

  // 🧮 Compute weekly average
  const average = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.hours, 0);
    return (total / data.length).toFixed(2);
  }, [data]);

  // 👇 Convert decimal to h + m format
  const avgFormatted = () => {
    const hours = Math.floor(average);
    const minutes = Math.round((average - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="weekly-card">
      <div className="weekly-title">Weekly Average Sleep Hours</div>
      <div className="weekly-average">{avgFormatted()}</div>

      <div className="weekly-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis
              ticks={[1, 4, 8]}
              tickFormatter={(v) => `${v} hr`}
              width={38}
            />
            <Tooltip formatter={(v) => `${v} hr`} />
<Bar
  dataKey="hours"
  fill="#f268d1"
  radius={[8, 8, 0, 0]}
  isAnimationActive={true}
  animationBegin={0}
  animationDuration={500}
  animationEasing="linear"
/>




          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
