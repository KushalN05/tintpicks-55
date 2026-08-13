
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ColorInput = ({ onAdd, onClear }: { onAdd: (color: string) => void; onClear: () => void }) => {
  const [hexValue, setHexValue] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    if (!hexRegex.test(hexValue)) {
      toast({
        title: "Invalid Color",
        description: "Please enter a valid hex color code",
        variant: "destructive",
      });
      return;
    }

    const formattedHex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
    onAdd(formattedHex);
    setHexValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="ghibli-card p-4 flex gap-2 shadow-sm">
      <Input
        type="text"
        placeholder="#000000"
        value={hexValue}
        onChange={(e) => setHexValue(e.target.value)}
        className="flex-1 border-ghibli-blue/30 text-ghibli-forest bg-white/50 placeholder:text-ghibli-forest/50 rounded-full"
      />
      <Button 
        id="tour-save"
        type="submit" 
        className="bg-ghibli-blue hover:bg-ghibli-blue/90 text-white rounded-full"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={onClear}
        className="border-ghibli-pink text-ghibli-pink hover:bg-ghibli-pink/10 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ColorInput;
