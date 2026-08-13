
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { Palette, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getColorName } from '@/utils/colorMapping';

interface SavedColor {
  id: string;
  hex_code: string;
  created_at: string;
}

const ColorPalette = () => {
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [filteredColors, setFilteredColors] = useState<SavedColor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      loadSavedColors();
    }
  }, [session]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredColors(savedColors);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredColors(savedColors.filter(color => {
        const colorName = getColorName(color.hex_code).toLowerCase();
        return colorName.includes(term) || color.hex_code.toLowerCase().includes(term);
      }));
    }
  }, [searchTerm, savedColors]);

  const loadSavedColors = async () => {
    if (!session) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('saved_colors')
      .select('*')
      .order('created_at', { ascending: false });
      
    setIsLoading(false);
    
    if (error) {
      console.error('Error loading saved colors:', error);
      toast({
        title: "Error",
        description: "Failed to load your saved colors.",
        variant: "destructive",
      });
      return;
    }
    
    setSavedColors(data || []);
    setFilteredColors(data || []);
  };
  
  const handleRemoveColor = async (colorId: string) => {
    if (!session) return;
    
    const { error } = await supabase
      .from('saved_colors')
      .delete()
      .eq('id', colorId);
      
    if (error) {
      console.error('Error removing color:', error);
      toast({
        title: "Error",
        description: "Failed to remove the color.",
        variant: "destructive",
      });
      return;
    }
    
    // Update local state
    setSavedColors(colors => colors.filter(color => color.id !== colorId));
    
    toast({
      title: "Color Removed",
      description: "The color has been removed from your palette.",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghibli-blue"></div>
      </div>
    );
  }
  
  if (savedColors.length === 0) {
    return (
      <div className="text-center p-8">
        <Palette className="h-12 w-12 text-ghibli-blue/50 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-ghibli-forest">Your palette is empty</h3>
        <p className="text-ghibli-forest/70 mt-2">
          Save colors from the color swiper or color grid to build your palette
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-ghibli text-ghibli-forest mb-6">Your Color Palette</h2>
      
      <Card className="border border-ghibli-blue/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg">Saved Colors ({savedColors.length})</CardTitle>
            
            <div className="relative w-full sm:w-auto max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ghibli-forest/50" />
              <Input 
                placeholder="Search colors..." 
                className="pl-9 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredColors.length === 0 ? (
            <p className="text-center py-6 text-ghibli-forest/70">No colors match your search</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {filteredColors.map((color) => (
                <div key={color.id} className="relative group">
                  <div 
                    className="h-16 w-full rounded-md shadow-sm"
                    style={{ backgroundColor: color.hex_code }}
                  ></div>
                  <div className="p-1 text-center">
                    <p className="text-xs font-medium truncate">{getColorName(color.hex_code)}</p>
                    <p className="text-xs text-gray-500">{color.hex_code}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 bg-white/80 rounded-full h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    onClick={() => handleRemoveColor(color.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPalette;
