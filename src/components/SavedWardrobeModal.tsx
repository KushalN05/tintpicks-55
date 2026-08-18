import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/utils/productService';
import { ExternalLink, ShoppingBag } from 'lucide-react';

interface SavedWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedWardrobeModal = ({ isOpen, onClose }: SavedWardrobeModalProps) => {
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSavedWardrobe();
    }
  }, [isOpen]);

  const fetchSavedWardrobe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('saved_wardrobe')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      const wardrobe = (data?.saved_wardrobe as unknown as Product[]) || [];
      setSavedItems(wardrobe);
    } catch (error) {
      console.error('Error fetching saved wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>, product: Product) => {
    e.preventDefault();
    window.open(product.link || '#', '_blank', 'noopener,noreferrer');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 border-l-0 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-border px-6 py-6">
          <SheetHeader className="mb-2">
            <SheetTitle className="text-foreground font-serif text-2xl tracking-wide">
              Saved Wardrobe
            </SheetTitle>
            <SheetDescription className="text-xs uppercase tracking-widest text-muted-foreground mt-1.5">
              Your 5 most recently shopped items
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="px-6 py-8 min-h-[50vh]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : savedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
              {savedItems.map((product, idx) => (
                <div key={product.product_id || idx} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                  <a 
                    href={product.link || '#'}
                    onClick={(e) => handleProductClick(e, product)}
                    className="group flex flex-col overflow-hidden transition-all duration-500 cursor-pointer block"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-stone-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="object-cover object-center w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-stone-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <div className="w-4/5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 pointer-events-none">
                          <div className="flex items-center justify-center w-full bg-white text-stone-900 uppercase tracking-widest text-[10px] font-semibold h-9 shadow-lg">
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            Shop Again
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col pt-3 gap-1 px-0.5">
                      <p className="text-xs text-stone-500 uppercase tracking-wide line-clamp-2 leading-relaxed font-medium">
                        {product.name}
                      </p>
                      {product.price && (
                        <p className="text-sm font-bold text-stone-900 font-serif tracking-tight mt-0.5">
                          {product.price.startsWith('£') || product.price.startsWith('$') ? product.price : `£${product.price}`}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-serif text-foreground">Your wardrobe is empty</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Items you shop from the inspiration board will automatically appear here.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SavedWardrobeModal;
