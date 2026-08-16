import React, { useState, useEffect } from 'react';
import StylingMannequin, { GarmentLayer } from './StylingMannequin';
import { generateFashionPalette } from '@/utils/fashionColorMath';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FashionStylingBoardProps {
  capturedColor: string | null;
  onColorSave?: (hex: string) => void;
}

const FashionStylingBoard: React.FC<FashionStylingBoardProps> = ({
  capturedColor,
  onColorSave,
}) => {
  const [colors, setColors] = useState<Record<GarmentLayer, string>>({
    torso: '#F5F5DC',
    legs: '#1C2833',
    outerwear: '#2F4F4F',
    shoes: '#000000',
  });

  const [activeLayers, setActiveLayers] = useState<Record<GarmentLayer, boolean>>({
    torso: true,
    legs: true,
    outerwear: false,
    shoes: false,
  });

  const [anchoredLayer, setAnchoredLayer] = useState<GarmentLayer>('torso');
  const [carouselColors, setCarouselColors] = useState<string[]>([]);
  
  // When capturedColor changes, we prompt or immediately apply it.
  // For this component, we'll assume it's applied to the anchored layer.
  useEffect(() => {
    if (capturedColor) {
      setColors(prev => ({ ...prev, [anchoredLayer]: capturedColor }));
    }
  }, [capturedColor]);

  // Update carousel colors when the anchored layer's color changes
  useEffect(() => {
    const baseColor = colors[anchoredLayer];
    const { monochromatic, analogous, neutrals } = generateFashionPalette(baseColor);
    
    // Combine and shuffle or group them
    const newColors = [...new Set([...monochromatic, ...analogous, ...neutrals])];
    setCarouselColors(newColors);
  }, [colors, anchoredLayer]);

  const handleLayerClick = (layer: GarmentLayer) => {
    setAnchoredLayer(layer);
  };

  const handleCarouselColorClick = (hex: string) => {
    // Apply to the opposite of the anchored layer, or just to whatever isn't anchored
    // A simple logic: if torso is anchored, apply to legs. If legs, apply to torso.
    let targetLayer: GarmentLayer = 'legs';
    if (anchoredLayer === 'torso') targetLayer = 'legs';
    if (anchoredLayer === 'legs') targetLayer = 'torso';
    if (anchoredLayer === 'outerwear') targetLayer = 'torso';
    if (anchoredLayer === 'shoes') targetLayer = 'legs';

    // If the chosen target layer is not active, activate it
    if (!activeLayers[targetLayer]) {
      setActiveLayers(prev => ({ ...prev, [targetLayer]: true }));
    }

    setColors(prev => ({ ...prev, [targetLayer]: hex }));
  };

  const toggleLayer = (layer: GarmentLayer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-12 p-6 animate-fade-in">
      {/* Left side: Mannequin & Controls */}
      <div className="flex-1 w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Styling Canvas</h2>
        <p className="text-sm text-muted-foreground mb-6">Select a layer to anchor it, then pick matching colors.</p>
        
        <StylingMannequin
          colors={colors}
          activeLayers={activeLayers}
          onLayerClick={handleLayerClick}
          selectedLayer={anchoredLayer}
        />

        <div className="flex items-center gap-6 mt-8">
          <div className="flex items-center space-x-2">
            <Switch 
              id="outerwear-toggle" 
              checked={activeLayers.outerwear} 
              onCheckedChange={() => toggleLayer('outerwear')} 
            />
            <Label htmlFor="outerwear-toggle" className="text-sm font-medium">Outerwear</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="shoes-toggle" 
              checked={activeLayers.shoes} 
              onCheckedChange={() => toggleLayer('shoes')} 
            />
            <Label htmlFor="shoes-toggle" className="text-sm font-medium">Shoes</Label>
          </div>
        </div>
      </div>

      {/* Right side: Carousel / Matching Palette */}
      <div className="flex-1 w-full flex flex-col">
        <h3 className="text-xl font-medium mb-4">Fashion Matches</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your anchored layer ({anchoredLayer}), here are safe pairings.
        </p>

        <div className="flex flex-wrap gap-4">
          {carouselColors.map((hex, i) => (
            <div 
              key={`${hex}-${i}`}
              onClick={() => handleCarouselColorClick(hex)}
              className="w-16 h-16 rounded-full border border-border cursor-pointer transition-transform hover:scale-110 shadow-sm flex items-center justify-center group"
              style={{ backgroundColor: hex }}
            >
              {/* Optional hover state to show save button or hex */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-[10px] px-1 rounded backdrop-blur-sm">
                {hex}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FashionStylingBoard;
