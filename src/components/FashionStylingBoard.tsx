import React, { useState, useEffect } from 'react';
import StylingMannequin, { GarmentCategory, GarmentType } from './StylingMannequin';
import { generateFashionPalette } from '@/utils/fashionColorMath';
import useEmblaCarousel from 'embla-carousel-react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

export interface CapturedItemConfig {
  item: GarmentType;
  category: GarmentCategory;
  hex: string;
  timestamp: number; // for tracking new captures
  desiredCategory?: GarmentCategory;
}

interface FashionStylingBoardProps {
  capturedItem?: CapturedItemConfig | null;
  savedColors?: any;
  onShop?: (color: string, category: string) => void;
}

const FashionStylingBoard: React.FC<FashionStylingBoardProps> = ({
  capturedItem,
  onShop,
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
  const [anchorColor, setAnchorColor] = useState<string>('#808080');
  const [carouselColors, setCarouselColors] = useState<string[]>([]);
  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' });

  // Handle incoming captured items from the camera flow
  useEffect(() => {
    if (capturedItem) {
      setEquipped(prev => ({ ...prev, [capturedItem.category]: capturedItem.item }));
      setColors(prev => ({ ...prev, [capturedItem.category]: capturedItem.hex }));
      setAnchorColor(capturedItem.hex);
      
      if (capturedItem.desiredCategory) {
        setSelectedLayer(capturedItem.desiredCategory);
        // Automatically equip a default item if they want a category but don't have one equipped
        setEquipped(prev => ({
          ...prev,
          [capturedItem.desiredCategory!]: 
            capturedItem.desiredCategory === 'top' ? 'shirt' : 
            capturedItem.desiredCategory === 'bottom' ? 'trousers' : 'jacket'
        }));
      } else {
        setSelectedLayer(capturedItem.category);
      }
    }
  }, [capturedItem]);

  // Update carousel colors ONLY when the anchor color changes
  useEffect(() => {
    const newColors = generateFashionPalette(anchorColor);
    setCarouselColors(newColors);
  }, [anchorColor]);

  const handleLayerClick = (layer: GarmentCategory) => {
    setSelectedLayer(layer);
  };

  const handleSaveWardrobe = () => {
    const outfit = {
      id: Date.now().toString(),
      equipped,
      colors,
      name: `Saved Outfit ${new Date().toLocaleDateString()}`
    };
    const existing = JSON.parse(localStorage.getItem('saved_outfits') || '[]');
    localStorage.setItem('saved_outfits', JSON.stringify([outfit, ...existing]));
    
    // Create a native alert since we don't have useToast imported here yet
    alert("Outfit Saved! You can view this outfit in your Saved profiles.");
  };

  const handleColorClick = (hex: string) => {
    setColors(prev => ({ ...prev, [selectedLayer]: hex }));
  };

  const equipItem = (category: GarmentCategory, item: GarmentType) => {
    setEquipped(prev => ({ ...prev, [category]: item }));
    setSelectedLayer(category);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8 animate-fade-in relative z-10">
      
      {/* Fashion Matches Carousel - Overlaid beautifully at the top */}
      <div className="w-full max-w-2xl px-4">
        <div className="flex justify-between items-end mb-2 px-2">
          <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Fashion Matches</h3>
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded">Editing: {selectedLayer}</span>
        </div>
        
        <div id="tour-swiper" className="overflow-hidden cursor-grab active:cursor-grabbing bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-variant" ref={emblaRef}>
          <div className="flex gap-4">
            {carouselColors.map((hex, i) => (
              <div 
                key={`${hex}-${i}`}
                onClick={() => handleColorClick(hex)}
                className="flex-[0_0_auto] w-12 h-12 md:w-16 md:h-16 rounded-full border border-border cursor-pointer transition-transform hover:scale-110 flex items-center justify-center group shrink-0"
                style={{ backgroundColor: hex }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-[10px] px-1 rounded backdrop-blur-sm pointer-events-none">
                  {hex}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Wardrobe Sidebar & Mannequin */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-12 w-full justify-center">
        
        {/* Wardrobe / Equip Controls */}
        <div id="tour-layers" className="w-full md:w-48 flex flex-col gap-6 shrink-0 bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm">
          <h3 className="text-lg font-medium border-b pb-2">Wardrobe</h3>
          
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

        {/* Mannequin */}
        <div id="tour-mannequin" className="w-full max-w-sm">
          <StylingMannequin
            equipped={equipped}
            colors={colors}
            onLayerClick={handleLayerClick}
            selectedLayer={selectedLayer}
          />
          
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              id="tour-shop" 
              className="w-full font-semibold uppercase tracking-wide shadow-md" 
              size="lg"
              onClick={() => {
                if (onShop) {
                  const shopCategoryMap: Record<GarmentCategory, string> = {
                    top: 'Shirts',
                    bottom: 'Trousers',
                    outerwear: 'Jackets'
                  };
                  onShop(colors[selectedLayer], shopCategoryMap[selectedLayer]);
                }
              }}
            >
              Shop This Match
            </Button>
            <Button 
              id="tour-save-wardrobe" 
              variant="outline" 
              className="w-full font-semibold uppercase tracking-wide" 
              size="lg"
              onClick={handleSaveWardrobe}
            >
              Save Wardrobe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionStylingBoard;
