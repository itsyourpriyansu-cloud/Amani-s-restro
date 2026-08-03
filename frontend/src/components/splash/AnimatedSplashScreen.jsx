import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Minimal Loading Screen for Amani's Kitchen
 *
 * Specifications:
 * - Full-screen background: #742F1C
 * - Uploaded Amani's Kitchen SVG logo centered horizontally and vertically
 * - No tagline, no buttons, no additional text, no spinner, no decorative illustrations
 * - Gentle fade-in and subtle opacity pulse while loading
 * - Very thin, minimal white progress line underneath the logo
 * - Immediately dismissed when page/content is ready (no artificial delay)
 * - Fades smoothly into the homepage
 */
const AnimatedSplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let isMounted = true;
    let progressInterval;

    // Smooth progress line advance over ~1.4s
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 8 + 4;
      });
    }, 90);

    const dismissSplash = () => {
      if (!isMounted) return;
      setProgress(100);
      // Wait for progress bar to reach 100% then start smooth fade out
      setTimeout(() => {
        if (isMounted) {
          setIsVisible(false);
        }
      }, 350);
    };

    // Keep splash screen visible for ~1.8s so the branding & animation are clearly experienced
    const timer = setTimeout(dismissSplash, 1800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleExitComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="amani-minimal-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#742F1C] select-none touch-none px-4"
          role="dialog"
          aria-label="Amani's Kitchen loading screen"
        >
          {/* Centered Amani's Kitchen SVG Logo with Gentle Opacity Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: [0.8, 1, 0.8],
              scale: 1,
            }}
            transition={{
              opacity: {
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              scale: {
                duration: 0.8,
                ease: 'easeOut',
              },
            }}
            className="flex flex-col items-center justify-center"
          >
            <img
              src="/Amanis Logo Final.svg"
              alt="Amani's Kitchen"
              className="w-56 sm:w-72 md:w-84 max-w-[75vw] h-auto filter brightness-0 invert drop-shadow-sm pointer-events-none"
            />
          </motion.div>

          {/* Thin Minimal White Progress Line Underneath Logo */}
          <div className="mt-8 w-36 sm:w-44 h-[1.5px] bg-white/20 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplashScreen;

