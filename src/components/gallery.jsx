import { useState, useEffect, useRef, useCallback } from "react";

import img1 from "../img/gallery/537559271_18534893635013456_8827823801066106167_n.jpg";
import img2 from "../img/gallery/538954266_18535626007013456_7142549030697035430_n.jpg";
import img3 from "../img/gallery/539798801_1312522097147426_5573402057859173759_n.jpg";
import img4 from "../img/gallery/541238280_1121443593274203_5440303493025343501_n.jpg";
import img5 from "../img/gallery/542956568_25017381797847783_5370650190011473753_n.jpg";
import img6 from "../img/gallery/628032149_665167290020484_1090471901332782973_n.jpg";

const fallbackItems = [
  { id: 1, src: img1, alt: "Colorful beetle tattoo with eye and smiley face" },
  { id: 2, src: img2, alt: "Murakami-style flower tattoo with pixel art" },
  { id: 3, src: img3, alt: "Psychedelic cosmic angel tattoo with wings and yin-yang" },
  { id: 4, src: img4, alt: "Neon scorpion tattoo with smiley face" },
  { id: 5, src: img5, alt: "Retro tech collage tattoo with eyes and computers" },
  { id: 6, src: img6, alt: "Colorful Medusa chest piece with snakes and smiley eyes" },
];

const MOBILE_QUERY = "(max-width: 768px)";

function getPageSize() {
  return window.matchMedia(MOBILE_QUERY).matches ? 4 : 3;
}

export default function Gallery() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(getPageSize);
  const galleryRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data.length > 0) {
          setItems(data.map((img) => ({ id: img.id, src: img.src, alt: img.alt })));
        } else if (!cancelled) {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = () => setVisibleCount((prev) => {
      const newPageSize = getPageSize();
      return prev <= newPageSize ? newPageSize : prev;
    });
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const loading = items === null && !error;
  const galleryItems = items ?? (error ? fallbackItems : []);
  const visibleItems = galleryItems.slice(0, visibleCount);
  const hasMore = visibleCount < galleryItems.length;
  const showToggle = galleryItems.length > getPageSize();

  const handleToggle = useCallback(() => {
    if (hasMore) {
      const prevCount = visibleCount;
      setVisibleCount((c) => c + getPageSize());
      requestAnimationFrame(() => {
        const cards = galleryRef.current?.querySelectorAll(".gallery-item");
        if (cards && cards[prevCount]) {
          cards[prevCount].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    } else {
      setVisibleCount(getPageSize());
      document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hasMore, visibleCount]);

  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">
            Playful, psychedelic, and unapologetically its own lane
          </p>
        </div>
        <div className="gallery-grid" ref={galleryRef}>
          {loading
            ? Array.from({ length: getPageSize() }, (_, i) => (
                <div key={i} className="gallery-item gallery-skeleton" />
              ))
            : visibleItems.map((item) => (
                <div key={item.id} className="gallery-item">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="gallery-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
        </div>
        <div className="gallery-cta">
          {showToggle && !loading && (
            <button
              type="button"
              className="btn-neon btn-neon-primary"
              onClick={handleToggle}
            >
              {hasMore ? "Show more photos" : "Show less"}
            </button>
          )}
          <a
            href="https://www.instagram.com/maxvktattoos/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon btn-neon-outline"
          >
            See more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
