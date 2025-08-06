import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  lines = 1
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const skeletonAnimation = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut'
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`bg-white/20 ${getVariantClasses()}`}
            style={{ 
              width: index === lines - 1 ? '75%' : width,
              height 
            }}
            {...skeletonAnimation}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-white/20 ${getVariantClasses()} ${className}`}
      style={{ width, height }}
      {...skeletonAnimation}
    />
  );
};