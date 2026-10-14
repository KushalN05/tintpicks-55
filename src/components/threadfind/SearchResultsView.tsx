import React, { useState, useMemo } from 'react';
import { SearchResult, FilterOptions, GarmentCategory, GarmentColour, SearchMode } from '@/types/threadfind';
import { FeaturedMatchCard } from './FeaturedMatchCard';
import { ProductCard } from './ProductCard';
import { MatchFilters } from './MatchFilters';
import { RefreshCw, SlidersHorizontal, ArrowLeft, AlertCircle, RotateCcw, Camera } from 'lucide-react';

interface SearchResultsViewProps {
  queryImageUrl: string;
  identifiedCategory?: GarmentCategory | string;
  results: SearchResult[];
  searchMode: SearchMode;
  onChangePhoto: () => void;
  onTakeAnotherPhoto?: () => void;
  onSelectProduct: (result: SearchResult) => void;
  isSaved: (productId: string) => boolean;
  onToggleSave: (productId: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  queryImageUrl,
  identifiedCategory,
  results,
  searchMode,
  onChangePhoto,
  onTakeAnotherPhoto,
  onSelectProduct,
  isSaved,
  onToggleSave,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    similarityTier: 'all',
    category: 'all',
    colour: 'all',
    pricePreset: 'all',
    sortBy: 'similarity',
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (updated: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...updated }));
  };

  const handleClearFilters = () => {
    setFilters({
      similarityTier: 'all',
      category: 'all',
      colour: 'all',
      pricePreset: 'all',
      sortBy: 'similarity',
    });
  };

  // Filter & sort results deterministically
  const filteredResults = useMemo(() => {
    return results.filter(item => {
      // Similarity filter
      if (filters.similarityTier === '95' && item.calibratedScore < 95.0) return false;
      if (filters.similarityTier === '90' && item.calibratedScore < 90.0) return false;
      if (filters.similarityTier === '80' && item.calibratedScore < 80.0) return false;

      // Category filter
      if (filters.category !== 'all' && item.product.category !== filters.category) return false;

      // Colour filter
      if (filters.colour !== 'all' && item.product.colour !== filters.colour) return false;

      // Price preset filter
      if (filters.pricePreset === 'under25' && item.product.price >= 25) return false;
      if (filters.pricePreset === 'under50' && item.product.price >= 50) return false;
      if (filters.pricePreset === 'under100' && item.product.price >= 100) return false;
      if (filters.pricePreset === 'under200' && item.product.price >= 200) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.product.price - b.product.price;
      if (filters.sortBy === 'price-desc') return b.product.price - a.product.price;
      if (filters.sortBy === 'newest') {
        const dateA = a.product.createdAt ? new Date(a.product.createdAt).getTime() : 0;
        const dateB = b.product.createdAt ? new Date(b.product.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      return b.calibratedScore - a.calibratedScore;
    });
  }, [results, filters]);

  // Featured top match is the first item if similarity-sorted and not empty
  const featuredItem = filteredResults.length > 0 && filters.sortBy === 'similarity' ? filteredResults[0] : null;
  const remainingItems = featuredItem ? filteredResults.slice(1) : filteredResults;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Query Reference Banner */}
      <div className="bg-white rounded-xl border border-[#E6E2DC] p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative w-16 h-16 rounded-lg bg-[#FAF9F6] overflow-hidden border border-[#E6E2DC] shrink-0">
            <img
              src={queryImageUrl}
              alt="Query input"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#77736F]">
                Your Photo
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8EFE9] text-[#285C47]">
                {identifiedCategory || 'Detected Item'}
              </span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl text-[#191919] mt-0.5">
              Your closest matches
            </h2>
            <p className="text-xs text-[#77736F]">
              Ranked by visual similarity to your photo.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-[#191919] block">
              {filteredResults.length} matching {filteredResults.length === 1 ? 'item' : 'items'}
            </span>
            <span className="text-[10px] text-[#77736F]">
              {searchMode === 'demo' ? 'Curated visual vector match' : 'Gemini 2 Visual Embedding'}
            </span>
          </div>

          {/* Primary Take another photograph CTA */}
          <button
            type="button"
            onClick={onTakeAnotherPhoto || onChangePhoto}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take another photograph</span>
          </button>

          {/* Secondary Change / upload photo button */}
          <button
            type="button"
            onClick={onChangePhoto}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-md border border-[#E6E2DC] bg-[#FAF9F6] text-xs font-medium text-[#77736F] hover:text-[#191919] hover:bg-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Change</span>
          </button>

          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-[#285C47] text-white text-xs font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Results Grid */}
      <div className="flex items-start gap-8">
        {/* Desktop Filter Sidebar */}
        <MatchFilters
          filters={filters}
          onChange={handleFilterChange}
          onClearAll={handleClearFilters}
          resultCount={filteredResults.length}
          isOpenMobile={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          {filteredResults.length === 0 ? (
            /* Friendly Empty State */
            <div className="bg-white rounded-xl border border-[#E6E2DC] p-12 text-center my-6">
              <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-[#E6E2DC] flex items-center justify-center mx-auto mb-4 text-[#77736F]">
                <AlertCircle className="w-6 h-6 stroke-[1.6]" />
              </div>
              <h3 className="font-editorial text-2xl text-[#191919] mb-1">
                No close matches found
              </h3>
              <p className="text-xs text-[#77736F] max-w-sm mx-auto mb-6">
                No items in the catalogue meet your current filter criteria. Try lowering the similarity threshold or clearing category constraints.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear filters</span>
                </button>
                <button
                  type="button"
                  onClick={onChangePhoto}
                  className="px-4 py-2 rounded-md border border-[#E6E2DC] bg-white text-[#191919] text-xs font-medium hover:bg-[#FAF9F6]"
                >
                  Try another photo
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Featured Best Match Card (if in similarity sort) */}
              {featuredItem && (
                <FeaturedMatchCard
                  result={featuredItem}
                  isSaved={isSaved(featuredItem.product.id)}
                  onToggleSave={onToggleSave}
                  onSelectProduct={onSelectProduct}
                />
              )}

              {/* Subheading for remaining matches */}
              {remainingItems.length > 0 && (
                <div className="mb-6 flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                  <h3 className="font-editorial text-xl text-[#191919]">
                    {featuredItem ? 'More close matches' : 'All ranked matches'}
                  </h3>
                  <span className="text-xs text-[#77736F]">
                    Showing {remainingItems.length} {remainingItems.length === 1 ? 'garment' : 'garments'}
                  </span>
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {remainingItems.map(result => (
                  <ProductCard
                    key={result.product.id}
                    result={result}
                    isSaved={isSaved(result.product.id)}
                    onToggleSave={onToggleSave}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
