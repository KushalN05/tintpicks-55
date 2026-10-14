import React from 'react';
import { SearchResult } from '@/types/threadfind';
import { Bookmark, Columns, Check, ExternalLink, Sparkles } from 'lucide-react';

interface FeaturedMatchCardProps {
  result: SearchResult;
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onSelectProduct: (result: SearchResult) => void;
}

export const FeaturedMatchCard: React.FC<FeaturedMatchCardProps> = ({
  result,
  isSaved,
  onToggleSave,
  onSelectProduct,
}) => {
  const { product, calibratedScore, tier, visualMatchReasons } = result;

  return (
    <div className="bg-white rounded-xl border-2 border-[#285C47]/40 shadow-sm overflow-hidden mb-10 transition-all hover:border-[#285C47]">
      {/* Featured Header Ribbon */}
      <div className="bg-[#E8EFE9] px-6 py-2.5 flex items-center justify-between border-b border-[#285C47]/15">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#285C47]" />
          <span className="text-xs uppercase font-bold tracking-wider text-[#285C47]">
            Strongest Visual Match
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#285C47] text-white">
            {tier}
          </span>
          <span className="text-sm font-bold text-[#285C47]">
            {calibratedScore.toFixed(1)}% Match
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
        {/* Product Photo */}
        <div
          className="md:col-span-5 relative aspect-square rounded-lg bg-[#FAF9F6] overflow-hidden cursor-pointer group"
          onClick={() => onSelectProduct(result)}
        >
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              if (product.fallback_image_url && e.currentTarget.src !== product.fallback_image_url) {
                e.currentTarget.src = product.fallback_image_url;
              }
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-[#191919] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-opacity">
              Inspect details
            </span>
          </div>
        </div>

        {/* Detailed Description & Reasons */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#77736F]">
                {product.brand}
              </span>
              <span className="text-xs text-[#77736F]">
                Available at {product.merchant}
              </span>
            </div>

            <h3
              className="font-editorial text-2xl sm:text-3xl text-[#191919] font-medium mt-1 cursor-pointer hover:text-[#285C47] transition-colors"
              onClick={() => onSelectProduct(result)}
            >
              {product.title}
            </h3>

            <div className="mt-2 text-xl font-bold text-[#191919]">
              £{product.price.toFixed(2)}
            </div>
          </div>

          {/* Visual Evidence / Grounded Match Reasons */}
          <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#E6E2DC]">
            <span className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-2">
              Why this matches your photo:
            </span>
            <ul className="space-y-1.5 text-xs text-[#191919]">
              {visualMatchReasons.slice(0, 3).map((reason, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-[#285C47] shrink-0 mt-0.5" />
                  <span className="leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Attributes Pills */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {product.attributes.silhouette && (
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E6E2DC] text-[#77736F]">
                Cut: <strong className="text-[#191919]">{product.attributes.silhouette}</strong>
              </span>
            )}
            {product.attributes.collar && (
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E6E2DC] text-[#77736F]">
                Collar: <strong className="text-[#191919]">{product.attributes.collar}</strong>
              </span>
            )}
            {product.attributes.closure && (
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E6E2DC] text-[#77736F]">
                Closure: <strong className="text-[#191919]">{product.attributes.closure}</strong>
              </span>
            )}
            {product.attributes.fabric && (
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E6E2DC] text-[#77736F]">
                Fabric: <strong className="text-[#191919]">{product.attributes.fabric}</strong>
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectProduct(result)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all shadow-sm active:scale-98"
            >
              <Columns className="w-4 h-4" />
              <span>Compare Side-by-Side</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(product.id)}
              className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-md border text-xs font-medium transition-all ${
                isSaved
                  ? 'bg-[#E8EFE9] border-[#285C47] text-[#285C47]'
                  : 'bg-white border-[#E6E2DC] text-[#191919] hover:bg-[#FAF9F6]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#285C47]' : ''}`} />
              <span>{isSaved ? 'Saved to Wishlist' : 'Save Item'}</span>
            </button>

            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium text-[#77736F] hover:text-[#191919] transition-colors ml-auto"
            >
              <span>View at {product.merchant}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
