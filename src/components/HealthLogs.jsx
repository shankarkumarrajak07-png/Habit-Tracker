// HealthLogs.jsx
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../components/styles/HealthLogs.css";

/*
  HEALTH LOG COMPONENT
  -------------------------------------------------------
  - Allows user to record today's health stats:
      water intake, sleep hours, steps taken, mood
  - User can add this once every 24 hours
  - After saving, user can still edit individual fields anytime
  - Saves current day's values to localStorage for UI persistence
  - Shows beautiful toast messages for user feedback
*/

export const HealthLogs = () => {
  // Initial structure for health log record
  const initialLogs = {
    water: "",
    sleep: "",
    steps: "",
    mood: "",
  };

  // Current visible values in UI
  const [logs, setLogs] = useState(initialLogs);

  // Controls whether user is adding new daily health log
  const [isAdding, setIsAdding] = useState(false);

  // Temporary form used while filling new daily entry
  const [addForm, setAddForm] = useState(initialLogs);

  // Editing single fields after daily log is saved
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  /*
    -------------------------------------------------------
    LOAD SAVED VALUES ON FIRST MOUNT
    -------------------------------------------------------
    - If today's health log was already written earlier,
      page reload should still show those values
  */
  useEffect(() => {
    const saved = localStorage.getItem("healthLogs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch {
        setLogs(initialLogs);
      }
    }
  }, []);

  /*
    -------------------------------------------------------
    SAVE VISIBILE UI VALUES WHENEVER LOGS CHANGE
    -------------------------------------------------------
    - We persist the currently visible daily values
    - But NOT multiple-day history
  */
  useEffect(() => {
    localStorage.setItem("healthLogs", JSON.stringify(logs));
  }, [logs]);

  /*
    -------------------------------------------------------
    HEALTH LOG FIELDS
    -------------------------------------------------------
  */
  const rows = [
    { key: "sleep", label: "Sleep Hours" },
    { key: "water", label: "Water Intake" },
    { key: "steps", label: "Steps Taken" },
    { key: "mood", label: "Mood Today" },
  ];

  /*
    -------------------------------------------------------
    ADD NEW DAILY HEALTH LOG (ONCE IN 24 HOURS)
    -------------------------------------------------------
  */
  const handleAddClick = () => {
    const lastTime = localStorage.getItem("lastHealthLogTime");

    // If user already added today's log
    if (lastTime) {
      const hoursPassed =
        (Date.now() - Number(lastTime)) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        toast.error(
          "⏳ Today's health log already added. Use Edit to update values."
        );
        return;
      }
    }

    // Prefill form with currently visible values
    setAddForm(logs);
    setIsAdding(true);
  };

  const handleSaveNewLog = () => {
    // Save UI values
    setLogs(addForm);
    localStorage.setItem("healthLogs", JSON.stringify(addForm));

    // Mark that today's daily record is done
    localStorage.setItem("lastHealthLogTime", Date.now());

    // Close form
    setIsAdding(false);

    // Feedback
    toast.success("🩺 Today's health log saved!");
  };

  /*
    -------------------------------------------------------
    EDIT SINGLE FIELD ANYTIME (not restricted)
    -------------------------------------------------------
  */
  const startEditing = (fieldKey) => {
    setEditingField(fieldKey);
    setEditingValue(logs[fieldKey] || "");
  };

  const saveEdit = (fieldKey) => {
    const updated = {
      ...logs,
      [fieldKey]: editingValue,
    };

    setLogs(updated);
    localStorage.setItem("healthLogs", JSON.stringify(updated));

    const label = rows.find((r) => r.key === fieldKey).label;

    toast.success(`✨ Updated ${label}: ${editingValue}`);

    setEditingField(null);
    setEditingValue("");
  };

  /*
    -------------------------------------------------------
    COMPONENT RENDER
    -------------------------------------------------------
  */
  return (
    <div className="health-card">

      <h2 className="health-title">Today’s Health Logs</h2>

      <div className="health-list">
        {rows.map((row) => (
          <div className="health-row" key={row.key}>
            <span>{row.label}</span>

            {editingField === row.key ? (
              <>
                <input
                  className="health-edit-input"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                />
                <button
                  className="health-save-btn"
                  onClick={() => saveEdit(row.key)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="health-value">
                  {logs[row.key] || "--"}
                </span>
                <button
                  className="health-edit-btn"
                  onClick={() => startEditing(row.key)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}

        {/* ADD DAILY LOG */}
        <div className="health-row add-log-row" onClick={handleAddClick}>
          <span>Add new health log</span>
        </div>
      </div>

      {/* INLINE DAILY LOG FORM */}
      {isAdding && (
        <div className="health-add-form">
          <h3>Log today’s health</h3>

          <input
            type="text"
            placeholder="Water Intake (e.g. 2.5L)"
            value={addForm.water}
            onChange={(e) =>
              setAddForm({ ...addForm, water: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Sleep Hours (e.g. 7)"
            value={addForm.sleep}
            onChange={(e) =>
              setAddForm({ ...addForm, sleep: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Steps Taken (e.g. 5000)"
            value={addForm.steps}
            onChange={(e) =>
              setAddForm({ ...addForm, steps: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Mood (e.g. Happy)"
            value={addForm.mood}
            onChange={(e) =>
              setAddForm({ ...addForm, mood: e.target.value })
            }
          />

          <button
            className="health-add-save-btn"
            onClick={handleSaveNewLog}
          >
            Save today’s health log
          </button>
        </div>
      )}
    </div>
  );
};
