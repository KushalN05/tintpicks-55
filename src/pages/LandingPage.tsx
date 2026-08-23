import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Camera, Layers, ShoppingBag, Check, Instagram, ArrowRight,
  ShieldCheck, HelpCircle, Menu, Star, Sparkles, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'TintPicks - See a color. Wear the fit.';
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const steps = [
    {
      title: "1. Capture",
      desc: "Scan any color from the real world using your device's camera, or pick a starting base shade.",
      icon: <Camera className="w-6 h-6 text-foreground" />
    },
    {
      title: "2. Style",
      desc: "Map colors onto our interactive 2D mannequin to visualize combinations using advanced fashion color math.",
      icon: <Layers className="w-6 h-6 text-foreground" />
    },
    {
      title: "3. Shop",
      desc: "Instantly discover matching garments from top retailers that perfectly align with your designed palette.",
      icon: <ShoppingBag className="w-6 h-6 text-foreground" />
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground/10">
      
      {/* ═══════════════════════════════════════════════════════════════
          FLOATING PILL NAVBAR (navigation-5 pattern)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-50 w-full py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-6">
          <div className="flex h-14 w-full max-w-4xl items-center justify-between gap-2 rounded-full border border-border bg-background/80 backdrop-blur-md pr-3 shadow-sm">
            
            {/* Logo */}
            <div className="flex items-center gap-2 pr-6 pl-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/favicon.png" alt="TintPicks" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-lg tracking-tight">TintPicks</span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#how-it-works" className="rounded-full bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                How it Works
              </a>
              <a href="#pricing" className="rounded-full bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </a>
              <a href="#about" className="rounded-full bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                About
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/login')}
                className="hidden md:block rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 font-semibold"
              >
                Get Started
              </Button>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-foreground">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="flex w-[300px] flex-col gap-6 p-6 bg-background">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
                        <img src="/favicon.png" alt="TintPicks" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-lg tracking-tight">TintPicks</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground">How it Works</a>
                      <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground">Pricing</a>
                      <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground">About</a>
                    </div>
                    <div className="mt-auto flex flex-col gap-3">
                      <Button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                        Get Started
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main>
        {/* ═══════════════════════════════════════════════════════════════
            HERO / CTA SECTION (cta-2 pattern)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative flex w-full items-center justify-center overflow-hidden">
          {/* Dot grid background */}
          <div className="absolute inset-0 z-0 h-full w-full bg-transparent [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] [mask-image:linear-gradient(to_bottom,black_60%,transparent)] [background-size:20px_20px]" />
          
          <div className="relative z-10 w-full max-w-3xl overflow-hidden bg-transparent px-6 py-16 text-center sm:px-16 sm:py-24">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              
              {/* Badge */}
              <div className="mb-7 flex justify-center">
                <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-foreground rounded-full animate-pulse" />
                  Trusted by Fashion Enthusiasts
                </Badge>
              </div>

              {/* Heading */}
              <h1 className="text-foreground mb-5 font-serif text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl md:text-6xl">
                See a color.
                <br />
                Wear the{' '}
                <span className="italic text-foreground/70">fit.</span>
              </h1>

              {/* Subtext */}
              <p className="text-muted-foreground mx-auto mb-10 max-w-md text-base leading-relaxed">
                The precision styling tool that bridges human color perception with fashion retail. Anchor a shade, build a cohesive palette, and step out in confidence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="group w-full sm:w-auto gap-2 rounded-full text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 px-8 h-12 shadow-xl"
                >
                  Start Styling for Free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto rounded-full text-sm font-medium border-border hover:bg-card px-8 h-12"
                >
                  See how it works
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-border border-2 border-background overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="User avatar" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-[2px]">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                </div>
                <span>Loved by 10,000+ stylists</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="px-6 pb-24 -mt-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-[2rem] border-2 border-border overflow-hidden shadow-2xl bg-card">
              <img
                src="/app-mockup.jpg"
                alt="TintPicks App - Color Wheel, Mannequin Styling, and Fashion Matching"
                className="w-full h-auto object-cover"
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            HOW IT WORKS (sticky scroll pattern)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-24 bg-card px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">A seamless workflow.</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">From inspiration to wardrobe in three intuitive steps.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    className={`transition-all duration-300 cursor-pointer ${activeStep === idx ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className="w-14 h-14 bg-background border border-border rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="relative h-[400px] w-full bg-background rounded-[2rem] border-2 border-border flex items-center justify-center shadow-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center"
                  >
                    {activeStep === 0 && <Camera className="w-32 h-32 text-foreground" />}
                    {activeStep === 1 && <Layers className="w-32 h-32 text-foreground" />}
                    {activeStep === 2 && <ShoppingBag className="w-32 h-32 text-foreground" />}
                    <h4 className="mt-8 font-bold text-xl uppercase tracking-widest">{steps[activeStep].title}</h4>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRICING SECTION (pricing-3 pattern)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-16 flex flex-col items-start justify-between gap-12 lg:flex-row lg:gap-8">
              <div className="flex max-w-2xl flex-col items-start gap-5">
                <Badge variant="outline" className="text-muted-foreground border-border bg-card/50 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm">
                  <Sparkles className="text-foreground h-4 w-4" />
                  <span className="text-foreground font-medium">Pricing</span>
                </Badge>
                <h2 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
                  Simple, transparent pricing.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
                  Choose the tier that fits your styling needs. Start free and upgrade when you need unlimited power.
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 pt-2 lg:w-1/3">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
                  Enterprise
                  <Star className="text-foreground h-4 w-4" />
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Need a custom plan for your fashion brand, styling team, or retail platform?
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Button variant="outline" className="group rounded-full">
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <span className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span className="bg-muted-foreground/50 h-1 w-1 rounded-full" />
                    Bespoke volume pricing
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Cards (pricing-3 horizontal layout) */}
            <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
              {/* Free Tier */}
              <div className="bg-card relative flex flex-col gap-8 rounded-[2rem] border border-border p-6 transition-all duration-300 sm:flex-row sm:p-8 md:p-10">
                <div className="border-border flex flex-1 flex-col items-start border-b pb-8 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0">
                  <Badge variant="outline" className="bg-card/30 mb-4 rounded-full px-3 text-xs font-medium">
                    Basic
                  </Badge>
                  <div className="text-foreground mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
                    £0
                  </div>
                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                    Perfect for occasional outfit planning and color discovery.
                  </p>
                  <div className="mt-auto w-full">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="group h-12 w-full rounded-full px-6 sm:w-auto"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center sm:pl-2">
                  <ul className="space-y-4 md:space-y-5">
                    {[
                      "5 fashion searches per month",
                      "Basic mannequin styling",
                      "Standard shopping links",
                      "Color wheel exploration",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="text-foreground mt-0.5 h-5 w-5 shrink-0" />
                        <span className="text-foreground text-sm font-medium md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="relative flex flex-col gap-8 rounded-[2rem] border border-foreground ring-1 ring-foreground/20 p-6 transition-all duration-300 sm:flex-row sm:p-8 md:p-10 bg-card">
                <div className="bg-foreground text-background absolute -top-3 left-6 rounded-md px-4 py-1 text-xs font-medium shadow-sm sm:left-10">
                  Popular
                </div>
                <div className="border-border flex flex-1 flex-col items-start border-b pb-8 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0">
                  <Badge variant="outline" className="bg-card/30 mb-4 rounded-full px-3 text-xs font-medium">
                    Pro
                  </Badge>
                  <div className="text-foreground mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
                    £3.99
                  </div>
                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                    Unlock the full power of your personal Cloud Wardrobe.
                  </p>
                  <div className="mt-auto w-full">
                    <Button
                      onClick={() => navigate('/login')}
                      className="group h-12 w-full rounded-full px-6 sm:w-auto bg-foreground text-background hover:bg-foreground/90"
                    >
                      Upgrade to Pro
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center sm:pl-2">
                  <ul className="space-y-4 md:space-y-5">
                    {[
                      "Unlimited fashion searches",
                      "Advanced palette generation",
                      "Save unlimited outfits",
                      "Priority shopping recommendations",
                      "Gender-optimized results",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="text-foreground mt-0.5 h-5 w-5 shrink-0" />
                        <span className="text-foreground text-sm font-medium md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-16 max-w-4xl text-center">
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                All plans include our core color capture technology and mannequin styling. Upgrade anytime, cancel anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer id="about" className="pt-16 pb-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
                  <img src="/favicon.png" alt="TintPicks" className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-xl tracking-tight">TintPicks</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                The precision styling tool that bridges human color perception with fashion retail.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center text-muted-foreground text-sm pt-8 border-t border-border/50">
            <p>© {new Date().getFullYear()} TintPicks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
