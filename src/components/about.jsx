import React from "react";
import logo2 from "../img/logo2.webp";

import { useMediaQuery } from 'react-responsive'


export default function About() {
  const isPortrait = useMediaQuery({ query: '(max-width: 750px)' })
  const imgWidth = isPortrait ? "50%" : "100%"
  const data = {
    logo: logo2, 
    about_me: [
      {
        id: "1",
        q: "How do I get tattooed by you?",
        a: "When I open my books I provide a contact form in my bio on Instagram. *PLEASE do not contact me through Big Cartel or DM's on Instagram, I will not respond.*"
      },
      {
        id: "2",
        q: "When do you open your books?",
        a: "I open my books for approximately 5-7 days every 2-3 months. Turn on post notifications on IG to make sure you don't miss it. I always give a heads up when I am going to open my books."
      },
      {
        id: "3",
        q: "If I try to book a tattoo with you while your books are closed will you respond or book me?",
        a: "No."
      },
      {
        id: "4",
        q: "What types of projects do you take on?",
        a: "Anything that fits in my style of art. Trippy, disco, bright and colorful, etc. Look at my IG for the types of things I like to do."
      },
      {
        id: "5",
        q: "What won't you tattoo?",
        a: "Anything that is not my style (i.e. realism, black and grey, script). I also do not under any circumstances finish, fix, or work on other artists work."
      },
      {
        id: "6",
        q: "I sent a great idea that fits in your style and didn't hear back, why?",
        a: "I am only one person with a limited amount of time to book clients, I simply cannot book everyone every time I open my books. If you didn't get in the first time, please keep submitting ideas!"
      }
    ]
  };
  return (
    <section id="about" className="about-mf sect-pt4 route">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="box-shadow-full">
              <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                          <img
                            src={data.logo}
                            alt="logo"
                            style={{ width: imgWidth, margin: "0 auto", textAlign: "center"}}
                          /> 
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="about-me pt-4 pt-md-0">
                    <div className="title-box-2">
                      <h5 className="title-left">FAQ</h5>
                    </div>
                    {data.about_me.map(content => (
                        <div className="lead" key={content.id}>
                          <div className="faq-q" key={content.id}>Q: {content.q}</div>
                          <br></br>
                          <span className="faq-q">A:</span> {content.a}
                          <br></br>
                          <br></br>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

