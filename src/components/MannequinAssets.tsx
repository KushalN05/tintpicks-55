import React from 'react';

// Common props for clothing items
export interface GarmentProps extends React.SVGProps<SVGSVGElement> {
  fillColor?: string;
  isActive?: boolean;
}

export const HumanoidBase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Head & Neck */}
    <path d="M150,40 C130,40 120,60 120,80 C120,100 135,110 150,110 C165,110 180,100 180,80 C180,60 170,40 150,40 Z" fill="#e3e2e0" stroke="#c8c5cb" strokeWidth="2" />
    {/* Torso & Arms */}
    <path d="M120,110 C100,120 90,130 80,150 L60,290 L80,300 L100,180 L110,180 L110,310 L145,310 L145,440 L120,540 L140,550 L150,530 L160,550 L180,540 L155,440 L155,310 L190,310 L190,180 L200,180 L220,300 L240,290 L220,150 C210,130 200,120 180,110 Z" fill="#e3e2e0" stroke="#c8c5cb" strokeWidth="2" />
  </svg>
);

export const Shorts: React.FC<GarmentProps> = ({ fillColor = "transparent", isActive, ...props }) => (
  <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M115,310 L185,310 L190,400 L155,395 L150,330 L145,395 L110,400 Z" 
      fill={fillColor} 
      stroke={isActive ? "#000" : "#4b5563"} 
      strokeWidth={isActive ? 3 : 2} 
      className="transition-all duration-300 drop-shadow-sm"
    />
  </svg>
);

export const Trousers: React.FC<GarmentProps> = ({ fillColor = "transparent", isActive, ...props }) => (
  <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M115,310 L185,310 L190,450 L165,545 L145,545 L150,400 L155,545 L135,545 L110,450 Z" 
      fill={fillColor} 
      stroke={isActive ? "#000" : "#4b5563"} 
      strokeWidth={isActive ? 3 : 2}
      className="transition-all duration-300 drop-shadow-sm"
    />
  </svg>
);

export const TShirt: React.FC<GarmentProps> = ({ fillColor = "transparent", isActive, ...props }) => (
  <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M130,115 C140,125 160,125 170,115 L210,145 L200,180 L190,175 L185,315 L115,315 L110,175 L100,180 L90,145 Z" 
      fill={fillColor} 
      stroke={isActive ? "#000" : "#4b5563"} 
      strokeWidth={isActive ? 3 : 2}
      className="transition-all duration-300 drop-shadow-sm"
    />
  </svg>
);

export const Shirt: React.FC<GarmentProps> = ({ fillColor = "transparent", isActive, ...props }) => (
  <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M130,110 L150,130 L170,110 L220,155 L205,290 L190,285 L185,320 L115,320 L110,285 L95,290 L80,155 Z" 
      fill={fillColor} 
      stroke={isActive ? "#000" : "#4b5563"} 
      strokeWidth={isActive ? 3 : 2}
      className="transition-all duration-300 drop-shadow-sm"
    />
    <line x1="150" y1="130" x2="150" y2="320" stroke={isActive ? "#000" : "#4b5563"} strokeWidth="1" />
  </svg>
);

export const Jacket: React.FC<GarmentProps> = ({ fillColor = "transparent", isActive, ...props }) => (
  <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M125,115 C140,125 160,125 175,115 L230,160 L215,300 L195,295 L190,325 L110,325 L105,295 L85,300 L70,160 Z" 
      fill={fillColor} 
      stroke={isActive ? "#000" : "#4b5563"} 
      strokeWidth={isActive ? 3 : 2}
      className="transition-all duration-300 drop-shadow-md"
    />
    <line x1="150" y1="120" x2="150" y2="325" stroke={isActive ? "#000" : "#4b5563"} strokeWidth="2" />
  </svg>
);
