
import { Camera, LogOut, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';

interface AppHeaderProps {
  onCameraClick: () => void;
  onLogout: () => void;
}

const AppHeader = ({ onCameraClick, onLogout }: AppHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 gradient-whisper backdrop-blur-lg border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="md:hidden py-4 space-y-4">
          <div className="text-center animate-fade-in">
            <BrandLogo size="md" showName={true} animate={true} />
            <p className="text-sm text-muted-foreground font-medium mt-2 animate-slide-up">
              Your color journey awaits
            </p>
          </div>
          <div className="flex justify-center gap-3 animate-scale-in">
            <Button
              className="rounded-full shadow-lg gradient-brand hover:scale-105 text-white group transition-all duration-300 flex-1 max-w-xs brand-glow"
              onClick={onCameraClick}
            >
              <Camera className="mr-2 h-4 w-4 group-hover:animate-bounce-subtle" />
              <span className="hidden xs:inline">Capture Color</span>
              <span className="xs:hidden">Capture</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onLogout}
              className="rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300 shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex py-6 justify-between items-center">
          <div className="flex-1 text-center animate-fade-in">
            <BrandLogo size="lg" showName={true} animate={true} />
            <p className="mt-2 text-muted-foreground font-medium animate-slide-up">
              Your color journey awaits
            </p>
          </div>
          <div className="flex gap-4 animate-scale-in">
            <Button
              id="tour-camera"
              size="lg"
              className="rounded-full shadow-lg gradient-brand hover:scale-105 text-white group transition-all duration-300 brand-glow"
              onClick={onCameraClick}
            >
              <Camera className="mr-2 h-5 w-5 group-hover:animate-bounce-subtle" />
              Capture Color
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onLogout}
              className="rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
