import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  const handleCapture = async (hex: string) => {
    await handleColorCapture(hex);
    setPendingHex(hex);
    setShowCamera(false);
  };

  const handleSelectCapturedGarment = (category: GarmentCategory, item: GarmentType) => {
    if (pendingHex) {
      setCapturedItem({
        category,
        item,
        hex: pendingHex,
        timestamp: Date.now()
      });
      setPendingHex(null);
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
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {showCamera ? (
          <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
        ) : (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Style Architect</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Build a cohesive look. Tap the camera to scan a color from real life, or anchor a layer to begin.
              </p>
            </div>
            <FashionStylingBoard 
              capturedItem={capturedItem} 
              savedColors={savedColors} 
            />
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
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tops</h4>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</Button>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Bottoms</h4>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</Button>
              </div>
              <div className="space-y-2 col-span-2">
                <h4 className="text-sm font-medium">Outerwear</h4>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;