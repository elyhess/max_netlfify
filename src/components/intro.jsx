import React from "react";
import "./stars.scss";
import logo from "../img/logo5.png";
import { useMediaQuery } from 'react-responsive'

export default function Intro() {
  const isPortrait = useMediaQuery({ query: '(max-width: 750px)' })

  const imgWidth = isPortrait ? "50%" : "20%"

  return (
    <div id="home" className="intro route bg-image background">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />


      <div className="intro-content display-table">
        <div className="table-cell">
          <div className="container mb-25">
            <span className="text-slider-items"></span>
            {isPortrait ? (
              <div className="row pb-4">
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: imgWidth,
                    margin: "0 auto",
                    textAlign: "center",
                    transform: "rotate(05deg)", // Add rotation here
                  }} />
              </div>
            ) : (
              <div className="row pb-4 mb-18">
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: imgWidth,
                    margin: "0 auto",
                    textAlign: "center",
                    transform: "rotate(05deg)", // Add rotation here
                  }}
                />
              </div>
            )}
            <h1 className="intro-title">MAX VK TATTOOS</h1>
            <p className="pt-3">
              <a
                className="btn btn-primary b-block px-4 js-scroll"
                href="#contact"
                role="button"
              >
                Contact
              </a>
            </p>
            <p className="pt-3">
              <a
                className="btn btn-primary b-block px-4 js-scroll"
                href="#about"
                role="button"
              >
                FAQ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}

