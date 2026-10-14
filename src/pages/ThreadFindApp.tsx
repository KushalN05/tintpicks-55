import React, { useState } from 'react';
import {
  SearchQuery,
  SearchResult,
  CropRegion,
  GarmentCategory,
  SearchMode,
  CatalogueProduct,
} from '@/types/threadfind';
import { Header } from '@/components/threadfind/Header';
import { HeroUploader } from '@/components/threadfind/HeroUploader';
import { SampleSearches } from '@/components/threadfind/SampleSearches';
import { HowItWorks } from '@/components/threadfind/HowItWorks';
import { ImagePreparation } from '@/components/threadfind/ImagePreparation';
import { SearchProgress } from '@/components/threadfind/SearchProgress';
import { SearchResultsView } from '@/components/threadfind/SearchResultsView';
import { ProductComparisonModal } from '@/components/threadfind/ProductComparisonModal';
import { SavedItemsDrawer } from '@/components/threadfind/SavedItemsDrawer';
import { CameraCaptureModal } from '@/components/threadfind/CameraCaptureModal';
import { TechArchitectureModal } from '@/components/threadfind/TechArchitectureModal';
import { useSavedItems } from '@/hooks/useSavedItems';
import { executeVisualSearch } from '@/services/searchEngine';
import { sampleGarments } from '@/data/catalogue';
import { AlertCircle, RotateCcw, Camera } from 'lucide-react';

type AppStep = 'home' | 'prepare' | 'searching' | 'results' | 'error';

