import SignUpForm from "../components/auth/SignUpForm";
import "../styles/SignUp.css";

export default function SignUpPage() {
  return (
    <div className="signup-container">
      <div className="signup-box">

        <h2 className="signup-title">Create Account </h2>
        <p className="signup-subtitle">
          Start your journey to building better habits.
        </p>

        <SignUpForm />
      </div>
    </div>
  );
}
