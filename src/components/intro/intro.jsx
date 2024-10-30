import React, { useState, useEffect } from "react";
import "./intro.css";

export default function Intro() {
  return (
    <div className="intro-container">
      <span style={{ fontSize: "40px" }}>
        All Your Daily Essentials in One Place!
      </span>
      <p>
        From fresh groceries to reliable hardware, we’ve got everything you need
        to keep your home running smoothly. Explore our extensive selection of
        household staples, delivered straight to your door
      </p>
    </div>
  );
}

export function IntroCarousel() {
  const images = [
    "https://via.placeholder.com/600x300?text=Image+1",
    "https://via.placeholder.com/600x300?text=Image+2",
    "https://via.placeholder.com/600x300?text=Image+3",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div className="carousel-container">
      <div
        style={{
          width: "90vw",
          aspectRatio: "1.5/1",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "pink",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease",
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ width: "90vw", aspectRatio: "1.5/1", flexShrink: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
