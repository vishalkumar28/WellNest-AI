import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EnhancedSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
  suffix?: string;
  color: string;
  disabled?: boolean;
}

export const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  min,
  max,
  value,
  onChange,
  labels,
  suffix = '',
  color,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  const labelIndex = Math.min(Math.floor((value - min) / ((max - min) / (labels.length - 1))), labels.length - 1);

  const handleChange = (newValue: number) => {
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let newValue = value;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - 1);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    handleChange(newValue);
  };

  return (
    <div className="space-y-6">
      {/* Value Display */}
      <div className="text-center">
        <div className="text-4xl mb-2">{labels[labelIndex]}</div>
        <div className="text-3xl font-bold text-gray-900">
          {value}{suffix}
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${color} rounded-lg`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {/* Thumb */}
        <motion.div
          className={`absolute top-1/2 w-6 h-6 bg-gradient-to-r ${color} rounded-full transform -translate-y-1/2 shadow-lg cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ left: `${percentage}%`, marginLeft: '-12px' }}
          whileHover={{ scale: disabled ? 1 : 1.1 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
};