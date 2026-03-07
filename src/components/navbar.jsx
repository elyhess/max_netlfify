import React, { useEffect, useRef } from "react";

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    function handleSmoothScroll(e) {
      const href = e.currentTarget.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 5;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }

    const links = document.querySelectorAll('a.js-scroll[href*="#"]:not([href="#"])');
    links.forEach((link) => link.addEventListener("click", handleSmoothScroll));
    return () => {
      links.forEach((link) => link.removeEventListener("click", handleSmoothScroll));
    };
  }, []);

  return <nav id="mainNav" ref={navRef}></nav>;
}
