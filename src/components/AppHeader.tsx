
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';
import HamburgerMenu from '@/components/HamburgerMenu';

interface AppHeaderProps {
  onCameraClick: () => void;
  onLogout: () => void;
  onColorAdd: (color: string) => void;
  onSavedPaletteClick: () => void;
  onStartTour: () => void;
}

const AppHeader = ({ onCameraClick, onLogout, onColorAdd, onSavedPaletteClick, onStartTour }: AppHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 gradient-whisper backdrop-blur-lg border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="md:hidden py-3 flex items-center justify-between gap-2">
          <BrandLogo size="sm" showName={true} animate={true} />

          <Button
            id="tour-camera"
            className="rounded-full shadow-md gradient-brand hover:scale-105 text-white group transition-all duration-300 brand-glow h-9 px-4 text-sm"
            onClick={onCameraClick}
          >
            <Camera className="mr-1.5 h-3.5 w-3.5 group-hover:animate-bounce-subtle" />
            Capture
          </Button>

          <HamburgerMenu
            onLogout={onLogout}
            onColorAdd={onColorAdd}
            onSavedPaletteClick={onSavedPaletteClick}
            onStartTour={onStartTour}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex py-6 justify-between items-center">
          <div className="flex-1 text-center animate-fade-in">
            <BrandLogo size="lg" showName={true} animate={true} />
            <p className="mt-2 text-muted-foreground font-medium animate-slide-up">
              Your color journey awaits
            </p>
          </div>
          <div className="flex gap-3 items-center animate-scale-in">
            <Button
              id="tour-camera"
              size="lg"
              className="rounded-full shadow-lg gradient-brand hover:scale-105 text-white group transition-all duration-300 brand-glow"
              onClick={onCameraClick}
            >
              <Camera className="mr-2 h-5 w-5 group-hover:animate-bounce-subtle" />
              Capture Color
            </Button>

            <HamburgerMenu
              onLogout={onLogout}
              onColorAdd={onColorAdd}
              onSavedPaletteClick={onSavedPaletteClick}
              onStartTour={onStartTour}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
