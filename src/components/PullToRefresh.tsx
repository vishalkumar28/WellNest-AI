import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);
  const rotate = useTransform(y, [0, threshold * 2], [0, 360]);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      setCanRefresh(false);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        y.set(0);
      }
    } else {
      y.set(0);
      setCanRefresh(false);
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newY = Math.max(0, info.offset.y);
    y.set(newY);
    setCanRefresh(newY > threshold);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-10"
        style={{ opacity, scale, y }}
      >
        <div className="bg-white rounded-full p-3 shadow-lg border">
          <motion.div style={{ rotate: isRefreshing ? rotate : 0 }}>
            <RefreshCw 
              className={`w-6 h-6 ${
                canRefresh ? 'text-green-500' : 'text-gray-400'
              } ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.2, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
};