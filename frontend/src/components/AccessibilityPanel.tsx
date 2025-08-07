import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Volume2, Keyboard, X } from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { highContrast, reducedMotion, toggleHighContrast } = useAccessibility();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50"
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-describedby="accessibility-description"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 id="accessibility-title" className="text-xl font-bold text-gray-900">
                  Accessibility Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close accessibility panel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div id="accessibility-description" className="space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">High Contrast</h3>
                    <p className="text-sm text-gray-600">Improve text visibility</p>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={highContrast}
                  aria-labelledby="high-contrast-label"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Reduced Motion</h3>
                    <p className="text-sm text-gray-600">
                      {reducedMotion ? 'Detected from system' : 'System preference not set'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  reducedMotion ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {reducedMotion ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Keyboard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Keyboard Shortcuts</h3>
                </div>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Daily Check-in</span>
                    <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">Alt + 1</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Dashboard</span>
                    <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">Alt + 2</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Chat</span>
                    <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">Alt + 3</kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};