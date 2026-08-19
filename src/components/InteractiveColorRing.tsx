import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface InteractiveColorRingProps {
  angles: [number, number]; // 0 to 360
  onChange: (angles: [number, number]) => void;
  children?: React.ReactNode;
}

export function angleToHex(angle: number, saturation = 100, lightness = 65) {
  // Simple HSL to Hex
  const h = angle;
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const InteractiveColorRing: React.FC<InteractiveColorRingProps> = ({ angles, onChange, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);

  const calculateAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const deg = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Convert atan2 (-180 to 180, 0 is right) to standard wheel (0 to 360, 0 is top)
    const angle = (deg + 90 + 360) % 360;
    return angle;
  };

  const handlePointerDown = (e: React.PointerEvent, thumbIndex: number) => {
    e.preventDefault();
    setActiveThumb(thumbIndex);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (activeThumb === null) return;
    const newAngle = calculateAngle(e.clientX, e.clientY);
    const newAngles = [...angles] as [number, number];
    newAngles[activeThumb] = newAngle;
    onChange(newAngles);
  }, [activeThumb, angles, onChange]);

  const handlePointerUp = useCallback(() => {
    setActiveThumb(null);
  }, []);

  useEffect(() => {
    if (activeThumb !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeThumb, handlePointerMove, handlePointerUp]);

  const getThumbPos = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    // 46% radius puts it perfectly in the center of the 24px padding ring
    return {
      left: `calc(50% + ${Math.cos(rad) * 46}% - 16px)`,
      top: `calc(50% + ${Math.sin(rad) * 46}% - 16px)`,
    };
  };

  return (
    <div 
      ref={containerRef}
      id="tour-camera-screen"
      className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] rounded-full flex items-center justify-center shadow-2xl touch-none"
      style={{
        background: "conic-gradient(from 0deg, hsl(0, 100%, 65%), hsl(60, 100%, 65%), hsl(120, 100%, 65%), hsl(180, 100%, 65%), hsl(240, 100%, 65%), hsl(300, 100%, 65%), hsl(360, 100%, 65%))",
        padding: "24px" // Thickness of the ring
      }}
    >
      {/* Central Capture Area */}
      <div className="w-full h-full bg-background rounded-full relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>

      {/* Thumb 0 */}
      <div 
        className="absolute z-20 w-8 h-8 rounded-full border-[3px] border-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
        style={{
          ...getThumbPos(angles[0]),
          backgroundColor: angleToHex(angles[0]),
          boxShadow: `0 0 15px ${angleToHex(angles[0])}80`
        }}
        onPointerDown={(e) => handlePointerDown(e, 0)}
      />

      {/* Thumb 1 */}
      <div 
        className="absolute z-20 w-8 h-8 rounded-full border-[3px] border-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
        style={{
          ...getThumbPos(angles[1]),
          backgroundColor: angleToHex(angles[1]),
          boxShadow: `0 0 15px ${angleToHex(angles[1])}80`
        }}
        onPointerDown={(e) => handlePointerDown(e, 1)}
      />
    </div>
  );
};

export default InteractiveColorRing;
