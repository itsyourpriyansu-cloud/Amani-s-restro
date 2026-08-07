import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import Icon from '../common/Icon';
import { UtensilsCrossed, ArrowLeft, Info, BellRing } from 'lucide-react';
import RestaurantTrustProfileModal from '../trust/RestaurantTrustProfileModal';
import CompactKitchenStatus from '../menu/CompactKitchenStatus';

/**
 * Top app bar component.
 * - On `/menu` page: Full header (64px height, brand icon + wordmark + Call Waiter button + Table chip) + Marquee Ticker.
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
  logoSrc = RESTAURANT_INFO.logo || '/logo.png',
  kitchenLoad,
  showKitchenStatus = true,
  onCallWaiter,
  showCallWaiter = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber } = useTable();
  const { assistanceRequests, addAssistanceRequest } = useOrder();
  const { showToast } = useToast();
  const [logoFailed, setLogoFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCircling, setIsCircling] = useState(false);
  const [showBuiltInModal, setShowBuiltInModal] = useState(false);

  const lastScrollY = useRef(0);

  const isMenuPage = location && location.pathname === '/menu';
  const canGoBack = showBackButton || onBack || (location && location.pathname !== '/');

  const [isCalled, setIsCalled] = useState(false);

  const handleCallWaiterAction = (e) => {
    e.stopPropagation();
    if (onCallWaiter) {
      onCallWaiter();
      return;
    }
    if (isCalled) {
      showToast(`Waiter has already been notified for Table ${tableNumber}`, 'info');
    } else {
      addAssistanceRequest(tableNumber, 'Call Waiter');
      setIsCalled(true);
      showToast(`Waiter called for Table ${tableNumber}. Staff notified!`, 'success');
    }
  };

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
    navigate('/');
  };

  const handleTableClick = (e) => {
    e.stopPropagation();
    if (onOpenTrustProfile) {
      onOpenTrustProfile();
    } else {
      setShowBuiltInModal(true);
    }
  };

  const formattedTableNumber = tableNumber
    ? `Table ${String(tableNumber).padStart(2, '0')}`
    : 'Table';

  /* ── Non-Menu Pages ── */
  if (!isMenuPage) {
    return (
      <>
        <header
          className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${
            transparent
              ? 'bg-transparent'
              : 'bg-background border-b border-outline-variant/70'
          }`}
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {/* Navigation Row */}
          <div className="mx-auto flex h-16 w-full max-w-[640px] items-center justify-between gap-3 px-4">
            {/* Left: Back button (if explicitly requested on sub-page) or Left-aligned Logo */}
            {showBackButton || onBack ? (
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={onBack || (() => navigate('/'))}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-[background-color,transform] duration-150 hover:bg-surface-container active:scale-95 border border-outline-variant/60"
                  aria-label="Go back"
                  title="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-on-surface-variant" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-start shrink-0">
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="flex items-center justify-start cursor-pointer focus:outline-none"
                  aria-label="Go to home page"
                  title="Go to home page"
                >
                  <img
                    src={logoSrc || '/Amanis Logo Final.svg'}
                    alt="Amani's Kitchen Brand Logo"
                    className="h-[42px] sm:h-[46px] w-auto max-w-[200px] sm:max-w-[230px] object-contain transition-transform duration-200 hover:scale-105"
                  />
                </button>
              </div>
            )}

            {/* Center: Title if passed */}
            {title && (
              <span className="font-bold text-[14.5px] sm:text-[15px] tracking-tight text-on-surface truncate text-center max-w-[55%] flex-1">
                {title}
              </span>
            )}
            {!title && (showBackButton || onBack) && (
              <span className="flex-1" />
            )}

            {/* Right action — Table indicator chip & Call Waiter button */}
            <div className="flex items-center shrink-0 gap-2">
              {(showCallWaiter || onCallWaiter) && (
                <button
                  type="button"
                  onClick={handleCallWaiterAction}
                  className={`h-8 px-2.5 sm:px-3 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 shrink-0 select-none cursor-pointer active:scale-95 transition-all shadow-sm ${
                    isCalled
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                      : 'bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary'
                  }`}
                  aria-label={isCalled ? "Waiter already called" : "Call waiter to table"}
                  title={isCalled ? "Waiter notified, staff is on the way!" : "Click to call waiter to your table"}
                >
                  <BellRing className={`w-3.5 h-3.5 ${isCalled ? 'animate-bounce text-amber-600 dark:text-amber-400' : 'text-primary animate-pulse'}`} />
                  <span className="whitespace-nowrap">{isCalled ? 'Waiter Called' : 'Call Waiter'}</span>
                </button>
              )}
              {rightIcon && (
                <button
                  type="button"
                  onClick={onRightAction}
                  className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant active:scale-95 transition-all cursor-pointer border border-outline-variant/60"
                >
                  <Icon name={rightIcon} className="text-sm" />
                </button>
              )}
              <button
                type="button"
                onClick={handleTableClick}
                className="flex h-8 shrink-0 select-none items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container-low px-3 text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
                aria-label={tableNumber ? `Your table: ${tableNumber}. Click to view kitchen details.` : 'Table details'}
                title="Click for Kitchen Details & Transparency"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" aria-hidden="true" />
                <span>{formattedTableNumber}</span>
              </button>
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
        {/* Main Navigation Row — 64px height, left-aligned logo */}
        <div className="max-w-[640px] mx-auto w-full h-[64px] flex items-center justify-between px-4 gap-3">
          {/* Left: Un-circled Brand Logo perfectly aligned on the left */}
          <div className="flex items-center min-w-0 flex-1 justify-start">
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center justify-start cursor-pointer focus:outline-none"
              aria-label="Go to home page"
              title="Go to home page"
            >
              {logoSrc && !logoFailed ? (
                <img
                  src={logoSrc || '/Amanis Logo Final.svg'}
                  alt="Amani's Kitchen Brand Logo"
                  onError={() => setLogoFailed(true)}
                  className="h-[44px] sm:h-[48px] w-auto max-w-[210px] sm:max-w-[240px] object-contain transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <div
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary flex items-center gap-2"
                  aria-hidden="true"
                >
                  <UtensilsCrossed className="w-5 h-5 text-on-primary" />
                  <span className="font-bold text-sm">Amani's</span>
                </div>
              )}
            </button>
          </div>

          {/* Right action control — Call Waiter button & Table chip */}
          <div className="flex items-center shrink-0 gap-2">
            <button
              type="button"
              onClick={handleCallWaiterAction}
              className={`h-8 px-2.5 sm:px-3 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 shrink-0 select-none cursor-pointer active:scale-95 transition-all shadow-sm ${
                isCalled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary'
              }`}
              aria-label={isCalled ? "Waiter already called" : "Call waiter to table"}
              title={isCalled ? "Waiter notified, staff is on the way!" : "Click to call waiter to your table"}
            >
              <BellRing className={`w-3.5 h-3.5 ${isCalled ? 'animate-bounce text-amber-600 dark:text-amber-400' : 'text-primary animate-pulse'}`} />
              <span className="whitespace-nowrap">{isCalled ? 'Waiter Called' : 'Call Waiter'}</span>
            </button>

            <button
              type="button"
              onClick={handleTableClick}
              className="h-8 px-3 rounded-full bg-surface-container-low/90 hover:bg-surface-container text-on-surface-variant text-[12.5px] font-semibold border border-outline-variant/60 hover:border-primary/40 flex items-center gap-2 shrink-0 select-none cursor-pointer active:scale-95 transition-all"
              aria-label={`Your table: ${tableNumber}. Click to view kitchen details.`}
              title="Click for Kitchen Details & Transparency"
            >
              <span className="w-2 h-2 rounded-full bg-secondary shrink-0" aria-hidden="true" />
              <span>{formattedTableNumber}</span>
            </button>
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
