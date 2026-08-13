
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getColorInfo, getAllNamedColors } from '@/utils/colorMapping';
import SwiperActions from './SwiperActions';
import RecommendationList from './RecommendationList';

interface ColorInfo {
  name: string;
  hex: string;
  category?: string;
}

interface ColorSwiperProps {
  onFirstColorSave?: () => void;
  onColorSave?: (color: { hex: string }) => void;
}

const colorDatabase: ColorInfo[] = getAllNamedColors();

const getRandomColor = (excludeHexes: Set<string> = new Set()): ColorInfo => {
  const choices = colorDatabase.filter(color => !excludeHexes.has(color.hex));
  const idx = Math.floor(Math.random() * choices.length);
  return choices[idx];
};

const getRecommendations = (baseColor: ColorInfo, count = 3): ColorInfo[] => {
  // Try to recommend colors in the same category
  const sameCategory = colorDatabase.filter(
    c => c.category === baseColor.category && c.hex !== baseColor.hex
  );
  // fallback to randoms if not enough, but never current color
  let pool = sameCategory.length >= count
    ? sameCategory
    : [...sameCategory, ...colorDatabase.filter(
        c => c.hex !== baseColor.hex && c.category !== baseColor.category
      )];
  // select unique randoms
  const picked: ColorInfo[] = [];
  const used = new Set([baseColor.hex]);
  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!used.has(pool[idx].hex)) {
      picked.push(pool[idx]);
      used.add(pool[idx].hex);
    }
    pool.splice(idx, 1);
  }
  return picked;
};

const ColorSwiper: React.FC<ColorSwiperProps> = ({ onFirstColorSave, onColorSave }) => {
  const [current, setCurrent] = useState<ColorInfo | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [recommendations, setRecommendations] = useState<ColorInfo[]>([]);
  const [likedCategories, setLikedCategories] = useState<Set<string>>(new Set());
  const [colorSavedOnce, setColorSavedOnce] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    loadNewColor();
    // eslint-disable-next-line
  }, []);

  const loadNewColor = () => {
    // If category is liked, favor those
    const pool = likedCategories.size > 0
      ? colorDatabase.filter(color => color.category && likedCategories.has(color.category))
      : colorDatabase;
    const color = getRandomColor(new Set(current ? [current.hex] : []));
    setCurrent(color);
    setRecommendations(getRecommendations(color, 3));
  };

  const handleSwipe = (liked: boolean) => {
    if (!current) return;
    setDirection(liked ? 'right' : 'left');
    if (liked && current.category) {
      setLikedCategories(prev => {
        const newSet = new Set(prev);
        newSet.add(current.category!);
        return newSet;
      });
    }
    setTimeout(() => {
      setDirection(null);
      loadNewColor();
    }, 450);
  };

  const handleSaveColor = async () => {
    if (!session || !current) return;
    const { error } = await supabase
      .from('saved_colors')
      .insert([{ user_id: session.user.id, hex_code: current.hex }]);
    if (error) {
      console.error('Error saving color:', error);
      toast({
        title: "Error",
        description: "Failed to save this color.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Color Saved",
        description: `${current.name} (${current.hex}) saved to your palette.`,
      });
      if (onFirstColorSave && !colorSavedOnce) {
        setColorSavedOnce(true);
        onFirstColorSave();
      }
      if (onColorSave) {
        onColorSave({ hex: current.hex });
      }
    }
  };

  if (!current) return <div className="p-8 text-center">Loading colors...</div>;

  return (
    <div className="flex flex-col items-center mt-8 mb-12">
      <h2 className="text-2xl font-ghibli text-ghibli-forest mb-1">Discover Colors</h2>
      <p className="mb-4 text-ghibli-forest/75 text-sm md:text-base max-w-md text-center">
        Swipe to like or dismiss a color. Save your favorites!
      </p>
      <div className="relative flex flex-col items-center w-full max-w-xs">
        <AnimatePresence>
          <motion.div
            key={current.hex}
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: direction === 'left' ? -350 : direction === 'right' ? 350 : 0,
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.33 }}
            className="w-full flex flex-col items-center"
          >
            {/* Color swatch card */}
            <div
              className="rounded-3xl border-2 border-ghibli-blue/40 shadow-xl overflow-hidden w-64 h-80 flex flex-col"
              style={{ backgroundColor: current.hex }}
            >
              <div className="flex-1" />
              <div className="p-5 bg-white/80 backdrop-blur-md rounded-b-3xl border-t border-ghibli-blue/10">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-ghibli-forest mb-1">{current.name}</span>
                  <span className="text-base capitalize text-ghibli-blue/80 mb-1">{current.category ?? 'General'}</span>
                  <span className="font-mono text-ghibli-forest/70">{current.hex}</span>
                </div>
              </div>
            </div>
            <SwiperActions
              onDislike={() => handleSwipe(false)}
              onSave={handleSaveColor}
              onLike={() => handleSwipe(true)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <h3 className="text-lg font-semibold text-ghibli-forest mt-10 mb-3">Recommended</h3>
      <RecommendationList recommendations={recommendations} />
    </div>
  );
};

export default ColorSwiper;
