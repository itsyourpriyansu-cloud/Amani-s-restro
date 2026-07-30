import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import Icon from '../common/Icon';
import { UtensilsCrossed, ArrowLeft, Info } from 'lucide-react';
import RestaurantTrustProfileModal from '../trust/RestaurantTrustProfileModal';
import CompactKitchenStatus from '../menu/CompactKitchenStatus';

/**
 * Top app bar component.
 * - On `/menu` page: Full header (64px height, brand icon + wordmark + Table chip) + Marquee Ticker.
 * - On all other pages: Narrowed navbar (50px height) with only Back Button + Table chip. Logo, wordmark & marquee hidden.
 * - Scroll-driven auto-hide/reveal animation preserved across all screens.
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
  kitchenLoad,
  showKitchenStatus = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber } = useTable();
  const [logoFailed, setLogoFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCircling, setIsCircling] = useState(false);
  const [showBuiltInModal, setShowBuiltInModal] = useState(false);

  const lastScrollY = useRef(0);

  const isMenuPage = location && location.pathname === '/menu';
  const canGoBack = showBackButton || onBack || (location && location.pathname !== '/');

  // Auto-hide navbar on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 30) {
        setIsVisible(true);
      } else if (diff > 6) {
        setIsVisible(false);
      } else if (diff < -6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const formattedTableNumber = `Table ${String(tableNumber || 5).padStart(2, '0')}`;

  /* ── Non-Menu Pages (Narrowed header: Back button + Table chip only, no logo/wordmark, no marquee) ── */
  if (!isMenuPage) {
    return (
      <>
        <header
          className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${
            transparent
              ? 'bg-transparent'
              : 'bg-surface border-b border-outline-variant/60 shadow-2xs'
          }`}
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {/* Narrowed Navigation Row — 50px height */}
          <div className="max-w-[640px] mx-auto w-full h-[50px] flex items-center justify-between px-3.5 sm:px-4 gap-3">
            {/* Back button */}
            <button
              type="button"
              onClick={onBack || (() => navigate('/'))}
              className="w-8.5 h-8.5 rounded-full bg-surface-container-low hover:bg-surface-container active:scale-95 text-on-surface-variant flex items-center justify-center transition-all border border-outline-variant/60 shrink-0 cursor-pointer"
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
            </button>

            {/* Optional page title in center if passed */}
            {title ? (
              <span className="font-bold text-[14.5px] sm:text-[15px] tracking-tight text-on-surface truncate text-center max-w-[55%]">
                {title}
              </span>
            ) : (
              <span className="flex-1" />
            )}

            {/* Right action — Table indicator chip */}
            <div className="flex items-center shrink-0 gap-2">
              {rightIcon && (
                <button
                  type="button"
                  onClick={onRightAction}
                  className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant active:scale-95 transition-all cursor-pointer border border-outline-variant/60"
                >
                  <Icon name={rightIcon} className="text-sm" />
                </button>
              )}
              <div
                className="h-7.5 px-2.5 rounded-full bg-surface-container-low/90 text-on-surface-variant text-[12px] font-semibold border border-outline-variant/60 flex items-center gap-1.5 shrink-0 select-none"
                aria-label={`Your table: ${tableNumber}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" aria-hidden="true" />
                <span>{formattedTableNumber}</span>
              </div>
            </div>
          </div>
        </header>

        <RestaurantTrustProfileModal
          isOpen={showBuiltInModal}
          onClose={() => setShowBuiltInModal(false)}
        />
      </>
    );
  }

  /* ── Menu Page (`/menu`) — Full brand header + Marquee Ticker ── */
  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 bg-surface border-b border-outline-variant/60 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {/* Main Navigation Row — 64px height */}
        <div className="max-w-[640px] mx-auto w-full h-[64px] flex items-center justify-between px-4 gap-3">
          {/* Back button */}
          {canGoBack && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onBack) {
                  onBack();
                } else {
                  navigate('/');
                }
              }}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container active:scale-95 text-on-surface-variant flex items-center justify-center transition-all border border-outline-variant/60 shrink-0 cursor-pointer"
              aria-label="Go to Home Screen"
              title="Go to Home Screen"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-on-surface-variant" />
            </button>
          )}

          {/* Brand identity container: logo icon + 10-12px gap + wordmark */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={handleLogoClick}
              className="relative flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
              aria-label="View restaurant and chef details"
              title="Click for Hotel & Chef details"
            >
              <svg
                className={`absolute -inset-1.5 w-[52px] h-[52px] pointer-events-none transition-opacity duration-300 ${
                  isCircling ? 'opacity-100 animate-spin' : 'opacity-0'
                }`}
                viewBox="0 0 52 52"
                fill="none"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  stroke="url(#logo-gold-gradient)"
                  strokeWidth="2.5"
                  strokeDasharray="40 85"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="logo-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E3C583" />
                    <stop offset="50%" stopColor="#C9953D" />
                    <stop offset="100%" stopColor="#985D2E" />
                  </linearGradient>
                </defs>
              </svg>

              {logoSrc && !logoFailed ? (
                <img
                  src={logoSrc}
                  alt="Mangamma Ruchulu Brand Logo"
                  aria-hidden="true"
                  onError={() => setLogoFailed(true)}
                  className={`shrink-0 w-10.5 h-10.5 rounded-full object-cover transition-all duration-300 ${
                    isCircling
                      ? 'scale-110 ring-2 ring-highlight border border-highlight/70 shadow-[0_0_12px_rgba(201,149,61,0.5)]'
                      : 'hover:scale-105 ring-1 ring-outline-variant/40'
                  }`}
                />
              ) : (
                <div
                  className={`shrink-0 w-10.5 h-10.5 rounded-full bg-primary text-on-primary flex items-center justify-center transition-all duration-300 ${
                    isCircling
                      ? 'scale-110 ring-2 ring-highlight border border-highlight/70 shadow-[0_0_12px_rgba(201,149,61,0.5)]'
                      : 'hover:scale-105 shadow-xs'
                  }`}
                  aria-hidden="true"
                >
                  <UtensilsCrossed className="w-5 h-5 text-on-primary" />
                </div>
              )}
            </button>

            {/* Wordmark */}
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
              <span className="text-[18px] sm:text-[20px] leading-tight font-bold text-primary tracking-tight truncate group-hover/title:opacity-90 transition-all">
                {RESTAURANT_INFO.name}
              </span>
            </div>
          </div>

          {/* Right action control — Table chip */}
          <div className="flex items-center shrink-0">
            <div
              className="h-8 px-3 rounded-full bg-surface-container-low/90 text-on-surface-variant text-[12.5px] font-semibold border border-outline-variant/60 flex items-center gap-2 shrink-0 select-none"
              aria-label={`Your table: ${tableNumber}`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary shrink-0" aria-hidden="true" />
              <span>{formattedTableNumber}</span>
            </div>
          </div>
        </div>

        {/* Integrated Marquee Kitchen Status Strip (Only on /menu) */}
        {showKitchenStatus && <CompactKitchenStatus kitchenLoad={kitchenLoad} />}
      </header>

      <RestaurantTrustProfileModal
        isOpen={showBuiltInModal}
        onClose={() => setShowBuiltInModal(false)}
      />
    </>
  );
};

export default TopAppBar;
