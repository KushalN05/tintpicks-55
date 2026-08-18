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
import UploadActionSheet from "@/components/UploadActionSheet";

const tourSteps: TourStep[] = [
  {
    targetId: 'tour-camera-screen',
    text: "Welcome to TintPicks! To capture a color, you don't need to hunt for a tiny button. Just tap anywhere on the live camera screen to snap it!",
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
  
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

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
    <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-40 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Good morning{userName ? `, ${userName.split(' ')[0]}` : ''}
        </h1>
        <HamburgerMenu
          onLogout={handleLogout}
          onColorAdd={handleColorAdd}
          onSavedPaletteClick={() => {}}
          onStartTour={() => setIsTourActive(true)}
        />
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 relative">
        {showCamera ? (
          <ColorCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
        ) : (
          <div className="w-full flex flex-col items-center pb-32 animate-fade-in relative">
            {savedColors.length === 0 && !isTourActive ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] w-full mt-12">
                 <div className="text-center space-y-4">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                     <Camera className="w-8 h-8 text-gray-400" />
                   </div>
                   <h3 className="text-xl font-semibold text-gray-900">Your Wardrobe is Empty</h3>
                   <p className="text-gray-500 text-sm max-w-[250px] mx-auto">
                     Tap the button below to scan an item and start building your style board.
                   </p>
                 </div>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto">
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
          <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900 text-xl">
                {captureStep === 1 ? "What did you capture?" : "What are you looking for?"}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {captureStep === 1 
                  ? "Select the clothing item that matches your captured color."
                  : "Select what you want to match it with."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {captureStep === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="color-name" className="text-gray-900 font-medium">Name this color (optional)</Label>
                  <Input 
                    id="color-name" 
                    placeholder={`e.g. Navy Blue Jacket`} 
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    className="col-span-3 border-gray-200 bg-gray-50 focus-visible:ring-black"
                  />
                </div>
              )}

              {captureStep === 1 ? (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Tops</h4>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-medium" onClick={() => handleSelectCapturedGarment('top', 'shirt')}>Shirt</button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-medium" onClick={() => handleSelectCapturedGarment('top', 'tshirt')}>T-Shirt</button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Bottoms</h4>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-medium" onClick={() => handleSelectCapturedGarment('bottom', 'trousers')}>Trousers</button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-medium" onClick={() => handleSelectCapturedGarment('bottom', 'shorts')}>Shorts</button>
                  </div>
                  <div className="space-y-2 col-span-2 mt-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Outerwear</h4>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-medium" onClick={() => handleSelectCapturedGarment('outerwear', 'jacket')}>Jacket</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-100">
                  <button className="w-full text-center px-4 py-4 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-semibold" onClick={() => handleSelectDesiredGarment('top')}>
                    Tops & Shirts
                  </button>
                  <button className="w-full text-center px-4 py-4 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-semibold" onClick={() => handleSelectDesiredGarment('bottom')}>
                    Bottoms & Trousers
                  </button>
                  <button className="w-full text-center px-4 py-4 border border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-colors text-gray-900 font-semibold" onClick={() => handleSelectDesiredGarment('outerwear')}>
                    Outerwear & Jackets
                  </button>
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

      {/* Sticky Bottom Container / Upload Trigger */}
      {!showCamera && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white to-transparent pb-safe pt-12 px-6 pb-8 z-30">
          <button 
            onClick={() => setIsActionSheetOpen(true)}
            className="w-full rounded-full bg-black py-4 text-white font-semibold text-lg text-center shadow-lg active:scale-[0.98] transition-transform"
          >
            Scan an Item
          </button>
        </div>
      )}

      <UploadActionSheet 
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onSelectCamera={() => setShowCamera(true)}
        onSelectLibrary={() => {
          // Placeholder for future library upload logic
          alert("Photo Library integration coming soon!");
        }}
        onSelectFile={() => {
          // Placeholder for future file picker logic
          alert("File picker integration coming soon!");
        }}
      />
    </div>
  );
};

export default Index;