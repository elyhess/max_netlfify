import React, { useState, useEffect, useMemo } from "react";

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
  const [width, setWidth] = useState(() => Math.max(window.innerWidth, 2000));

  useEffect(() => {
    function handleResize() {
      setWidth(Math.max(window.innerWidth, 2000));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shadows = useMemo(() => {
    const h = 2000;
    return {
      s1: generateShadow(600, width, h, COLORS_1),
      s2: generateShadow(200, width, h, COLORS_2),
      s3: generateShadow(100, width, h, COLORS_3),
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
              top: 2000,
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
