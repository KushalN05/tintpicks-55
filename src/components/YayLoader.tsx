
import React from "react";
import { motion } from "framer-motion";

interface YayLoaderProps {
  show: boolean;
}

const YayLoader: React.FC<YayLoaderProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-5xl md:text-7xl font-ghibli text-ghibli-blue mb-2 animate-bounce">
          🎉 Yaay!
        </span>
        <span className="text-xl md:text-2xl font-semibold text-ghibli-forest animate-pulse">
          Color added to your palette!
        </span>
      </motion.div>
    </div>
  );
};

export default YayLoader;
