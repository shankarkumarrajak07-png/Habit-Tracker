import habitus from "../../assets/habitus.png";
import { Link } from "react-router-dom";
import Buttons from "../ui/Button";
export default function Navbar() {
  return (
    <nav className="navbar"><span><img src={habitus} alt="logo" className="logo-img" /></span>
      <h1 className="logo">
        Habit<span className="gradient-text">us</span>
      </h1>

      <ul className="nav-links">

        <li>
          <a href="#home">Home</a>
        </li>

        <li>
          <a href="#feature">Feature</a>
        </li>

        <li>
          <a href="#about">About Us</a>
        </li>

      </ul>

      <Link to="/login">
        <Buttons className='login-btn'>Login</Buttons>
      </Link>
    </nav>
  );
}
