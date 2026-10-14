import React, { useState, useRef } from 'react';
import { CropRegion, GarmentCategory } from '@/types/threadfind';
import { Crop, RefreshCw, X, Search, Sparkles, Check, Sliders } from 'lucide-react';

interface ImagePreparationProps {
  imageSrc: string;
  scenarioId?: 'jacket' | 'cardigan' | 'rugby' | 'jeans' | 'custom';
  initialCategory?: GarmentCategory;
  onConfirmSearch: (crop?: CropRegion, category?: GarmentCategory) => void;
  onReplaceImage: () => void;
  onRemoveImage: () => void;
}

const CATEGORIES: GarmentCategory[] = [
  'Jackets',
  'Knitwear',
  'Tops',
  'Trousers',
  'Dresses',
  'Shoes',
  'Other',
];

export const ImagePreparation: React.FC<ImagePreparationProps> = ({
  imageSrc,
  scenarioId,
  initialCategory,
  onConfirmSearch,
  onReplaceImage,
  onRemoveImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | undefined>(
    initialCategory ||
      (scenarioId === 'jacket'
        ? 'Jackets'
        : scenarioId === 'cardigan'
        ? 'Knitwear'
        : scenarioId === 'rugby'
        ? 'Tops'
        : scenarioId === 'jeans'
        ? 'Trousers'
        : undefined)
  );

  const [cropPreset, setCropPreset] = useState<'full' | 'upper' | 'lower' | 'custom'>('full');
  const [cropBox, setCropBox] = useState<CropRegion>({ x: 5, y: 5, width: 90, height: 90 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePresetChange = (preset: 'full' | 'upper' | 'lower') => {
    setCropPreset(preset);
    if (preset === 'full') {
      setCropBox({ x: 4, y: 4, width: 92, height: 92 });
    } else if (preset === 'upper') {
      setCropBox({ x: 10, y: 5, width: 80, height: 55 });
    } else if (preset === 'lower') {
      setCropBox({ x: 15, y: 45, width: 70, height: 50 });
    }
  };

  const predictedLabel = scenarioId === 'jacket'
    ? 'Leather jacket / Outerwear'
    : scenarioId === 'cardigan'
    ? 'Cable-knit cardigan'
    : scenarioId === 'rugby'
    ? 'Striped rugby shirt'
    : scenarioId === 'jeans'
    ? 'Straight-leg denim jeans'
    : 'Detected clothing item';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6E2DC]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#285C47] font-semibold">
            Query Preparation
          </span>
          <h2 className="font-editorial text-2xl text-[#191919] mt-0.5">
            Refine & focus your photo
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onReplaceImage}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-[#E6E2DC] bg-white text-xs font-medium text-[#191919] hover:bg-[#FAF9F6] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#77736F]" />
            <span>Replace</span>
          </button>
          <button
            type="button"
            onClick={onRemoveImage}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-[#E6E2DC] bg-white text-xs font-medium text-[#9E2A2B] hover:bg-red-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Image & Crop Viewport */}
        <div className="md:col-span-7 bg-white p-4 rounded-xl border border-[#E6E2DC] shadow-sm">
          <div className="flex items-center justify-between mb-3 text-xs text-[#77736F]">
            <span className="flex items-center space-x-1">
              <Crop className="w-3.5 h-3.5 text-[#285C47]" />
              <span>Garment focus region</span>
            </span>
            <span>Drag boundary to isolate piece</span>
          </div>

          <div
            ref={containerRef}
            className="relative aspect-square w-full rounded-lg bg-[#FAF9F6] overflow-hidden select-none border border-[#E6E2DC]"
          >
            <img
              src={imageSrc}
              alt="Query preview"
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Crop Overlay Bounding Box */}
            <div
              className="absolute border-2 border-[#285C47] bg-[#285C47]/10 transition-all cursor-move shadow-[0_0_0_9999px_rgba(25,25,25,0.45)]"
              style={{
                top: `${cropBox.y}%`,
                left: `${cropBox.x}%`,
                width: `${cropBox.width}%`,
                height: `${cropBox.height}%`,
              }}
            >
              {/* Corner Grips */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#285C47] rounded-xs" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#285C47] rounded-xs" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#285C47] rounded-xs" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#285C47] rounded-xs" />

              {/* Center Target Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 border border-[#285C47]/60 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#285C47] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Region Presets */}
          <div className="mt-4 flex items-center justify-between text-xs pt-2">
            <span className="text-[#77736F] font-medium">Quick crop presets:</span>
            <div className="flex space-x-1.5">
              <button
                type="button"
                onClick={() => handlePresetChange('full')}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  cropPreset === 'full'
                    ? 'bg-[#285C47] text-white border-[#285C47]'
                    : 'bg-white text-[#191919] border-[#E6E2DC] hover:bg-[#FAF9F6]'
                }`}
              >
                Whole image
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('upper')}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  cropPreset === 'upper'
                    ? 'bg-[#285C47] text-white border-[#285C47]'
                    : 'bg-white text-[#191919] border-[#E6E2DC] hover:bg-[#FAF9F6]'
                }`}
              >
                Focus Top
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('lower')}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  cropPreset === 'lower'
                    ? 'bg-[#285C47] text-white border-[#285C47]'
                    : 'bg-white text-[#191919] border-[#E6E2DC] hover:bg-[#FAF9F6]'
                }`}
              >
                Focus Bottom
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Detection & Category Fine-tuning */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E6E2DC] shadow-sm">
            {/* Visual Identification Badge */}
            <div className="mb-5 pb-4 border-b border-[#E6E2DC]">
              <span className="text-[11px] uppercase tracking-wider text-[#77736F] font-medium">
                Detected Garment
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-editorial text-lg text-[#191919] font-medium">
                  {predictedLabel}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8EFE9] text-[#285C47]">
                  High visual confidence
                </span>
              </div>
            </div>

            {/* Optional Category Refinement */}
            <div>
              <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
                Optional Category Focus
              </label>
              <p className="text-xs text-[#77736F] mb-3">
                Leave unselected to search the whole catalogue, or narrow down to a specific garment department.
              </p>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(prev => (prev === cat ? undefined : cat))
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#285C47] text-white shadow-xs'
                        : 'bg-[#FAF9F6] text-[#191919] border border-[#E6E2DC] hover:border-[#CCC7BE]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Card */}
          <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E6E2DC]">
            <button
              type="button"
              onClick={() => onConfirmSearch(cropBox, selectedCategory)}
              className="w-full inline-flex items-center justify-center space-x-2.5 px-6 py-4 rounded-lg bg-[#285C47] text-white text-base font-medium hover:bg-[#1F4A39] transition-all shadow-md active:scale-98"
            >
              <Search className="w-5 h-5" />
              <span>Find my match</span>
            </button>
            <p className="mt-3 text-center text-xs text-[#77736F]">
              Vector search will rank exact and nearest visual items first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
