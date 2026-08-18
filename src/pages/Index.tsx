import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Home, Heart, Plus, Search, User } from "lucide-react";
import { useHomePage } from "@/hooks/useHomePage";
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import ShoppingModal from "@/components/ShoppingModal";
import { motion, AnimatePresence } from "framer-motion";

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-camera-screen',
    text: "Welcome to TintPicks! To capture a color, tap the massive camera button below.",
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
    <div className="min-h-screen bg-background text-foreground relative flex flex-col overflow-hidden font-sans pb-32">
      
      {/* iOS-Native Large Header */}
      {!showCamera && (
        <header className="w-full px-6 pt-12 pb-4 bg-background z-40">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shadow-sm">
              <span className="text-background font-bold text-lg">T</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">TintPicks</span>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-2">
              Good morning{userName ? `, ${userName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
               ☀️ {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </motion.div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full">
        <AnimatePresence mode="wait">
          {showCamera ? (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-background"
            >
              <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-1 flex flex-col"
            >
              {savedColors.length === 0 && !isTourActive ? (
                /* Rich Empty State */
                <div className="w-full flex-1 flex flex-col px-6 pt-6 pb-32 max-w-2xl mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mb-10">
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="w-full aspect-[2/1] rounded-[2rem] border-2 border-dashed border-border/80 bg-card flex flex-col items-center justify-center hover:bg-card/80 transition-all group shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Camera className="w-7 h-7 text-background" />
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">Capture a Color</h3>
                      <p className="text-muted-foreground text-sm">Scan an item to start styling</p>
                    </button>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="w-full">
                    <h3 className="text-xl font-bold tracking-tight mb-4">Discover</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Inspiration Card 1 */}
                      <div className="aspect-[4/5] rounded-3xl bg-muted overflow-hidden relative group shadow-sm">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                         <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355] to-[#D2B48C] group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute bottom-5 left-5 z-20">
                           <p className="text-white font-bold text-lg leading-tight mb-1">Earth Tones</p>
                           <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Trending Palettes</p>
                         </div>
                      </div>
                      {/* Inspiration Card 2 */}
                      <div className="aspect-[4/5] rounded-3xl bg-muted overflow-hidden relative group shadow-sm">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                         <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50] to-[#3498DB] group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute bottom-5 left-5 z-20">
                           <p className="text-white font-bold text-lg leading-tight mb-1">Styling Navy</p>
                           <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Style Guides</p>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                /* Active Dashboard State */
                <div className="w-full h-full pb-24 px-4">
                  <FashionStylingBoard 
                    capturedItem={capturedItem} 
                    savedColors={savedColors}
                    onShop={handleShop}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Glassmorphic Navigation Pill */}
      {!showCamera && (
        <div className="fixed bottom-8 inset-x-0 flex justify-center z-40 pointer-events-none">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-foreground/95 backdrop-blur-md rounded-full px-8 py-4 flex items-center gap-10 shadow-2xl pointer-events-auto border border-white/10"
          >
            <button className="text-background hover:text-background/70 transition-colors flex flex-col items-center gap-1">
               <Home className="w-6 h-6" />
            </button>
            <button className="text-background/50 hover:text-background transition-colors flex flex-col items-center gap-1">
               <Heart className="w-6 h-6" />
            </button>
            
            {/* Prominent Central Capture Button */}
            <button 
              id="tour-camera-screen"
              onClick={() => setShowCamera(true)}
              className="w-14 h-14 rounded-full bg-background flex items-center justify-center shadow-lg -mt-10 border-4 border-foreground hover:scale-110 active:scale-95 transition-transform duration-200 group"
            >
               <Plus className="w-6 h-6 text-foreground group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            <button className="text-background/50 hover:text-background transition-colors flex flex-col items-center gap-1">
               <Search className="w-6 h-6" />
            </button>
            <button onClick={handleLogout} className="text-background/50 hover:text-background transition-colors flex flex-col items-center gap-1">
               <User className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}

      {isTourActive && <GuidedTour steps={tourSteps} onComplete={handleTourComplete} />}

      {/* Slide-Up Bottom Sheet for Color Classification */}
      <AnimatePresence>
        {!!pendingHex && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setPendingHex(null)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 inset-x-0 bg-card rounded-t-[32px] p-6 pb-safe pt-8 z-50 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto border-t border-border"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6 absolute top-4 left-1/2 -translate-x-1/2" />
              
              <h2 className="text-2xl font-bold text-foreground mb-2 mt-4 tracking-tight">
                 {captureStep === 1 ? "What did you capture?" : "What are you looking for?"}
              </h2>
              <p className="text-muted-foreground mb-8">
                 {captureStep === 1 ? "Select the clothing item that matches your captured color." : "Select what you want to match it with."}
              </p>

              <div className="space-y-6">
                {captureStep === 1 && (
                  <div className="space-y-3">
                    <Label htmlFor="color-name" className="text-foreground font-semibold">Name this color (optional)</Label>
                    <Input 
                      id="color-name" 
                      placeholder={`e.g. Navy Blue Jacket`} 
                      value={pendingName}
                      onChange={(e) => setPendingName(e.target.value)}
                      className="bg-background border-border h-12 rounded-xl focus-visible:ring-foreground"
                    />
                  </div>
                )}

                {captureStep === 1 ? (
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tops</h4>
                      <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-border hover:border-foreground hover:bg-background text-foreground font-medium" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</Button>
                      <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-border hover:border-foreground hover:bg-background text-foreground font-medium" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</Button>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bottoms</h4>
                      <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-border hover:border-foreground hover:bg-background text-foreground font-medium" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</Button>
                      <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-border hover:border-foreground hover:bg-background text-foreground font-medium" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</Button>
                    </div>
                    <div className="space-y-3 col-span-2 mt-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Outerwear</h4>
                      <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-border hover:border-foreground hover:bg-background text-foreground font-medium" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 border-t border-border pt-6">
                    <Button className="w-full justify-center h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-lg font-semibold" onClick={() => handleSelectDesiredGarment('top')}>
                      Tops & Shirts
                    </Button>
                    <Button className="w-full justify-center h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-lg font-semibold" onClick={() => handleSelectDesiredGarment('bottom')}>
                      Bottoms & Trousers
                    </Button>
                    <Button className="w-full justify-center h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-lg font-semibold" onClick={() => handleSelectDesiredGarment('outerwear')}>
                      Outerwear & Jackets
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
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