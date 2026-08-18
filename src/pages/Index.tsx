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
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
  const [isStylingBoardOpen, setIsStylingBoardOpen] = useState(false);
  
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
      setIsStylingBoardOpen(true);
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

      {/* Main Content Area - Inspiration Board */}
      <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 pb-24 relative">
        {showCamera ? (
          <div className="absolute inset-0 z-40 bg-background">
            <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-foreground tracking-tight">
              Inspiration
            </h1>
            
            {/* Masonry Grid for Inspiration Board */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {/* High-quality placeholder images representing fashion outfits */}
              {[
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
                "https://images.unsplash.com/photo-1434389678232-04ce6c43420a?w=600&q=80",
                "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80",
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
                "https://images.unsplash.com/photo-1550614000-4b95d466f916?w=600&q=80",
                "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
                "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
                "https://images.unsplash.com/photo-1485231183945-fd660d740c01?w=600&q=80",
              ].map((src, i) => (
                <div key={i} className="break-inside-avoid overflow-hidden rounded-xl bg-stone-100 group cursor-pointer relative">
                  <img 
                    src={src} 
                    alt="Fashion Inspiration" 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>

            {/* Floating Camera Button (Always Visible) */}
            <Button 
              id="tour-camera-screen"
              size="icon"
              className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all z-50 bg-foreground text-background border border-border"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="w-7 h-7" />
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

        {/* Fashion Styling Board Modal */}
        <Sheet open={isStylingBoardOpen} onOpenChange={setIsStylingBoardOpen}>
          <SheetContent side="bottom" className="h-[90vh] w-full p-0 rounded-t-3xl border-t-0 shadow-2xl flex flex-col overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto pb-6">
              {capturedItem && (
                <FashionStylingBoard 
                  capturedItem={capturedItem} 
                  savedColors={savedColors}
                  onShop={handleShop}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Index;