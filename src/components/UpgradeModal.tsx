import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, CheckCircle2 } from 'lucide-react';
import { useSearchLimit } from '@/hooks/useSearchLimit';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { upgradeToPro } = useSearchLimit();

  const handleUpgrade = () => {
    upgradeToPro();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-stone-900 border-stone-800 text-white overflow-hidden p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-800/50 via-stone-900 to-black pointer-events-none" />
        
        <div className="relative p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <DialogHeader className="space-y-3 mb-8 w-full">
            <DialogTitle className="text-2xl font-serif text-white flex items-center justify-center gap-2">
              Unlock TintPicks Pro
              <Sparkles className="w-5 h-5 text-primary" />
            </DialogTitle>
            <DialogDescription className="text-stone-300 text-sm leading-relaxed max-w-[280px] mx-auto">
              You've reached your free limit of 5 searches. Upgrade to Pro to unlock unlimited fashion matching.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full space-y-4 mb-8 text-left bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-stone-200">Unlimited fashion matching and searches</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-stone-200">Save unlimited outfits to your Wardrobe</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-stone-200">Exclusive access to premium brand matches</p>
            </div>
          </div>

          <Button 
            onClick={handleUpgrade}
            className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground font-semibold tracking-wide shadow-lg shadow-primary/20 border-0"
          >
            Upgrade to Pro Now
          </Button>
          
          <p className="text-xs text-stone-500 mt-4">
            Cancel anytime. Secure checkout.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
