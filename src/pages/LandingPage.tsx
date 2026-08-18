import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, Layers, ShoppingBag, Check, Instagram, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    document.title = 'TintPicks - See a color. Wear the fit.';
    
    // Auto cycle through steps for the sticky scroll visual
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
              <img src="/favicon.png" alt="TintPicks" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-lg tracking-tight">TintPicks</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              variant="default"
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 transition-all hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 text-center max-w-5xl mx-auto overflow-hidden">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-foreground">
              See a color.<br />Wear the fit.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The precision styling tool that bridges human color perception with fashion retail. Anchor a shade, build a cohesive palette, and step out in confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 h-14 text-base transition-all hover:scale-105 shadow-xl group"
              >
                Start Styling for Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col items-center justify-center mb-20 gap-3 opacity-80">
               <div className="flex -space-x-3">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="w-10 h-10 rounded-full bg-border border-2 border-background overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="User avatar" />
                   </div>
                 ))}
               </div>
               <div className="flex items-center gap-2 text-sm font-medium">
                 <ShieldCheck className="w-4 h-4" />
                 <span>Trusted by 10,000+ fashion enthusiasts</span>
               </div>
            </div>
          </motion.div>

          {/* Animated Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9] bg-card rounded-[2rem] border-2 border-border overflow-hidden flex items-center justify-center shadow-2xl relative"
          >
             {/* Simple UI Mockup Animation */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-background/30 to-transparent" />
             <div className="relative z-10 flex flex-col items-center justify-center w-64 h-96 bg-background rounded-3xl border border-border shadow-2xl overflow-hidden p-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center mb-8 shadow-lg"
                >
                  <Camera className="w-8 h-8 text-background" />
                </motion.div>
                <div className="w-full space-y-4">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.2, duration: 0.5 }} className="h-4 bg-border rounded-full" />
                  <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ delay: 1.4, duration: 0.5 }} className="h-4 bg-border/60 rounded-full" />
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} className="w-full h-12 bg-foreground rounded-xl mt-4" />
                </div>
             </div>
          </motion.div>
        </section>

        {/* Sticky Scroll "How It Works" Section */}
        <section id="how-it-works" className="py-24 bg-card px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">A seamless workflow.</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">From inspiration to wardrobe in three intuitive steps.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left text column */}
              <div className="space-y-12">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    className={`transition-all duration-300 ${activeStep === idx ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`}
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
              
              {/* Right visual column (Sticky) */}
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

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-background">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Choose the tier that fits your styling needs.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="border border-border bg-card rounded-3xl p-8 flex flex-col shadow-sm"
              >
                <div className="mb-8">
                  <h3 className="text-xl font-semibold tracking-tight mb-2">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">£0</span>
                    <span className="text-muted-foreground text-sm">/ forever</span>
                  </div>
                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed">Perfect for occasional outfit planning and color discovery.</p>
                </div>
                <ul className="space-y-4 flex-1 mb-8">
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> 10 color captures per month</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> Basic mannequin styling</li>
                  <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> Standard shopping links</li>
                </ul>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full rounded-full h-12 border-border hover:bg-background">
                  Get Started
                </Button>
              </motion.div>

              {/* Pro Tier (Elevated) */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} variants={fadeUp}
                className="relative rounded-3xl p-1 bg-gradient-to-b from-foreground via-foreground/50 to-border shadow-2xl"
              >
                <div className="h-full w-full bg-card rounded-[1.4rem] p-8 flex flex-col relative overflow-hidden group">
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-foreground text-background text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Popular
                  </div>
                  <div className="mb-8 relative z-10">
                    <h3 className="text-xl font-semibold tracking-tight mb-2">Pro</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight">£3.99</span>
                      <span className="text-muted-foreground text-sm">/ month</span>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">Unlock the full power of your personal Cloud Wardrobe.</p>
                  </div>
                  <ul className="space-y-4 flex-1 mb-8 relative z-10">
                    <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> Unlimited color captures</li>
                    <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> Advanced palette generation</li>
                    <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> Save unlimited outfits</li>
                    <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-foreground" /> Priority shopping recommendations</li>
                  </ul>
                  <Button onClick={() => navigate('/login')} className="w-full rounded-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-transform hover:scale-105 relative z-10">
                    Upgrade to Pro
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Expanded Footer */}
      <footer className="pt-16 pb-8 bg-card border-t border-border">
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
