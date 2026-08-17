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
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import ShoppingModal from "@/components/ShoppingModal";

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-camera-screen',
    text: "Welcome to TintPicks! To capture a color, you don't need to hunt for a tiny button. Just tap anywhere on the live camera screen or the center crosshair to snap it!",
  },
  {
    targetId: 'tour-mannequin',
    text: "This is your 2D Interactive Mannequin Canvas. Tap the Top or Bottom layers to apply your captured color directly to the silhouette.",
  },
  {
    targetId: 'tour-swiper',
    text: "Here is the magic. Swipe this Interactive Garment Swiper left or right to cycle through fashion-safe colors perfectly matched to your base color.",
  },
  {
    targetId: 'tour-layers',
    text: "Building a full fit? Use these Toggle Layers to add Outerwear jackets or Footwear to the mannequin.",
  },
  {
    targetId: 'tour-shop',
    text: "Love the look? Tap 'Shop This Complete Look' to instantly find these exact matching items from premium brands.",
  },
  {
    targetId: 'tour-save-wardrobe',
    text: "Finally, hit Save to store this complete outfit in your personal Cloud Wardrobe for later. Let's get styling!",
  }
];

const Index = () => {
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const {
    showCamera,
    setShowCamera,
    isTourActive,
    setIsTourActive,
    showShoppingModal,
    setShowShoppingModal,
    selectedColor,
    selectedShopCategory,
    handleLogout,
    handleColorAdd,
    handleColorCapture,
    handleShop,
    savedColors,
  } = useHomePage();

  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string>("");
  const [capturedItem, setCapturedItem] = useState<CapturedItemConfig | null>(null);
  const [captureStep, setCaptureStep] = useState<1 | 2>(1);
  const [capturedCategory, setCapturedCategory] = useState<GarmentCategory | null>(null);
  const [capturedItemType, setCapturedItemType] = useState<GarmentType | null>(null);
  
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
        // Start tour automatically if not completed
        if (!onboardingData.onboarding_completed) {
          setIsTourActive(true);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleCapture = (hex: string) => {
    // We don't save immediately. We wait for the modal to get the name and garment.
    setPendingHex(hex);
    setPendingName(""); // Reset name
    setCaptureStep(1);
    setShowCamera(false);
  };

  const handleSelectCapturedGarment = (category: GarmentCategory, item: GarmentType) => {
    setCapturedCategory(category);
    setCapturedItemType(item);
    setCaptureStep(2);
  };

  const handleSelectDesiredGarment = async (desiredCat: GarmentCategory) => {
    if (pendingHex && capturedCategory && capturedItemType) {
      const finalName = pendingName.trim() || `Colour #${savedColors.length + 1}`;
      
      // Save to database
      await handleColorCapture(pendingHex, finalName);

      setCapturedItem({
        category: capturedCategory,
        item: capturedItemType,
        hex: pendingHex,
        timestamp: Date.now(),
        desiredCategory: desiredCat
      });
      setPendingHex(null);
      setPendingName("");
    }
  };

  const handleTourComplete = async () => {
    setIsTourActive(false);
    
    // Check and update profile if it was their first time
    if (userProfile && !userProfile.onboarding_completed) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id);
          
          setUserProfile({ ...userProfile, onboarding_completed: true });
        }
      } catch (error) {
        console.error('Failed to update onboarding state', error);
      }
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
              onStartTour={() => setIsTourActive(true)}
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
            {savedColors.length === 0 && !isTourActive ? (
              <div className="flex flex-col items-center justify-center flex-1 w-full relative">
                {/* Witty Empty State Text */}
                <div className="absolute top-1/4 z-10 px-4">
                  <div className="bg-black/40 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/10 shadow-lg text-sm md:text-base font-medium tracking-wide text-center">
                    Feed me some color (I promise I have good taste)
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full pb-24">
                <FashionStylingBoard 
                  capturedItem={capturedItem} 
                  savedColors={savedColors}
                  onShop={handleShop}
                />
              </div>
            )}

            {/* Floating Camera Button (Always Visible) */}
            <Button 
              id="tour-camera-screen"
              size="icon"
              className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 shadow-2xl hover:scale-105 active:scale-95 transition-transform z-50 bg-primary text-primary-foreground"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
        )}

        {isTourActive && <GuidedTour steps={tourSteps} onComplete={handleTourComplete} />}

        <Dialog open={!!pendingHex} onOpenChange={(open) => !open && setPendingHex(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {captureStep === 1 ? "What did you capture?" : "What are you looking for?"}
              </DialogTitle>
              <DialogDescription>
                {captureStep === 1 
                  ? "Select the clothing item that matches your captured color."
                  : "Select what you want to match it with."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {captureStep === 1 && (
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
              )}

              {captureStep === 1 ? (
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
              ) : (
                <div className="grid grid-cols-1 gap-3 pt-4 border-t">
                  <Button variant="outline" className="w-full justify-center h-12 text-base" onClick={() => handleSelectDesiredGarment('top')}>
                    Tops & Shirts
                  </Button>
                  <Button variant="outline" className="w-full justify-center h-12 text-base" onClick={() => handleSelectDesiredGarment('bottom')}>
                    Bottoms & Trousers
                  </Button>
                  <Button variant="outline" className="w-full justify-center h-12 text-base" onClick={() => handleSelectDesiredGarment('outerwear')}>
                    Outerwear & Jackets
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <ShoppingModal 
          isOpen={showShoppingModal} 
          onClose={() => setShowShoppingModal(false)} 
          color={selectedColor}
          initialCategory={selectedShopCategory}
        />
      </main>
    </div>
  );
};

export default Index;