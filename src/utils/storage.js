export function saveDailyLog(dailyData) {
  const existing = JSON.parse(localStorage.getItem("dailyLogs") || "[]");

  // Replace today's record instead of pushing duplicate
  const today = new Date().toLocaleDateString();

  const filtered = existing.filter((r) => r.date !== today);
  filtered.push(dailyData);

  localStorage.setItem("dailyLogs", JSON.stringify(filtered));
}
