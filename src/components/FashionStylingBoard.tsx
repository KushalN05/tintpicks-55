import React, { useState, useEffect } from 'react';
import StylingMannequin, { GarmentLayer } from './StylingMannequin';
import { generateFashionPalette } from '@/utils/fashionColorMath';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FashionStylingBoardProps {
  capturedColor: string | null;
  savedColors?: { id: string; hex: string }[];
  onColorSave?: (hex: string) => void;
}

const FashionStylingBoard: React.FC<FashionStylingBoardProps> = ({
  capturedColor,
  savedColors = [],
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

  const [selectedLayer, setSelectedLayer] = useState<GarmentLayer>('torso');
  const [carouselColors, setCarouselColors] = useState<string[]>([]);
  
  // When capturedColor changes, we apply it to the selected layer
  useEffect(() => {
    if (capturedColor) {
      setColors(prev => ({ ...prev, [selectedLayer]: capturedColor }));
    }
  }, [capturedColor]);

  // Update carousel colors when the selected layer's color changes
  useEffect(() => {
    const baseColor = colors[selectedLayer];
    const { monochromatic, analogous, neutrals } = generateFashionPalette(baseColor);
    
    // Combine and deduplicate
    const newColors = [...new Set([...monochromatic, ...analogous, ...neutrals])];
    setCarouselColors(newColors);
  }, [colors, selectedLayer]);

  const handleLayerClick = (layer: GarmentLayer) => {
    setSelectedLayer(layer);
  };

  const handleColorClick = (hex: string) => {
    // If the chosen layer is not active, activate it
    if (!activeLayers[selectedLayer]) {
      setActiveLayers(prev => ({ ...prev, [selectedLayer]: true }));
    }

    setColors(prev => ({ ...prev, [selectedLayer]: hex }));
  };

  const toggleLayer = (layer: GarmentLayer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-12 p-6 animate-fade-in">
      {/* Left side: Mannequin & Controls */}
      <div className="flex-1 w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Styling Canvas</h2>
        <p className="text-sm text-muted-foreground mb-6">Click a layer on the mannequin to edit it, then pick a color.</p>
        
        <StylingMannequin
          colors={colors}
          activeLayers={activeLayers}
          onLayerClick={handleLayerClick}
          selectedLayer={selectedLayer}
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
      <div className="flex-1 w-full flex flex-col space-y-12">
        <div>
          <h3 className="text-xl font-medium mb-4">Saved Colors</h3>
          {savedColors.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't saved any colors yet. Tap the camera to capture one.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {savedColors.map((sc) => (
                <div 
                  key={sc.id}
                  onClick={() => handleColorClick(sc.hex)}
                  className="w-16 h-16 rounded-full border border-border cursor-pointer transition-transform hover:scale-110 shadow-sm flex items-center justify-center group"
                  style={{ backgroundColor: sc.hex }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-[10px] px-1 rounded backdrop-blur-sm">
                    {sc.hex}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-medium mb-4">Fashion Matches</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Safe pairings based on your selected {selectedLayer}.
          </p>

          <div className="flex flex-wrap gap-4">
            {carouselColors.map((hex, i) => (
              <div 
                key={`${hex}-${i}`}
                onClick={() => handleColorClick(hex)}
                className="w-16 h-16 rounded-full border border-border cursor-pointer transition-transform hover:scale-110 shadow-sm flex items-center justify-center group"
                style={{ backgroundColor: hex }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-[10px] px-1 rounded backdrop-blur-sm">
                  {hex}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionStylingBoard;
