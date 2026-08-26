import { useState, useEffect } from 'react';

const SEARCH_LIMIT = 5;

export const useSearchLimit = () => {
  const [searchCount, setSearchCount] = useState(0);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Load from local storage
    const storedCount = localStorage.getItem('tintpicks_search_count');
    const storedPro = localStorage.getItem('tintpicks_is_pro');

    if (storedCount) {
      setSearchCount(parseInt(storedCount, 10));
    }
    if (storedPro === 'true') {
      setIsPro(true);
    }
  }, []);

  const incrementSearch = () => {
    if (isPro) return true; // Pro users have unlimited searches
    
    if (searchCount >= SEARCH_LIMIT) {
      return false;
    }
    
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    localStorage.setItem('tintpicks_search_count', newCount.toString());
    
    return true;
  };

  const hasReachedLimit = !isPro && searchCount >= SEARCH_LIMIT;

  const upgradeToPro = () => {
    setIsPro(true);
    localStorage.setItem('tintpicks_is_pro', 'true');
  };

  return {
    searchCount,
    isPro,
    hasReachedLimit,
    incrementSearch,
    upgradeToPro,
    SEARCH_LIMIT
  };
};
