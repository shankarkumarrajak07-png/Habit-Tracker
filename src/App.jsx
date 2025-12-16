import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/SignUp/SignUpPage";

import Dashboard from "./pages/Dashboard/Dashboard";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import Onboarding from "./pages/Onboarding/Oboarding"
import Suggestions from "./pages/Suggestions/Suggestions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Onboarding flow */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/suggestions" element={<Suggestions />} />

        {/* Main app */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
