import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onCameraClick?: () => void;
  onPaletteClick?: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onCameraClick,
  onPaletteClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const mainButtonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45 }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20, scale: 0.8 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    })
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Action menu */}
      <motion.div
        className="absolute bottom-16 right-0 flex flex-col gap-3"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        {/* Camera action */}
        <motion.div
          custom={0}
          variants={itemVariants}
        >
          <Button
            size="lg"
            onClick={() => {
              onCameraClick?.();
              setIsOpen(false);
            }}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Camera className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>

        {/* Palette action */}
        <motion.div
          custom={1}
          variants={itemVariants}
        >
          <Button
            size="lg"
            onClick={() => {
              onPaletteClick?.();
              setIsOpen(false);
            }}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Palette className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>

        {/* Sparkles action */}
        <motion.div
          custom={2}
          variants={itemVariants}
        >
          <Button
            size="lg"
            onClick={() => setIsOpen(false)}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Sparkles className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Main FAB */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          delay: 0.5 
        }}
      >
        <Button
          size="lg"
          onClick={toggleMenu}
          className="h-14 w-14 rounded-full  hover:scale-110 shadow-lg hover:shadow-xl transition-all duration-300 group "
        >
          <motion.div
            variants={mainButtonVariants}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Background overlay when open */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;