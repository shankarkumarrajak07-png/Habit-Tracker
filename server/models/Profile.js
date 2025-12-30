const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number, required: true, min: 1, max: 120 },
    height: { type: Number, required: true, min: 50, max: 300 },
    weight: { type: Number, required: true, min: 10, max: 500 },
    bmi: { type: Number, required: true },
    bmiStatus: {
      type: String,
      enum: ["Underweight", "Normal Weight", "Overweight", "Obese"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);