
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BlobMascotProps {
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'neutral' | 'excited';
  className?: string;
}

const BlobMascot: React.FC<BlobMascotProps> = ({ 
  size = 'md', 
  mood = 'happy',
  className = ''
}) => {
  const [blink, setBlink] = useState(false);
  
  // Dimensions based on size
  const dimensions = {
    sm: { width: 60, height: 60 },
    md: { width: 100, height: 100 },
    lg: { width: 140, height: 140 }
  };
  
  // Mascot colors
  const colors = {
    body: '#7AA0C4', // Ghibli blue
    eyes: '#FFF',
    pupils: '#3F6C51', // Ghibli forest
    blush: '#F19CBB', // Ghibli pink
    shadow: 'rgba(0, 0, 0, 0.1)'
  };
  
  // Expressions based on mood
  const expressions = {
    happy: {
      eyeSize: 0.15,
      mouthPath: 'M 30,65 Q 50,80 70,65',
      blushOpacity: 0.5
    },
    neutral: {
      eyeSize: 0.15,
      mouthPath: 'M 35,65 L 65,65',
      blushOpacity: 0.2
    },
    excited: {
      eyeSize: 0.2,
      mouthPath: 'M 25,65 Q 50,90 75,65',
      blushOpacity: 0.8
    }
  };
  
  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 3000 + 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  const { width, height } = dimensions[size];
  const currentExpression = expressions[mood];
  
  // Animation variants
  const blobVariants = {
    idle: {
      scale: [1, 1.03, 1],
      y: [0, -3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width, height }}
      initial="idle"
      animate="idle"
      variants={blobVariants}
    >
      {/* Blob Body */}
      <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="50" cy="90" rx="30" ry="10" fill={colors.shadow} />
        
        {/* Body */}
        <motion.path
          d="M 50,10 
             C 70,10 85,25 85,50 
             C 85,75 70,90 50,90 
             C 30,90 15,75 15,50 
             C 15,25 30,10 50,10 Z"
          fill={colors.body}
        />
        
        {/* Left Eye */}
        <circle cx="35" cy="45" r={width * currentExpression.eyeSize} fill={colors.eyes} />
        <motion.circle 
          cx="35" cy="45" 
          r={width * currentExpression.eyeSize * 0.5} 
          fill={colors.pupils}
          style={{ 
            scaleY: blink ? 0.1 : 1,
            transformOrigin: '35px 45px'
          }}
        />
        
        {/* Right Eye */}
        <circle cx="65" cy="45" r={width * currentExpression.eyeSize} fill={colors.eyes} />
        <motion.circle 
          cx="65" cy="45" 
          r={width * currentExpression.eyeSize * 0.5} 
          fill={colors.pupils}
          style={{ 
            scaleY: blink ? 0.1 : 1,
            transformOrigin: '65px 45px'
          }}
        />
        
        {/* Blush */}
        <circle cx="25" cy="55" r="10" fill={colors.blush} opacity={currentExpression.blushOpacity} />
        <circle cx="75" cy="55" r="10" fill={colors.blush} opacity={currentExpression.blushOpacity} />
        
        {/* Mouth */}
        <path d={currentExpression.mouthPath} stroke={colors.pupils} strokeWidth="3" fill="none" />
      </svg>
    </motion.div>
  );
};

export default BlobMascot;
