import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useHomePage } from "@/hooks/useHomePage";
import HamburgerMenu from "@/components/HamburgerMenu";

const Index = () => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const {
    showCamera,
    setShowCamera,
    handleLogout,
    handleColorAdd,
    handleColorCapture,
    savedColors,
  } = useHomePage();

  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string>("");
  const [capturedItem, setCapturedItem] = useState<CapturedItemConfig | null>(null);
  
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: onboardingData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (onboardingData) {
        setUserName(onboardingData.display_name || '');
        setUserProfile(onboardingData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleCapture = (hex: string) => {
    // We don't save immediately. We wait for the modal to get the name and garment.
    setPendingHex(hex);
    setPendingName(""); // Reset name
    setShowCamera(false);
  };

  const handleSelectCapturedGarment = async (category: GarmentCategory, item: GarmentType) => {
    if (pendingHex) {
      const finalName = pendingName.trim() || `Colour #${savedColors.length + 1}`;
      
      // Save to database
      await handleColorCapture(pendingHex, finalName);

      setCapturedItem({
        category,
        item,
        hex: pendingHex,
        timestamp: Date.now()
      });
      setPendingHex(null);
      setPendingName("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      {/* Sleek Minimalist Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-sm flex items-center justify-center">
              <span className="text-background font-bold text-lg">T</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">TintPicks</span>
          </div>

          <div className="flex items-center gap-4">
            {userName && <span className="text-sm font-medium text-muted-foreground">Hello, {userName}</span>}
            <Button variant="ghost" size="icon" onClick={() => setShowCamera(true)} className="rounded-full">
              <Camera className="h-5 w-5" />
            </Button>
            <HamburgerMenu
              onLogout={handleLogout}
              onColorAdd={handleColorAdd}
              onSavedPaletteClick={() => {}}
              onStartTour={() => {}}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {showCamera ? (
          <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center animate-fade-in relative">
            {savedColors.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 w-full relative">
                {/* Just the mannequin faintly in the background, or nothing but text */}
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-center opacity-20 pointer-events-none absolute z-0 select-none">
                  Capture<br/>A Colour
                </h1>
                
                <div className="z-10 mt-8">
                  <Button 
                    size="lg" 
                    className="rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition-transform"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="w-10 h-10 mb-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full pb-24">
                <FashionStylingBoard 
                  capturedItem={capturedItem} 
                  savedColors={savedColors} 
                />
              </div>
            )}

            {/* Floating Camera Button (Only if colors exist) */}
            {savedColors.length > 0 && (
              <Button 
                size="icon"
                className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 shadow-2xl hover:scale-105 transition-transform z-50 bg-primary text-primary-foreground"
                onClick={() => setShowCamera(true)}
              >
                <Camera className="w-8 h-8" />
              </Button>
            )}
          </div>
        )}

        <Dialog open={!!pendingHex} onOpenChange={(open) => !open && setPendingHex(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>What did you capture?</DialogTitle>
              <DialogDescription>
                Select the clothing item that matches your captured color.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="color-name">Name this color (optional)</Label>
                <Input 
                  id="color-name" 
                  placeholder={`e.g. Navy Blue Jacket`} 
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Tops</h4>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Bottoms</h4>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</Button>
                </div>
                <div className="space-y-2 col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Outerwear</h4>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;