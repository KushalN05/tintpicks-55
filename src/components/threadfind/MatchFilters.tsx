import React from 'react';
import { FilterOptions, GarmentCategory, GarmentColour } from '@/types/threadfind';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface MatchFiltersProps {
  filters: FilterOptions;
  onChange: (updated: Partial<FilterOptions>) => void;
  onClearAll: () => void;
  resultCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const CATEGORIES: ('all' | GarmentCategory)[] = [
  'all',
  'Jackets',
  'Knitwear',
  'Tops',
  'Trousers',
  'Dresses',
  'Shoes',
  'Other',
];

const COLOURS: { label: string; value: 'all' | GarmentColour; swatch?: string }[] = [
  { label: 'All Colours', value: 'all' },
  { label: 'Black', value: 'Black', swatch: '#191919' },
  { label: 'White & Cream', value: 'White and cream', swatch: '#FAF6EE' },
  { label: 'Brown', value: 'Brown', swatch: '#5A3825' },
  { label: 'Blue', value: 'Blue', swatch: '#243C5A' },
  { label: 'Green', value: 'Green', swatch: '#285C47' },
  { label: 'Red & Pink', value: 'Red and pink', swatch: '#B83232' },
  { label: 'Grey', value: 'Grey', swatch: '#77736F' },
  { label: 'Multicolour', value: 'Multicolour', swatch: 'conic-gradient(red, yellow, green, blue, purple, red)' },
];

export const MatchFilters: React.FC<MatchFiltersProps> = ({
  filters,
  onChange,
  onClearAll,
  resultCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isFiltered =
    filters.similarityTier !== 'all' ||
    filters.category !== 'all' ||
    filters.colour !== 'all' ||
    filters.pricePreset !== 'all' ||
    filters.sortBy !== 'similarity';

  const filterContent = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#285C47]" />
          <span className="font-semibold text-sm text-[#191919]">Refine Matches</span>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-[#285C47] hover:underline flex items-center space-x-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sorting Control */}
      <div>
        <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
          Sort by
        </label>
        <select
          value={filters.sortBy}
          onChange={e => onChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
          className="w-full text-xs rounded-md border border-[#E6E2DC] bg-white px-3 py-2 text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#285C47]"
        >
          <option value="similarity">Best Visual Match</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {/* Visual Similarity Tier Filter */}
      <div>
        <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
          Visual Similarity
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Results' },
            { id: '95', label: '95%+ Strongest Matches' },
            { id: '90', label: '90%+ Very Close Matches' },
            { id: '80', label: '80%+ Close Alternatives' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ similarityTier: opt.id as FilterOptions['similarityTier'] })}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors text-left ${
                filters.similarityTier === opt.id
                  ? 'bg-[#E8EFE9] text-[#285C47] font-semibold'
                  : 'text-[#77736F] hover:bg-[#FAF9F6] hover:text-[#191919]'
              }`}
            >
              <span>{opt.label}</span>
              {filters.similarityTier === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#285C47]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Category Multi-choice Filter */}
      <div>
        <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange({ category: cat })}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                filters.category === cat
                  ? 'bg-[#285C47] text-white font-medium'
                  : 'bg-white border border-[#E6E2DC] text-[#77736F] hover:border-[#CCC7BE] hover:text-[#191919]'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Colour Filter */}
      <div>
        <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
          Colour
        </label>
        <div className="space-y-1">
          {COLOURS.map(col => (
            <button
              key={col.value}
              type="button"
              onClick={() => onChange({ colour: col.value })}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded text-xs transition-colors text-left ${
                filters.colour === col.value
                  ? 'bg-[#E8EFE9] text-[#285C47] font-semibold'
                  : 'text-[#77736F] hover:bg-[#FAF9F6] hover:text-[#191919]'
              }`}
            >
              {col.swatch && (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ background: col.swatch }}
                />
              )}
              <span className="truncate">{col.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Presets */}
      <div>
        <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Any Price' },
            { id: 'under50', label: 'Under £50' },
            { id: 'under100', label: 'Under £100' },
            { id: 'under200', label: 'Under £200' },
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ pricePreset: p.id as FilterOptions['pricePreset'] })}
              className={`px-2 py-1.5 rounded text-xs text-center border transition-colors ${
                filters.pricePreset === p.id
                  ? 'bg-[#285C47] text-white border-[#285C47] font-medium'
                  : 'bg-white text-[#77736F] border-[#E6E2DC] hover:border-[#CCC7BE]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-xl border border-[#E6E2DC] shadow-xs self-start sticky top-24">
        {filterContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white p-6 shadow-xl flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6E2DC]">
                <span className="font-editorial text-lg text-[#191919]">Filters</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-md hover:bg-[#FAF9F6] text-[#77736F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-[#E6E2DC] mt-6">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-md bg-[#285C47] text-white text-xs font-semibold"
              >
                Show {resultCount} {resultCount === 1 ? 'Match' : 'Matches'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
