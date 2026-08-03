import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import { restaurantConfig } from '../../config/restaurantConfig';
import { formatInvoiceAmount } from '../../utils/formatters';
import TopCategoriesSection from '../../components/home/TopCategoriesSection';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import CustomizationModal from '../../components/menu/CustomizationModal';
import { ArrowRight, Bell, Search, UtensilsCrossed, Clock, Flame, CheckCircle2, AlertCircle } from 'lucide-react';

/* ─────────────────────────────────────────────
   Kitchen status metadata & semantic states (Minimal & Concise)
───────────────────────────────────────────── */
const KITCHEN_STATUS_META = {
  NORMAL: {
    label: 'Kitchen Running Smoothly',
    subLabel: 'Est. prep time',
    icon: CheckCircle2,
    badgeBg: 'bg-secondary-container/80 text-on-secondary-container border border-secondary/30',
    dotBg: 'bg-secondary',
  },
  BUSY: {
    label: 'Kitchen Moderately Busy',
    subLabel: 'Est. prep time',
    icon: Flame,
    badgeBg: 'bg-amber-100/90 text-amber-950 border border-amber-300/60',
    dotBg: 'bg-warning',
  },
  VERY_BUSY: {
    label: 'Kitchen Very Busy',
    subLabel: 'Est. prep time',
    icon: Clock,
    badgeBg: 'bg-error-container/80 text-on-error-container border border-error/30',
    dotBg: 'bg-error',
  },
  PAUSED: {
    label: 'Orders Temporarily Paused',
    subLabel: 'Brief delay',
    icon: AlertCircle,
    badgeBg: 'bg-error-container/80 text-on-error-container border border-error/30',
    dotBg: 'bg-error',
  },
};

/* ─────────────────────────────────────────────
   Sub-component: RestaurantHero
   Aspect ratio ~16:9 (clamp 190-220px), authentic photography,
   lower-left text alignment, Noto Sans Telugu + Inter font styling.
───────────────────────────────────────────── */
const RestaurantHero = ({ heroImage }) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden bg-on-background"
      style={{ height: 'clamp(190px, 48vw, 220px)' }}
    >
      {!heroImgFailed ? (
        <img
          src={heroImage || '/mangamma_hero_banner.png'}
          alt="Amani's Kitchen authentic South Indian dining meal and ambience"
          fetchpriority="high"
          loading="eager"
          onError={() => setHeroImgFailed(true)}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 45%' }}
        />
      ) : (
        <div className="w-full h-full bg-on-background flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-inverse-on-surface/50" aria-hidden="true" />
        </div>
      )}

      {/* Restrained dark gradient (85% black at bottom, fading to 45% near middle) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(26, 18, 13, 0.85) 0%, rgba(26, 18, 13, 0.45) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Lower-left text: 20px padding, 27px bottom padding, max 85% width */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 px-[20px] pb-[27px] flex flex-col gap-1 z-10 max-w-[85%]"
      >
        <p
          className="font-serif italic text-white font-bold leading-tight drop-shadow-xs"
          style={{ fontSize: '28px' }}
        >
          {RESTAURANT_INFO.tagline}
        </p>
        <p
          className="font-sans text-white/95 font-medium leading-snug drop-shadow-xs mt-0.5"
          style={{ fontSize: '13px' }}
        >
          Since {RESTAURANT_INFO.established} &middot; Authentic South Indian Dining
        </p>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: KitchenStatusCard
   Minimal, clean, easy-to-read status card with no text truncation.
───────────────────────────────────────────── */
const KitchenStatusCard = ({ statusMeta, etaLow }) => {
  const IconComponent = statusMeta?.icon || Flame;
  const etaRange = `${etaLow}–${etaLow + 5} min`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
      className="mx-4 relative z-20 bg-surface border border-outline-variant/70 shadow-[0_4px_14px_rgba(26,18,13,0.05)] flex items-center justify-between gap-2.5 px-3.5 py-3 sm:px-4 sm:py-3.5"
      style={{ marginTop: '-18px', borderRadius: '16px' }}
    >
      {/* Left + Middle section */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Status icon / non-color cue + dot */}
        <div className="relative shrink-0 flex items-center justify-center w-8.5 h-8.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface-variant">
          <IconComponent className="w-4 h-4 text-on-surface" aria-hidden="true" />
          <span
            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${statusMeta.dotBg}`}
            aria-hidden="true"
          />
        </div>

        {/* Labels — concise, minimal text */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-on-surface text-[14px] sm:text-[15px] leading-tight truncate">
            {statusMeta.label}
          </span>
          <span className="text-on-surface-variant font-medium text-[12px] sm:text-[13px] leading-tight mt-0.5">
            {statusMeta.subLabel}
          </span>
        </div>
      </div>

      {/* Right side: time badge */}
      <div className="shrink-0 flex items-center">
        <div
          className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl font-semibold text-[12.5px] sm:text-[13.5px] leading-none flex items-center gap-1.5 select-none ${statusMeta.badgeBg}`}
          aria-label={`Estimated preparation time: ${etaRange}`}
        >
          <Clock className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
          <span>{etaRange}</span>
        </div>
      </div>
    </motion.div>
  );
};



