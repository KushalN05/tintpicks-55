import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react';
import { generateFashionPalette } from '@/utils/fashionColorMath';
import { getColorName } from '@/utils/colorMapping';

interface GuidedRecoveryProps {
  color: string;
  colorName: string;
  category: string;
  gender: string;
  onColorPivot: (newColor: string) => void;
  onCategoryPivot: () => void;
}

const GuidedRecovery: React.FC<GuidedRecoveryProps> = ({
  color,
  colorName,
  category,
  gender,
  onColorPivot,
  onCategoryPivot
}) => {
  // Generate matching colors based on the current color
  const palette = useMemo(() => generateFashionPalette(color).filter(c => c !== color), [color]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <PackageX className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-base font-sans uppercase tracking-widest text-foreground mb-3">
        No Exact Matches
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed mb-8">
        We scoured the web, but couldn't find a trusted match for that exact <strong className="text-foreground">{colorName}</strong> in <strong className="text-foreground">{category !== 'All' ? category : 'clothing'}</strong> right now.
      </p>

      {/* The Color Pivot */}
      {palette.length > 0 && (
        <div className="w-full max-w-sm mb-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
            Try one of your other matching colors instead:
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {palette.map((swatchHex, i) => (
              <button
                key={`${swatchHex}-${i}`}
                onClick={() => onColorPivot(swatchHex)}
                className="w-10 h-10 rounded-full shadow-sm border border-border transition-transform hover:scale-110"
                style={{ backgroundColor: swatchHex }}
                title={`Search for ${getColorName(swatchHex)}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* The Category Pivot */}
      {category !== 'All' && (
        <div className="w-full max-w-sm border-t border-border pt-6 mt-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">
            Or, see what else exists in this color:
          </p>
          <Button 
            variant="outline" 
            className="w-full font-semibold uppercase tracking-wide text-xs h-10"
            onClick={onCategoryPivot}
          >
            Search All {gender !== 'All' ? gender + 's Wear' : 'Fashion'} in {colorName}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GuidedRecovery;
