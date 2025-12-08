import LoginForm from "../components/auth/LoginForm";
import "../styles/Login.css";

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">

        <h1 className="login-title">Welcome Back </h1>
        <p className="login-subtitle">
          Login to continue your habit tracking journey.
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
