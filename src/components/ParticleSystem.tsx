import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
}

interface ParticleSystemProps {
  trigger?: boolean;
  className?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ trigger = false, className = '' }) => {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    'hsl(202, 80%, 70%)', // brand-glow
    'hsl(342, 75%, 75%)', // brand-accent
    'hsl(23, 83%, 75%)',  // brand-warm
    'rgba(255, 255, 255, 0.8)',
    'hsl(46, 100%, 95%)'  // brand-whisper
  ];

  const createParticle = (x: number, y: number): Particle => ({
    id: Math.random(),
    x,
    y,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.8 + 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2 - 1,
    life: 1
  });

  const createBurst = () => {
    const newParticles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 20; i++) {
      newParticles.push(createParticle(
        centerX + (Math.random() - 0.5) * 100,
        centerY + (Math.random() - 0.5) * 100
      ));
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const updateParticles = () => {
    setParticles(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02,
          opacity: particle.opacity * 0.98
        }))
        .filter(particle => particle.life > 0 && particle.opacity > 0.1)
    );
  };

  useEffect(() => {
    if (trigger) {
      createBurst();
    }
  }, [trigger]);

  useEffect(() => {
    const animate = () => {
      updateParticles();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (particles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;