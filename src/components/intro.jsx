import React, {useState} from "react";
import "./stars.scss";
import Typed from "react-typed";

export default function Intro() {
  // const [clicked, setClicked] = useState(false)
  // const changeState = () => {  
  //   setClicked(true)
  //   setTimeout(function(){
  //     setClicked(false)
  // }, 2000);
  //  }; 

  return (
    // <div id="home" className="intro route bg-image " style={{backgroundImage: "url("+bigImage+")"}}>
    <div id="home" className="intro route bg-image background">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />

      <div className="intro-content display-table">
        <div className="table-cell">
          <div className="container">
            <h1 className="intro-title mb-4">MAX VK TATTOOS</h1>
            <p className="intro-subtitle">
              <span className="text-slider-items"></span>
              <strong className="text-slider">
                <Typed
                  strings={[
                    "✨Trippy tats for groovy cats✨"
                  ]}
                  typeSpeed={80}
                  backDelay={3000}
                  backSpeed={30}
                  loop
                />
              </strong>
            </p>
            <p className="pt-3">
              <a
                  className="btn btn-primary rainbow-button btn js-scroll px-4"
                  href="#work"
                  role="button"    
                  // className="btn btn-primary btn js-scroll px-4"

              >
                  View My Work
                </a>
                </p>      
          </div>
        </div>
      </div>
    </div>
  );
}

