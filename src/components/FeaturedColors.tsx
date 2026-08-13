
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getColorName } from '../utils/colorMapping';

const featuredColors = [
  { hex: '#FF6B6B', name: 'Coral Red' },
  { hex: '#4ECDC4', name: 'Light Turquoise' },
  { hex: '#45B7D1', name: 'Marine Blue' },
  { hex: '#96CEB4', name: 'Sage' },
  { hex: '#FFEEAD', name: 'Cream' },
  { hex: '#FF9F1C', name: 'Orange' },
  { hex: '#E4C1F9', name: 'Lavender' },
  { hex: '#FFD93D', name: 'Sunshine Yellow' },
  { hex: '#6C757D', name: 'Slate Gray' },
  { hex: '#95D5B2', name: 'Mint' },
  { hex: '#FB6F92', name: 'Rose Pink' },
  { hex: '#2A9D8F', name: 'Teal' },
];

const FeaturedColors = ({ onSelect }: { onSelect: (color: string) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative p-4 my-4">
      <h2 className="text-xl font-ghibli font-semibold mb-5 text-ghibli-forest">Featured Colors</h2>
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 shadow-sm rounded-full text-ghibli-forest"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredColors.map((color, index) => {
            const colorName = getColorName(color.hex);
            
            return (
              <div
                key={index}
                className="flex-none w-32 snap-start group"
                onClick={() => onSelect(color.hex)}
              >
                <div
                  className="h-32 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105 hover:rotate-2"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="mt-2 text-sm text-ghibli-forest font-medium">{colorName}</p>
                <p className="text-xs text-ghibli-forest/70">{color.hex}</p>
              </div>
            );
          })}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 shadow-sm rounded-full text-ghibli-forest"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturedColors;
