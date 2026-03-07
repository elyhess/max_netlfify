import React, { useState } from "react";
import logo2 from "../img/logo2.webp";

const faqData = [
  {
    id: "1",
    q: "How do I get tattooed by you?",
    a: "When I open my books I provide a contact form in my bio on Instagram. PLEASE do not contact me through Big Cartel or DM's on Instagram, I will not respond.",
  },
  {
    id: "2",
    q: "When do you open your books?",
    a: "I open my books for approximately 5-7 days every 2-3 months. Turn on post notifications on IG to make sure you don't miss it. I always give a heads up when I am going to open my books.",
  },
  {
    id: "3",
    q: "If I try to book while your books are closed, will you respond?",
    a: "No.",
  },
  {
    id: "4",
    q: "What types of projects do you take on?",
    a: "Anything that fits in my style of art. Trippy, disco, bright and colorful, etc. Look at my IG for the types of things I like to do.",
  },
  {
    id: "5",
    q: "What won't you tattoo?",
    a: "Anything that is not my style (i.e. realism, black and grey, script). I also do not under any circumstances finish, fix, or work on other artists work.",
  },
  {
    id: "6",
    q: "I sent a great idea but didn't hear back, why?",
    a: "I am only one person with a limited amount of time to book clients, I simply cannot book everyone every time I open my books. If you didn't get in the first time, please keep submitting ideas!",
  },
];

export default function About() {
  const [openId, setOpenId] = useState(null);

  function toggleFaq(id) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <section id="faq" className="section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">FAQ</h2>
          <p className="section-subtitle">Everything you need to know</p>
        </div>
        <div className="faq-layout">
          <div className="faq-list">
            {faqData.map((item) => (
              <div
                key={item.id}
                className={`faq-item glass-card ${openId === item.id ? "faq-open" : ""}`}
                onClick={() => toggleFaq(item.id)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-toggle">
                    {openId === item.id ? "−" : "+"}
                  </span>
                </div>
                <div
                  className={`faq-answer ${openId === item.id ? "faq-answer-open" : ""}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="faq-artwork hidden-mobile">
            <img src={logo2} alt="logo" className="faq-image" />
          </div>
        </div>
      </div>
    </section>
  );
}
