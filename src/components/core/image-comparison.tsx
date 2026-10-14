import React, { useState, useRef, ReactNode, createContext, useContext } from 'react';
import { motion, useMotionValue, useTransform, useSpring, SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageComparisonContextType {
  sliderX: any;
  isHovered: boolean;
}

const ImageComparisonContext = createContext<ImageComparisonContextType | null>(null);

export interface ImageComparisonProps {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  springOptions?: SpringOptions;
}

export function ImageComparison({
  children,
  className,
  enableHover = false,
  springOptions = { bounce: 0 },
}: ImageComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion value representing the slider percentage (0 to 100)
  const sliderPosition = useMotionValue(50);
  const springPosition = useSpring(sliderPosition, springOptions);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!enableHover && e.buttons !== 1) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    sliderPosition.set(percentage);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (enableHover) {
      sliderPosition.set(50);
    }
  };

  return (
    <ImageComparisonContext.Provider value={{ sliderX: springPosition, isHovered }}>
      <div
        ref={containerRef}
        className={cn('relative overflow-hidden select-none touch-none', className)}
        onPointerMove={handlePointerMove}
        onPointerDown={(e) => {
          if (!enableHover) {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            handlePointerMove(e);
          }
        }}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onPointerUp={(e) => {
          if (!enableHover) {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          }
        }}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}

export interface ImageComparisonImageProps {
  src: string;
  alt: string;
  position: 'left' | 'right';
  className?: string;
}

export function ImageComparisonImage({ src, alt, position, className }: ImageComparisonImageProps) {
  const context = useContext(ImageComparisonContext);
  if (!context) throw new Error('ImageComparisonImage must be used within ImageComparison');
  
  const { sliderX } = context;
  const clipPath = useTransform(sliderX, (val) => `inset(0 ${100 - (val as number)}% 0 0)`);

  if (position === 'right') {
    return (
      <div className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("absolute inset-0 w-full h-full pointer-events-none z-10", className)}
      style={{ clipPath }}
    >
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
    </motion.div>
  );
}

export interface ImageComparisonSliderProps {
  className?: string;
}

export function ImageComparisonSlider({ className }: ImageComparisonSliderProps) {
  const context = useContext(ImageComparisonContext);
  if (!context) throw new Error('ImageComparisonSlider must be used within ImageComparison');
  
  const { sliderX } = context;

  return (
    <motion.div
      className={cn("absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-lg", className)}
      style={{ left: useTransform(sliderX, (val) => `${val}%`), x: '-50%' }}
    >
      <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </div>
    </motion.div>
  );
}
