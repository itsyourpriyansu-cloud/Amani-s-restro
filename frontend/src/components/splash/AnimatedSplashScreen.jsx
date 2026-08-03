import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { restaurantConfig } from '../../config/restaurantConfig';
import {
  CurryLeafIcon,
  RedChiliIcon,
  CorianderIcon,
  CardamomIcon,
  StarAniseIcon,
  CloveIcon,
  PeppercornIcon,
  GarlicIcon,
  OnionPetalIcon,
  AromaStreamIcon,
  BrassMotifIcon,
} from './SpiceIcons';

/**
 * AnimatedSplashScreen
 * Mobile-first, cinematic, antigravity-motion opening sequence for Mangamma Ruchulu.
 *
 * Enhanced Timing Schedule (4.8s total duration + 0.8s velvety dissolve exit):
 * 0.0s - 0.5s : Soft fade in from dark textured background + ambient saffron radial pulse
 * 0.5s - 1.5s : Antigravity spice & herb icons drift inward with orbital curvature & parallax depth
 * 1.5s - 2.2s : Rising steam aroma swirls & central gold lighting halo form
 * 2.2s - 3.0s : Telugu script "మంగమ్మ రుచులు" & English title "Mangamma Ruchulu" reveal
 * 3.0s - 3.8s : Tagline "A Journey of Tradition. A Legacy of Flavour." + horizontal shimmer pass
 * 3.8s - 4.8s : Harmonious settle & brand hold phase; smooth velvety transition into home screen
 */

const FLOATING_ITEMS = [
  { id: 'curry-1', Icon: CurryLeafIcon, startX: -140, startY: -180, endX: -95, endY: -130, scale: 1.1, rot: -25, delay: 0.5 },
  { id: 'chili-1', Icon: RedChiliIcon, startX: 160, startY: -150, endX: 110, endY: -110, scale: 1.0, rot: 35, delay: 0.6 },
  { id: 'cardamom-1', Icon: CardamomIcon, startX: -160, startY: 60, endX: -115, endY: 35, scale: 0.9, rot: -15, delay: 0.7 },
  { id: 'anise-1', Icon: StarAniseIcon, startX: 170, startY: 90, endX: 120, endY: 65, scale: 1.15, rot: 45, delay: 0.8 },
  { id: 'clove-1', Icon: CloveIcon, startX: -120, startY: 180, endX: -80, endY: 145, scale: 0.85, rot: 20, delay: 0.9 },
  { id: 'pepper-1', Icon: PeppercornIcon, startX: 140, startY: 190, endX: 95, endY: 150, scale: 1.2, rot: -10, delay: 1.0 },
  { id: 'garlic-1', Icon: GarlicIcon, startX: -170, startY: -50, endX: -125, endY: -35, scale: 0.85, rot: 15, delay: 0.65 },
  { id: 'onion-1', Icon: OnionPetalIcon, startX: 165, startY: -40, endX: 120, endY: -25, scale: 0.9, rot: -30, delay: 0.75 },
  { id: 'coriander-1', Icon: CorianderIcon, startX: 40, startY: -220, endX: 30, endY: -160, scale: 0.95, rot: 12, delay: 0.85 },
  { id: 'curry-2', Icon: CurryLeafIcon, startX: -50, startY: 220, endX: -35, endY: 165, scale: 0.8, rot: 55, delay: 0.95 },
];

