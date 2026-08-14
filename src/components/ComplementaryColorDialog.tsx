
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getColorName, getAllNamedColors } from '../utils/colorMapping';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComplementaryColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalColor: string;
  onShop: (color: string) => void;
}

const ComplementaryColorDialog = ({
  isOpen,
  onClose,
  originalColor,
  onShop,
}: ComplementaryColorDialogProps) => {
  const isMobile = useIsMobile();
  const allColors = getAllNamedColors();
  
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };
  
  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };
  
  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  // Find closest color in our palette
  const findClosestColor = (targetHex: string) => {
    const [r, g, b] = hexToRgb(targetHex);
    let closestColor = allColors[0].hex;
    let minDistance = Number.MAX_VALUE;

    allColors.forEach(color => {
      const [cr, cg, cb] = hexToRgb(color.hex);
      
      // Simple Euclidean distance in RGB space
      const distance = Math.sqrt(
        Math.pow(r - cr, 2) + 
        Math.pow(g - cg, 2) + 
        Math.pow(b - cb, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.hex;
      }
    });

    return closestColor;
  };
  
  // Find complementary colors (opposite on the color wheel)
  const findComplementaryColors = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Complementary = opposite on the color wheel
    const complementaryHue = (h + 180) % 360;
    const [cr, cg, cb] = hslToRgb(complementaryHue, s, l);
    const complementaryHex = rgbToHex(cr, cg, cb);
    
    return [findClosestColor(complementaryHex)];
  };
  
  // Find analogous colors (adjacent on the color wheel)
  const findAnalogousColors = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Analogous = adjacent on the color wheel (±30°)
    const analogousHue1 = (h + 30) % 360;
    const analogousHue2 = (h + 330) % 360; // Equivalent to (h - 30)
    
    const [ar1, ag1, ab1] = hslToRgb(analogousHue1, s, l);
    const [ar2, ag2, ab2] = hslToRgb(analogousHue2, s, l);
    
    const analogousHex1 = rgbToHex(ar1, ag1, ab1);
    const analogousHex2 = rgbToHex(ar2, ag2, ab2);
    
    return [
      findClosestColor(analogousHex1),
      findClosestColor(analogousHex2)
    ];
  };
  
  // Find triadic colors (three equidistant points on the color wheel)
  const findTriadicColors = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Triadic = three equidistant points on the color wheel (±120°)
    const triadicHue1 = (h + 120) % 360;
    const triadicHue2 = (h + 240) % 360;
    
    const [tr1, tg1, tb1] = hslToRgb(triadicHue1, s, l);
    const [tr2, tg2, tb2] = hslToRgb(triadicHue2, s, l);
    
    const triadicHex1 = rgbToHex(tr1, tg1, tb1);
    const triadicHex2 = rgbToHex(tr2, tg2, tb2);
    
    return [
      findClosestColor(triadicHex1),
      findClosestColor(triadicHex2)
    ];
  };
  
  // Find monochromatic colors (variations in saturation and lightness)
  const findMonochromaticColors = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    
    const lighter = Math.min(l + 20, 90);
    const darker = Math.max(l - 20, 10);
    
    const [lr, lg, lb] = hslToRgb(h, s, lighter);
    const [dr, dg, db] = hslToRgb(h, s, darker);
    
    const lighterHex = rgbToHex(lr, lg, lb);
    const darkerHex = rgbToHex(dr, dg, db);
    
    return [
      findClosestColor(lighterHex),
      findClosestColor(darkerHex)
    ];
  };
  
  const complementaryColors = findComplementaryColors(originalColor);
  const analogousColors = findAnalogousColors(originalColor);
  const triadicColors = findTriadicColors(originalColor);
  const monochromaticColors = findMonochromaticColors(originalColor);

  const ColorCard = ({ color }: { color: string }) => (
    <div className="text-center ghibli-card p-3 md:p-4 hover:scale-105 transition-transform min-w-[140px]">
      <div
        className="h-16 md:h-24 w-full rounded-lg mb-2"
        style={{ backgroundColor: color }}
      />
      <p className="font-medium text-ghibli-forest font-ghibli text-sm md:text-base line-clamp-2">{getColorName(color)}</p>
      <p className="text-xs md:text-sm text-ghibli-forest/70 mb-2">{color}</p>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-ghibli-blue text-ghibli-blue hover:bg-ghibli-blue/10 rounded-full text-xs md:text-sm"
        onClick={() => onShop(color)}
      >
        <ShoppingBag className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        Shop
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-ghibli-beige/95 backdrop-blur-sm border-ghibli-blue/30 rounded-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-ghibli-forest font-ghibli text-lg md:text-xl">Color Harmony</DialogTitle>
          <DialogDescription className="text-ghibli-forest/80 text-sm md:text-base">
            Discover the perfect color combinations for your wardrobe
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="complementary" className="mt-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-ghibli-cream/70 h-auto">
            <TabsTrigger value="complementary" className="text-xs md:text-sm px-2 py-2">Complementary</TabsTrigger>
            <TabsTrigger value="analogous" className="text-xs md:text-sm px-2 py-2">Analogous</TabsTrigger>
            <TabsTrigger value="triadic" className="text-xs md:text-sm px-2 py-2">Triadic</TabsTrigger>
            <TabsTrigger value="monochromatic" className="text-xs md:text-sm px-2 py-2">Monochromatic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="complementary" className="mt-4">
            {isMobile ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <ColorCard color={originalColor} />
                {complementaryColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <ColorCard color={originalColor} />
                {complementaryColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analogous" className="mt-4">
            {isMobile ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <ColorCard color={originalColor} />
                {analogousColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <ColorCard color={originalColor} />
                {analogousColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="triadic" className="mt-4">
            {isMobile ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <ColorCard color={originalColor} />
                {triadicColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <ColorCard color={originalColor} />
                {triadicColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monochromatic" className="mt-4">
            {isMobile ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <ColorCard color={originalColor} />
                {monochromaticColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <ColorCard color={originalColor} />
                {monochromaticColors.map((color, index) => (
                  <ColorCard key={index} color={color} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ComplementaryColorDialog;
