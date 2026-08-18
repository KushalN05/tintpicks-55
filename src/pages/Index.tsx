import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Settings, Share, Plus, Layers, Users, BarChart2 } from "lucide-react";
import { useHomePage } from "@/hooks/useHomePage";
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import ShoppingModal from "@/components/ShoppingModal";
import { motion } from "framer-motion";

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-camera-screen',
    text: "Welcome to TintPicks! To capture a color, tap the massive gradient ring.",
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
  
  const [activeTab, setActiveTab] = useState<'home' | 'wardrobe'>('home');

  // If they have saved colors but click home, they should see the ring.
  // If they click wardrobe, they see the styling board.
  // Force switch to wardrobe if they capture something new.
  useEffect(() => {
    if (capturedItem) {
      setActiveTab('wardrobe');
    }
  }, [capturedItem]);

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
        if (!onboardingData.onboarding_completed) {
          setIsTourActive(true);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleCapture = (hex: string) => {
    setPendingHex(hex);
    setPendingName(""); 
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
      setActiveTab('wardrobe');
    }
  };

  const handleTourComplete = async () => {
    setIsTourActive(false);
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
    <div className="min-h-screen bg-background text-foreground relative flex flex-col font-sans pb-32 overflow-x-hidden">
      
      {showCamera ? (
        <div className="absolute inset-0 z-50 bg-background">
          <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
        </div>
      ) : (
        <>
          {activeTab === 'home' ? (
            /* Gradient Ring Dashboard UI */
            <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
              {/* Top Nav */}
              <div className="w-full px-6 pt-12 flex justify-between items-center z-10">
                <button onClick={handleLogout} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                  <Settings className="w-6 h-6 text-foreground" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                  <Share className="w-6 h-6 text-foreground" />
                </button>
              </div>

              {/* Greeting */}
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-foreground text-center max-w-[320px] leading-tight tracking-tight mx-auto mt-8 mb-16 font-serif"
              >
                How are you styling this morning?
              </motion.h1>

              {/* Massive Gradient Ring */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.1 }}
                className="w-full flex justify-center mb-16 px-4"
              >
                <div 
                  id="tour-camera-screen"
                  className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: "conic-gradient(from 180deg, #3b82f6, #8b5cf6, #ef4444, #f97316, #eab308, #22c55e, #3b82f6)",
                    padding: "24px" // Thickness of the ring
                  }}
                >
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center shadow-inner hover:scale-95 active:scale-90 transition-transform duration-300 group"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mb-3 group-hover:bg-foreground group-hover:text-background transition-colors">
                      <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-medium text-foreground tracking-wide">Capture</span>
                  </button>
                </div>
              </motion.div>

              {/* Stat Pills */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 px-6 mb-8"
              >
                <div className="flex-1 bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-sm hover:bg-card transition-colors">
                  <span className="text-4xl font-serif text-foreground mb-1">{savedColors.length}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">Saved<br/>Colors</span>
                </div>
                <div 
                  className="flex-1 bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-sm hover:bg-card transition-colors cursor-pointer"
                  onClick={() => savedColors.length > 0 && setActiveTab('wardrobe')}
                >
                  <span className="text-4xl font-serif text-foreground mb-1">{savedColors.length > 0 ? "1" : "0"}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">Active<br/>Outfit</span>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Active Styling Board */
            <div className="w-full h-full pb-24 pt-12 px-4">
              <FashionStylingBoard 
                capturedItem={capturedItem} 
                savedColors={savedColors}
                onShop={handleShop}
              />
            </div>
          )}
        </>
      )}

      {/* Bottom Navigation */}
      {!showCamera && (
        <div className="fixed bottom-0 inset-x-0 h-[100px] bg-background/80 backdrop-blur-2xl border-t border-border flex justify-around items-center px-6 pb-safe z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'home' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
          >
             <Plus className={`w-7 h-7 ${activeTab === 'home' ? 'text-[#f97316]' : ''}`} />
             <span className="text-[11px] font-bold tracking-widest uppercase">Capture</span>
          </button>
          <button 
            onClick={() => {
              if (savedColors.length > 0) setActiveTab('wardrobe');
            }}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'wardrobe' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'} ${savedColors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             <Layers className="w-7 h-7" />
             <span className="text-[11px] font-bold tracking-widest uppercase">Wardrobe</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground/80 transition-colors">
             <Users className="w-7 h-7" />
             <span className="text-[11px] font-bold tracking-widest uppercase">Friends</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground/80 transition-colors">
             <BarChart2 className="w-7 h-7" />
             <span className="text-[11px] font-bold tracking-widest uppercase">Analyze</span>
          </button>
        </div>
      )}

      {isTourActive && <GuidedTour steps={tourSteps} onComplete={handleTourComplete} />}

      {/* Dialog for Capture (Unchanged standard Dialog, as we reverted the bottom sheet previously) */}
      <Dialog open={!!pendingHex} onOpenChange={(open) => !open && setPendingHex(null)}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {captureStep === 1 ? "What did you capture?" : "What are you looking for?"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {captureStep === 1 
                ? "Select the clothing item that matches your captured color."
                : "Select what you want to match it with."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {captureStep === 1 && (
              <div className="space-y-2">
                <Label htmlFor="color-name" className="text-foreground">Name this color (optional)</Label>
                <Input 
                  id="color-name" 
                  placeholder={`e.g. Navy Blue Jacket`} 
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  className="bg-card border-border text-foreground focus-visible:ring-foreground"
                />
              </div>
            )}

            {captureStep === 1 ? (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Tops</h4>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-card" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</Button>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-card" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Bottoms</h4>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-card" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</Button>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-card" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</Button>
                </div>
                <div className="space-y-2 col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Outerwear</h4>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-card" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="w-full justify-center h-12 text-base border-border text-foreground hover:bg-card" onClick={() => handleSelectDesiredGarment('top')}>
                  Tops & Shirts
                </Button>
                <Button variant="outline" className="w-full justify-center h-12 text-base border-border text-foreground hover:bg-card" onClick={() => handleSelectDesiredGarment('bottom')}>
                  Bottoms & Trousers
                </Button>
                <Button variant="outline" className="w-full justify-center h-12 text-base border-border text-foreground hover:bg-card" onClick={() => handleSelectDesiredGarment('outerwear')}>
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
    </div>
  );
};

export default Index;