/* ─────────────────────────────────────────────
   Sub-component: RestaurantTrustFooter
   Brand-story content — kept at the very bottom, out of the ordering flow.
───────────────────────────────────────────── */
const RestaurantTrustFooter = ({ onOpenTrustProfile }) => (
  <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 px-4 py-6">
    <span className="text-on-surface-variant text-[12px]">
      Since {RESTAURANT_INFO.established}
    </span>
    <span className="text-on-surface-variant text-[10px]" aria-hidden="true">·</span>
    <span className="text-on-surface-variant text-[12px]">
      {restaurantConfig.parentCompanyLabel}
    </span>
    <span className="text-on-surface-variant text-[10px]" aria-hidden="true">·</span>
    <button
      onClick={onOpenTrustProfile}
      className="text-primary font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded text-[12px] cursor-pointer"
    >
      Our Story
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   Sub-component: StickyFooterBar
   Always-available "Call Waiter" + cart summary once items are added.
───────────────────────────────────────────── */
const StickyFooterBar = ({ onCallWaiter, assistanceSent, itemCount, totalAmount, onViewCart }) => (
  <div
    className="fixed left-0 bottom-0 w-full z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant px-4 pt-3"
    style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
  >
    <div className="max-w-[640px] mx-auto flex items-center gap-3">
      <button
        onClick={onCallWaiter}
        disabled={assistanceSent}
        className={`h-[48px] rounded-[14px] border border-primary/30 text-primary font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-primary-container/50 active:bg-primary-container disabled:opacity-60 transition-colors cursor-pointer ${
          itemCount > 0 ? 'px-4 shrink-0' : 'flex-1'
        }`}
      >
        <Bell className="w-4 h-4" aria-hidden="true" />
        {assistanceSent ? 'Waiter notified' : 'Call Waiter'}
      </button>

      {itemCount > 0 && (
        <button
          onClick={onViewCart}
          className="flex-1 min-w-0 h-[48px] bg-primary hover:brightness-90 text-on-primary rounded-[14px] flex items-center justify-between px-4 font-bold text-[13px] transition-colors cursor-pointer"
        >
          <span className="truncate">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatInvoiceAmount(totalAmount)}
          </span>
          <span className="flex items-center gap-1 shrink-0 ml-2">
            View Cart
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main screen component
───────────────────────────────────────────── */
const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const { addToCart, totals } = useCart();
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

  const handleAssistance = () => {
    addAssistanceRequest(tableNumber, 'GENERAL');
    setAssistanceSent(true);
    setTimeout(() => setAssistanceSent(false), 4000);
  };

  const handleAddToCartFromModal = (payload) => {
    const { dish, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(dish, formattedModifiers, specialInstruction, quantity, { selectedOptions, makeVegan, jainPreparation, allergyAlert });
    showToast(`Added customized ${dish.name} (x${quantity}) to cart`, 'success');
  };

  const totalAmount = totals.totalPayable || totals.grandTotal || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main
        className="flex-1 flex flex-col overflow-x-hidden"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
        }}
      >
        <div className="w-full mx-auto flex flex-col max-w-[640px]">
          {/* ── Restaurant Hero ── */}
          <RestaurantHero heroImage={RESTAURANT_INFO.heroImage} />

          {/* ── Content stack ── */}
          <div className="flex flex-col">
            {/* Kitchen status card (overlaps hero by ~18px) */}
            <KitchenStatusCard statusMeta={statusMeta} etaLow={etaLow} />

            {/* Primary CTA — eye-catchy brand button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/menu')}
              className="mx-4 mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-primary to-maroon-950 hover:brightness-105 active:scale-[0.985] text-on-primary font-bold transition-all shadow-[0_4px_16px_rgba(122,31,36,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 group cursor-pointer"
              style={{ height: '54px', borderRadius: '14px', fontSize: '16px' }}
            >
              <span>Explore Authentic Flavours</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-active:translate-x-1" aria-hidden="true" />
            </motion.button>

            {/* ── Top Categories section (Replaces full menu list on home screen) ── */}
            <div ref={popularSectionRef}>
              <TopCategoriesSection />
            </div>

            {/* ── Trust footer ── */}
            <RestaurantTrustFooter onOpenTrustProfile={() => setIsTrustOpen(true)} />
          </div>
        </div>
      </main>

      {/* ── Sticky bottom bar: Call Waiter + cart summary ── */}
      {!isCustomizationOpen && (
        <StickyFooterBar
          onCallWaiter={handleAssistance}
          assistanceSent={assistanceSent}
          itemCount={totals.itemCount}
          totalAmount={totalAmount}
          onViewCart={() => navigate('/cart')}
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
