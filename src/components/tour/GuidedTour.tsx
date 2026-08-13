import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BlobMascot from '@/components/BlobMascot';

export interface TourStep {
  targetId: string;
  text: string;
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];

  useEffect(() => {
    const updatePosition = () => {
      if (!step) return;
      const el = document.getElementById(step.targetId);
      if (el) {
        // If element is not fully in viewport, scroll to it
        const rect = el.getBoundingClientRect();
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (!isInViewport) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTargetRect(el.getBoundingClientRect());
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    // Poll to catch any animated/delayed elements rendering
    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      clearInterval(interval);
    };
  }, [step]);

  if (!step || !targetRect) return null;

  const padding = 12;
  const top = targetRect.top - padding;
  const left = targetRect.left - padding;
  const width = targetRect.width + padding * 2;
  const height = targetRect.height + padding * 2;

  // Render popover below if target is near the top, otherwise above
  const showBelow = targetRect.top < window.innerHeight / 2;
  
  // Keep popover on screen horizontally
  const maxLeft = window.innerWidth - 300 - 20; // 300px width + 20px padding
  const popoverLeft = Math.max(20, Math.min(targetRect.left, maxLeft));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dimmed backdrop with precise cutout using box-shadow */}
      <div
        className="absolute transition-all duration-500 ease-in-out border-2 border-white/50"
        style={{
          top,
          left,
          width,
          height,
          boxShadow: '0 0 0 9999px rgba(31, 41, 55, 0.7)',
          borderRadius: '12px',
        }}
      />

      {/* Popover UI */}
      <div
        className="absolute z-50 transition-all duration-500 ease-in-out pointer-events-auto"
        style={{
          top: showBelow ? top + height + 20 : top - 140, // 140px is approx height of the card
          left: popoverLeft,
          width: '300px',
        }}
      >
        <div className="relative animate-slide-up">
          {/* Tinti Mascot - slightly overlapping the card */}
          <div className="absolute -top-12 -left-4 w-20 h-20 animate-float">
            <BlobMascot size="sm" mood="excited" />
          </div>
          
          {/* Dialogue Bubble */}
          <div className="ghibli-card p-5 ml-6 bg-white/95 backdrop-blur-xl shadow-2xl relative overflow-visible">
            {/* Speech bubble tail */}
            <div 
              className="absolute w-4 h-4 bg-white/95 border-l border-t border-white/40 transform -rotate-45"
              style={{
                top: showBelow ? '-8px' : 'auto',
                bottom: showBelow ? 'auto' : '-8px',
                left: '24px'
              }}
            />
            
            <p className="text-ghibli-forest font-medium mb-4 relative z-10 leading-snug">
              {step.text}
            </p>
            
            <div className="flex justify-between items-center relative z-10">
              <button 
                onClick={onComplete}
                className="text-xs text-ghibli-forest/50 hover:text-ghibli-forest transition-colors font-medium tracking-wide uppercase"
              >
                Skip Tour
              </button>
              
              <Button 
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    onComplete();
                  }
                }}
                className="bg-ghibli-blue hover:bg-ghibli-blue/90 text-white rounded-full h-8 px-5 text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
