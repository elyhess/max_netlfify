import { useEffect, useState } from "react";

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let timeoutId;

    function handleLoad() {
      timeoutId = window.setTimeout(() => setLoaded(true), 100);
    }

    if (document.readyState === "complete") {
      handleLoad();
    }

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (loaded) return null;

  return <div id="preloader"></div>;
}
