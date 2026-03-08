import { useEffect, useMemo, useState } from "react";

const COLORS_1 = ["#FFF"];
const COLORS_2 = [
  "#FFF", "#FFF", "#FFF", "#FFF",
  "#faeb0b", "#faeb0b",
  "#f41dcf", "#f41dcf",
  "#1990fe",
];
const COLORS_3 = [
  "#1990fe", "#1990fe", "#1990fe",
  "#f41dcf", "#f41dcf",
  "#faeb0b",
  "#FFF",
];
const STARFIELD_HEIGHT = 2000;

function generateShadow(count, width, height, colors) {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const color = colors[Math.floor(Math.random() * colors.length)];
    parts.push(`${x}px ${y}px ${color}`);
  }
  return parts.join(", ");
}

export default function Stars() {
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? STARFIELD_HEIGHT : Math.max(window.innerWidth, STARFIELD_HEIGHT)
  );

  useEffect(() => {
    function handleResize() {
      setWidth(Math.max(window.innerWidth, STARFIELD_HEIGHT));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shadows = useMemo(() => {
    return {
      s1: generateShadow(600, width, STARFIELD_HEIGHT, COLORS_1),
      s2: generateShadow(200, width, STARFIELD_HEIGHT, COLORS_2),
      s3: generateShadow(100, width, STARFIELD_HEIGHT, COLORS_3),
    };
  }, [width]);

  const layers = [
    { shadow: shadows.s1, size: 2, duration: 50, blur: 0.5 },
    { shadow: shadows.s2, size: 3, duration: 100, blur: 0.7 },
    { shadow: shadows.s3, size: 4, duration: 150, blur: 1 },
  ];

  return (
    <div className="stars-container">
      {layers.map((layer, i) => (
        <div
          key={i}
          className="star-layer"
          style={{
            width: layer.size,
            height: layer.size,
            boxShadow: layer.shadow,
            filter: `blur(${layer.blur}px)`,
            animation: `animStar ${layer.duration}s linear infinite`,
          }}
        >
          <div
            style={{
              position: "relative",
              top: STARFIELD_HEIGHT,
              width: layer.size,
              height: layer.size,
              boxShadow: layer.shadow,
            }}
          />
        </div>
      ))}
    </div>
  );
}
