
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info, X, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';

const quotes = [
  "Colors are like friends, they bring out the best in each other!",
  "The right color can change not just your outfit, but your day!",
  "Finding your perfect color is like finding a piece of magic.",
  "Every color has a story to tell about you.",
  "Fashion is about expressing who you are through colors and shapes.",
  "Capture the colors that speak to your heart!",
  "Life is too short to wear boring colors.",
  "When in doubt, let TintPicks guide your color journey."
];

const tips = [
  {
    title: "Capture Colors",
    description: "Use the camera button to capture colors from your surroundings or upload an image to extract colors."
  },
  {
    title: "Explore Combinations",
    description: "Click on 'View Complementary' to discover colors that work beautifully with your selected color."
  },
  {
    title: "Shop the Look",
    description: "Find clothing and accessories that match your favorite colors with the 'Shop this color' button."
  },
  {
    title: "Save Favorites",
    description: "Your captured colors are automatically saved to your collection for future inspiration."
  }
];

const HowToUseGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className="w-full mb-6">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex justify-between items-center w-full">
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 rounded-full border-ghibli-blue text-ghibli-blue hover:bg-ghibli-blue/10 mb-2"
            >
              <Info size={16} />
              <span>{isOpen ? "Hide Guide" : "How to Use TintPicks"}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-2">
          <Card className="p-4 bg-ghibli-cream/70 backdrop-blur-sm border-ghibli-blue/20 overflow-hidden relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full hover:bg-ghibli-red/10 text-ghibli-forest"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Character and Quote Section */}
              <div className="relative w-full md:w-1/3 flex flex-col items-center">
                <div className="relative animate-float" style={{ animationDuration: '6s' }}>
                  <img 
                    src="/lovable-uploads/539dce15-cb88-4d10-8ae0-d0a8a0e60874.png" 
                    alt="Tintpicks Character" 
                    className="h-32 mx-auto mb-2"
                  />
                  <div className="absolute inset-0 bg-ghibli-green/20 rounded-full blur-xl -z-10"></div>
                  <div className="absolute w-8 h-8 -top-2 -right-3 bg-ghibli-pink/30 rounded-full blur-md animate-float" style={{ animationDuration: '7s', animationDelay: '0.5s' }}></div>
                  <div className="absolute w-6 h-6 -bottom-1 -left-2 bg-ghibli-blue/30 rounded-full blur-md animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
                </div>
                
                <div className="relative mt-4 p-4 bg-white/80 rounded-xl border border-ghibli-green/30 min-h-[120px] flex items-center justify-center w-full">
                  <p className="text-ghibli-forest font-ghibli text-center italic">"{quotes[currentQuote]}"</p>
                  <div className="absolute top-1/2 -left-3 transform -translate-y-1/2">
                    <Button variant="ghost" size="icon" onClick={prevQuote} className="rounded-full bg-white/80 hover:bg-white shadow-sm text-ghibli-forest">
                      <ChevronLeft size={18} />
                    </Button>
                  </div>
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <Button variant="ghost" size="icon" onClick={nextQuote} className="rounded-full bg-white/80 hover:bg-white shadow-sm text-ghibli-forest">
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Tips Section */}
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-ghibli text-ghibli-forest mb-3">Getting Started</h3>
                
                <div className="relative p-4 bg-white/80 rounded-xl border border-ghibli-blue/30 min-h-[160px]">
                  <div className="flex flex-col items-center">
                    <h4 className="text-lg font-ghibli text-ghibli-blue mb-2">{tips[currentTip].title}</h4>
                    <p className="text-ghibli-forest text-center mb-4">{tips[currentTip].description}</p>
                    
                    <div className="flex justify-center gap-2 mt-2">
                      {tips.map((_, index) => (
                        <div 
                          key={index} 
                          className={`w-2 h-2 rounded-full ${index === currentTip ? 'bg-ghibli-blue' : 'bg-ghibli-blue/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 -left-3 transform -translate-y-1/2">
                    <Button variant="ghost" size="icon" onClick={prevTip} className="rounded-full bg-white/80 hover:bg-white shadow-sm text-ghibli-forest">
                      <ChevronLeft size={18} />
                    </Button>
                  </div>
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <Button variant="ghost" size="icon" onClick={nextTip} className="rounded-full bg-white/80 hover:bg-white shadow-sm text-ghibli-forest">
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HowToUseGuide;
