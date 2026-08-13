import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
  animate?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  showName = true, 
  className = '',
  animate = true 
}) => {
  const sizeMap = {
    sm: { logo: 'h-8', text: 'text-lg', sparkle: 'w-3 h-3' },
    md: { logo: 'h-12', text: 'text-xl', sparkle: 'w-4 h-4' },
    lg: { logo: 'h-16', text: 'text-2xl', sparkle: 'w-5 h-5' },
    xl: { logo: 'h-20', text: 'text-3xl', sparkle: 'w-6 h-6' }
  };

  const { logo, text, sparkle } = sizeMap[size];

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0, rotateY: -20 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.3,
        type: "spring",
        stiffness: 150
      }
    }
  };

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1.2, 1], 
      rotate: [0, 180, 360],
      transition: {
        delay: 0.6,
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={`flex items-center justify-center gap-3 ${className}`}
      initial={animate ? "initial" : "animate"}
      animate="animate"
      whileHover="hover"
    >
      {/* Logo Container */}
      <motion.div 
        className="relative"
        variants={logoVariants}
      >
        {/* Main logo image */}
        <div className="relative">
          <img 
            src="/lovable-uploads/539dce15-cb88-4d10-8ae0-d0a8a0e60874.png" 
            alt="TintPicks Logo" 
            className={`${logo} mx-auto relative z-10`}
          />
          
          {/* Glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-pink-400/30 rounded-full blur-xl -z-10 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-brand rounded-full blur-2xl opacity-20 -z-20 animate-float-gentle"></div>
        </div>

        {/* Floating sparkles */}
        <motion.div 
          className={`absolute -top-1 -right-1 text-yellow-400 ${sparkle}`}
          variants={sparkleVariants}
        >
          <Sparkles className="w-full h-full animate-sparkle" />
        </motion.div>
        
        <motion.div 
          className={`absolute -bottom-1 -left-1 text-blue-400 ${sparkle}`}
          variants={sparkleVariants}
          style={{ animationDelay: '1s' }}
        >
          <Sparkles className="w-full h-full animate-sparkle" />
        </motion.div>
      </motion.div>

      {/* Brand name */}
      {showName && (
        <motion.div 
          className="text-center"
          variants={textVariants}
        >
          <h1 className={`font-ghibli font-bold bg-gradient-brand bg-clip-text text-transparent ${text} leading-tight`}>
            TintPicks
          </h1>
          <p className="text-xs text-muted-foreground font-medium tracking-wide opacity-80">
            Color Discovery
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BrandLogo;