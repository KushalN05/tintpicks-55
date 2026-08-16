import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, Layers, ShoppingBag, Check } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'TintPicks - See a color. Wear the fit.';
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">TintPicks</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how-it-works" className="text-zinc-500 hover:text-zinc-900 transition-colors">How it Works</a>
            <a href="#pricing" className="text-zinc-500 hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#about" className="text-zinc-500 hover:text-zinc-900 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              variant="default"
              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-zinc-900">
            See a color.<br />Wear the fit.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The precision styling tool that bridges human color perception with fashion retail. Anchor a shade, build a cohesive palette, and step out in confidence.
          </p>
          <div className="flex items-center justify-center gap-4 mb-20">
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-8 h-14 text-base"
            >
              Start Styling for Free
            </Button>
          </div>

          {/* Hero Mockup Placeholder */}
          <div className="w-full max-w-4xl mx-auto aspect-[16/9] bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden flex items-center justify-center shadow-sm">
            <span className="text-zinc-400 font-medium tracking-widest uppercase text-sm">App Interface Mockup</span>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-zinc-50 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">A seamless workflow.</h2>
              <p className="text-zinc-500 max-w-xl mx-auto">From inspiration to wardrobe in three intuitive steps.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Camera className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">1. Capture</h3>
                <p className="text-zinc-500 leading-relaxed">Scan any color from the real world using your device's camera, or pick a starting base shade.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Layers className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">2. Style</h3>
                <p className="text-zinc-500 leading-relaxed">Map colors onto our interactive 2D mannequin to visualize combinations using advanced fashion color math.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <ShoppingBag className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">3. Shop</h3>
                <p className="text-zinc-500 leading-relaxed">Instantly discover matching garments from top retailers that perfectly align with your designed palette.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
              <p className="text-zinc-500 max-w-xl mx-auto">Choose the tier that fits your styling needs.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free Tier */}
              <div className="border border-zinc-200 rounded-3xl p-8 flex flex-col">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold tracking-tight mb-2">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">£0</span>
                    <span className="text-zinc-500 text-sm">/ forever</span>
                  </div>
                  <p className="text-zinc-500 mt-4 text-sm leading-relaxed">Perfect for occasional outfit planning and color discovery.</p>
                </div>
                <ul className="space-y-4 flex-1 mb-8">
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> 10 color captures per month</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> Basic mannequin styling</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> Standard shopping links</li>
                </ul>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full rounded-full h-12 border-zinc-200 hover:bg-zinc-50">
                  Get Started
                </Button>
              </div>

              {/* Pro Tier */}
              <div className="border-2 border-zinc-900 rounded-3xl p-8 flex flex-col relative shadow-lg">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-zinc-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold tracking-tight mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">£3.99</span>
                    <span className="text-zinc-500 text-sm">/ month</span>
                  </div>
                  <p className="text-zinc-500 mt-4 text-sm leading-relaxed">Unlock the full power of your personal Cloud Wardrobe.</p>
                </div>
                <ul className="space-y-4 flex-1 mb-8">
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> Unlimited color captures</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> Advanced palette generation</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> Save unlimited outfits</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-zinc-900" /> Priority shopping recommendations</li>
                </ul>
                <Button onClick={() => navigate('/login')} className="w-full rounded-full h-12 bg-zinc-900 text-white hover:bg-zinc-800">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-zinc-900 text-white px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Our Mission</h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-10">
              We believe that styling should be intuitive, precision-driven, and beautiful. TintPicks bridges the gap between human color perception and the fragmented world of fashion retail, allowing you to build a cohesive wardrobe anchored around the exact colors you see in the real world.
            </p>
            <div className="w-12 h-1 bg-white/20 mx-auto rounded-full" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-500 text-sm border-t border-zinc-100">
        <p>© {new Date().getFullYear()} TintPicks. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
