import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ColorCapture from "@/components/ColorCapture";
import FashionStylingBoard from "@/components/FashionStylingBoard";
import { Button } from "@/components/ui/button";
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
  } = useHomePage();

  const [capturedColor, setCapturedColor] = useState<string | null>(null);
  
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

  const handleCapture = (hex: string) => {
    setCapturedColor(hex);
    setShowCamera(false);
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
            <FashionStylingBoard capturedColor={capturedColor} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;