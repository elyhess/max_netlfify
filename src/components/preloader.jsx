import React, { useState, useEffect } from "react";

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function handleLoad() {
      setTimeout(() => setLoaded(true), 100);
    }

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (loaded) return null;

  return <div id="preloader"></div>;
}
