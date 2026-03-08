import { useState } from "react";
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
    a: "I keep my books open only a few times a year for a limited window. Turn on post notifications on IG to make sure you don't miss it. I always give a heads up when I am going to open my books.",
  },
  {
    id: "3",
    q: "If I try to book while your books are closed, will you respond?",
    a: "No.",
  },
  {
    id: "4",
    q: "What types of projects do you take on?",
    a: "Anything that aligns with my vibrant style — trippy, disco-infused, bright and colorful. My work is playful, psychedelic, and unapologetically its own lane. Check my IG for examples.",
  },
  {
    id: "5",
    q: "What won't you tattoo?",
    a: "No realism, no black-and-grey, no reworks — just original art straight from the heart and imagination, built from scratch. I do not under any circumstances finish, fix, or work on other artists' work.",
  },
  {
    id: "6",
    q: "I sent a great idea but didn't hear back, why?",
    a: "I am only one person with a limited amount of time to book clients. I simply cannot book everyone every time I open my books. If you didn't get in the first time, please keep submitting ideas!",
  },
];

export default function About() {
  const [openId, setOpenId] = useState(null);

  function toggleFaq(id) {
    setOpenId((currentOpenId) => (currentOpenId === id ? null : id));
  }

  return (
    <section id="faq" className="section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">FAQ</h2>
          <p className="section-subtitle">
            Original art from the heart &amp; imagination
          </p>
        </div>
        <div className="faq-layout">
          <div className="faq-list">
            {faqData.map((item) => (
              <div
                key={item.id}
                className={`faq-item glass-card ${openId === item.id ? "faq-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={openId === item.id}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span>{item.q}</span>
                  <span className="faq-toggle" aria-hidden="true">
                    {openId === item.id ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={`faq-answer-${item.id}`}
                  className={`faq-answer ${openId === item.id ? "faq-answer-open" : ""}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="faq-artwork hidden-mobile">
            <img src={logo2} alt="logo" className="faq-image" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}
