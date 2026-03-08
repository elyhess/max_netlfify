import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.pageYOffset > 50);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleNavClick(event, href) {
    if (!href.startsWith("#") || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    setMenuOpen(false);

    const navHeight = navRef.current?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

    window.scrollTo({ top, behavior: "smooth" });
  }

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
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          type="button"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <div
          id="primary-navigation"
          className={`navbar-links ${menuOpen ? "show" : ""}`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="nav-link js-scroll"
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
