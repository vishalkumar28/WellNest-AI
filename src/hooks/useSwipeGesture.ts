import { useGesture } from '@use-gesture/react';
import { useSpring } from 'react-spring';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export const useSwipeGesture = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 50 
}: SwipeGestureOptions) => {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [xDir], distance, cancel }) => {
      if (distance > threshold) {
        cancel();
        if (xDir > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (xDir < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
        api.start({ x: 0 });
      } else {
        api.start({ x: mx });
      }
    },
    onDragEnd: () => {
      api.start({ x: 0 });
    }
  });

  return { bind, style: { x } };
};