// DailyHabits.jsx
import React, { useState, useEffect } from "react";
import "../components/styles/DailyHabits.css";

/*
  DAILY HABITS COMPONENT
  -------------------------------------------------------
  - Allows user to add habits for the day
  - Supports marking habits completed (checkbox)
  - Supports editing and deleting habits
  - Saves habits to localStorage so UI persists
  - Sends progress % to parent component via setProgress
*/

export const DailyHabits = ({ setProgress }) => {
  // All habit entries for today
  const [habits, setHabits] = useState([]);

  // Controlled input for creating a new habit
  const [newHabit, setNewHabit] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  /*
    -------------------------------------------------------
    LOAD SAVED HABITS ON COMPONENT MOUNT
    -------------------------------------------------------
    - When component first loads, read habits from localStorage
    - This allows page reloads without losing UI state
  */
  useEffect(() => {
    const saved = localStorage.getItem("dailyHabits");
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  /*
    -------------------------------------------------------
    SAVE HABITS WHENEVER THEY CHANGE
    -------------------------------------------------------
    - Each time habits array updates, store the latest snapshot
    - This ensures UI does not reset after refresh
  */
  useEffect(() => {
    localStorage.setItem("dailyHabits", JSON.stringify(habits));
  }, [habits]);

  /*
    -------------------------------------------------------
    CALCULATE PROGRESS % AND UPDATE DONUT
    -------------------------------------------------------
    - We compute how many habits are completed out of total
    - Then send progress up to Dashboard through setProgress()
    - This dynamically updates your donut component
  */
  useEffect(() => {
    if (!setProgress) return; // if parent did not pass progress handler

    const total = habits.length;
    const completed = habits.filter((h) => h.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    setProgress(percent);
  }, [habits]);

  /*
    -------------------------------------------------------
    ADD HABIT
    -------------------------------------------------------
  */
  const addHabit = () => {
    if (!newHabit.trim()) return;

    const newEntry = {
      id: Date.now(), // unique habit identifier
      name: newHabit,
      completed: false,
    };

    setHabits([...habits, newEntry]);
    setNewHabit("");
  };

  /*
    -------------------------------------------------------
    MARK HABIT COMPLETED / UNCOMPLETED
    -------------------------------------------------------
  */
  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  /*
    -------------------------------------------------------
    EDIT HABIT NAME
    -------------------------------------------------------
  */
  const startEditing = (habit) => {
    setEditingId(habit.id);
    setEditingText(habit.name);
  };

  const saveHabit = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, name: editingText } : h
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  /*
    -------------------------------------------------------
    DELETE HABIT
    -------------------------------------------------------
  */
  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  /*
    -------------------------------------------------------
    COMPONENT RENDER
    -------------------------------------------------------
  */
  return (
    <div className="daily-habits-card ">
      <h2 className="habits-title">Daily Habits</h2>

      {/* NEW HABIT INPUT */}
      <div className="add-habit-row">
        <input
          type="text"
          placeholder="Enter new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      {/* HABIT LIST */}
      <div className="habit-list">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`habit-item ${habit.completed ? "done" : ""}`}
          >
            {/* VISUAL CHECKBOX */}
            <div
              className="habit-checkbox"
              onClick={() => toggleHabit(habit.id)}
            >
              {habit.completed && <span className="checkmark">✓</span>}
            </div>

            {/* HABIT NAME (EDIT OR VIEW MODE) */}
            {editingId === habit.id ? (
              <input
                className="edit-input"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <p onClick={() => toggleHabit(habit.id)}>{habit.name}</p>
            )}

            {/* ACTION BUTTONS */}
            <div className="habit-actions">
              {editingId === habit.id ? (
                <button className="save-btn" onClick={() => saveHabit(habit.id)}>
                  Save
                </button>
              ) : (
                <button className="edit-btn" onClick={() => startEditing(habit)}>
                  Edit
                </button>
              )}

              <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
