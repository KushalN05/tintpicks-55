import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'grid' | 'header';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  count = 3, 
  className = '' 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const renderSkeletonCard = (index: number) => (
    <motion.div
      key={index}
      variants={itemVariants}
      className="minimal-card p-4 space-y-3"
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </motion.div>
  );

  const renderSkeletonList = (index: number) => (
    <motion.div
      key={index}
      variants={itemVariants}
      className="flex items-center space-x-4 p-4 minimal-card"
    >
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </motion.div>
  );

  const renderSkeletonGrid = (index: number) => (
    <motion.div
      key={index}
      variants={itemVariants}
      className="aspect-square rounded-lg overflow-hidden minimal-card p-2"
    >
      <Skeleton className="w-full h-full rounded-md" />
    </motion.div>
  );

  const renderSkeletonHeader = () => (
    <motion.div
      variants={itemVariants}
      className="space-y-4 p-6"
    >
      <div className="flex items-center justify-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (type) {
      case 'header':
        return renderSkeletonHeader();
      case 'list':
        return Array.from({ length: count }, (_, i) => renderSkeletonList(i));
      case 'grid':
        return Array.from({ length: count }, (_, i) => renderSkeletonGrid(i));
      default:
        return Array.from({ length: count }, (_, i) => renderSkeletonCard(i));
    }
  };

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {type === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderContent()}
        </div>
      ) : (
        renderContent()
      )}
    </motion.div>
  );
};

export default SkeletonLoader;