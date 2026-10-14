import React from 'react';
import { SearchResult } from '@/types/threadfind';
import { Bookmark, Columns, ExternalLink, Sparkles } from 'lucide-react';

interface ProductCardProps {
  result: SearchResult;
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onSelectProduct: (result: SearchResult) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  result,
  isSaved,
  onToggleSave,
  onSelectProduct,
}) => {
  const { product, calibratedScore, tier, visualMatchReasons } = result;

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Exact item':
      case 'Near-identical':
        return 'bg-[#285C47] text-white';
      case 'Very close match':
        return 'bg-[#E8EFE9] text-[#285C47] border border-[#285C47]/20 font-medium';
      case 'Similar style':
        return 'bg-[#FAF9F6] text-[#191919] border border-[#E6E2DC]';
      default:
        return 'bg-[#F4F1EA] text-[#77736F]';
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-[#E6E2DC] overflow-hidden hover:border-[#CCC7BE] hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div
        className="relative aspect-4/5 w-full bg-[#FAF9F6] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(result)}
      >
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            if (product.fallback_image_url && e.currentTarget.src !== product.fallback_image_url) {
              e.currentTarget.src = product.fallback_image_url;
            }
          }}
        />

        {/* Save Button (Separate accessible button, not nested) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#191919] hover:bg-white hover:scale-110 transition-all shadow-xs"
          aria-label={isSaved ? 'Remove from saved' : 'Save item'}
        >
          <Bookmark
            className={`w-4 h-4 ${isSaved ? 'fill-[#285C47] text-[#285C47]' : 'text-[#77736F]'}`}
          />
        </button>

        {/* Quick Compare Overlay Button on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(result);
            }}
            className="w-full py-2 px-3 rounded-md bg-white/95 backdrop-blur-xs text-xs font-semibold text-[#191919] shadow-sm hover:bg-white flex items-center justify-center space-x-1.5"
          >
            <Columns className="w-3.5 h-3.5 text-[#285C47]" />
            <span>Compare with photo</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Match Score & Tier Pill */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${getTierColor(tier)}`}>
              {tier}
            </span>
            <span className="text-xs font-bold text-[#285C47]">
              {calibratedScore.toFixed(1)}% match
            </span>
          </div>

          {/* Brand & Title */}
          <div className="cursor-pointer" onClick={() => onSelectProduct(result)}>
            <span className="text-xs uppercase font-medium tracking-wider text-[#77736F]">
              {product.brand}
            </span>
            <h4 className="text-sm font-semibold text-[#191919] mt-0.5 line-clamp-1 group-hover:text-[#285C47] transition-colors">
              {product.title}
            </h4>
          </div>

          {/* Key Attributes summary */}
          <div className="mt-2 text-[11px] text-[#77736F] line-clamp-1">
            {product.attributes.silhouette || product.category} · {product.colour} · {product.attributes.fabric || product.merchant}
          </div>
        </div>

        {/* Price & Merchant Footer */}
        <div className="mt-4 pt-3 border-t border-[#E6E2DC]/70 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-[#191919]">
              £{product.price.toFixed(2)}
            </span>
            <span className="block text-[10px] text-[#77736F] leading-tight">
              via {product.merchant}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(result)}
            className="text-xs font-medium text-[#285C47] hover:underline"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
