import React from 'react';
import { HumanoidBase, Shorts, Trousers, Shirt, TShirt, Jacket } from './MannequinAssets';

export type GarmentCategory = 'top' | 'bottom' | 'outerwear';
export type GarmentType = 'shirt' | 'tshirt' | 'trousers' | 'shorts' | 'jacket' | null;

interface StylingMannequinProps {
  equipped: Record<GarmentCategory, GarmentType>;
  colors: Record<GarmentCategory, string>;
  selectedLayer: GarmentCategory | null;
  onLayerClick: (layer: GarmentCategory) => void;
}

const StylingMannequin: React.FC<StylingMannequinProps> = ({
  equipped,
  colors,
  selectedLayer,
  onLayerClick,
}) => {
  const renderTop = () => {
    const isActive = selectedLayer === 'top';
    const fill = colors.top || 'transparent';
    if (equipped.top === 'shirt') return <Shirt className="h-full aspect-[111.5/373] pointer-events-auto cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('top')} />;
    if (equipped.top === 'tshirt') return <TShirt className="h-full aspect-[111.5/373] pointer-events-auto cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('top')} />;
    return null;
  };

  const renderBottom = () => {
    const isActive = selectedLayer === 'bottom';
    const fill = colors.bottom || 'transparent';
    if (equipped.bottom === 'trousers') return <Trousers className="h-full aspect-[111.5/373] pointer-events-auto cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('bottom')} />;
    if (equipped.bottom === 'shorts') return <Shorts className="h-full aspect-[111.5/373] pointer-events-auto cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('bottom')} />;
    return null;
  };

  const renderOuterwear = () => {
    const isActive = selectedLayer === 'outerwear';
    const fill = colors.outerwear || 'transparent';
    if (equipped.outerwear === 'jacket') return <Jacket className="h-full aspect-[111.5/373] pointer-events-auto cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('outerwear')} />;
    return null;
  };

  return (
    <div className="relative w-[320px] h-[520px] mx-auto flex items-center justify-center bg-transparent">
      {/* Base Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <HumanoidBase className="h-full aspect-[111.5/373]" />
      </div>
      
      {/* Garments (rendered in z-index order) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {renderBottom()}
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {renderTop()}
      </div>
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        {renderOuterwear()}
      </div>
    </div>
  );
};

export default StylingMannequin;
