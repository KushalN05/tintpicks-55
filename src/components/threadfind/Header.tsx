import React from 'react';
import { Bookmark, Sparkles, SlidersHorizontal, Camera, Database, HelpCircle } from 'lucide-react';
import { SearchMode } from '@/types/threadfind';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onNewSearch: () => void;
  onOpenHowItWorks: () => void;
  onOpenTechModal: () => void;
  searchMode: SearchMode;
  onToggleSearchMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  onNewSearch,
  onOpenHowItWorks,
  onOpenTechModal,
  searchMode,
  onToggleSearchMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E2DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onNewSearch}>
          <div className="w-9 h-9 rounded-full bg-[#285C47] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="font-editorial text-xl font-bold tracking-tight">T</span>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-2xl font-semibold tracking-tight text-[#191919] group-hover:text-[#285C47] transition-colors">
              ThreadFind
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#77736F] font-medium hidden sm:block">
              Visual Clothing Search
            </span>
          </div>
        </div>

        {/* Minimal Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#77736F]">
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-[#191919] transition-colors flex items-center space-x-1.5 py-1"
          >
            <HelpCircle className="w-4 h-4 text-[#77736F]" />
            <span>How it works</span>
          </button>

          <button
            onClick={onNewSearch}
            className="hover:text-[#191919] transition-colors flex items-center space-x-1.5 py-1"
          >
            <Camera className="w-4 h-4 text-[#77736F]" />
            <span>New search</span>
          </button>

          <button
            onClick={onOpenTechModal}
            className="hover:text-[#191919] transition-colors flex items-center space-x-1.5 py-1"
            title="Inspect Vector Search & AI Architecture"
          >
            <Database className="w-4 h-4 text-[#77736F]" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Actions & Saved Items */}
        <div className="flex items-center space-x-3">
          {/* Mode Pill Indicator */}
          <button
            onClick={onToggleSearchMode}
            className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              searchMode === 'demo'
                ? 'bg-[#E8EFE9] text-[#285C47] border-[#285C47]/20 hover:bg-[#D3DFD5]'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Toggle between Seeded Demo Mode and Live Vector Search"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{searchMode === 'demo' ? 'Demo Mode (Seeded)' : 'pgvector Live'}</span>
          </button>

          {/* Saved Items Counter Button */}
          <button
            onClick={onOpenSaved}
            className="relative inline-flex items-center space-x-2 px-3 py-1.5 rounded-md border border-[#E6E2DC] bg-white text-[#191919] text-sm font-medium hover:bg-[#F4F1EA] transition-all shadow-xs"
            aria-label="View saved garments"
          >
            <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-[#285C47] text-[#285C47]' : 'text-[#77736F]'}`} />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-[#285C47] text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Mobile New Search CTA */}
          <button
            onClick={onNewSearch}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-[#E6E2DC] bg-white text-[#191919] hover:bg-[#F4F1EA]"
            aria-label="Start search"
          >
            <Camera className="w-4 h-4 text-[#285C47]" />
          </button>
        </div>
      </div>
    </header>
  );
};
