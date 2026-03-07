import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.pageYOffset > 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleSmoothScroll(e) {
      const href = e.currentTarget.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        setMenuOpen(false);
        const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }

    const links = document.querySelectorAll(
      'a.js-scroll[href*="#"]:not([href="#"])'
    );
    links.forEach((link) => link.addEventListener("click", handleSmoothScroll));
    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleSmoothScroll)
      );
    };
  }, []);

  return (
    <nav
      id="mainNav"
      ref={navRef}
      className={`navbar-main ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <div className="container navbar-inner">
        <a className="navbar-brand js-scroll" href="#home">
          MAX VK
        </a>
        <button
          className={`navbar-hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
          <a className="nav-link js-scroll" href="#home">Home</a>
          <a className="nav-link js-scroll" href="#gallery">Gallery</a>
          <a className="nav-link js-scroll" href="#faq">FAQ</a>
          <a className="nav-link js-scroll" href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}
