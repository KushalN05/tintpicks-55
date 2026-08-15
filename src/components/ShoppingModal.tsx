import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ShoppingBag, ExternalLink, PackageX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getColorName } from '../utils/colorMapping';
import { fetchProductsByColor, Product } from '../utils/productService';

const ProductCard = ({ product }: { product: Product }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden transition-all duration-500">
      {/* Strict Fashion Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-stone-100">
        {!imgError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover object-center w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-stone-300" />
          </div>
        )}

        {/* Hover Overlay — slides up on hover */}
        {product.affiliate_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-4/5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75"
            >
              <Button
                className="w-full bg-white hover:bg-stone-50 text-stone-900 rounded-none uppercase tracking-widest text-[10px] font-semibold h-9 shadow-lg"
              >
                <ExternalLink className="h-3 w-3 mr-1.5" />
                Shop Now
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Product Info — fashion typography */}
      <div className="flex flex-col pt-3 gap-1 px-0.5">
        <p className="text-xs text-stone-500 uppercase tracking-wide line-clamp-2 leading-relaxed font-medium">
          {product.name}
        </p>
        {product.price && (
          <p className="text-sm font-bold text-stone-900 font-serif tracking-tight mt-0.5">
            £{product.price}
          </p>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col animate-pulse">
    <div className="aspect-[3/4] w-full rounded-md bg-stone-200" />
    <div className="pt-3 flex flex-col gap-2 px-0.5">
      <div className="h-3 bg-stone-200 rounded w-full" />
      <div className="h-3 bg-stone-200 rounded w-2/3" />
      <div className="h-4 bg-stone-300 rounded w-1/4 mt-1" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 bg-ghibli-cream/30 rounded-full flex items-center justify-center mb-6">
      <PackageX className="h-8 w-8 text-ghibli-forest/30" />
    </div>
    <h3 className="text-base font-ghibli uppercase tracking-widest text-ghibli-forest mb-3">
      No Items Found
    </h3>
    <p className="text-sm text-ghibli-forest/60 max-w-[240px] leading-relaxed">
      We couldn't find exact matches. Try adjusting the category or gender filters to explore more.
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
          setProducts(Array.isArray(results) ? results : []);
        })
        .catch((err) => {
          console.error('Product fetch error:', err);
          setProducts([]); 
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, color, gender, category]);

  const safeProductsCount = Array.isArray(products) ? products.length : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* Luxury Side Drawer styling */}
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 border-l-0 shadow-2xl overflow-y-auto"
      >
        {/* Glassmorphism Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-ghibli-cream/40 px-6 py-6 transition-all">
          <SheetHeader className="gap-0 mb-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className="w-12 h-12 rounded-full shadow-sm border border-ghibli-cream/50"
                style={{ backgroundColor: color }}
              />
              <div>
                <SheetTitle className="text-ghibli-forest font-ghibli text-xl tracking-wide">
                  Shop {colorName}
                </SheetTitle>
                <SheetDescription className="text-xs uppercase tracking-widest text-ghibli-forest/50 mt-1.5">
                  {color} · {safeProductsCount} items
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Minimalist Filters */}
          <div className="flex gap-3">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="flex-1 bg-transparent border-t-0 border-x-0 border-b border-ghibli-cream/50 rounded-none focus:ring-0 focus:border-ghibli-forest px-1 shadow-none">
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
              <SelectTrigger className="flex-1 bg-transparent border-t-0 border-x-0 border-b border-ghibli-cream/50 rounded-none focus:ring-0 focus:border-ghibli-forest px-1 shadow-none">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Shirts">Shirts & Tops</SelectItem>
                <SelectItem value="Trousers">Trousers & Jeans</SelectItem>
                <SelectItem value="Jackets">Jackets & Coats</SelectItem>
                <SelectItem value="Dresses">Dresses</SelectItem>
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Shorts">Shorts</SelectItem>
                <SelectItem value="Skirts">Skirts</SelectItem>
                <SelectItem value="Hoodies">Hoodies & Sweaters</SelectItem>
                <SelectItem value="Bags">Bags</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic Grid Content */}
        <div className="px-6 py-8 min-h-[50vh]">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
              {products.map((product, idx) => (
                <div 
                  key={product.product_id || idx} 
                  className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                  style={{ animationDelay: `${idx * 50}ms`, animationDuration: '700ms' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <EmptyState />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingModal;
