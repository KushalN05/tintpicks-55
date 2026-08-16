import React from 'react';

export interface GarmentProps extends React.HTMLAttributes<HTMLDivElement> {
  fillColor?: string;
  isActive?: boolean;
}

// Helper wrapper to ensure all SVGs share the exact same bounding box and styling logic
const GarmentSVG: React.FC<GarmentProps & { children: React.ReactNode }> = ({ 
  fillColor = "transparent", 
  isActive, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={`relative w-full h-full ${className || ''}`} {...props}>
      <svg 
        viewBox="0 0 320 520" 
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-all duration-300 ${isActive ? 'scale-105 drop-shadow-xl z-50' : 'drop-shadow-sm z-10'}`}
        style={{ pointerEvents: 'none' }} // Let the div handle pointer events
      >
        {/* Inject fillColor into the child paths where appropriate by passing context or just assuming the children use currentColor, but it's easier to clone Element */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // If the child is the main colored path (we'll add a data-main attribute to it)
            if (child.props['data-main']) {
              return React.cloneElement(child as React.ReactElement, { fill: fillColor !== 'transparent' ? fillColor : '#FFFFFF' });
            }
            return child;
          }
          return child;
        })}
      </svg>
    </div>
  );
};

export const HumanoidBase: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <GarmentSVG fillColor="#E5E7EB" {...props}>
    {/* Head */}
    <path data-main="true" d="M160,15 C140,15 130,35 130,55 C130,75 142,85 148,90 L148,100 L172,100 L172,90 C178,85 190,75 190,55 C190,35 180,15 160,15 Z" stroke="#D1D5DB" strokeWidth="2" />
    {/* Torso & Arms */}
    <path data-main="true" d="M148,100 C120,102 95,115 80,135 C70,150 60,220 55,280 C54,290 68,290 70,280 C75,230 85,180 95,155 C100,200 105,250 110,290 L210,290 C215,250 220,200 225,155 C235,180 245,230 250,280 C252,290 266,290 265,280 C260,220 250,150 240,135 C225,115 200,102 172,100 Z" stroke="#D1D5DB" strokeWidth="2" />
    {/* Legs */}
    <path data-main="true" d="M110,290 C100,380 95,450 90,500 C89,510 105,510 110,500 C120,430 140,350 155,320 L165,320 C180,350 200,430 210,500 C215,510 231,510 230,500 C225,450 220,380 210,290 Z" stroke="#D1D5DB" strokeWidth="2" />
  </GarmentSVG>
);

export const Shorts: React.FC<GarmentProps> = (props) => (
  <GarmentSVG {...props}>
    <path data-main="true" d="M110,290 L210,290 C213,320 216,360 218,390 C219,395 200,395 195,390 C185,360 170,335 163,320 C161,315 159,315 157,320 C150,335 135,360 125,390 C120,395 101,395 102,390 C104,360 107,320 110,290 Z" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
    <path d="M160,290 L160,318" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
  </GarmentSVG>
);

export const Trousers: React.FC<GarmentProps> = (props) => (
  <GarmentSVG {...props}>
    <path data-main="true" d="M110,290 L210,290 C220,380 225,450 230,500 C231,510 215,510 210,500 C200,430 180,350 165,320 C162,315 158,315 155,320 C140,350 120,430 110,500 C105,510 89,510 90,500 C95,450 100,380 110,290 Z" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
    <path d="M160,290 L160,320" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
  </GarmentSVG>
);

export const Shirt: React.FC<GarmentProps> = (props) => (
  <GarmentSVG {...props}>
    <path data-main="true" d="M148,100 C120,102 95,115 80,135 C70,150 60,220 55,280 C54,290 68,290 70,280 C75,230 85,180 95,155 C100,200 105,250 110,295 L210,295 C215,250 220,200 225,155 C235,180 245,230 250,280 C252,290 266,290 265,280 C260,220 250,150 240,135 C225,115 200,102 172,100 C165,110 155,110 148,100 Z" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
    {/* Collar & Placket */}
    <path d="M148,100 L160,115 L172,100 M160,115 L160,295" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
  </GarmentSVG>
);

export const TShirt: React.FC<GarmentProps> = (props) => (
  <GarmentSVG {...props}>
    <path data-main="true" d="M148,100 C120,102 95,115 80,135 C75,142 70,165 67,185 C75,188 85,185 92,180 C94,170 95,160 95,155 C100,200 105,250 110,295 L210,295 C215,250 220,200 225,155 C225,160 226,170 228,180 C235,185 245,188 253,185 C250,165 245,142 240,135 C225,115 200,102 172,100 C165,115 155,115 148,100 Z" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
    {/* Crew neck */}
    <path d="M148,100 C155,110 165,110 172,100" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" />
  </GarmentSVG>
);

export const Jacket: React.FC<GarmentProps> = (props) => (
  <GarmentSVG {...props}>
    <path data-main="true" d="M145,100 C115,102 90,115 75,135 C65,150 55,220 50,280 C49,290 63,290 65,280 C70,230 80,180 90,155 C95,200 100,250 105,310 L140,310 L145,120 C150,115 170,115 175,120 L180,310 L215,310 C220,250 225,200 230,155 C240,180 250,230 255,280 C257,290 271,290 270,280 C265,220 255,150 245,135 C230,115 205,102 175,100 C165,110 155,110 145,100 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
    {/* Inner collar lapel line */}
    <path d="M145,100 C155,110 165,110 175,100" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" fill="none" />
  </GarmentSVG>
);
