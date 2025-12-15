import{Link} from "react-router-dom";
import Buttons from "../ui/Button";
import "../../styles/SignUp.css";

export default function SignUpForm() {
  return (
    <form className="signup-form">

      <div className="input-group">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your name" />
      </div>

      <div className="input-group">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />
      </div>

      <div className="input-group">
        <label>Password</label>
        <input type="password" placeholder="Create a password" />
      </div>

      <div className="input-group">
        <label>Confirm Password</label>
        <input type="password" placeholder="Re-enter your password" />
      </div>

      <Buttons className="signup-btn">Create Account</Buttons>

      <p className="signup-switch">
        Already have an account? <Link to="/login" >
        <span>Login</span> </Link>
      </p>
    </form>
  );
}
