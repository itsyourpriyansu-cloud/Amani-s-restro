import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import { restaurantConfig } from '../../config/restaurantConfig';
import TopCategoriesSection from '../../components/home/TopCategoriesSection';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import CustomizationModal from '../../components/menu/CustomizationModal';
import { 
  ArrowRight, 
  Bell, 
  UtensilsCrossed, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  GlassWater,
  Receipt,
  HelpCircle,
  UserCheck,
  Check
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Kitchen status metadata & semantic states
───────────────────────────────────────────── */
const KITCHEN_STATUS_META = {
  NORMAL: {
    label: 'Normal',
    subLabel: 'Est. prep time',
    icon: CheckCircle2,
    dotColor: '#2E7D3E', // Leaf Green
  },
  BUSY: {
    label: 'Moderate',
    subLabel: 'Est. prep time',
    icon: Flame,
    dotColor: '#EAA52E', // Saffron
  },
  VERY_BUSY: {
    label: 'High',
    subLabel: 'Est. prep time',
    icon: Clock,
    dotColor: '#87351F', // Terracotta
  },
  PAUSED: {
    label: 'Paused',
    subLabel: 'Brief delay',
    icon: AlertCircle,
    dotColor: '#87351F',
  },
};

/* ─────────────────────────────────────────────
   Sub-component: RestaurantHero
   Full-width edge-to-edge hero (~390–440px), clamp sizer,
   3 cinematic gradient layers, editorial headline.
───────────────────────────────────────────── */
const RestaurantHero = ({ heroImage }) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-b-[26px] bg-[#21100B]"
      style={{ height: 'clamp(390px, 86vw, 440px)' }}
    >
      {!heroImgFailed ? (
        <picture>
          <img
            src={heroImage || '/south_indian_hero_banner.png'}
            alt="Amani's Kitchen authentic South Indian dining ambience"
            fetchpriority="high"
            loading="eager"
            onError={() => setHeroImgFailed(true)}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 42%' }}
          />
        </picture>
      ) : (
        <div className="w-full h-full bg-[#21100B] flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-[#FFF9F4]/40" aria-hidden="true" />
        </div>
      )}

      {/* Layer 1 — subtle top shade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(22, 10, 7, 0.28) 0%, rgba(22, 10, 7, 0.04) 30%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 2 — strong lower text gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(27, 11, 7, 0) 30%, rgba(33, 13, 8, 0.34) 58%, rgba(34, 13, 8, 0.90) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Layer 3 — subtle warm radial light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 72% 24%, rgba(234, 165, 46, 0.16), transparent 38%)',
        }}
        aria-hidden="true"
      />

      {/* Lower-left headline content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 px-5 pb-10 flex flex-col gap-2 z-10"
      >
        <h1
          className="font-sans uppercase text-[#FFF9F4] font-normal tracking-tight leading-[1.02]"
          style={{
            fontSize: 'clamp(31px, 10vw, 27px)',
            textShadow: '0 2px 18px rgba(18, 7, 4, 0.30)',
          }}
        >
          A Taste of the South,<br />Made With Heart.
        </h1>
        <p
          className="font-sans text-white/85 font-medium leading-snug tracking-wide text-[13px] sm:text-[14px] flex items-center gap-1.5 mt-3 mb-3"
          style={{ textShadow: '0 1px 8px rgba(18, 7, 4, 0.25)' }}
        >
          <span>Since {RESTAURANT_INFO.established}</span>
          <span className="opacity-60" aria-hidden="true">•</span>
          <span>Authentic South Indian Dining</span>
        </p>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: KitchenStatusCard
   Overlaps hero bottom by ~28px, concise non-truncated text.
───────────────────────────────────────────── */
const KitchenStatusCard = ({ statusMeta, etaLow }) => {
  const IconComponent = statusMeta?.icon || Flame;
  const etaRange = `${etaLow}–${etaLow + 5} min`;
  const dotColor = statusMeta?.dotColor || '#EAA52E';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
      className="mx-4 relative z-20 flex items-center justify-between gap-3 px-4 py-3 rounded-[22px] backdrop-blur-md"
      style={{
        marginTop: '-28px',
        backgroundColor: 'rgba(255, 252, 249, 0.96)',
        border: '1px solid rgba(112, 62, 43, 0.10)',
        boxShadow: '0 12px 30px rgba(57, 27, 16, 0.12)',
        minHeight: '74px',
      }}
    >
      {/* Left section: Icon + Status */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#F4E9E1] border border-[#663422]/10 text-[#87351F]">
          <IconComponent className="w-5 h-5 text-[#87351F]" aria-hidden="true" />
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white"
            style={{ backgroundColor: dotColor }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-semibold text-[#74645D] leading-none uppercase tracking-wider">
            Kitchen load
          </span>
          <span className="text-[15px] font-bold text-[#21100B] leading-tight mt-1 truncate">
            {statusMeta?.label || 'Moderate'}
          </span>
        </div>
      </div>

      {/* Right section: Preparation time pill */}
      <div className="shrink-0 flex items-center">
        <div
          className="h-[44px] px-3.5 rounded-[16px] font-bold text-[13px] leading-none flex items-center gap-1.5 select-none bg-[#EAA52E]/15 text-[#21100B] border border-[#EAA52E]/25"
          aria-label={`Estimated preparation time: ${etaRange}`}
        >
          <Clock className="w-4 h-4 text-[#87351F]" aria-hidden="true" />
          <span>{etaRange}</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: RestaurantTrustFooter
───────────────────────────────────────────── */
const RestaurantTrustFooter = ({ onOpenTrustProfile }) => (
  <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 px-4 pt-6 pb-2">
    <span className="text-[#74645D] text-[12px]">
      Since {RESTAURANT_INFO.established}
    </span>
    <span className="text-[#74645D] text-[10px]" aria-hidden="true">·</span>
    <span className="text-[#74645D] text-[12px]">
      {restaurantConfig.parentCompanyLabel}
    </span>
    <span className="text-[#74645D] text-[10px]" aria-hidden="true">·</span>
    <button
      onClick={onOpenTrustProfile}
      className="text-[#87351F] font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87351F] rounded text-[12px] cursor-pointer"
    >
      Our Story
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   Sub-component: FloatingActionDock
   Persistent floating bottom action dock featuring:
   1. Flexible "View Menu" main pill
   2. Separate circular "Call Waiter" FAB with Quick-Action menu popover.
───────────────────────────────────────────── */
const FloatingActionDock = ({
  onNavigateMenu,
  onRequestAssistance,
  tableNumber,
  assistanceSent,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInitialTooltip, setShowInitialTooltip] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const menuRef = useRef(null);

  // Auto-hide initial tooltip after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialTooltip(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle click outside and Escape key to close quick-action menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleSelectService = (type, label, confirmText) => {
    onRequestAssistance(type);
    setIsMenuOpen(false);

    // Show temporary inline confirmation toast
    const tableId = tableNumber ? `Table ${tableNumber}` : 'Table';
    setStatusMessage(`${confirmText} · ${tableId}`);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  const SERVICE_OPTIONS = [
    {
      type: 'GENERAL',
      title: 'Call waiter',
      subtitle: 'Ask a staff member to come over',
      confirmText: 'Waiter requested',
      icon: UserCheck,
      iconBg: 'bg-[#87351F]/10 text-[#87351F]',
    },
    {
      type: 'WATER',
      title: 'Request water',
      subtitle: 'Send drinking water to table',
      confirmText: 'Water request sent',
      icon: GlassWater,
      iconBg: 'bg-[#17675D]/10 text-[#17675D]',
    },
    {
      type: 'BILL',
      title: 'Request bill',
      subtitle: 'Let the counter know you are ready',
      confirmText: 'Bill requested',
      icon: Receipt,
      iconBg: 'bg-[#EAA52E]/15 text-[#642313]',
    },
    {
      type: 'OTHER',
      title: 'Other help',
      subtitle: 'Share another request',
      confirmText: 'Request sent',
      icon: HelpCircle,
      iconBg: 'bg-[#74645D]/10 text-[#21100B]',
    },
  ];

  return (
    <>
      {/* Inline Request Status Confirmation Chip */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
            className="fixed left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#FFF9F4] border border-[#2E7D3E]/30 text-[#2E7D3E] font-bold text-[13px] flex items-center gap-2 shadow-[0_10px_25px_rgba(26,18,13,0.15)]"
            style={{
              bottom: 'calc(78px + env(safe-area-inset-bottom))',
            }}
          >
            <Check className="w-4 h-4 text-[#2E7D3E] shrink-0" aria-hidden="true" />
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Dock Container */}
      <div
        ref={menuRef}
        className="fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-28px)] max-w-[430px] flex items-center gap-2.5 select-none pointer-events-auto"
        style={{
          bottom: 'calc(14px + env(safe-area-inset-bottom))',
        }}
      >
        {/* Waiter Quick-Action Menu Popover (anchored above the waiter FAB on the left) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="waiter-quick-menu"
              role="dialog"
              aria-label="Waiter assistance options"
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 bottom-[66px] w-[260px] bg-[#FFF9F4] border border-[#663422]/15 rounded-[22px] p-2.5 shadow-[0_18px_45px_rgba(33,13,8,0.20)] z-50 overflow-hidden flex flex-col gap-1 origin-bottom-left"
            >
              <div className="px-3 py-1.5 border-b border-[#663422]/10 flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#21100B]">Need assistance?</span>
                <span className="text-[11px] font-semibold text-[#87351F] bg-[#87351F]/10 px-2 py-0.5 rounded-full">
                  {tableNumber ? `Table ${tableNumber}` : 'Table'}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 mt-1">
                {SERVICE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.type}
                      onClick={() => handleSelectService(opt.type, opt.title, opt.confirmText)}
                      className="w-full text-left p-2.5 rounded-[14px] hover:bg-[#F4E9E1]/60 active:bg-[#F4E9E1] transition-colors flex items-center gap-3 group cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-[11px] flex items-center justify-center shrink-0 ${opt.iconBg}`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[13.5px] font-bold text-[#21100B] leading-tight group-hover:text-[#87351F] transition-colors">
                          {opt.title}
                        </span>
                        <span className="text-[11px] text-[#74645D] font-medium leading-tight mt-0.5 truncate">
                          {opt.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Call Waiter FAB Button (Left position, White background + border) */}
        <div className="relative shrink-0">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Call waiter"
            aria-expanded={isMenuOpen}
            aria-controls="waiter-quick-menu"
            disabled={assistanceSent}
            className="w-[54px] h-[54px] rounded-[18px] bg-[#FFF9F4] hover:bg-[#F4E9E1] active:bg-[#F4E9E1] text-[#87351F] flex items-center justify-center relative transition-all duration-200 shadow-[0_4px_14px_rgba(33,13,8,0.08)] border border-[#87351F]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87351F] focus-visible:ring-offset-2 cursor-pointer disabled:opacity-70"
          >
            {assistanceSent ? (
              <Clock className="w-5 h-5 text-[#EAA52E] animate-pulse" aria-hidden="true" />
            ) : (
              <Bell className="w-5.5 h-5.5 text-[#87351F]" aria-hidden="true" />
            )}

            {/* Active/Pending Notification Dot */}
            {assistanceSent && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EAA52E] ring-2 ring-[#FFF9F4]" aria-hidden="true" />
            )}
          </motion.button>

          {/* Initial brief contextual tooltip */}
          <AnimatePresence>
            {showInitialTooltip && !isMenuOpen && !assistanceSent && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                className="absolute left-0 -top-8 bg-[#21100B] text-[#FFF9F4] text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shadow-md pointer-events-none z-50 flex items-center gap-1"
              >
                <span>Call waiter</span>
                <span className="w-1.5 h-1.5 bg-[#EAA52E] rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. View Menu Main Button (Right position, Primary Terracotta Focus) */}
        <motion.button
          whileTap={{ scale: 0.985 }}
          onClick={onNavigateMenu}
          className="flex-1 min-w-0 h-[54px] rounded-[18px] text-white font-bold text-[15px] sm:text-[16px] flex items-center justify-between px-5 transition-all duration-200 shadow-[0_10px_28px_rgba(111,38,20,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87351F] focus-visible:ring-offset-2 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #87351F 0%, #642313 100%)',
          }}
        >
          <span className="truncate">Explore Amani's Flavors</span>
          <ArrowRight className="w-5 h-5 text-white/90 shrink-0 ml-2" aria-hidden="true" />
        </motion.button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Main screen component: WelcomeScreen
───────────────────────────────────────────── */
const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [assistanceSent, setAssistanceSent] = useState(false);
  const [customizingDish, setCustomizingDish] = useState(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const popularSectionRef = useRef(null);

  const statusMeta =
    KITCHEN_STATUS_META[kitchenLoad?.status] || KITCHEN_STATUS_META.BUSY;
  const etaLow = kitchenLoad?.averagePreparationMinutes || 24;

  const handleAssistance = (requestType = 'GENERAL') => {
    addAssistanceRequest(tableNumber, requestType);
    setAssistanceSent(true);
    setTimeout(() => setAssistanceSent(false), 5000);
  };

  const handleAddToCartFromModal = (payload) => {
    const { dish, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(dish, formattedModifiers, specialInstruction, quantity, { selectedOptions, makeVegan, jainPreparation, allergyAlert });
    showToast(`Added customized ${dish.name} (x${quantity}) to cart`, 'success');
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{
        background: 'linear-gradient(180deg, #FFF9F4 0%, #FFFDFB 45%, #FAF3ED 100%)',
      }}
    >
      <main
        className="flex-1 flex flex-col overflow-x-hidden"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'calc(90px + env(safe-area-inset-bottom))',
        }}
      >
        <div className="w-full mx-auto flex flex-col max-w-[640px] relative">
          {/* Subtle radial tint behind categories */}
          <div
            className="absolute top-[380px] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(135, 53, 31, 0.08), transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* ── 1. Full-width Immersive Hero ── */}
          <RestaurantHero heroImage={RESTAURANT_INFO.heroImage} />

          {/* ── 2. Kitchen Status Card (Overlaps hero) ── */}
          <KitchenStatusCard statusMeta={statusMeta} etaLow={etaLow} />

          {/* ── 3. Top Categories Section ── */}
          <div ref={popularSectionRef}>
            <TopCategoriesSection />
          </div>

          {/* ── 4. Brand Trust Footer ── */}
          <RestaurantTrustFooter onOpenTrustProfile={() => setIsTrustOpen(true)} />
        </div>
      </main>

      {/* ── 5. Persistent Floating Bottom Action Dock ("View Menu" + "Call Waiter") ── */}
      {!isCustomizationOpen && (
        <FloatingActionDock
          onNavigateMenu={() => navigate('/menu')}
          onRequestAssistance={handleAssistance}
          tableNumber={tableNumber}
          assistanceSent={assistanceSent}
        />
      )}

      {/* ── Modals — preserved behavior ── */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />
      <CustomerPreferencesModal
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
      />
      {customizingDish && (
        <CustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => {
            setIsCustomizationOpen(false);
            setCustomizingDish(null);
          }}
          dish={customizingDish}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </div>
  );
};

export default WelcomeScreen;
