import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroScreen.css';

/**
 * Amani's App Launch Intro Screen Config
 */
const INTRO_CONFIG = {
  showOncePerSession: true,
  minimumDuration: 1700,
  normalDuration: 2200,
  maximumDuration: 3000,
  debugReplay: false,
};

export default function IntroScreen({ onComplete, forceReplay = false }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRefs = useRef([]);

  const addTimer = (fn, delay) => {
    const timer = setTimeout(fn, delay);
    timerRefs.current.push(timer);
    return timer;
  };

  useEffect(() => {
    // Check SessionStorage & Debug flag
    const hasSeen = sessionStorage.getItem('amanis_intro_seen');
    const skipIntro = INTRO_CONFIG.showOncePerSession && hasSeen && !forceReplay && !INTRO_CONFIG.debugReplay;

    if (skipIntro) {
      setShouldRender(false);
      onComplete?.();
      return;
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = mediaQuery.matches;
    setPrefersReducedMotion(reducedMotion);

    // Save previous overflow & lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Execution Timeline
    if (reducedMotion) {
      // Reduced motion timeline: total ~800ms
      addTimer(() => setIsExiting(true), 600);
      addTimer(() => {
        try {
          sessionStorage.setItem('amanis_intro_seen', 'true');
        } catch (e) {
          // ignore session errors
        }
        document.body.style.overflow = originalOverflow;
        setShouldRender(false);
        onComplete?.();
      }, 850);
    } else {
      // Full animated storyboard timeline
      // Phase 5 (Exit sequence start at ~2000ms)
      addTimer(() => {
        setIsExiting(true);
      }, 1950);

      // Final unmount & cleanup at ~2350ms
      addTimer(() => {
        try {
          sessionStorage.setItem('amanis_intro_seen', 'true');
        } catch (e) {
          // ignore session errors
        }
        document.body.style.overflow = originalOverflow;
        setShouldRender(false);
        onComplete?.();
      }, 2350);
    }

    // Hard fallback timer (max 3000ms guarantee)
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      setShouldRender(false);
      onComplete?.();
    }, INTRO_CONFIG.maximumDuration);

    // Cleanup on unmount
    return () => {
      timerRefs.current.forEach(clearTimeout);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [forceReplay, onComplete]);

  if (!shouldRender) return null;

  // Easing curve constants
  const customEase = [0.22, 1, 0.36, 1];

  // Particle sparks definition (6 points: 4 saffron, 2 teal)
  const sparks = [
    { angle: 30, distance: 26, color: 'saffron', delay: 0.28 },
    { angle: 90, distance: 30, color: 'teal', delay: 0.32 },
    { angle: 150, distance: 24, color: 'saffron', delay: 0.35 },
    { angle: 210, distance: 28, color: 'saffron', delay: 0.3 },
    { angle: 270, distance: 32, color: 'teal', delay: 0.36 },
    { angle: 330, distance: 25, color: 'saffron', delay: 0.33 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className={`amanis-intro ${isExiting ? 'amanis-intro--exiting' : ''}`}
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.45, ease: customEase }}
      >
        {/* Base Radial Background Atmosphere */}
        <motion.div
          className="amanis-intro__background"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { scale: 1, opacity: 1 }
              : isExiting
              ? { scale: 1.15, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.7, ease: customEase }}
        />

        {/* Subtle Grain Texture */}
        <div className="amanis-intro__noise" />

        {/* Central Radial Bloom Aura */}
        <motion.div
          className="amanis-intro__central-bloom"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.8 }
              : {
                  scale: [0.4, 1.25, 1],
                  opacity: [0, 0.9, 0.6],
                }
          }
          transition={{ duration: 0.9, ease: customEase }}
        />

        {/* Ambient Rotating Mandala Backdrop */}
        <svg
          className="amanis-intro__ambient-mandala"
          viewBox="0 0 1071.56 445.87"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M402.8,220.35l-28.7-28.7s-.04-.02-.04-.03c1.51-4.47,2.35-9.23,2.34-14.12,0-10.9-4.25-21.14-11.95-28.85-3.58-3.57-7.71-6.37-12.19-8.38l-.02-42.11c0-2.07-1.67-3.75-3.75-3.75h-40.58s-.04,.02-.05,.02c-2.1-4.22-4.87-8.18-8.32-11.63-7.71-7.71-17.95-11.95-28.85-11.95h0c-5.06,0-9.95,.95-14.53,2.69l-29.79-29.76c-1.46-1.46-3.83-1.46-5.29,0l-28.69,28.71s-.02,.03-.04,.04c-4.47-1.5-9.22-2.34-14.1-2.34t-.03,0c-16.56,0-30.81,9.93-37.2,24.14l-42.13,.02c-2.06,0-3.74,1.69-3.74,3.75v40.59s.02,.02,.02,.02c-4.22,2.11-8.17,4.9-11.63,8.35-7.72,7.71-11.95,17.96-11.95,28.86,0,5.06,.95,9.96,2.69,14.54l-29.76,29.79c-1.47,1.46-1.46,3.84,0,5.3l28.71,28.69s.03,.02,.04,.03c-1.51,4.47-2.34,9.23-2.34,14.12,0,10.89,4.24,21.14,11.95,28.85,3.58,3.57,7.71,6.37,12.19,8.38l.02,42.11c0,2.07,1.68,3.75,3.75,3.75h40.59s.04-.02,.04-.02c2.1,4.23,4.87,8.19,8.33,11.64,7.7,7.7,17.94,11.94,28.85,11.94h0c5.06,0,9.96-.95,14.54-2.69l29.79,29.77c.73,.73,1.69,1.09,2.64,1.09s1.93-.37,2.65-1.1l28.69-28.7s.02-.04,.03-.04c4.46,1.5,9.22,2.35,14.1,2.35,0,0,.02,0,.04,0,16.55,0,30.8-9.94,37.19-24.15l42.13-.02c2.06,0,3.74-1.68,3.74-3.75v-40.58s-.02-.04-.02-.05c4.22-2.1,8.19-4.87,11.63-8.32,7.71-7.71,11.95-17.95,11.95-28.86,0-5.06-.95-9.96-2.69-14.54l29.76-29.79c1.47-1.46,1.46-3.83,0-5.29Z"
            fill="currentColor"
          />
        </svg>

        {/* Main Stage: Official Logo Reveal */}
        <motion.div
          className="amanis-intro__stage"
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.94, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : isExiting
              ? { scale: 0.92, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.55, ease: customEase }}
        >
          {/* Accent Sparks Container */}
          {!prefersReducedMotion && (
            <div className="amanis-intro__spark-container">
              {sparks.map((spark, idx) => {
                const rad = (spark.angle * Math.PI) / 180;
                const x = Math.cos(rad) * spark.distance;
                const y = Math.sin(rad) * spark.distance;
                return (
                  <motion.span
                    key={idx}
                    className={`amanis-intro__spark amanis-intro__spark--${spark.color}`}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                    animate={{
                      x: [0, x],
                      y: [0, y],
                      opacity: [0, 1, 0],
                      scale: [0.3, 1, 0.2],
                    }}
                    transition={{
                      duration: 0.65,
                      delay: spark.delay,
                      ease: customEase,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Signature Orbit Ring Arc Highlight */}
          {!prefersReducedMotion && (
            <motion.svg
              className="amanis-intro__orbit-ring"
              viewBox="0 0 100 100"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#F2A13A"
                strokeWidth="2.5"
                strokeDasharray="40 240"
                strokeLinecap="round"
                initial={{ rotate: -40, opacity: 0 }}
                animate={{
                  rotate: [ -40, 220 ],
                  opacity: [ 0, 0.85, 0 ],
                }}
                transition={{
                  duration: 0.85,
                  delay: 1.15,
                  ease: customEase,
                }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4CA99A"
                strokeWidth="2"
                strokeDasharray="15 265"
                strokeLinecap="round"
                initial={{ rotate: -70, opacity: 0 }}
                animate={{
                  rotate: [ -70, 190 ],
                  opacity: [ 0, 0.7, 0 ],
                }}
                transition={{
                  duration: 0.85,
                  delay: 1.22,
                  ease: customEase,
                }}
              />
            </motion.svg>
          )}

          {/* Vector SVG Composition */}
          <svg
            className="amanis-intro__svg-container"
            viewBox="0 0 1071.56 445.87"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 1. Outer Mandala Symbol Path */}
            <motion.path
              className="amanis-intro__svg-path-mandala"
              d="M402.8,220.35l-28.7-28.7s-.04-.02-.04-.03c1.51-4.47,2.35-9.23,2.34-14.12,0-10.9-4.25-21.14-11.95-28.85-3.58-3.57-7.71-6.37-12.19-8.38l-.02-42.11c0-2.07-1.67-3.75-3.75-3.75h-40.58s-.04,.02-.05,.02c-2.1-4.22-4.87-8.18-8.32-11.63-7.71-7.71-17.95-11.95-28.85-11.95h0c-5.06,0-9.95,.95-14.53,2.69l-29.79-29.76c-1.46-1.46-3.83-1.46-5.29,0l-28.69,28.71s-.02,.03-.04,.04c-4.47-1.5-9.22-2.34-14.1-2.34t-.03,0c-16.56,0-30.81,9.93-37.2,24.14l-42.13,.02c-2.06,0-3.74,1.69-3.74,3.75v40.59s.02,.02,.02,.02c-4.22,2.11-8.17,4.9-11.63,8.35-7.72,7.71-11.95,17.96-11.95,28.86,0,5.06,.95,9.96,2.69,14.54l-29.76,29.79c-1.47,1.46-1.46,3.84,0,5.3l28.71,28.69s.03,.02,.04,.03c-1.51,4.47-2.34,9.23-2.34,14.12,0,10.89,4.24,21.14,11.95,28.85,3.58,3.57,7.71,6.37,12.19,8.38l.02,42.11c0,2.07,1.68,3.75,3.75,3.75h40.59s.04-.02,.04-.02c2.1,4.23,4.87,8.19,8.33,11.64,7.7,7.7,17.94,11.94,28.85,11.94h0c5.06,0,9.96-.95,14.54-2.69l29.79,29.77c.73,.73,1.69,1.09,2.64,1.09s1.93-.37,2.65-1.1l28.69-28.7s.02-.04,.03-.04c4.46,1.5,9.22,2.35,14.1,2.35,0,0,.02,0,.04,0,16.55,0,30.8-9.94,37.19-24.15l42.13-.02c2.06,0,3.74-1.68,3.74-3.75v-40.58s-.02-.04-.02-.05c4.22-2.1,8.19-4.87,11.63-8.32,7.71-7.71,11.95-17.95,11.95-28.86,0-5.06-.95-9.96-2.69-14.54l29.76-29.79c1.47-1.46,1.46-3.83,0-5.29Z"
              fill="#742f1c"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { scale: 0.62, opacity: 0, rotate: -8, filter: 'blur(6px)' }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }
              }
              transition={{ duration: 0.68, delay: 0.18, ease: customEase }}
            />

            {/* 2. Central Smiling Plate Emblem */}
            <g>
              <motion.circle
                cx="223.3"
                cy="222.94"
                r="71.38"
                fill="#742f1c"
                initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.28, ease: customEase }}
                style={{ transformOrigin: '223.3px 222.94px' }}
              />
              <motion.path
                className="amanis-intro__svg-path-plate"
                d="M265.55,225.98c.13-.14,.26-.29,.38-.43,5.02-5.75,7.21-13.19,6.16-20.97-1.64-12.17-10.35-20.67-21.16-20.67-11.69,0-21.2,9.51-21.2,21.2s7.7,19.18,20.6,21.16c.26,.04,.52,.08,.77,.13-4.26,1.75-9.35,2.68-15.01,2.68h-34.46c-2.21,0-4,1.79-4,4s1.79,4,4,4h34.46c9.11,0,17.12-2.09,23.32-5.99,1.34,1.6,2.28,3.52,2.74,5.7,1.48,7.09-1.75,14.53-9.07,20.94-7.7,6.73-18.63,10.91-28.53,10.91-10.88,0-20.04-2.91-28-8.9-11.69-8.79-18.39-22.53-18.39-37.7s10.19-27.57,19.66-29.82c7.39-1.68,13.91,3.94,13.91,11.03,0,3.3-1.44,6.25-3.7,8.32-1.22-2.77-3.98-4.72-7.2-4.72-4.34,0-7.86,3.53-7.86,7.86,0,4.04,3.08,7.34,7.01,7.78,.45,.05,1.16,.05,1.32,.04,10.24-.48,18.42-8.93,18.42-19.27,0-12.09-11.1-21.69-23.71-18.81-14.25,3.39-25.84,20.26-25.84,37.61s7.87,33.77,21.58,44.09c9.4,7.07,20.13,10.51,32.81,10.51,11.93,0,24.56-4.82,33.79-12.89,12.94-11.32,12.85-22.77,11.63-28.58-.73-3.49-2.25-6.6-4.41-9.17Zm-5.63-5.69c-.19,.22-.39,.44-.59,.65-2.33-1.25-4.95-2.13-7.79-2.57-6.3-.96-13.81-4.05-13.81-13.25,0-7.28,5.93-13.21,13.21-13.21,7.87,0,12.32,6.9,13.24,13.74,.75,5.54-.72,10.6-4.25,14.64Z"
                fill="#ffffff"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.38, ease: customEase }}
                style={{ transformOrigin: '223.3px 222.94px' }}
              />
            </g>

            {/* 3. Amani's Primary Wordmark */}
            <motion.path
              className="amanis-intro__svg-path-wordmark"
              d="M471.26,154.41v-18.63h41.45v18.63h-41.45Zm160.7,114c-.48-1.01-.93-2.16-.94-3.25-.06-14.08-.08-28.15,.03-42.23,0-1.07,.89-2.51,1.81-3.14,3.67-2.51,7.7-2.65,11.61-.65,4.18,2.15,6.48,5.74,6.51,10.49,.07,11.77,.05,23.55-.01,35.33,0,1.09-.38,2.24-.85,3.24-1.18,2.49-2.5,4.92-3.81,7.44h38.26c-.9-1.72-1.54-3.18-2.39-4.5-1.88-2.93-2.49-6.05-2.44-9.54,.16-11.86,.14-23.73,.03-35.59-.1-10.36-4.79-18.25-13.91-23.09-9.03-4.79-18.19-4.32-26.66,1.49-3.97,2.72-7.4,6.2-11.04,9.31-8.71-16.28-32.71-19.9-45.98-1.67v-10.6c-12.2,3.25-24,6.4-36.47,9.73,2.1,1.98,3.63,3.57,5.32,4.98,1.78,1.48,2.36,3.22,2.34,5.54-.11,12.04-.27,24.09,.04,36.12,.15,5.94-.6,11.4-4.09,16.31-.28,.4-.39,.92-.68,1.61h38.23c-.81-1.57-1.4-2.94-2.19-4.18-1.92-3-2.57-6.19-2.52-9.78,.17-12.66,.07-25.32,.07-37.98v-2.74c4.06-3.38,8.34-4.17,12.87-2.14,4.63,2.08,6.97,5.82,6.96,10.95,0,11.69,.02,23.37-.04,35.06,0,1.17-.39,2.42-.88,3.5-1.09,2.38-2.36,4.67-3.71,7.29h38.32c-1.38-2.64-2.66-4.94-3.79-7.3Zm232.78-54.7c-8.71-16.28-32.71-19.9-45.98-1.67v-10.6c-12.2,3.25-24,6.4-36.47,9.73,2.1,1.98,3.63,3.57,5.32,4.98,1.78,1.48,2.36,3.22,2.34,5.54-.11,12.04-.27,24.09,.04,36.12,.15,5.94-.6,11.4-4.09,16.31-.28,.4-.39,.92-.68,1.61h38.23c-.81-1.57-1.4-2.94-2.19-4.18-1.92-3-2.57-6.19-2.52-9.78,.17-12.66,.07-25.32,.07-37.98v-2.74c4.06-3.38,8.34-4.17,12.87-2.14,4.63,2.08,6.97,5.82,6.96,10.95,0,11.69,.02,23.37-.04,35.06,0,1.17-.39,2.42-.88,3.5-1.09,2.38-2.36,4.67-3.71,7.29h38.32c-1.38-2.64-2.66-4.94-3.79-7.3-.48-1.01-.93-2.16-.94-3.25-.06-14.08,.03-25.8,.03-39.87,0-3.14-.7-7.73-2.89-11.58Zm-389.94-31.19c.73,1.76,.75,3.29-.06,5.01-4.26,9.03-8.41,18.1-12.68,27.13-6.33,13.38-12.1,26.91-13.25,41.93-.53,6.89,.45,13.51,2.27,20.02h31.18c-.27-.91-.46-1.58-.67-2.23-2.24-6.7-4.66-13.34-6.68-20.1-3.71-12.46-6.36-25.08-2.87-38.06,1.86-6.91,4.13-13.72,6.22-20.57,.33,.01,.66,.02,1,.04,9.78,27.01,19.56,54.02,29.32,80.97h30.21c-.44-1.31-.78-2.39-1.16-3.45-10.27-28.67-20.57-57.33-30.77-86.03-.48-1.34-.36-3.1,.03-4.51,.8-2.91,1.97-5.71,3.04-8.72h-38.17c1.09,3.13,1.92,5.91,3.03,8.58Zm266.83,38.49v-13.01c-11.29,1.62-19.12,8.03-25.54,17.11-5.74-4.56-11.4-9.05-17.6-13.97,3.7-1.89,6.93-3.8,10.35-5.25,10.24-4.33,20.94-6.69,32.09-6.02,11.99,.72,21.86,5.19,27,16.9,2.21,5.03,2.75,10.41,2.79,15.82,.08,10.09,.13,21.72-.04,31.81-.06,3.33,.43,5.96,4.72,11.46-18.73,0-39.62,0-58.35,0-4.96,0-9.67-1.07-14.11-3.24-11.65-5.71-14.63-18.32-6.87-28.71,4.31-5.76,10.07-9.62,16.35-12.85,8.47-4.35,17.49-7.18,26.7-9.44,.77-.19,1.54-.38,2.5-.62Zm-.07,8.37c-9.98,3.4-18.16,8.56-22.78,18.08-2.36,4.86-.92,9.65,3.5,12.84,5.69,4.1,12.32,5.43,19.28,6.44v-37.36Zm218.86,46.41c17.49,.03,34.97,.07,52.46,.05,.71,0,1.66-.34,2.08-.86,3.69-4.61,7.87-8.96,10.77-14.03,3.91-6.83,3.12-13.89-2.24-19.91-2.39-2.69-5.1-5.28-8.14-7.15-7.3-4.51-14.94-8.46-22.32-12.85-3.33-1.98-6.51-4.27-9.49-6.75-1.28-1.07-2.91-2.54-3.15-5.08,15.85,.11,30.19,1.92,41.78,13.01v-20.79c-15.22,0-30.22,0-45.21,.02-.59,0-1.27,.14-1.74,.46-5.67,3.86-11.1,7.98-14.76,13.95-1.96,3.2-2.91,6.61-2.06,10.39,1.15,5.16,4.51,8.89,8.55,11.79,6.03,4.33,12.45,8.13,18.66,12.22,5.62,3.7,11.3,7.31,16.69,11.31,1.98,1.47,4.71,4.12,4.1,6.63-17.1-.1-32.45-5.63-46.57-15.76v23.14c.42,.15,.5,.21,.59,.21Zm-81.04-64.61c12.53-3.34,24.28-6.47,36.44-9.71,0,1.34,0,2.35,0,3.37,0,18.85,.07,37.7-.06,56.55-.03,3.57,.48,6.79,2.46,9.78,.87,1.31,1.46,2.79,2.33,4.48h-38.22c1.11-2.17,2.34-4.17,3.19-6.32,.72-1.83,1.41-3.83,1.43-5.77,.12-13.98,0-27.97,.12-41.95,.02-2.32-.55-4.06-2.33-5.54-1.69-1.4-3.24-2.96-5.35-4.91Zm20.36-42.39c-8.96,0-16.22,5.56-16.22,12.42s7.26,12.42,16.22,12.42,16.22-5.56,16.22-12.42-7.26-12.42-16.22-12.42Zm60.5,2.43c0-7.63-7.26-13.33-16.22-13.33s-16.22,5.56-16.22,12.42c-.16,3.28,1.86,7.32,5.44,9.81,2.06,1.43,4.53,2.29,7.24,3.62-.71,2.77-1.46,5.69-2.22,8.66,12.59-1.28,21.98-9.1,21.98-21.17Z"
              fill="#742f1c"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, filter: 'blur(4px)' }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, filter: 'blur(0px)' }
              }
              transition={{ duration: 0.55, delay: 0.6, ease: customEase }}
            />

            {/* 4. "THE DELICIOUS SOUTH" Tagline Text */}
            <motion.text
              className="amanis-intro__svg-text-tagline"
              transform="translate(448.65 346.95)"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, letterSpacing: '0.08em' }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, letterSpacing: '0.14em' }
              }
              transition={{ duration: 0.5, delay: 0.78, ease: customEase }}
            >
              THE DELICIOUS SOUTH
            </motion.text>
          </svg>

          {/* Light Sheen Sweep across Logo Stage */}
          {!prefersReducedMotion && (
            <motion.div
              className="amanis-intro__sheen"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: [ '-100%', '100%' ],
                opacity: [ 0, 0.45, 0 ],
              }}
              transition={{
                duration: 0.75,
                delay: 1.3,
                ease: customEase,
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
