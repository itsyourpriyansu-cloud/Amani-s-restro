import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Toast from '../common/Toast';
import AnimatedSplashScreen from '../splash/AnimatedSplashScreen';

const CustomerLayout = ({ children }) => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Event listener to trigger splash screen on demand (e.g. from header logo / button)
    const handleReplaySplash = () => {
      setShowSplash(true);
    };
    window.addEventListener('replay-splash', handleReplaySplash);
    return () => window.removeEventListener('replay-splash', handleReplaySplash);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface overflow-x-hidden">
      <Toast />

      {/* Render Animated Splash Screen on customer link open */}
      {showSplash && (
        <AnimatedSplashScreen
          onComplete={handleSplashComplete}
          autoDismiss={true}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex-1 flex flex-col"
          style={{ paddingBottom: 'calc(104px + env(safe-area-inset-bottom))' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CustomerLayout;