export const ThreadFindApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [searchMode, setSearchMode] = useState<SearchMode>('vector');

  // Query state
  const [queryImage, setQueryImage] = useState<string>('');
  const [activeScenarioId, setActiveScenarioId] = useState<
    'jacket' | 'cardigan' | 'rugby' | 'jeans' | 'custom' | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modals & Drawers
  const [comparisonResult, setComparisonResult] = useState<SearchResult | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  // Saved items hook
  const { savedProducts, toggleSave, isSaved, clearAll, count: savedCount } = useSavedItems();

  // Core execution helper
  const executeSearchWithImage = async (
    imgUrl: string,
    category?: GarmentCategory,
    scenarioId?: 'jacket' | 'cardigan' | 'rugby' | 'jeans' | 'custom',
    crop?: CropRegion
  ) => {
    setCurrentStep('searching');
    setSearchError(null);
    setQueryImage(imgUrl);
    if (category) setSelectedCategory(category);
    if (scenarioId) setActiveScenarioId(scenarioId);

    const query: SearchQuery = {
      imageUrl: imgUrl,
      crop,
      selectedCategory: category,
      scenarioId: scenarioId || activeScenarioId,
    };

    try {
      const results = await executeVisualSearch(query, searchMode);
      if (!results || results.length === 0) {
        throw new Error('No visually similar items returned from the catalogue.');
      }
      setSearchResults(results);
      setCurrentStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Visual search failed:', err);
      setSearchError(
        err.message || 'Unable to complete visual search. Please check your network connection and retry.'
      );
      setCurrentStep('error');
    }
  };

  // Handle image upload from file or URL
  const handleImageSelected = (
    fileOrUrl: File | string,
    scenarioId?: 'jacket' | 'cardigan' | 'rugby' | 'jeans'
  ) => {
    setActiveScenarioId(scenarioId || 'custom');

    if (typeof fileOrUrl === 'string') {
      setQueryImage(fileOrUrl);
      setCurrentStep('prepare');
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          setQueryImage(e.target.result as string);
          setCurrentStep('prepare');
        }
      };
      reader.readAsDataURL(fileOrUrl);
    }
  };

  // Handle sample selection from curated scenarios
  const handleSelectSample = (scenarioId: 'jacket' | 'cardigan' | 'rugby' | 'jeans') => {
    const sample = sampleGarments.find(s => s.id === scenarioId);
    if (!sample) return;
    setActiveScenarioId(scenarioId);
    setQueryImage(sample.imageUrl);
    setSelectedCategory(sample.category);
    setCurrentStep('prepare');
  };

  // Handle camera capture result: directly executes visual search on accepted photo
  const handleCameraCapture = (imageDataUrl: string) => {
    setIsCameraOpen(false);
    executeSearchWithImage(imageDataUrl, undefined, 'custom');
  };

  // Trigger visual search execution from ImagePreparation
  const handleConfirmSearch = async (crop?: CropRegion, category?: GarmentCategory) => {
    await executeSearchWithImage(queryImage, category, activeScenarioId, crop);
  };

  const handleInspectSavedItem = (product: CatalogueProduct) => {
    const foundResult = searchResults.find(r => r.product.id === product.id) || {
      product,
      rawSimilarity: 0.95,
      calibratedScore: 95.0,
      tier: 'Near-identical' as const,
      visualMatchReasons: product.match_reasons || ['Matched from your saved wardrobe shortlist'],
      attributeComparisons: [],
    };
    setComparisonResult(foundResult);
  };

  const handleScrollToSamples = () => {
    const el = document.getElementById('sample-searches');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#191919] font-sans selection:bg-[#E8EFE9] selection:text-[#285C47]">
      {/* Universal Header */}
      <Header
        savedCount={savedCount}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onNewSearch={() => setCurrentStep('home')}
        onOpenHowItWorks={handleScrollToHowItWorks}
        onOpenTechModal={() => setIsTechModalOpen(true)}
        searchMode={searchMode}
        onToggleSearchMode={() =>
          setSearchMode(prev => (prev === 'demo' ? 'vector' : 'demo'))
        }
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentStep === 'home' && (
          <>
            <HeroUploader
              onImageSelected={handleImageSelected}
              onLaunchCamera={() => setIsCameraOpen(true)}
              onScrollToSamples={handleScrollToSamples}
            />
            <SampleSearches onSelectSample={handleSelectSample} />
            <HowItWorks />
          </>
        )}

        {currentStep === 'prepare' && (
          <ImagePreparation
            imageSrc={queryImage}
            scenarioId={activeScenarioId}
            initialCategory={selectedCategory}
            onConfirmSearch={handleConfirmSearch}
            onReplaceImage={() => setCurrentStep('home')}
            onRemoveImage={() => setCurrentStep('home')}
          />
        )}

        {currentStep === 'searching' && (
          <SearchProgress queryImageUrl={queryImage} />
        )}

        {currentStep === 'results' && (
          <SearchResultsView
            queryImageUrl={queryImage}
            identifiedCategory={selectedCategory}
            results={searchResults}
            searchMode={searchMode}
            onChangePhoto={() => setCurrentStep('home')}
            onTakeAnotherPhoto={() => setIsCameraOpen(true)}
            onSelectProduct={res => setComparisonResult(res)}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {currentStep === 'error' && (
          <div className="max-w-md mx-auto py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-[#9E2A2B]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#191919] mb-2">
              Visual Search Encountered an Issue
            </h2>
            <p className="text-xs text-[#77736F] leading-relaxed mb-6">
              {searchError || 'An error occurred while computing embeddings or querying the catalogue.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => executeSearchWithImage(queryImage, selectedCategory, activeScenarioId)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md border border-[#E6E2DC] bg-white text-[#191919] text-xs font-semibold hover:bg-[#FAF9F6] transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Take another photo</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep('home')}
                className="w-full sm:w-auto px-4 py-2 text-xs text-[#77736F] hover:text-[#191919]"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Slide-over Drawers */}
      <ProductComparisonModal
        queryImageUrl={queryImage}
        result={comparisonResult}
        onClose={() => setComparisonResult(null)}
        isSaved={comparisonResult ? isSaved(comparisonResult.product.id) : false}
        onToggleSave={toggleSave}
      />

      <SavedItemsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProducts={savedProducts}
        onRemoveItem={toggleSave}
        onClearAll={clearAll}
        onInspectItem={handleInspectSavedItem}
        onStartSearch={() => setCurrentStep('home')}
      />

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      <TechArchitectureModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
        searchMode={searchMode}
        onToggleSearchMode={() =>
          setSearchMode(prev => (prev === 'demo' ? 'vector' : 'demo'))
        }
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E6E2DC] bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736F] gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-editorial text-base text-[#191919] font-semibold">
              ThreadFind
            </span>
            <span>— AI-Powered Exact Clothing Search</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsTechModalOpen(true)}
              className="hover:text-[#191919] underline transition-colors"
            >
              Postgres pgvector Architecture
            </button>
            <button
              onClick={handleScrollToHowItWorks}
              className="hover:text-[#191919] transition-colors"
            >
              How It Works
            </button>
            <span>“See it. Snap it. Find it.”</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
