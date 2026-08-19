import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StylingMannequin, { GarmentCategory, GarmentType } from "@/components/StylingMannequin";

interface SavedOutfit {
  id: string;
  equipped: Record<GarmentCategory, GarmentType>;
  colors: Record<GarmentCategory, string>;
  name: string;
}

const History = () => {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_outfits') || '[]');
    setOutfits(saved);
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = outfits.filter(o => o.id !== id);
    setOutfits(updated);
    localStorage.setItem('saved_outfits', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/app")} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg tracking-tight">Saved Outfits</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in pb-32">
        {outfits.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold tracking-tight mb-2">No saved outfits</h2>
            <p className="text-muted-foreground mb-6">Capture some colours and save your styling to build your wardrobe.</p>
            <Button onClick={() => navigate("/app")} className="rounded-full font-semibold">Go Capture</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {outfits.map((outfit) => (
              <div 
                key={outfit.id} 
                className="group relative flex flex-col gap-4 bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => navigate("/app", { state: { loadOutfit: outfit } })}
              >
                <div className="w-full aspect-square rounded-[1.5rem] bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="w-3/4 h-full pointer-events-none flex items-center justify-center">
                    <StylingMannequin
                      equipped={outfit.equipped}
                      colors={outfit.colors}
                      onLayerClick={() => {}}
                      selectedLayer="top"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-foreground rounded-full shadow-sm"
                    onClick={(e) => handleDelete(e, outfit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{outfit.name}</h3>
                  <div className="flex gap-2 mt-2">
                    {Object.values(outfit.colors).map((c, i) => (
                      c !== 'transparent' && (
                        <div key={i} className="w-6 h-6 rounded-full border border-border shadow-sm" style={{ backgroundColor: c as string }} />
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
