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
    if (equipped.top === 'shirt') return <Shirt className="absolute inset-0 cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('top')} />;
    if (equipped.top === 'tshirt') return <TShirt className="absolute inset-0 cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('top')} />;
    return null;
  };

  const renderBottom = () => {
    const isActive = selectedLayer === 'bottom';
    const fill = colors.bottom || 'transparent';
    if (equipped.bottom === 'trousers') return <Trousers className="absolute inset-0 cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('bottom')} />;
    if (equipped.bottom === 'shorts') return <Shorts className="absolute inset-0 cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('bottom')} />;
    return null;
  };

  const renderOuterwear = () => {
    const isActive = selectedLayer === 'outerwear';
    const fill = colors.outerwear || 'transparent';
    if (equipped.outerwear === 'jacket') return <Jacket className="absolute inset-0 cursor-pointer" fillColor={fill} isActive={isActive} onClick={() => onLayerClick('outerwear')} />;
    return null;
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[1/2] flex justify-center items-center">
      {/* Base Layer */}
      <HumanoidBase className="absolute inset-0 pointer-events-none" />
      
      {/* Garments (rendered in z-index order: bottom -> top -> outerwear) */}
      <div className="absolute inset-0 z-10">
        {renderBottom()}
      </div>
      <div className="absolute inset-0 z-20">
        {renderTop()}
      </div>
      <div className="absolute inset-0 z-30">
        {renderOuterwear()}
      </div>
    </div>
  );
};

export default StylingMannequin;
