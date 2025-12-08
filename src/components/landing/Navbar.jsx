import{Link} from "react-router-dom";
import Buttons from "../ui/Button";
export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Habitus</h1>

      <ul className="nav-links">
        <li>Home</li>
        <li>Feature</li>
        <li>About Us</li>
      </ul>
      <Link to="/login">
        <Buttons className='login-btn'>Login</Buttons>
      </Link>
    </nav>
  );
}
