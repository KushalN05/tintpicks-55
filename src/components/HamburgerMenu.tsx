import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu, X, LogOut, CreditCard, Palette, Hash,
  PlayCircle, ChevronRight, Plus, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HamburgerMenuProps {
  onLogout: () => void;
  onColorAdd: (color: string) => void;
  onSavedPaletteClick: () => void;
  onStartTour: () => void;
}

/* ── Section label ── */
const SectionLabel = ({ label }: { label: string }) => (
  <div className="px-5 pt-6 pb-2">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
  </div>
);

/* ── Row item ── */
const MenuRow = ({
  icon: Icon,
  label,
  onClick,
  badge,
  destructive = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  badge?: string;
  destructive?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-5 py-3 text-sm font-medium
      transition-colors duration-150 rounded-xl
      ${destructive
        ? 'text-red-500 hover:bg-red-50'
        : 'text-foreground hover:bg-foreground/10'
      }
    `}
  >
    <Icon className={`h-4 w-4 shrink-0 ${destructive ? 'text-red-400' : 'text-muted-foreground'}`} />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="text-[10px] font-bold uppercase tracking-wide bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
        {badge}
      </span>
    )}
    {!destructive && !badge && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
  </button>
);

/* ── Main Component ── */
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onLogout,
  onColorAdd,
  onSavedPaletteClick,
  onStartTour,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexValue, setHexValue] = useState('');
  const [hexError, setHexError] = useState('');
  const hexInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const close = () => setIsOpen(false);

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = hexValue.trim().replace(/^#/, '');
    const isValid = /^[0-9A-Fa-f]{6}$/.test(raw) || /^[0-9A-Fa-f]{3}$/.test(raw);
    if (!isValid) {
      setHexError('Enter a valid hex (e.g. #FF5733)');
      hexInputRef.current?.focus();
      return;
    }
    setHexError('');
    onColorAdd(`#${raw.length === 3 ? raw.split('').map(c => c + c).join('') : raw}`);
    setHexValue('');
    close();
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        id="hamburger-menu-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex items-center justify-center h-10 w-10 rounded-full text-foreground hover:bg-foreground/10 transition-colors duration-200"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* ── Backdrop and Drawer (Portaled to body) ── */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          {isOpen && (
            <div
              className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
              onClick={close}
            />
          )}

          {/* Slide-in Drawer */}
          <div
            className={`
              fixed top-0 right-0 z-[9999] h-full w-80
              bg-white shadow-2xl border-l border-border
              flex flex-col
              transition-transform duration-300 ease-in-out
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {/* ─ Header ─ */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-border">
              <div>
                <p className="font-bold text-foreground text-lg leading-tight font-sans">TintPicks</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your Color World 🎨</p>
              </div>
              <button
                onClick={close}
                aria-label="Close menu"
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* ─ Scrollable Body ─ */}
            <div className="flex-1 overflow-y-auto">

              {/* ACCOUNT */}
              <SectionLabel label="Account" />
              <div className="px-2 space-y-0.5">
                <MenuRow
                  icon={History}
                  label="Colour History"
                  onClick={() => { close(); navigate('/history'); }}
                />
                <MenuRow
                  icon={CreditCard}
                  label="Subscriptions"
                  badge="Coming Soon"
                  onClick={() => close()}
                />
              </div>

              {/* HEX CODE INPUT */}
              <SectionLabel label="Add by Hex Code" />
              <div className="px-5">
                <form onSubmit={handleHexSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-lg border border-border shrink-0 transition-colors duration-200"
                      style={{
                        backgroundColor:
                          /^#?[0-9A-Fa-f]{3,6}$/.test(hexValue.trim())
                            ? (hexValue.startsWith('#') ? hexValue : `#${hexValue}`)
                            : '#f3f4f6',
                      }}
                    />
                    <input
                      ref={hexInputRef}
                      type="text"
                      placeholder="#FF5733"
                      value={hexValue}
                      onChange={(e) => { setHexValue(e.target.value); setHexError(''); }}
                      maxLength={7}
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition"
                    />
                  </div>
                  {hexError && <p className="text-xs text-red-500">{hexError}</p>}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2  text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                    Add Color
                  </button>
                </form>
              </div>

              {/* TUTORIAL */}
              <SectionLabel label="Help" />
              <div className="px-2 space-y-0.5">
                <MenuRow
                  icon={PlayCircle}
                  label="Replay Tutorial"
                  onClick={() => { close(); setTimeout(onStartTour, 300); }}
                />
              </div>
            </div>

            {/* ─ Footer: Logout ─ */}
            <div className="px-3 py-4 border-t border-border">
              <MenuRow
                icon={LogOut}
                label="Log Out"
                destructive
                onClick={() => { close(); onLogout(); }}
              />
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default HamburgerMenu;
