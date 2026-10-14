import React from 'react';
import { CatalogueProduct, SearchResult } from '@/types/threadfind';
import { X, Trash2, ExternalLink, Bookmark, ArrowRight, Columns } from 'lucide-react';

interface SavedItemsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProducts: CatalogueProduct[];
  onRemoveItem: (productId: string) => void;
  onClearAll: () => void;
  onInspectItem: (product: CatalogueProduct) => void;
  onStartSearch: () => void;
}

export const SavedItemsDrawer: React.FC<SavedItemsDrawerProps> = ({
  isOpen,
  onClose,
  savedProducts,
  onRemoveItem,
  onClearAll,
  onInspectItem,
  onStartSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#E6E2DC]">
        {/* Header */}
        <div className="p-6 border-b border-[#E6E2DC] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#285C47] fill-[#285C47]" />
            <h3 className="font-editorial text-xl text-[#191919]">Saved Items</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8EFE9] text-[#285C47] font-semibold">
              {savedProducts.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {savedProducts.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-[#77736F] hover:text-[#9E2A2B] transition-colors"
                title="Clear all saved garments"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#E6E2DC] text-[#77736F]"
              aria-label="Close saved drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#77736F]">
              <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E2DC] flex items-center justify-center mb-4 text-[#77736F]">
                <Bookmark className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h4 className="font-editorial text-xl text-[#191919] mb-1">
                Your wardrobe shortlist is empty
              </h4>
              <p className="text-xs text-[#77736F] max-w-xs mb-6">
                When searching, tap the bookmark icon on any garment to save and compare it later.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartSearch();
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all shadow-sm"
              >
                <span>Start a search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            savedProducts.map(product => (
              <div
                key={product.id}
                className="p-3 rounded-lg border border-[#E6E2DC] bg-[#FAF9F6] hover:bg-white transition-all flex items-center space-x-3 group"
              >
                <div
                  className="w-16 h-20 rounded bg-white overflow-hidden shrink-0 border border-[#E6E2DC] cursor-pointer"
                  onClick={() => {
                    onClose();
                    onInspectItem(product);
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      if (product.fallback_image_url && e.currentTarget.src !== product.fallback_image_url) {
                        e.currentTarget.src = product.fallback_image_url;
                      }
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#77736F]">
                    {product.brand}
                  </span>
                  <h4
                    className="text-xs font-semibold text-[#191919] truncate cursor-pointer hover:text-[#285C47]"
                    onClick={() => {
                      onClose();
                      onInspectItem(product);
                    }}
                  >
                    {product.title}
                  </h4>
                  <div className="text-xs font-bold text-[#191919] mt-1">
                    £{product.price.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-[#77736F]">via {product.merchant}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1.5 rounded text-[#77736F] hover:text-[#9E2A2B] hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded text-[#77736F] hover:text-[#285C47] hover:bg-[#E8EFE9] transition-colors"
                    title="Visit retailer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="p-6 border-t border-[#E6E2DC] bg-[#FAF9F6]">
            <div className="flex items-center justify-between text-xs mb-3 text-[#77736F]">
              <span>Saved Items Total:</span>
              <span className="font-bold text-[#191919] text-sm">
                £{savedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
