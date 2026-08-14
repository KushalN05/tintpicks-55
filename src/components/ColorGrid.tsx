
import React, { useState } from 'react';
import { ShoppingBag, Palette, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getColorName, getColorAnalysis } from '../utils/colorMapping';
import ComplementaryColorDialog from './ComplementaryColorDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Color {
  id?: string;
  hex: string;
  name?: string;
}

const ColorGrid = ({ colors, onShop }: { colors: Color[]; onShop: (color: string) => void }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showComplementary, setShowComplementary] = useState(false);
  const isMobile = useIsMobile();

  const handleViewComplementary = (hex: string) => {
    setSelectedColor(hex);
    setShowComplementary(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {colors.map((color, index) => {
        const colorName = getColorName(color.hex);
        const { analysis } = getColorAnalysis(color.hex);
        
        return (
          <div
            key={color.id ?? index}
            className="ghibli-card group hover:translate-y-[-5px]"
          >
            <div
              className="h-32 w-full rounded-t-xl"
              style={{ backgroundColor: color.hex }}
            />
            <div className="p-4">
              <div className="flex items-center">
                <p className="text-ghibli-forest font-medium font-ghibli">{colorName}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-2"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{analysis}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-ghibli-forest/70 text-sm mb-3">{color.hex}</p>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="w-full border-ghibli-blue text-ghibli-blue hover:bg-ghibli-blue/10 rounded-full"
                  onClick={() => onShop(color.hex)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {isMobile ? "Shop" : "Shop this color"}
                </Button>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="w-full border-ghibli-green text-ghibli-green hover:bg-ghibli-green/10 rounded-full"
                  onClick={() => handleViewComplementary(color.hex)}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  {isMobile ? "View" : "View Complementary"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {selectedColor && (
        <ComplementaryColorDialog
          isOpen={showComplementary}
          onClose={() => setShowComplementary(false)}
          originalColor={selectedColor}
          onShop={(color: string) => {
            setShowComplementary(false);
            // Delay to let the dialog unmount before opening the shopping modal
            setTimeout(() => onShop(color), 200);
          }}
        />
      )}
    </div>
  );
};

export default ColorGrid;
