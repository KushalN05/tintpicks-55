import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, Wand2, Sparkles } from 'lucide-react';
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '@/components/core/image-comparison';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
      
      {/* Floating Pill Navigation */}
      <nav className="fixed top-6 inset-x-0 mx-auto w-[90%] max-w-5xl z-50 transition-all duration-300">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-full px-6 py-3 shadow-lg shadow-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="TintPicks Logo" className="w-8 h-8 rounded-full" />
            <span className="font-serif font-bold text-lg tracking-tight text-foreground">TintPicks</span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#examples" className="text-muted-foreground hover:text-primary transition-colors">Examples</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Log in
            </Link>
            <button 
              onClick={() => navigate('/login')}
              className="bg-foreground text-background px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (landing-01 inspired) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Styling</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold tracking-tight text-foreground leading-[1.1] mb-8"
          >
            See a color.<br/>Wear the <span className="text-primary italic">fit.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop guessing what matches. Capture any color in the real world, and our engine instantly builds harmonious, premium outfits around it.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Start Styling Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-card border border-border text-foreground font-semibold text-lg flex items-center justify-center hover:bg-card/80 transition-all active:scale-95"
            >
              See how it works
            </a>
          </motion.div>


        </div>
      </section>

      {/* Image Comparison Section */}
      <section id="examples" className="py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">From Clashing to Curated</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Slide to see how TintPicks transforms an ugly, uncoordinated outfit into a harmonious, premium look.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ImageComparison
              className='aspect-square md:aspect-[16/10] w-full rounded-2xl border border-border shadow-2xl overflow-hidden'
              enableHover
              springOptions={{
                bounce: 0.3,
              }}
            >
              <ImageComparisonImage
                src='/ugly_outfit.jpg'
                alt='Ugly clashing outfit'
                position='left'
              />
              <ImageComparisonImage
                src='/styled_outfit.jpg'
                alt='Styled premium outfit'
                position='right'
              />
              <ImageComparisonSlider className='w-1 bg-primary/50 backdrop-blur-md' />
            </ImageComparison>
            <div className="flex justify-between mt-4 text-sm font-medium text-muted-foreground px-4">
              <span className="text-destructive/80">Ugly Clashing Outfit</span>
              <span className="text-primary">Styled Harmonious Outfit</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Your personal stylist in 3 steps</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Seamlessly bridge the gap between inspiration and reality.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Eye className="w-8 h-8 text-primary" />,
                title: "1. Capture",
                desc: "Point your camera at a piece of clothing or input a hex code. We instantly extract the exact color."
              },
              {
                icon: <Wand2 className="w-8 h-8 text-primary" />,
                title: "2. Style",
                desc: "Our color math engine builds a harmonious outfit on a virtual mannequin based on your base color."
              },
              {
                icon: <ArrowRight className="w-8 h-8 text-primary" />,
                title: "3. Shop",
                desc: "Click on any garment to immediately search real stores for matching items in your size."
              }
            ].map((step, i) => (
              <div key={i} className="minimal-card p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Start styling for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="minimal-card p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-foreground mb-2">Basic</h3>
              <p className="text-muted-foreground mb-6">Perfect for trying out the engine.</p>
              <div className="text-4xl font-serif font-bold text-foreground mb-8">Free</div>
              <ul className="space-y-4 mb-8 flex-1">
                {['5 outfit searches per lifetime', 'Basic color wheel', 'Standard harmony matching'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-4 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-border/50 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="minimal-card p-8 flex flex-col border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">For fashion enthusiasts.</p>
              <div className="text-4xl font-serif font-bold text-foreground mb-8">£5<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited outfit searches', 'Save unlimited outfits', 'Advanced color math', 'Priority shopping links'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="TintPicks" className="w-6 h-6 rounded-md grayscale opacity-50" />
            <span className="font-serif font-bold text-muted-foreground">TintPicks</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} TintPicks. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
