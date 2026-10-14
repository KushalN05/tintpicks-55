import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard, { CapturedItemConfig } from "@/components/FashionStylingBoard";
import { GarmentCategory, GarmentType } from "@/components/StylingMannequin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Layers, Bookmark, Search, CheckCircle2, Zap, Palette } from "lucide-react";
import { useHomePage } from "@/hooks/useHomePage";
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import ShoppingModal from "@/components/ShoppingModal";
import HamburgerMenu from "@/components/HamburgerMenu";
import InteractiveColorRing, { angleToHex } from "@/components/InteractiveColorRing";
import UpgradeModal from "@/components/UpgradeModal";
import { useSearchLimit } from "@/hooks/useSearchLimit";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-gender-selector',
    text: 'Before we start, select your styling gender here! This helps us find the most accurate fashion matches and optimizes your experience.'
  },
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
    text: 'After you capture or save a color, you will automatically be brought to the Styling board to build your outfit.'
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
  
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedShopCategory, setSelectedShopCategory] = useState("All");

  const { searchCount, SEARCH_LIMIT, isPro, incrementSearch } = useSearchLimit();

  const handleShop = (color: string, category: string) => {
    if (!incrementSearch()) {
      setShowUpgradeModal(true);
      return;
    }
    setSelectedColor(color);
    setSelectedShopCategory(category);
    setShowShoppingModal(true);
  };

  const {
    showCamera,
    setShowCamera,
    isTourActive,
    setIsTourActive,
    handleLogout,
    handleColorAdd,
    handleColorCapture,
    savedColors,
  } = useHomePage();

  const [pendingHex, setPendingHex] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string>("");
  const [capturedItem, setCapturedItem] = useState<CapturedItemConfig | null>(null);
  const [captureStep, setCaptureStep] = useState<1 | 2>(1);
  const [capturedCategory, setCapturedCategory] = useState<GarmentCategory | null>(null);
  const [capturedItemType, setCapturedItemType] = useState<GarmentType | null>(null);
  
  const [activeTab, setActiveTab] = useState<'home' | 'wardrobe'>('home');
  const [gender, setGender] = useState<'unisex' | 'mens' | 'womens' | ''>('');
  const [loadedOutfit, setLoadedOutfit] = useState<any>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.loadOutfit) {
      setLoadedOutfit(location.state.loadOutfit);
      setActiveTab('wardrobe');
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const [ringAngles, setRingAngles] = useState<[number, number]>([30, 210]);

  const getHarmonyInfo = (a1: number, a2: number) => {
    let diff = Math.abs(a1 - a2);
    if (diff > 180) diff = 360 - diff;

    if (diff < 15) return { name: "Monochromatic", desc: "Variations of the same hue." };
    if (diff > 15 && diff <= 45) return { name: "Analogous", desc: "Adjacent colors on the wheel." };
    if (diff > 150) return { name: "Complementary", desc: "High contrast and high impact." };
    if (diff > 105 && diff <= 135) return { name: "Triadic", desc: "Vibrant but balanced contrast." };
    return { name: "Contrasting", desc: "Bold pairing bringing dynamic energy." };
  };

  const harmony = getHarmonyInfo(ringAngles[0], ringAngles[1]);

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
    } catch {
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
      } catch {
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col font-sans pb-32 overflow-x-hidden">
      
      {showCamera ? (
        <div className="absolute inset-0 z-50 bg-background">
          <ErrorBoundary>
            <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
          </ErrorBoundary>
        </div>
      ) : (
        <div className="flex flex-col gap-10 px-4 py-6 md:px-8 md:py-10 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-2">
                <img src="/favicon.png" alt="TintPicks" className="w-8 h-8 rounded-lg" />
                <h1 className="font-serif text-3xl md:text-4xl leading-snug tracking-tight text-foreground">
                  TintPicks Studio
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                AI-Powered Fashion Styling
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select 
                id="tour-gender-selector"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className={`bg-card text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${!gender ? 'animate-pulse ring-2 ring-destructive border-destructive text-destructive' : ''}`}
              >
                <option value="" disabled>Set Gender</option>
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

          {/* Metrics Section (Tallie-inspired) */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Metrics</h2>
            <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
              
              <div className="flex h-32 flex-col justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Bookmark className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-tight">Saved Colors</span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-3xl leading-none font-medium text-foreground">{savedColors.length}</p>
                </div>
              </div>

              <div id="tour-active-outfit-btn" className="flex h-32 flex-col justify-between rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-card/80 transition-colors" onClick={() => savedColors.length > 0 && setActiveTab('wardrobe')}>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Layers className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-tight">Active Outfit</span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-3xl leading-none font-medium text-foreground">
                    {savedColors.length > 0 ? "1" : "0"}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    {savedColors.length > 0 ? (
                      <span className="flex items-center text-primary"><CheckCircle2 className="w-3 h-3 mr-1"/> Ready</span>
                    ) : (
                      <span className="text-muted-foreground">Empty</span>
                    )}
                  </div>
                </div>
              </div>

              <div id="tour-color-math" className="flex h-32 flex-col justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Palette className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-tight">Harmony</span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-2xl leading-none font-medium text-foreground truncate">{harmony.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{harmony.desc}</p>
                </div>
              </div>

              <div className="flex h-32 flex-col justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Search className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-tight">Searches</span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-3xl leading-none font-medium text-foreground">
                    {isPro ? "Unlimited" : `${Math.max(0, SEARCH_LIMIT - searchCount)} left`}
                  </p>
                  {!isPro && (
                    <div className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline" onClick={() => setShowUpgradeModal(true)}>
                      <Zap className="w-3 h-3"/> Upgrade to Pro
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* Main Area */}
          <section className="flex flex-col gap-5 mt-4">
            {activeTab === 'home' ? (
              <div className="w-full max-w-2xl mx-auto flex flex-col items-center py-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="w-full flex justify-center px-4"
                >
                  <InteractiveColorRing angles={ringAngles} onChange={setRingAngles}>
                    <button 
                      id="tour-camera-btn"
                      onClick={() => {
                        if (!gender) {
                          alert("Please select your gender at the top first!");
                          return;
                        }
                        setShowCamera(true);
                      }}
                      className="w-full h-full rounded-full flex flex-col items-center justify-center hover:bg-black/5 active:bg-black/10 transition-colors duration-300 group"
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors group-hover:border-primary">
                        <Plus className="w-8 h-8" />
                      </div>
                      <span className="text-xl font-medium text-foreground tracking-wide">Capture</span>
                    </button>
                  </InteractiveColorRing>
                </motion.div>
                
                <div className="mt-12 w-full flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-border shadow-inner" style={{ backgroundColor: angleToHex(ringAngles[0]) }} />
                    <span className="font-mono text-sm tracking-wider uppercase text-muted-foreground">{angleToHex(ringAngles[0])}</span>
                  </div>
                  <span className="text-muted-foreground">+</span>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-border shadow-inner" style={{ backgroundColor: angleToHex(ringAngles[1]) }} />
                    <span className="font-mono text-sm tracking-wider uppercase text-muted-foreground">{angleToHex(ringAngles[1])}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[60vh] pb-8 pt-4">
                <ErrorBoundary>
                  <FashionStylingBoard 
                    capturedItem={capturedItem} 
                    savedColors={savedColors}
                    initialOutfit={loadedOutfit}
                    gender={gender}
                    onShop={handleShop}
                  />
                </ErrorBoundary>
              </div>
            )}
          </section>

        </div>
      )}

      {/* Bottom Navigation */}
      {!showCamera && (
        <div className="fixed bottom-0 inset-x-0 h-[80px] md:h-[100px] bg-card/90 backdrop-blur-2xl border-t border-border flex justify-around items-center px-6 pb-safe z-40">
          <button 
            id="tour-tab-capture"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
             <Plus className="w-6 h-6 md:w-7 md:h-7" />
             <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase">Capture</span>
          </button>
          <button 
            id="tour-tab-styling"
            onClick={() => {
              if (!gender) {
                alert("Please select your gender at the top first!");
                return;
              }
              if (savedColors.length > 0 || loadedOutfit) setActiveTab('wardrobe');
            }}
            className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'wardrobe' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} ${(savedColors.length === 0 && !loadedOutfit) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             <Layers className="w-6 h-6 md:w-7 md:h-7" />
             <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase">Styling</span>
          </button>
          <button 
            id="tour-tab-saved"
            onClick={() => navigate('/history')}
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
             <Bookmark className="w-6 h-6 md:w-7 md:h-7" />
             <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase">Saved</span>
          </button>
        </div>
      )}

      {isTourActive && (
        <GuidedTour 
          steps={tourSteps} 
          onComplete={handleTourComplete} 
          onStepChange={(stepIndex) => {
            const targetId = tourSteps[stepIndex]?.targetId;
            if (['tour-tab-styling', 'tour-layers', 'tour-mannequin', 'tour-swiper', 'tour-save-wardrobe', 'tour-shop'].includes(targetId)) {
              setActiveTab('wardrobe');
            } else {
              setActiveTab('home');
            }
          }}
        />
      )}

      {/* Capture Dialog */}
      <Dialog open={!!pendingHex} onOpenChange={(open) => !open && setPendingHex(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
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
                  placeholder={`e.g. Mint Green Jacket`} 
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  className="bg-background border-border text-foreground focus-visible:ring-primary"
                />
              </div>
            )}

            {captureStep === 1 ? (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Tops</h4>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-background" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</Button>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-background" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Bottoms</h4>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-background" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</Button>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-background" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</Button>
                </div>
                <div className="space-y-2 col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Outerwear</h4>
                  <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-background" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="w-full justify-center h-12 text-base border-border text-foreground hover:bg-background" onClick={() => handleSelectDesiredGarment('top')}>
                  Tops & Shirts
                </Button>
                <Button variant="outline" className="w-full justify-center h-12 text-base border-border text-foreground hover:bg-background" onClick={() => handleSelectDesiredGarment('bottom')}>
                  Bottoms & Trousers
                </Button>
                <Button variant="outline" className="w-full justify-center h-12 text-base border-border text-foreground hover:bg-background" onClick={() => handleSelectDesiredGarment('outerwear')}>
                  Outerwear & Jackets
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <ErrorBoundary>
        <ShoppingModal 
          isOpen={showShoppingModal} 
          onClose={() => setShowShoppingModal(false)}
          color={selectedColor}
          initialCategory={selectedShopCategory}
          initialGender={gender === 'unisex' ? 'Unisex' : gender === 'mens' ? 'Mens' : gender === 'womens' ? 'Womens' : 'All'}
        />
      </ErrorBoundary>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default Index;