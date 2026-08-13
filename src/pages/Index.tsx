import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import GuidedTour, { TourStep } from "@/components/tour/GuidedTour";
import React from "react";
import ColorCapture from "@/components/ColorCapture";
import ColorInput from "@/components/ColorInput";
import ShoppingModal from "@/components/ShoppingModal";
import UserProfileInitializer from "@/components/UserProfileInitializer";
import YayLoader from "@/components/YayLoader";
import GhibliFloatingElements from "@/components/home/GhibliFloatingElements";
import AppHeaderSection from "@/components/home/AppHeaderSection";
import MascotSection from "@/components/home/MascotSection";
import ColorTabs from "@/components/home/ColorTabs";

import ParticleSystem from "@/components/ParticleSystem";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useHomePage } from "@/hooks/useHomePage";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const {
    showCamera,
    setShowCamera,
    showShoppingModal,
    setShowShoppingModal,
    selectedColor,
    savedColors,
    setSavedColors,
    mascotMood,
    activeTab,
    setActiveTab,
    showYay,
    handleShowYay,
    handleColorCapture,
    handleColorAdd,
    handleClearColors,
    handleLogout,
    handleShop,
    handleColorSaveFromDiscover,
  } = useHomePage();
  
  useEffect(() => {
    // Load user profile
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get onboarding data for personalized greeting
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

  const handleTourComplete = async () => {
    if (userProfile && !userProfile.onboarding_completed) {
      setUserProfile({ ...userProfile, onboarding_completed: true });
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userProfile.id);
    }
  };

  const tourSteps: TourStep[] = [
    { targetId: 'tour-camera', text: "Hi, I'm Tinti! Tap here to scan a color you love." },
    { targetId: 'tour-harmonies', text: "I'll instantly show you perfect matching colors!" },
    { targetId: 'tour-save', text: "Click Save to add it to your Cloud Wardrobe!" },
  ];

  return (
    <div className="min-h-screen bg-ghibli-gradient relative">
      {/* Tour Component */}
      {userProfile?.onboarding_completed === false && (
        <GuidedTour steps={tourSteps} onComplete={handleTourComplete} />
      )}
      
      {/* Main Content */}
      <div className="min-h-screen relative overflow-x-hidden">
        <YayLoader show={showYay} />
        <ParticleSystem trigger={showYay} />
        <GhibliFloatingElements />

        <UserProfileInitializer onColorsLoaded={setSavedColors} />

        {showCamera ? (
          <ColorCapture onCapture={handleColorCapture} onClose={() => setShowCamera(false)} />
        ) : (
          <>
            <AppHeaderSection userName={userName} userProfile={userProfile} onCameraClick={() => setShowCamera(true)} onLogout={handleLogout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in camera-button">
                <div className="w-full md:w-3/4 animate-slide-up">
                  <ColorInput onAdd={handleColorAdd} onClear={handleClearColors} />
                </div>
                <div className="animate-scale-in">
                  <MascotSection mascotMood={mascotMood} />
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-fade-in">
              <div className="color-grid">
                <ColorTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  savedColors={savedColors}
                  onShop={handleShop}
                  onColorAdd={handleColorAdd}
                  onShowYay={handleShowYay}
                  onColorSaveFromDiscover={handleColorSaveFromDiscover}
                />
              </div>
            </div>

            <div className="recommendations">
              {/* Recommendations section placeholder */}
            </div>

            <div className="shopping-section">
              <ShoppingModal
                isOpen={showShoppingModal}
                onClose={() => setShowShoppingModal(false)}
                color={selectedColor}
              />
            </div>

            {/* Floating Action Button */}
            <FloatingActionButton 
              onCameraClick={() => setShowCamera(true)}
              onPaletteClick={() => setActiveTab('palette')}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;