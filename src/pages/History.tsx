import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SavedColor } from "@/hooks/useHomePage";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const History = () => {
  const [colors, setColors] = useState<SavedColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Check if `name` column exists in the schema. If we get a schema error, fallback to selecting just id and hex_code.
      // But typically Supabase allows selecting columns that might not exist if we use *
      const { data, error } = await supabase
        .from("saved_colors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setColors(data.map(d => ({
          id: d.id,
          hex: d.hex_code,
          name: d.name || "Unnamed Colour",
        })));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent navigation if they click the card
    try {
      const { error } = await supabase.from("saved_colors").delete().eq("id", id);
      if (error) throw error;
      setColors(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Deleted",
        description: "Color removed from history.",
      });
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error",
        description: "Failed to delete color.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg tracking-tight">Colour History</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : colors.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold tracking-tight mb-2">No colours yet</h2>
            <p className="text-muted-foreground mb-6">Capture some colours to start building your history.</p>
            <Button onClick={() => navigate("/dashboard")}>Go Capture</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {colors.map((color) => (
              <div 
                key={color.id} 
                className="group relative flex flex-col gap-2 cursor-pointer transition-transform hover:-translate-y-1"
                onClick={() => navigate("/dashboard")} // In a real app we might pass state to pre-select this color
              >
                <div 
                  className="w-full aspect-square rounded-2xl shadow-sm border border-border flex items-end justify-end p-2 relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
                    onClick={(e) => handleDelete(e, color.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium text-sm truncate">{color.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{color.hex}</p>
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
