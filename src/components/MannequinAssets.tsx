import React from 'react';

const SPRITE_URL = '/assets/mannequin/sprite.png';

export interface GarmentProps extends React.HTMLAttributes<HTMLDivElement> {
  fillColor?: string;
  isActive?: boolean;
}

const SpriteGarment: React.FC<GarmentProps & { index: number }> = ({ fillColor = "transparent", isActive, index, className, ...props }) => {
  const isTransparent = fillColor === 'transparent' || !fillColor;
  
  // Background position percentages: 0, 20, 40, 60, 80, 100
  const bgPosition = `${index * 20}% 0`;

  return (
    <div 
      className={`relative w-full h-full ${className || ''}`}
      {...props}
    >
      {/* 
        Original Image Layer
        Provides the shading and line art.
      */}
      <div 
        className={`absolute inset-0 transition-transform duration-300 ${isActive ? 'scale-105 drop-shadow-md z-50' : 'drop-shadow-sm z-10'}`}
        style={{
          backgroundImage: `url(${SPRITE_URL})`,
          backgroundSize: `600% 100%`,
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 
          Color Overlay Layer
          Masks precisely to the alpha channel of the sprite item, applying a multiply blend.
        */}
        {!isTransparent && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: fillColor,
              WebkitMaskImage: `url(${SPRITE_URL})`,
              WebkitMaskSize: `600% 100%`,
              WebkitMaskPosition: bgPosition,
              WebkitMaskRepeat: 'no-repeat',
              maskImage: `url(${SPRITE_URL})`,
              maskSize: `600% 100%`,
              maskPosition: bgPosition,
              maskRepeat: 'no-repeat',
              mixBlendMode: 'multiply',
            }}
          />
        )}
      </div>
    </div>
  );
};

export const HumanoidBase: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <SpriteGarment index={0} fillColor="transparent" {...props} />
);

export const Shorts: React.FC<GarmentProps> = (props) => (
  <SpriteGarment index={1} {...props} />
);

export const Trousers: React.FC<GarmentProps> = (props) => (
  <SpriteGarment index={2} {...props} />
);

export const Shirt: React.FC<GarmentProps> = (props) => (
  <SpriteGarment index={3} {...props} />
);

export const TShirt: React.FC<GarmentProps> = (props) => (
  <SpriteGarment index={4} {...props} />
);

export const Jacket: React.FC<GarmentProps> = (props) => (
  <SpriteGarment index={5} {...props} />
);
