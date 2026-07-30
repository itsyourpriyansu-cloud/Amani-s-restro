import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import Icon from '../common/Icon';
import { UtensilsCrossed, ArrowLeft, Info } from 'lucide-react';
import RestaurantTrustProfileModal from '../trust/RestaurantTrustProfileModal';

/**
 * Top app bar with Table indicator.
 * Features scroll-driven auto-hide/reveal, circling logo interaction, Hotel & Chef details, and easy back button navigation.
 */
const TopAppBar = ({
  variant = 'brand',
  title,
  onBack,
  showBackButton,
  rightIcon,
  onRightAction,
  transparent = false,
  onOpenTrustProfile,
  onOpenPreferences,
  logoSrc,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber } = useTable();
  const [logoFailed, setLogoFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCircling, setIsCircling] = useState(false);
  const [showBuiltInModal, setShowBuiltInModal] = useState(false);

  const lastScrollY = useRef(0);

  // Determine if back button should be visible (on any non-home screen or when requested)
  const canGoBack = showBackButton || onBack || (location && location.pathname !== '/');

  // Auto-hide navbar on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (diff > 6) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else if (diff < -6) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logo click with circling animation & open details modal
  const handleLogoClick = (e) => {
    e.stopPropagation();
    setIsCircling(true);
    setTimeout(() => setIsCircling(false), 900);

    if (onOpenTrustProfile) {
      onOpenTrustProfile();
    } else {
      setShowBuiltInModal(true);
    }
  };

  /* ── Back variant (secondary screens) ── */
  if (variant === 'back') {
    return (
      <header
        className={`fixed top-0 left-0 w-full z-40 h-14 flex items-center justify-between px-3.5 sm:px-4 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          transparent
            ? 'bg-transparent'
            : 'bg-white/90 backdrop-blur-md border-b border-stone-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-[640px] mx-auto w-full flex items-center justify-between gap-3">
          <button
            onClick={onBack || (() => navigate(-1))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 active:scale-95 transition-all cursor-pointer border border-stone-200/40"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          
          <span className="font-bold text-base tracking-tight text-[#800A2E] truncate max-w-[55%] text-center">
            {title || RESTAURANT_INFO.name}
          </span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLogoClick}
              className="h-8 px-2.5 rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-xs font-semibold text-stone-700 flex items-center gap-1 transition-all cursor-pointer border border-stone-200/40"
              title="About Kitchen & Chef"
            >
              <Info className="w-3.5 h-3.5 text-[#A30F3B]" />
              <span className="hidden sm:inline">About</span>
            </button>
            {rightIcon ? (
              <button
                onClick={onRightAction}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 active:scale-95 transition-all cursor-pointer border border-stone-200/40"
              >
                <Icon name={rightIcon} className="text-base" />
              </button>
            ) : (
              <span className="w-9" />
            )}
          </div>
        </div>
      </header>
    );
  }

  /* ── Brand variant (welcome screen & primary screens) ── */
  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          height: 'calc(56px + env(safe-area-inset-top))',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="max-w-[640px] mx-auto w-full h-full flex items-center justify-between px-3.5 sm:px-4 gap-2.5">
          {/* Back button — visible when on any sub-page or when onBack is passed */}
          {canGoBack && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onBack) {
                  onBack();
                } else {
                  navigate(-1);
                }
              }}
              className="w-8.5 h-8.5 rounded-full bg-stone-100/90 hover:bg-stone-200/90 active:scale-90 text-stone-700 flex items-center justify-center transition-all border border-stone-200/50 shrink-0 cursor-pointer shadow-2xs hover:shadow-xs"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-stone-700" />
            </button>
          )}

          {/* Brand identity container */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Animated Logo Icon Button — click for Hotel & Chef details with gold popping animation */}
            <button
              type="button"
              onClick={handleLogoClick}
              className="relative flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
              aria-label="View restaurant and chef details"
              title="Click for Hotel & Chef details"
            >
              {/* Rotating SVG gold aura ring on click */}
              <svg
                className={`absolute -inset-1.5 w-11 h-11 pointer-events-none transition-opacity duration-300 ${
                  isCircling ? 'opacity-100 animate-spin' : 'opacity-0'
                }`}
                viewBox="0 0 44 44"
                fill="none"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  stroke="url(#logo-gold-gradient)"
                  strokeWidth="2.5"
                  strokeDasharray="35 75"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="logo-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>

              {logoSrc && !logoFailed ? (
                <img
                  src={logoSrc}
                  alt=""
                  aria-hidden="true"
                  onError={() => setLogoFailed(true)}
                  className={`shrink-0 w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    isCircling
                      ? 'scale-125 ring-3 ring-amber-400 ring-offset-1 border border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.7)]'
                      : 'hover:scale-110 ring-1 ring-black/5'
                  }`}
                />
              ) : (
                <div
                  className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#800A2E] to-[#A30F3B] text-white flex items-center justify-center transition-all duration-300 ${
                    isCircling
                      ? 'scale-125 ring-3 ring-amber-400 ring-offset-1 border border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.7)]'
                      : 'hover:scale-110 shadow-xs'
                  }`}
                  aria-hidden="true"
                >
                  <UtensilsCrossed className="w-4 h-4 text-amber-100" />
                </div>
              )}
            </button>

            {/* Restaurant Name — click to go to Home Screen */}
            <div
              className="flex flex-col min-w-0 cursor-pointer group/title"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/');
              }}
              role="button"
              tabIndex={0}
              title="Go to Home Screen"
            >
              <span className="text-[15px] sm:text-[16px] leading-tight font-bold text-[#800A2E] tracking-tight truncate group-hover/title:text-[#A30F3B] group-hover/title:underline decoration-amber-500/40 underline-offset-2 transition-all">
                {RESTAURANT_INFO.name}
              </span>
            </div>
          </div>

          {/* Right action control — Table chip */}
          <div className="flex items-center shrink-0">
            <div
              className="h-8 px-3 rounded-full bg-[#A30F3B]/8 text-[#A30F3B] text-[12px] font-bold border border-[#A30F3B]/15 flex items-center gap-1.5 shrink-0 select-none"
              aria-label={`Your table: ${tableNumber}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A30F3B] animate-pulse shrink-0" />
              <span>Table {tableNumber}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Built-in Restaurant & Chef details modal */}
      <RestaurantTrustProfileModal
        isOpen={showBuiltInModal}
        onClose={() => setShowBuiltInModal(false)}
      />
    </>
  );
};

export default TopAppBar;


