import "../components/styles/MoodSelector.css";

export const MoodSelector = ({ mood, setMood }) => {
  const moods = [
    { value: "Happy", emoji: "😊" },
    { value: "Normal", emoji: "😐" },
    { value: "Sad", emoji: "😔" },
    { value: "Angry", emoji: "😤" },
    { value: "Tired", emoji: "🥱" },
  ];

  return (
    <div className="mood-card">
      <h2 className="mood-title">Today’s Mood</h2>

      <div className="mood-list">
        {moods.map((m) => (
          <div
            key={m.value}
            className={`mood-item ${mood === m.value ? "selected" : ""}`}
            onClick={() => setMood(m.value)}
          >
            <span>{m.value}</span>
            <span>{m.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
