const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const healthLogRoutes = require("./routes/healthLogRoutes");
const streakRoutes = require("./routes/streakRoutes");
const habitListRoutes = require("./routes/habitListRoutes");
const habitItemRoutes = require("./routes/habitItemRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/health", healthLogRoutes);
app.use("/api/streak",streakRoutes);
app.use("/api/habit-lists", habitListRoutes);
app.use("/api/habit-items", habitItemRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/history", historyRoutes);

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

