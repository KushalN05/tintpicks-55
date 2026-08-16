import React, { useState, useEffect, useCallback } from 'react';
import StylingMannequin, { GarmentCategory, GarmentType } from './StylingMannequin';
import { generateFashionPalette } from '@/utils/fashionColorMath';
import useEmblaCarousel from 'embla-carousel-react';
import { Shirt, Pants, X } from 'lucide-react';
import { Button } from './ui/button';

export interface CapturedItemConfig {
  item: GarmentType;
  category: GarmentCategory;
  hex: string;
  timestamp: number; // for tracking new captures
}

interface FashionStylingBoardProps {
  capturedItem?: CapturedItemConfig | null;
  savedColors?: { id: string; hex: string }[];
}

const FashionStylingBoard: React.FC<FashionStylingBoardProps> = ({
  capturedItem,
  savedColors = [],
}) => {
  const [colors, setColors] = useState<Record<GarmentCategory, string>>({
    top: '#F5F5DC',
    bottom: '#1C2833',
    outerwear: 'transparent',
  });

  const [equipped, setEquipped] = useState<Record<GarmentCategory, GarmentType>>({
    top: 'shirt',
    bottom: 'trousers',
    outerwear: null,
  });

  const [selectedLayer, setSelectedLayer] = useState<GarmentCategory>('top');
  const [carouselColors, setCarouselColors] = useState<string[]>([]);
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' });

  // Handle incoming captured items from the camera flow
  useEffect(() => {
    if (capturedItem) {
      setEquipped(prev => ({ ...prev, [capturedItem.category]: capturedItem.item }));
      setColors(prev => ({ ...prev, [capturedItem.category]: capturedItem.hex }));
      setSelectedLayer(capturedItem.category);
    }
  }, [capturedItem]);

  // Update carousel colors when the selected layer's color changes
  useEffect(() => {
    const baseColor = colors[selectedLayer] !== 'transparent' ? colors[selectedLayer] : '#808080';
    const { monochromatic, analogous, neutrals } = generateFashionPalette(baseColor);
    
    // Combine and deduplicate
    const newColors = [...new Set([...monochromatic, ...analogous, ...neutrals])];
    setCarouselColors(newColors);
  }, [colors, selectedLayer]);

  const handleLayerClick = (layer: GarmentCategory) => {
    setSelectedLayer(layer);
  };

  const handleColorClick = (hex: string) => {
    setColors(prev => ({ ...prev, [selectedLayer]: hex }));
  };

  const equipItem = (category: GarmentCategory, item: GarmentType) => {
    setEquipped(prev => ({ ...prev, [category]: item }));
    setSelectedLayer(category);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-12 p-6 animate-fade-in">
      {/* Left side: Wardrobe / Equip Controls */}
      <div className="w-full md:w-48 flex flex-col gap-6 shrink-0 order-2 md:order-1">
        <h3 className="text-xl font-medium border-b pb-2">Wardrobe</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tops</h4>
            <div className="flex gap-2">
              <Button 
                variant={equipped.top === 'shirt' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => equipItem('top', 'shirt')}
                className="w-full"
              >
                Shirt
              </Button>
              <Button 
                variant={equipped.top === 'tshirt' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => equipItem('top', 'tshirt')}
                className="w-full"
              >
                T-Shirt
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bottoms</h4>
            <div className="flex gap-2">
              <Button 
                variant={equipped.bottom === 'trousers' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => equipItem('bottom', 'trousers')}
                className="w-full"
              >
                Trousers
              </Button>
              <Button 
                variant={equipped.bottom === 'shorts' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => equipItem('bottom', 'shorts')}
                className="w-full"
              >
                Shorts
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outerwear</h4>
            <div className="flex gap-2">
              <Button 
                variant={equipped.outerwear === 'jacket' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => equipItem('outerwear', 'jacket')}
                className="w-full"
              >
                Jacket
              </Button>
              <Button 
                variant={equipped.outerwear === null ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => equipItem('outerwear', null)}
                className="w-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Mannequin */}
      <div className="flex-1 w-full flex flex-col items-center order-1 md:order-2 bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-sm">
        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Styling Canvas</h2>
            <p className="text-sm text-muted-foreground">Click a garment to edit its color.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Editing: {selectedLayer}</span>
          </div>
        </div>
        
        <StylingMannequin
          equipped={equipped}
          colors={colors}
          onLayerClick={handleLayerClick}
          selectedLayer={selectedLayer}
        />
      </div>

      {/* Right side: Swipeable Color Carousel / Matches */}
      <div className="w-full md:w-64 flex flex-col gap-12 shrink-0 order-3">
        {/* Saved Colors Swiper */}
        <div>
          <h3 className="text-xl font-medium mb-4">My Collection</h3>
          {savedColors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved colors yet.</p>
          ) : (
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex gap-4">
                {savedColors.map((sc) => (
                  <div 
                    key={sc.id}
                    onClick={() => handleColorClick(sc.hex)}
                    className="flex-[0_0_auto] w-14 h-14 rounded-full border border-border cursor-pointer transition-transform hover:scale-105 flex items-center justify-center group shrink-0"
                    style={{ backgroundColor: sc.hex }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-[9px] px-1 rounded backdrop-blur-sm">
                      {sc.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fashion Matches Swiper */}
        <div>
          <h3 className="text-xl font-medium mb-2">Fashion Matches</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Safe pairings for your {equipped[selectedLayer] || selectedLayer}. Swipe to explore.
          </p>

          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-4">
              {carouselColors.map((hex, i) => (
                <div 
                  key={`${hex}-${i}`}
                  onClick={() => handleColorClick(hex)}
                  className="flex-[0_0_auto] w-14 h-14 rounded-full border border-border cursor-pointer transition-transform hover:scale-105 flex items-center justify-center group shrink-0"
                  style={{ backgroundColor: hex }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-[9px] px-1 rounded backdrop-blur-sm">
                    {hex}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionStylingBoard;
