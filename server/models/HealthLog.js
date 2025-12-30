const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  water: String,
  sleep: String,
  steps: String,
  mood: String,
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("HealthLog", healthLogSchema);