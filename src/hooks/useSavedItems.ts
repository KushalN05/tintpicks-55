import { useState, useEffect } from 'react';
import { catalogueProducts } from '@/data/catalogue';
import { CatalogueProduct } from '@/types/threadfind';

const STORAGE_KEY = 'threadfind_saved_products_v1';

export function useSavedItems() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [savedIds]);

  const toggleSave = (productId: string) => {
    setSavedIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isSaved = (productId: string) => savedIds.includes(productId);

  const clearAll = () => setSavedIds([]);

  const savedProducts: CatalogueProduct[] = savedIds
    .map(id => catalogueProducts.find(p => p.id === id))
    .filter((p): p is CatalogueProduct => p !== undefined);

  return {
    savedIds,
    savedProducts,
    toggleSave,
    isSaved,
    clearAll,
    count: savedIds.length,
  };
}
