
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingBag, ExternalLink, Loader2, PackageX, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getColorName } from '../utils/colorMapping';
import { fetchProductsByColor, Product } from '../utils/productService';

const ProductCard = ({ product }: { product: Product }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
        {!imgError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {/* Color dot overlay */}
        {product.hex_code && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: product.hex_code }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.price && (
          <p className="text-base font-bold text-ghibli-forest">
            {product.price}
          </p>
        )}

        {product.affiliate_url && (
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto"
          >
            <Button
              size="sm"
              className="w-full bg-ghibli-blue hover:bg-ghibli-blue/85 text-white rounded-full text-xs font-semibold gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Buy Now
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full aspect-[3/4] bg-gray-200" />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-1" />
      <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-20 h-20 bg-ghibli-cream rounded-full flex items-center justify-center mb-4">
      <PackageX className="h-10 w-10 text-ghibli-forest/40" />
    </div>
    <h3 className="text-lg font-ghibli font-semibold text-ghibli-forest mb-2">
      No exact matches found
    </h3>
    <p className="text-sm text-ghibli-forest/60 max-w-[280px]">
      We couldn't find products matching this exact color right now. Try a nearby shade!
    </p>
  </div>
);

const ShoppingModal = ({
  isOpen,
  onClose,
  color,
}: {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('All');
  const [category, setCategory] = useState('All');
  const colorName = getColorName(color);

  useEffect(() => {
    if (isOpen && color) {
      setLoading(true);
      setProducts([]);
      fetchProductsByColor(color, gender, category, 24)
        .then((results) => {
          // Strictly ensure it's an array to prevent .length or .map crashes
          setProducts(Array.isArray(results) ? results : []);
        })
        .catch((err) => {
          console.error('Product fetch error:', err);
          setProducts([]); // Fallback to empty array on error
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, color, gender, category]);

  // Defensive check for the header length render
  const safeProductsCount = Array.isArray(products) ? products.length : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] bg-white/98 backdrop-blur-md border-gray-200 rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4">
          <DialogHeader className="gap-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl shadow-inner border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div>
                <DialogTitle className="text-ghibli-forest font-ghibli text-lg leading-tight">
                  Shop {colorName}
                </DialogTitle>
                <DialogDescription className="text-xs text-ghibli-forest/50 mt-0.5">
                  {color} · {safeProductsCount} items found
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Genders</SelectItem>
                <SelectItem value="Mens">Mens</SelectItem>
                <SelectItem value="Womens">Womens</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Tops">Tops</SelectItem>
                <SelectItem value="Bottoms">Bottoms</SelectItem>
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Outerwear">Outerwear</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-4 pb-5">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : !Array.isArray(products) || products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3">
              {products.map((product) => (
                <ProductCard key={product.product_id || Math.random()} product={product} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingModal;
