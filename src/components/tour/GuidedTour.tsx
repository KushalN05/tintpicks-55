import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  // Prevent background scrolling while tour is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!step) return;
      
      const elements = document.querySelectorAll(`[id="${step.targetId}"]`);
      let el: Element | null = null;
      for (let i = 0; i < elements.length; i++) {
        const rect = elements[i].getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          el = elements[i];
          break;
        }
      }
      
      if (!el) {
        el = document.getElementById(step.targetId); // Fallback
      }

      if (el) {
        // If element is not fully in viewport, scroll to it
        const rect = el.getBoundingClientRect();
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (!isInViewport) {
          // Scroll cleanly to center so it's not hidden behind the fixed bottom card
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

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dimmed backdrop with precise cutout using box-shadow */}
      <div
        className="absolute transition-all duration-500 ease-in-out ring-4 ring-white/80 ring-offset-2 ring-offset-black/50"
        style={{
          top,
          left,
          width,
          height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
          borderRadius: '12px',
        }}
      >
        {/* Subtle pulsing pointer indicator */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg" />
        </div>
      </div>

      {/* Fixed Anchor Container for Dialogue Card */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100] pointer-events-auto">
        <div className="backdrop-blur-md bg-stone-900/90 text-white rounded-2xl p-5 shadow-2xl border border-white/10 relative animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Skip Button */}
          <button 
            onClick={onComplete}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
            aria-label="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step Counter */}
          <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-3">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          {/* Dialogue Text */}
          <p className="text-[15px] font-medium mb-6 leading-relaxed pr-6 text-stone-100">
            {step.text}
          </p>
          
          {/* Controls */}
          <div className="flex justify-between items-center mt-2">
            <Button 
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`text-white hover:text-white hover:bg-white/10 -ml-2 rounded-full px-4 ${currentStep === 0 ? 'opacity-30' : ''}`}
            >
              Previous
            </Button>
            
            <Button 
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  onComplete();
                }
              }}
              className="bg-white text-stone-900 hover:bg-stone-200 rounded-full h-10 px-6 font-semibold shadow-md active:scale-95 transition-transform"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
