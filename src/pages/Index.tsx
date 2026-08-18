import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Home, Search, Plus, Heart, User } from "lucide-react";
import { useHomePage } from "@/hooks/useHomePage";
import HamburgerMenu from "@/components/HamburgerMenu";
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import ShoppingModal from "@/components/ShoppingModal";
import SavedWardrobeModal from "@/components/SavedWardrobeModal";

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-camera-screen',
    text: "Welcome to TintPicks! To capture a color, you don't need to hunt for a tiny button. Just tap the plus button or anywhere on the live camera screen to snap it!",
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
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  
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
    <div className="min-h-screen bg-background text-foreground relative flex flex-col pb-24 font-sans">
      {/* Sleek Minimalist Header */}
      <header className="w-full bg-background pt-8 pb-4 px-6 flex items-center justify-between z-40">
        <h1 className="text-2xl font-bold tracking-tighter uppercase" style={{ letterSpacing: '-0.05em' }}>TINTPICKS</h1>
        <HamburgerMenu
          onLogout={handleLogout}
          onColorAdd={handleColorAdd}
          onSavedPaletteClick={() => setIsWardrobeOpen(true)}
          onStartTour={() => setIsTourActive(true)}
        />
      </header>

      {/* Greeting */}
      <div className="px-6 pb-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Good morning{userName ? `, ${userName.split(' ')[0]}` : ''}</h2>
      </div>
      
      {/* Tabs (Visual only to match design) */}
      <div className="px-6 flex gap-6 border-b border-border mb-6">
        <button className="pb-2 border-b-2 border-foreground text-sm font-semibold">Today's suggestions</button>
        <button className="pb-2 text-muted-foreground text-sm font-semibold hover:text-foreground transition-colors" onClick={() => setIsWardrobeOpen(true)}>Wardrobe</button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center px-4 relative">
        {showCamera ? (
          <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
        ) : (
          <div className="w-full flex-1 flex flex-col animate-fade-in relative">
            {savedColors.length === 0 && !isTourActive ? (
              <div className="flex flex-col items-center justify-center flex-1 w-full relative min-h-[50vh]">
                 <div className="text-center space-y-4">
                   <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                     <Camera className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <h3 className="text-xl font-semibold">Start your style journey</h3>
                   <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                     Tap the plus button below to capture a color or upload an image.
                   </p>
                 </div>
              </div>
            ) : (
              <div className="w-full h-full pb-6 max-w-md mx-auto">
                <FashionStylingBoard 
                  capturedItem={capturedItem} 
                  savedColors={savedColors}
                  onShop={handleShop}
                />
              </div>
            )}
          </div>
        )}

        {/* Modals and Dialogs */}
        {isTourActive && <GuidedTour steps={tourSteps} onComplete={handleTourComplete} />}

        <Dialog open={!!pendingHex} onOpenChange={(open) => !open && setPendingHex(null)}>
          <DialogContent className="sm:max-w-md border-border bg-card">
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
                    className="col-span-3 border-border bg-background"
                  />
                </div>
              )}

              {captureStep === 1 ? (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Tops</h4>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</Button>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Bottoms</h4>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</Button>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</Button>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Outerwear</h4>
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-muted" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full justify-center h-12 text-base border-border hover:bg-muted" onClick={() => handleSelectDesiredGarment('top')}>
                    Tops & Shirts
                  </Button>
                  <Button variant="outline" className="w-full justify-center h-12 text-base border-border hover:bg-muted" onClick={() => handleSelectDesiredGarment('bottom')}>
                    Bottoms & Trousers
                  </Button>
                  <Button variant="outline" className="w-full justify-center h-12 text-base border-border hover:bg-muted" onClick={() => handleSelectDesiredGarment('outerwear')}>
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
        
        <SavedWardrobeModal 
          isOpen={isWardrobeOpen} 
          onClose={() => setIsWardrobeOpen(false)} 
        />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border px-6 py-4 flex items-center justify-between z-50">
        <button className="flex flex-col items-center gap-1 text-foreground">
          <Home className="w-6 h-6" />
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" 
          onClick={() => {
             setShowShoppingModal(true);
          }}
        >
          <Search className="w-6 h-6" />
        </button>
        
        {/* Center Plus Button */}
        <button 
          id="tour-camera-screen"
          onClick={() => setShowCamera(true)}
          className="w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center -mt-6 shadow-xl active:scale-95 transition-transform"
        >
          <Plus className="w-7 h-7" />
        </button>

        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" 
          onClick={() => setIsWardrobeOpen(true)}
        >
          <Heart className="w-6 h-6" />
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" 
          onClick={() => document.getElementById('hamburger-menu-btn')?.click()}
        >
          <User className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};

export default Index;