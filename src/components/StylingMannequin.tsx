import React from 'react';

export type GarmentLayer = 'torso' | 'legs' | 'outerwear' | 'shoes';

interface StylingMannequinProps {
  colors: Record<GarmentLayer, string>;
  activeLayers: Record<GarmentLayer, boolean>;
  onLayerClick?: (layer: GarmentLayer) => void;
  selectedLayer?: GarmentLayer | null;
}

const StylingMannequin: React.FC<StylingMannequinProps> = ({
  colors,
  activeLayers,
  onLayerClick,
  selectedLayer,
}) => {
  // A sleek, minimal set of SVG paths representing a fashion silhouette
  // We divide the body into distinct paths for color targeting.

  const getLayerStyle = (layer: GarmentLayer) => ({
    fill: activeLayers[layer] ? colors[layer] : 'transparent',
    stroke: selectedLayer === layer ? '#000000' : '#E5E7EB', // Highlight if selected
    strokeWidth: selectedLayer === layer ? 2 : 1,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  });

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] flex justify-center items-center">
      <svg
        viewBox="0 0 200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Base silhouette outline (Head/Neck) - uncolored */}
        <path
          d="M100 20C90 20 82 28 82 38C82 48 90 56 100 56C110 56 118 48 118 38C118 28 110 20 100 20ZM95 55V70H105V55H95Z"
          fill="#F3F4F6"
          stroke="#D1D5DB"
          strokeWidth="1"
        />

        {/* Legs Layer */}
        {activeLayers.legs && (
          <path
            d="M75 190 L65 350 L85 350 L95 190 Z M125 190 L135 350 L115 350 L105 190 Z M75 190 Q100 210 125 190 Z"
            style={getLayerStyle('legs')}
            onClick={() => onLayerClick?.('legs')}
          />
        )}

        {/* Torso Layer */}
        {activeLayers.torso && (
          <path
            d="M70 70 Q100 85 130 70 L125 190 Q100 200 75 190 Z"
            style={getLayerStyle('torso')}
            onClick={() => onLayerClick?.('torso')}
          />
        )}

        {/* Shoes Layer */}
        {activeLayers.shoes && (
          <path
            d="M60 350 Q65 370 85 370 L85 350 Z M140 350 Q135 370 115 370 L115 350 Z"
            style={getLayerStyle('shoes')}
            onClick={() => onLayerClick?.('shoes')}
          />
        )}

        {/* Outerwear Layer (Overlaps Torso and arms) */}
        {activeLayers.outerwear && (
          <path
            d="M60 70 L50 180 L65 180 L70 90 L70 210 L130 210 L130 90 L135 180 L150 180 L140 70 Q100 50 60 70 Z"
            style={getLayerStyle('outerwear')}
            onClick={() => onLayerClick?.('outerwear')}
          />
        )}
      </svg>
    </div>
  );
};

export default StylingMannequin;
