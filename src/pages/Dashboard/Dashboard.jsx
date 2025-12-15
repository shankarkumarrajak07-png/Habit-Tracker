// Dashboard.jsx
import Lottie from "lottie-react";
import welcomeAnim from "../../assets/animations/welcome.json";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import  Header  from "../../components/Header/Header"
import { DailyHabits } from "../../components/DailyHabits/DailyHabits";
import { HealthLogs } from "../../components/HealthLogs/HealthLogs";
import { MoodSelector } from "../../components/MoodSelector/MoodSelector";
import { ProgressDonut } from "../../components/ProgressDonut/ProgressDonut";
import Footer from "../../components/Footer/Footer";

import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";

import toast, { Toaster } from "react-hot-toast";
import { WeeklySleepChart } from "../../components/Charts/WeeklySleepChart";
import { WeeklyStepsChart } from "../../components/Charts/WeeklyStepsChart";
import { WeeklyWaterChart } from "../../components/Charts/WeeklyWaterChart";
import { WeeklyMoodChart } from "../../components/Charts/WeeklyMoodChart";

export default function Dashboard() {
  const [dateTime, setDateTime] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [weather, setWeather] = useState(null);
  const [mood, setMood] = useState("");
  const [progress, setProgress] = useState(0);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  

  /* -------------------------- LIVE CLOCK -------------------------- */
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ------------------- STREAK LOAD ON START ----------------------- */
  useEffect(() => {
    const savedStreak = localStorage.getItem("userStreak");
    if (savedStreak) setStreak(Number(savedStreak));
  }, []);

  /* ------------------- INCREASE STREAK ----------------------------- */
  const increaseStreak = () => {
    const lastUpdated = localStorage.getItem("lastStreakUpdate");

    if (!lastUpdated) {
      const updated = streak + 1;
      setStreak(updated);
      localStorage.setItem("userStreak", updated);
      localStorage.setItem("lastStreakUpdate", Date.now());
      toast.success(`🔥 Streak maintained! Current streak: ${updated} days`, {
        position: "top-center"
      });
      const badge = document.querySelector(".streak-badge");
      badge.classList.add("success-pulse");
      setTimeout(() => badge.classList.remove("success-pulse"), 600);
      return;
    }

    const hoursPassed = (Date.now() - Number(lastUpdated)) / (1000 * 60 * 60);

    if (hoursPassed < 24) {
      toast.error(
        `⏳ You must wait ${(24 - hoursPassed).toFixed(1)} hours to maintain streak again`,
        { position: "top-center" }
      );
      return;
    }

    const updated = streak + 1;
    setStreak(updated);
    localStorage.setItem("userStreak", updated);
    localStorage.setItem("lastStreakUpdate", Date.now());
    toast.success(`🔥 Streak maintained! Current streak: ${updated} days`, {
      position: "top-center"
    });
  };

  /* ------------------------ WEATHER FETCH -------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.weather || !data.weather[0]) return;

            setWeather({
              status: data.weather[0].main,
              temp: data.main.temp,
              feelsLike: data.main.feels_like,
              high: data.main.temp_max,
              low: data.main.temp_min,
              city: data.name,
            });
          });
      },
      () => console.log("Location permission denied")
    );
  }, []);

  return (
    <div className="dashboard-page">
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#ffffff",
              color: "#111",
            },
          },
          error: {
            style: {
              background: "#ff4d4d",
              color: "white",
            },
          },
        }}
      />
      {/* HEADER */}
      <Header />

      <div className="dashboard-container">
        {/* WEATHER LOADING STATE */}
        {!weather ? (
          <div className="weather-loading">Loading weather...</div>
        ) : (
          <div className="dashboard-content">
            {/* WELCOME CARD */}
            <div className="dashboard-welcome-card">
              {/* LEFT SIDE */}
              <div className="welcome-left">
                <h1>Hello, Nikita!</h1>

                <h3>
                  {dateTime.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </h3>

                <p className="datetime">
                  {dateTime.toLocaleDateString()} ·
                  {dateTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <h2>{weather.temp}° C</h2>

                <p>
                  High: {weather.high} · Low: {weather.low}
                </p>

                <span className="city-pin">📍 {weather.city}</span>
              </div>

              {/* RIGHT SIDE */}
              <div className="welcome-right">
                <div className="streak-badge" onClick={increaseStreak}>
                  🔥 {streak} day streak
                </div>

                <div className="animation-container">
                  <Lottie
                    animationData={welcomeAnim}
                    loop={true}
                    className="welcome-animation"
                  />
                </div>

                <div className="weather-block">
                  <div className="weather-main-icon">
                    {weather.status === "Clear" && <WiDaySunny size={65} />}
                    {weather.status === "Clouds" && <WiCloudy size={65} />}
                    {weather.status === "Rain" && <WiRain size={65} />}
                    {weather.status === "Snow" && <WiSnow size={65} />}
                    {weather.status === "Thunderstorm" && (
                      <WiThunderstorm size={65} />
                    )}
                    {["Mist", "Fog", "Haze", "Smoke", "Dust"].includes(
                      weather.status
                    ) && <WiFog size={65} />}
                  </div>

                  <div className="weather-text">
                    <h3>{weather.status}</h3>
                    <p>Feels like {weather.feelsLike}°C</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== ROW 1 ===================== */}
            <div className="section-container">
              <div className="section-header-pill">Daily Habit & Health Logs</div>
              <div className="cards-row">
                <DailyHabits setProgress={setProgress} />
                <ProgressDonut progress={progress} />
              </div>
            </div>

            {/* ===================== ROW 2 ===================== */}
            <div className="section-container">
              <div className="section-header-pill">Mood & Daily Productivity</div>
              <div className="cards-row">
                <HealthLogs mood={mood} />
                <MoodSelector mood={mood} setMood={setMood} />
              </div>
            </div>

            {/* ===================== ROW 3 (CHARTS) ===================== */}
            <div className="section-container">
              <div className="section-header-pill">Weekly Health Analytics</div>
              <div className="charts-grid">
                <WeeklySleepChart />
                <WeeklyStepsChart />
                <WeeklyWaterChart />
                <WeeklyMoodChart />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};