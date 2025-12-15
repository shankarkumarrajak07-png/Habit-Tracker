import{Link} from "react-router-dom";
import Buttons from "../ui/Button";
import habitus from "../../assets/habitus.png";
export default function CTA() {
  return (
    <section className="cta">
      <span><img src={habitus} alt="logo" className="logo-cta"/></span>
      <h2 className="cta-title">Ready to build better habits?</h2>

      <p className="cta-text">
        Take control of your daily routines and start meaningful progress — one habit at a time.
        <br />
        Join thousands of users who are transforming their lives with Habitus.
        <br />
        
      </p>
      <Link to="/signup" >
      <Buttons className="cta-btn">Start Tracking — It’s Free</Buttons>
      </Link>
    </section>
  );
}