const AnimatedSplashScreen = ({ onComplete, autoDismiss = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef(null);

  /* ── Canvas Golden Spice Dust Particle System ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.7 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.5 - 0.2,
      color: Math.random() > 0.4 ? '#C9953D' : '#E3C583',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += (Math.random() - 0.5) * 0.015;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.85) p.alpha = 0.85;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ── Main Timer Sequence (4.8s total stay time) ── */
  useEffect(() => {
    if (!autoDismiss) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4800);

    return () => clearTimeout(timer);
  }, [autoDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#140705] select-none touch-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 45%, #3D160E 0%, #1C0B08 60%, #100504 100%)',
          }}
          role="dialog"
          aria-label="Amani's Kitchen brand introduction"
        >
          {/* Layer 1: Ambient Background Particle Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80 z-10" />

          {/* Layer 2: Central Saffron Glow Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 0.35, 0.75, 0.5],
              scale: [0.6, 1.0, 1.28, 1.18],
            }}
            transition={{
              duration: 4.6,
              times: [0, 0.35, 0.7, 1],
              ease: 'easeInOut',
            }}
            className="absolute z-20 pointer-events-none rounded-full w-[360px] h-[360px]"
            style={{
              background:
                'radial-gradient(circle, rgba(229, 158, 43, 0.42) 0%, rgba(163, 15, 59, 0.28) 45%, transparent 75%)',
              filter: 'blur(36px)',
            }}
          />

          {/* Layer 3: Brassware Heritage Motif (Rotates slowly) */}
          <motion.div
            initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 0.28, rotate: 50, scale: 1.12 }}
            transition={{ duration: 4.8, ease: 'easeOut' }}
            className="absolute z-20 pointer-events-none"
          >
            <BrassMotifIcon className="w-[340px] h-[340px] text-highlight" />
          </motion.div>

          {/* Layer 4: Rising Aroma & Steam Swirls */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: [0, 0.65, 0.35], y: -45 }}
            transition={{ duration: 3.6, delay: 1.2, ease: 'easeOut' }}
            className="absolute z-25 pointer-events-none -translate-y-12"
          >
            <AromaStreamIcon className="w-36 h-72 opacity-80" />
          </motion.div>

          {/* Layer 5: Antigravity Floating Ingredients (Orbiting peripheral plane) */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            {FLOATING_ITEMS.map((item) => {
              const { id, Icon, startX, startY, endX, endY, scale, rot, delay } = item;
              return (
                <motion.div
                  key={id}
                  initial={{
                    x: startX,
                    y: startY,
                    opacity: 0,
                    scale: scale * 0.5,
                    rotate: rot - 35,
                  }}
                  animate={{
                    x: [startX, endX, endX + (startX > 0 ? 8 : -8)],
                    y: [startY, endY, endY + 10],
                    opacity: [0, 0.9, 0.95, 0.9],
                    scale: [scale * 0.5, scale, scale * 1.05],
                    rotate: [rot - 35, rot, rot + 15],
                  }}
                  transition={{
                    duration: 3.2,
                    delay: delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                >
                  <Icon className="w-10 h-10 filter drop-shadow-md" />
                </motion.div>
              );
            })}
          </div>

          {/* Layer 6: Central Brand Reveal Stack (Telugu + English + Tagline) */}
          <div className="relative z-40 flex flex-col items-center justify-center text-center px-6 max-w-[360px]">
            {/* Crown Logo Emblem */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-20 h-20 rounded-full border-2 border-highlight overflow-hidden shadow-[0_0_35px_rgba(201,149,61,0.5)] mb-4"
            >
              <img
                src="/Amanis Logo Final.svg"
                alt="Amani's Kitchen Brand Logo"
                className="w-full h-full object-contain p-1.5 bg-white/10"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 1.85] }}
                transition={{ duration: 1.4, delay: 2.4, repeat: Infinity, repeatDelay: 1.5 }}
                className="absolute inset-0 rounded-full border border-highlight pointer-events-none"
              />
            </motion.div>

            {/* Main English Brand Name: "Amani's Kitchen" */}
            <motion.h1
              initial={{ opacity: 0, y: 16, letterSpacing: '0.06em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.02em' }}
              transition={{ duration: 0.8, delay: 2.4, ease: 'easeOut' }}
              className="relative font-serif font-bold text-[32px] sm:text-[36px] leading-tight text-surface tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
            >
              {restaurantConfig.name}

              {/* Shimmer Light Pass Across Logo */}
              <motion.span
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: '140%', opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: 3.4, ease: 'easeInOut' }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-highlight/50 to-transparent skew-x-12 pointer-events-none"
              />
            </motion.h1>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.85 }}
              transition={{ duration: 0.7, delay: 3.0 }}
              className="w-28 h-[1.5px] my-3.5 bg-gradient-to-r from-transparent via-highlight to-transparent"
            />

            {/* Tagline: "A Journey of Tradition. A Legacy of Flavour." */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.2, ease: 'easeOut' }}
              className="text-[13.5px] font-medium text-surface/95 tracking-wide leading-relaxed max-w-[290px]"
            >
              {restaurantConfig.tagline}
            </motion.p>
          </div>

          {/* Layer 7: Skip Control (Top Right) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="absolute top-5 right-5 z-50"
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-surface text-[12px] font-semibold tracking-wide backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-lg"
              aria-label="Skip splash screen animation"
            >
              <span>Skip</span>
              <span className="text-highlight" aria-hidden="true">
                ➔
              </span>
            </button>
          </motion.div>

          {/* Layer 8: Subtle Progress Line at Screen Bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4.8, ease: 'linear' }}
            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-highlight to-secondary origin-left z-50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedSplashScreen;
