import{Link} from "react-router-dom";
import React from "react";
export default function Hero() {
  return (
    <section className="hero">
      <div className="circle c1"></div>
      <div className="circle c2"></div>
      <div className="circle c3"></div>
      <div className="circle c4"></div>
      <div className="circle c5"></div>
      <div className="circle c6"></div>
      <div className="circle c7"></div>
      <div className="circle c8"></div>
      <div className="circle c9"></div>
      <div className="circle c10"></div>
      <div className="circle c11"></div>
      <div className="circle c12"></div>
      <div className="circle c13"></div>
      <div className="circle c14"></div>
      <div className="circle c15"></div>
      <div className="circle c16"></div>
      <div className="circle c17"></div>
      <div className="circle c18"></div>
      <div className="circle c19"></div>
      <div className="circle c20"></div>
      

      <h1 className="hero-title">
        Build Better Habits. <br /> One Day at a Time.
      </h1>

      <p className="hero-sub">
        Track your daily routines, stay consistent, and turn goals into habits — all in one beautiful app. <br />
        Start your journey to a more productive you today!
      </p>

     
        <div className="hero-btn-wrapper">
  <Link to="/signup" style ={{ textDecoration: 'none' }}>
  <button className="cssbuttons-io-button">
    Get started
    <div className="icon">
      <svg
        height="24"
        width="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  </button>
  </Link>
</div>

     
    </section>
  );
}
