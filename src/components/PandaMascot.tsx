
import React from "react";

interface PandaMascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const dimensionMap = {
  sm: 60,
  md: 100,
  lg: 140,
};

const PandaMascot: React.FC<PandaMascotProps> = ({ size = "md", className = "" }) => {
  const dim = dimensionMap[size];
  return (
    <div
      className={`relative ${className}`}
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow"
      >
        {/* Bamboo pattern bg */}
        <defs>
          <pattern id="bamboo" patternUnits="userSpaceOnUse" width="24" height="32">
            <rect x="10" y="2" width="4" height="28" rx="2" fill="#BCD77F" />
            <rect x="10" y="2" width="4" height="5" rx="1.5" fill="#A2C94B" opacity="0.4"/>
            <rect x="10" y="13" width="4" height="4" rx="1.5" fill="#A2C94B" opacity="0.4"/>
            <rect x="10" y="22" width="4" height="4" rx="1.5" fill="#A2C94B" opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="128" height="128" fill="url(#bamboo)" opacity="0.13"/>

        {/* Body */}
        <ellipse cx="64" cy="78" rx="40" ry="36" fill="#fff" />
        {/* Head shadow */}
        <ellipse cx="64" cy="94" rx="30" ry="12" fill="#000" opacity="0.08" />

        {/* Ears */}
        <ellipse cx="34" cy="35" rx="17" ry="18" fill="#252626" />
        <ellipse cx="94" cy="35" rx="17" ry="18" fill="#252626" />

        {/* Head */}
        <ellipse cx="64" cy="52" rx="36" ry="33" fill="#FFF" stroke="#EEE" strokeWidth="2"/>

        {/* Panda eye spots */}
        <ellipse cx="45" cy="54" rx="9" ry="13" fill="#252626" />
        <ellipse cx="83" cy="54" rx="9" ry="13" fill="#252626" />

        {/* Eyes (white) */}
        <ellipse cx="45" cy="56" rx="4" ry="5" fill="#fff" />
        <ellipse cx="83" cy="56" rx="4" ry="5" fill="#fff" />

        {/* Pupils */}
        <ellipse cx="45" cy="58" rx="2" ry="2.5" fill="#252626" />
        <ellipse cx="83" cy="58" rx="2" ry="2.5" fill="#252626" />

        {/* Blush (Ghibli pink) */}
        <ellipse cx="38" cy="73" rx="6" ry="2.5" fill="#F19CBB" opacity="0.6"/>
        <ellipse cx="90" cy="73" rx="6" ry="2.5" fill="#F19CBB" opacity="0.6"/>

        {/* Nose */}
        <ellipse cx="64" cy="66" rx="4" ry="2.5" fill="#252626" />
        {/* Mouth */}
        <path
          d="M60 74 Q 64 78 68 74"
          stroke="#888"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default PandaMascot;
