
import React, { useEffect } from "react";
import { Wind, Cloud } from "lucide-react";

const GhibliFloatingElements = () => {
  useEffect(() => {
    // Add floating elements for Ghibli effect
    const createFloatingElement = () => {
      const element = document.createElement("div");
      element.classList.add("ghibli-cloud");

      const size = Math.random() * 70 + 30;
      element.style.width = `${size}px`;
      element.style.height = `${size / 2}px`;

      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      element.style.left = `${posX}px`;
      element.style.top = `${posY}px`;

      document.querySelector(".floating-elements")?.appendChild(element);

      setTimeout(() => {
        element.style.left = `${posX + 200}px`;
        element.style.opacity = "0";
        setTimeout(() => element.remove(), 15000);
      }, 100);
    };

    const elemInterval = setInterval(createFloatingElement, 7000);
    for (let i = 0; i < 3; i++) createFloatingElement();

    return () => {
      clearInterval(elemInterval);
    };
  }, []);

  return (
    <>
      <div className="floating-elements absolute inset-0 pointer-events-none overflow-hidden"></div>
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 text-ghibli-blue/20 animate-float hidden md:block">
        <Cloud size={60} />
      </div>
      <div className="absolute bottom-20 right-10 w-12 h-12 text-ghibli-green/20 animate-float hidden md:block" style={{ animationDelay: "3s" }}>
        <Cloud size={50} />
      </div>
      <div className="absolute top-40 right-20 w-16 h-16 text-ghibli-purple/20 animate-sway hidden md:block">
        <Wind size={50} />
      </div>
    </>
  );
};

export default GhibliFloatingElements;
