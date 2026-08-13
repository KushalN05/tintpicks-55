import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, Camera, Palette, ShoppingBag, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactNode;
}

interface AppTourProps {
  isVisible: boolean;
  onComplete: () => void;
  userName: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'header',
    title: 'Welcome to TintPicks!',
    description: 'This is your navigation bar. Here you can access different sections of the app and your profile.',
    target: '.app-header',
    position: 'bottom',
    icon: <Menu className="w-5 h-5" />
  },
  {
    id: 'camera',
    title: 'Capture Colors',
    description: 'Use the camera button to capture colors from real life or upload photos. This is where the magic begins!',
    target: '.camera-button',
    position: 'bottom',
    icon: <Camera className="w-5 h-5" />
  },
  {
    id: 'colors',
    title: 'Your Color Palette',
    description: 'All your captured and saved colors appear here. Tap any color to see complementary matches.',
    target: '.color-grid',
    position: 'top',
    icon: <Palette className="w-5 h-5" />
  },
  {
    id: 'recommendations',
    title: 'Smart Recommendations',
    description: 'Based on your style preferences, we show you personalized color combinations and outfit ideas.',
    target: '.recommendations',
    position: 'top'
  },
  {
    id: 'shopping',
    title: 'Shop Your Colors',
    description: 'Find clothing and accessories that match your saved colors. Never miss a perfect match again!',
    target: '.shopping-section',
    position: 'top',
    icon: <ShoppingBag className="w-5 h-5" />
  }
];

const AppTour = ({ isVisible, onComplete, userName }: AppTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isVisible && currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target) as HTMLElement;
      setTargetElement(element);

      if (element) {
        // Add highlight class
        element.classList.add('tour-highlight');
        // Scroll into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return () => {
        if (element) {
          element.classList.remove('tour-highlight');
        }
      };
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Remove highlight from current element
    if (targetElement) {
      targetElement.classList.remove('tour-highlight');
    }
    onComplete();
  };

  const getTooltipPosition = () => {
    if (!targetElement) return { top: '50%', left: '50%' };

    const rect = targetElement.getBoundingClientRect();
    const step = tourSteps[currentStep];

    switch (step.position) {
      case 'top':
        return {
          top: rect.top - 20,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: rect.bottom + 20,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 20,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 20,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: rect.bottom + 20,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  if (!isVisible || currentStep >= tourSteps.length) return null;

  const currentStepData = tourSteps[currentStep];
  const position = getTooltipPosition();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none" />
      
      {/* Spotlight effect */}
      {targetElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50 pointer-events-auto"
          style={position}
        >
          <div className="bg-white rounded-xl shadow-xl border border-ghibli-blue/20 p-6 max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentStepData.icon && (
                  <div className="text-ghibli-blue">{currentStepData.icon}</div>
                )}
                <h3 className="font-bold text-ghibli-forest text-lg">
                  {currentStepData.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="text-ghibli-forest hover:bg-ghibli-cream/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="text-ghibli-forest/70 mb-6">
              {currentStep === 0 
                ? `Hi ${userName}! Let me show you around TintPicks. ${currentStepData.description}`
                : currentStepData.description
              }
            </p>

            {/* Progress */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1 bg-ghibli-cream rounded-full h-2">
                <div
                  className="bg-ghibli-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-ghibli-forest/60">
                {currentStep + 1}/{tourSteps.length}
              </span>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-ghibli-blue/30 text-ghibli-forest hover:bg-ghibli-cream/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                className="bg-ghibli-blue text-white hover:bg-ghibli-blue/90"
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Arrow pointer */}
          <div
            className="absolute w-3 h-3 bg-white border-l border-t border-ghibli-blue/20 transform rotate-45"
            style={{
              [currentStepData.position === 'top' ? 'bottom' : 'top']: '-6px',
              left: '50%',
              marginLeft: '-6px',
              ...(currentStepData.position === 'left' && { 
                right: '-6px', 
                top: '50%', 
                marginTop: '-6px', 
                marginLeft: 0 
              }),
              ...(currentStepData.position === 'right' && { 
                left: '-6px', 
                top: '50%', 
                marginTop: '-6px', 
                marginLeft: 0 
              })
            }}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AppTour;