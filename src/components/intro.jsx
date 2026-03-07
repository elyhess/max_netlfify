import React from "react";
import logo from "../img/logo5.png";

export default function Intro() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-logo-wrapper">
          <img src={logo} alt="logo" className="hero-logo" />
        </div>
        <h1 className="hero-title">MAX VK TATTOOS</h1>
        <p className="hero-subtitle">Trippy &bull; Colorful &bull; Custom</p>
        <div className="hero-buttons">
          <a className="btn-neon btn-neon-primary js-scroll" href="#contact">
            Book Now
          </a>
          <a className="btn-neon btn-neon-outline js-scroll" href="#gallery">
            View Work
          </a>
        </div>
      </div>
    </section>
  );
}
