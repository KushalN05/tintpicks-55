import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlobMascot from '@/components/BlobMascot';
import { MessageCircle, Heart, Star, Zap } from 'lucide-react';

interface InteractiveMascotProps {
  mood: "happy" | "neutral" | "excited";
  className?: string;
  onInteraction?: () => void;
}

const InteractiveMascot: React.FC<InteractiveMascotProps> = ({ 
  mood, 
  className = '',
  onInteraction
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [reactions, setReactions] = useState<{ id: number; icon: React.ElementType; x: number; y: number }[]>([]);

  const messages = {
    happy: [
      "Great color choice! 🌈",
      "You have amazing taste! ✨",
      "That color makes me smile! 😊",
      "Perfect color harmony! 🎨"
    ],
    neutral: [
      "Ready to find colors? 🔍",
      "What colors inspire you today? 💭",
      "Let's explore together! 🌟",
      "I'm here to help! 👋"
    ],
    excited: [
      "WOW! Amazing color! 🎉",
      "That's fantastic! ⭐",
      "You're on fire! 🔥",
      "Incredible choice! 💫"
    ]
  };

  const handleMascotClick = () => {
    // Show random message
    const moodMessages = messages[mood];
    const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
    setCurrentMessage(randomMessage);
    setShowMessage(true);

    // Create reaction effect
    const reactionIcons = [Heart, Star, Zap, MessageCircle];
    const newReaction = {
      id: Date.now(),
      icon: reactionIcons[Math.floor(Math.random() * reactionIcons.length)],
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50
    };
    
    setReactions(prev => [...prev, newReaction]);

    // Clear message after 3 seconds
    setTimeout(() => setShowMessage(false), 3000);
    
    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);

    onInteraction?.();
  };

  // Auto-show occasional messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showMessage && Math.random() < 0.3) {
        const moodMessages = messages[mood];
        const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
        setCurrentMessage(randomMessage);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [mood, showMessage]);

  return (
    <div className={`relative ${className}`}>
      {/* Interactive mascot */}
      <motion.div
        onClick={handleMascotClick}
        className="cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BlobMascot size="lg" mood={mood} />
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-brand opacity-0 blur-xl -z-10"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/50 z-20"
          >
            <div className="text-sm font-medium text-foreground whitespace-nowrap">
              {currentMessage}
            </div>
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating reactions */}
      <AnimatePresence>
        {reactions.map((reaction) => {
          const IconComponent = reaction.icon;
          return (
            <motion.div
              key={reaction.id}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1.2, 0.8],
                x: reaction.x,
                y: reaction.y - 50
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <IconComponent className="w-6 h-6 text-primary" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Name tag */}
      <motion.div 
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-foreground border border-white/40 shadow-sm z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Tinti
      </motion.div>
    </div>
  );
};

export default InteractiveMascot;