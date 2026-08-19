import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Plus, Layers, Bookmark } from "lucide-react";
import { useHomePage } from "@/hooks/useHomePage";
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import ShoppingModal from "@/components/ShoppingModal";
import HamburgerMenu from "@/components/HamburgerMenu";
import InteractiveColorRing, { angleToHex } from "@/components/InteractiveColorRing";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tourSteps: TourStep[] = [
  {
    targetId: 'hamburger-menu-btn',
    text: 'Welcome to TintPicks! Tap here to access your account, manually add hex codes, and view your colour history.'
  },
  {
    targetId: 'tour-camera-btn',
    text: 'This is the heart of the app. Tap the center to open the camera and capture your physical garments.'
  },
  {
    targetId: 'tour-camera-screen',
    text: 'You can also drag these two thumbs around the color wheel to manually explore different palettes!'
  },
  {
    targetId: 'tour-color-math',
    text: 'As you pick colors, our engine instantly calculates the harmony to show you exactly how well they match.'
  },
  {
    targetId: 'tour-tab-styling',
    text: 'Once you have some colors, head over to the Styling board to build your outfit.'
  },
  {
    targetId: 'tour-layers',
    text: 'Use these layer controls to equip different types of tops, bottoms, and outerwear.'
  },
  {
    targetId: 'tour-mannequin',
    text: 'Tap on any part of the mannequin to assign your colors to that specific layer.'
  },
  {
    targetId: 'tour-swiper',
    text: 'Swipe through curated fashion matches generated dynamically from your base color.'
  },
  {
    targetId: 'tour-save-wardrobe',
    text: 'When you are happy with your outfit, save it to your Wardrobe.'
  },
  {
    targetId: 'tour-tab-saved',
    text: 'You can view all your saved beautiful mannequin profiles anytime here in the Saved tab!'
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
  const [gender, setGender] = useState<'unisex' | 'mens' | 'womens'>('unisex');
  const navigate = useNavigate();

  const [ringAngles, setRingAngles] = useState<[number, number]>([30, 210]); // Default to complementary

  // Math for harmony
  const getHarmonyInfo = (a1: number, a2: number) => {
    let diff = Math.abs(a1 - a2);
    if (diff > 180) diff = 360 - diff;

    if (diff < 15) return { name: "Monochromatic", desc: "Variations of the same hue, offering a cohesive, soothing look." };
    if (diff > 15 && diff <= 45) return { name: "Analogous", desc: "Adjacent colors on the wheel, creating a serene and comfortable aesthetic." };
    if (diff > 150) return { name: "Complementary", desc: "Opposite colors creating high contrast and high impact." };
    if (diff > 105 && diff <= 135) return { name: "Triadic", desc: "Evenly spaced colors offering vibrant but balanced contrast." };
    return { name: "Contrasting", desc: "A bold pairing that brings dynamic energy to an outfit." };
  };

  const harmony = getHarmonyInfo(ringAngles[0], ringAngles[1]);

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
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                  <img src="/favicon.png" alt="TintPicks" className="w-8 h-8 rounded-lg" />
                  <span className="font-bold text-lg tracking-tight font-serif">TintPicks</span>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="bg-card text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="mens">Mens</option>
                    <option value="womens">Womens</option>
                  </select>
                  <HamburgerMenu
                    onLogout={handleLogout}
                    onColorAdd={handleColorAdd}
                    onSavedPaletteClick={() => navigate('/history')}
                    onStartTour={() => setIsTourActive(true)}
                  />
                </div>
              </div>

              {/* Desktop Grid (80/20 Split) */}
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-8 px-4 lg:px-8 pt-4">

                 {/* Center Column: The Gradient Ring Dashboard (80%) */}
                 <div className="flex flex-col w-full mx-auto relative lg:col-span-4 lg:max-w-2xl">
                    {/* Greeting */}
                    <motion.h1 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl md:text-5xl font-bold text-foreground text-center max-w-[320px] leading-tight tracking-tight mx-auto mt-4 mb-16 font-serif"
                    >
                      How are you styling this morning?
                    </motion.h1>

                    {/* Massive Interactive Gradient Ring */}
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.1 }}
                      className="w-full flex justify-center mb-16 px-4"
                    >
                      <InteractiveColorRing angles={ringAngles} onChange={setRingAngles}>
                        <button 
                          id="tour-camera-btn"
                          onClick={() => setShowCamera(true)}
                          className="w-full h-full rounded-full flex flex-col items-center justify-center hover:bg-black/5 active:bg-black/10 transition-colors duration-300 group"
                        >
                          <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mb-3 group-hover:bg-foreground group-hover:text-background transition-colors">
                            <Plus className="w-8 h-8" />
                          </div>
                          <span className="text-xl font-medium text-foreground tracking-wide">Capture</span>
                        </button>
                      </InteractiveColorRing>
                    </motion.div>

                    {/* Stat Pills */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex gap-4 px-6 mb-8 max-w-md mx-auto w-full"
                    >
                      <div className="flex-1 bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-sm hover:bg-card transition-colors">
                        <span className="text-4xl font-serif text-foreground mb-1">{savedColors.length}</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">Saved<br/>Colors</span>
                      </div>
                      <div 
                        id="tour-active-outfit-btn"
                        className="flex-1 bg-card/60 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-sm hover:bg-card transition-colors cursor-pointer"
                        onClick={() => savedColors.length > 0 && setActiveTab('wardrobe')}
                      >
                        <span className="text-4xl font-serif text-foreground mb-1">{savedColors.length > 0 ? "1" : "0"}</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">Active<br/>Outfit</span>
                      </div>
                    </motion.div>
                 </div>

                 {/* Right Panel: Color Math (20%) */}
                 <div id="tour-color-math" className="flex flex-col h-full lg:border-l border-t lg:border-t-0 border-border/50 lg:pl-8 pt-8 lg:pt-0 lg:col-span-1 mb-32 lg:mb-0">
                   <h2 className="text-xl font-bold font-serif mb-6 px-1">Color Math</h2>
                   <div className="flex flex-col gap-6">
                      
                      <div className="p-6 bg-card/60 backdrop-blur-md rounded-[2rem] border border-border/50 shadow-sm">
                         <h3 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">Current Selection</h3>
                         <div className="flex items-center gap-4 mb-3">
                           <div className="w-8 h-8 rounded-full border border-border shadow-inner" style={{ backgroundColor: angleToHex(ringAngles[0]) }} />
                           <span className="font-mono text-sm tracking-wider uppercase">{angleToHex(ringAngles[0])}</span>
                         </div>
                         <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full border border-border shadow-inner" style={{ backgroundColor: angleToHex(ringAngles[1]) }} />
                           <span className="font-mono text-sm tracking-wider uppercase">{angleToHex(ringAngles[1])}</span>
                         </div>
                      </div>

                      <div className="p-6 bg-card/60 backdrop-blur-md rounded-[2rem] border border-border/50 shadow-sm">
                         <h3 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-3">Harmony</h3>
                         <p className="text-sm font-medium leading-relaxed">
                           <span className="font-bold">{harmony.name}</span>. {harmony.desc}
                         </p>
                      </div>
                   </div>
                 </div>

              </div>
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
            id="tour-tab-capture"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'home' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
          >
             <Plus className={`w-7 h-7 ${activeTab === 'home' ? 'text-[#f97316]' : ''}`} />
             <span className="text-[11px] font-bold tracking-widest uppercase">Capture</span>
          </button>
          <button 
            id="tour-tab-styling"
            onClick={() => {
              if (savedColors.length > 0) setActiveTab('wardrobe');
            }}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'wardrobe' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'} ${savedColors.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             <Layers className="w-7 h-7" />
             <span className="text-[11px] font-bold tracking-widest uppercase">Styling</span>
          </button>
          <button 
            id="tour-tab-saved"
            onClick={() => navigate('/history')}
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground/80 transition-colors"
          >
             <Bookmark className="w-7 h-7" />
             <span className="text-[11px] font-bold tracking-widest uppercase">Saved</span>
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