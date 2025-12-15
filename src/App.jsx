<<<<<<< Updated upstream
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
=======
import  {BrowserRouter, Routes, Route}  from "react-router-dom";
import  Dashboard  from "./pages/Dashboard/Dashboard";
import  History  from "./pages/History/History"
import Profile from "./pages/Profile/Profile";
import ProfileEdit from "./pages/Profile/ProfileEdit"
import  Onboarding from "./pages/Onboarding/Oboarding";
import  Suggestions  from "./pages/Suggestions/Suggestions";
import LandingPage from "./pages/Landing/LandingPage";
import SignUpPage from "./pages/SignUp/SignUpPage";
import LoginPage from "./pages/Login/LoginPage";
>>>>>>> Stashed changes

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
=======
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* After login */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/suggestions" element={<Suggestions />} />

        {/* Main app */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
>>>>>>> Stashed changes
      </Routes>
    </BrowserRouter>
  );
}
<<<<<<< Updated upstream
=======

export default App;
>>>>>>> Stashed changes
