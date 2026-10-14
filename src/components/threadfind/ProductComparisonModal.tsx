import React, { useState } from 'react';
import { SearchResult } from '@/types/threadfind';
import { X, ArrowLeft, Bookmark, ExternalLink, Check, Sparkles, SlidersHorizontal, Info } from 'lucide-react';

interface ProductComparisonModalProps {
  queryImageUrl: string;
  result: SearchResult | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  queryImageUrl,
  result,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!result) return null;

  const { product, calibratedScore, tier, visualMatchReasons, attributeComparisons } = result;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E6E2DC] my-8 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E6E2DC] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#77736F] hover:text-[#191919] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to results</span>
            </button>
            <span className="text-[#E6E2DC]">|</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#285C47]">
                Visual Comparison
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#285C47] text-white">
                {calibratedScore.toFixed(1)}% {tier}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onToggleSave(product.id)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                isSaved
                  ? 'bg-[#E8EFE9] border-[#285C47] text-[#285C47]'
                  : 'bg-white border-[#E6E2DC] text-[#191919] hover:bg-[#FAF9F6]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#285C47]' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#E6E2DC] text-[#77736F] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Side-by-Side Images Header */}
          <div>
            <div className="text-center mb-4">
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#191919]">
                Side-by-Side Verification
              </h3>
              <p className="text-xs text-[#77736F] mt-1">
                Comparing your original input against the catalogue product.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF9F6] p-4 sm:p-6 rounded-xl border border-[#E6E2DC]">
              {/* Left Column: Reference Photo */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#77736F]">
                    Your Photo (Reference)
                  </span>
                  <span className="text-[11px] text-[#77736F]">Input image</span>
                </div>
                <div className="relative aspect-square w-full rounded-lg bg-white overflow-hidden border border-[#E6E2DC] shadow-xs">
                  <img
                    src={queryImageUrl}
                    alt="Your query"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right Column: Matched Catalogue Item */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#285C47]">
                    Matched Catalogue Garment
                  </span>
                  <span className="text-[11px] font-semibold text-[#285C47]">
                    {calibratedScore.toFixed(1)}% Match
                  </span>
                </div>
                <div className="relative aspect-square w-full rounded-lg bg-white overflow-hidden border border-[#285C47]/40 shadow-xs">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      if (product.fallback_image_url && e.currentTarget.src !== product.fallback_image_url) {
                        e.currentTarget.src = product.fallback_image_url;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Why This Looks Similar */}
          <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E6E2DC]">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#285C47]" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#191919]">
                Why this looks similar
              </h4>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#191919]">
              {visualMatchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-white p-3 rounded-md border border-[#E6E2DC]">
                  <Check className="w-4 h-4 text-[#285C47] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribute Comparison Breakdown Table */}
          {attributeComparisons && attributeComparisons.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#191919] mb-3">
                Feature-Level Attribute Analysis
              </h4>
              <div className="border border-[#E6E2DC] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF9F6] text-[#77736F] uppercase border-b border-[#E6E2DC] font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Garment Feature</th>
                      <th className="px-4 py-3">Query Observation</th>
                      <th className="px-4 py-3">Product Specification</th>
                      <th className="px-4 py-3 text-right">Alignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2DC]">
                    {attributeComparisons.map((attr, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F6]/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-[#191919]">{attr.feature}</td>
                        <td className="px-4 py-3 text-[#77736F]">{attr.queryValue}</td>
                        <td className="px-4 py-3 text-[#191919] font-medium">{attr.productValue}</td>
                        <td className="px-4 py-3 text-right">
                          {attr.isMatch ? (
                            <span className="inline-flex items-center space-x-1 text-[#285C47] font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Match</span>
                            </span>
                          ) : (
                            <span className="text-[#77736F] text-[11px]">Variant</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Specifications & Purchase Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-xl border border-[#E6E2DC] shadow-xs gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#77736F] font-semibold">
                {product.brand} · {product.category}
              </span>
              <h3 className="font-editorial text-2xl text-[#191919] font-medium mt-0.5">
                {product.title}
              </h3>
              <div className="text-xl font-bold text-[#191919] mt-1">
                £{product.price.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onToggleSave(product.id)}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-md border text-xs font-semibold transition-all ${
                  isSaved
                    ? 'bg-[#E8EFE9] border-[#285C47] text-[#285C47]'
                    : 'bg-white border-[#E6E2DC] text-[#191919] hover:bg-[#FAF9F6]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#285C47]' : ''}`} />
                <span>{isSaved ? 'Saved to Wishlist' : 'Save Item'}</span>
              </button>

              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all shadow-sm active:scale-98"
              >
                <span>Buy at {product.merchant}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
