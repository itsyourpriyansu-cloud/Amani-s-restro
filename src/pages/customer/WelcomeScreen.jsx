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
import TopAppBar from '../../components/layout/TopAppBar';
import TopCategoriesSection from '../../components/home/TopCategoriesSection';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import CustomizationModal from '../../components/menu/CustomizationModal';
import { ArrowRight, Bell, Search, UtensilsCrossed } from 'lucide-react';

/* ─────────────────────────────────────────────
   Kitchen status metadata
───────────────────────────────────────────── */
const KITCHEN_STATUS_META = {
  NORMAL: { label: 'Kitchen running smoothly', dot: 'bg-emerald-600' },
  BUSY: { label: 'Kitchen moderately busy', dot: 'bg-[#B56B08]' },
  VERY_BUSY: { label: 'Kitchen very busy right now', dot: 'bg-red-600' },
  PAUSED: { label: 'Kitchen has paused new orders briefly', dot: 'bg-red-600' },
};



/* ─────────────────────────────────────────────
   Sub-component: RestaurantHero
   Compact hero — native name + tagline only.
   English name lives once, in the sticky header above.
───────────────────────────────────────────── */
const RestaurantHero = ({ heroImage }) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#201714]"
      style={{ height: 'clamp(150px, 40vw, 180px)' }}
    >
      {!heroImgFailed ? (
        <img
          src={heroImage}
          alt="Mangamma Ruchulu restaurant interior — warm dining room with hanging lights"
          fetchpriority="high"
          loading="eager"
          onError={() => setHeroImgFailed(true)}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 48%' }}
        />
      ) : (
        <div className="w-full h-full bg-[#201714] flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-[#95847C]" aria-hidden="true" />
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(22, 12, 9, 0.82) 0%, rgba(22, 12, 9, 0.48) 36%, rgba(22, 12, 9, 0.08) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 px-4 pb-9 flex flex-col gap-1 z-10"
        style={{ maxWidth: '90%' }}
      >
        <p
          className="font-telugu text-white font-semibold leading-tight drop-shadow-xs"
          style={{ fontSize: '19px' }}
          lang="te"
        >
          {RESTAURANT_INFO.nativeName}
        </p>
        <p className="text-white/90 font-medium leading-snug drop-shadow-xs" style={{ fontSize: '13px' }}>
          {RESTAURANT_INFO.tagline}
        </p>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: KitchenStatusStrip
   Single-line kitchen status card. Table info lives once, in the header chip.
───────────────────────────────────────────── */
const KitchenStatusStrip = ({ statusMeta, etaLow }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
    className="mx-4 relative z-20 bg-white border border-[#EADFD6] shadow-[0_8px_24px_rgba(63,34,23,0.07)] flex items-center gap-2.5"
    style={{ marginTop: '-18px', padding: '14px 16px', borderRadius: '18px' }}
  >
    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusMeta.dot}`} aria-hidden="true" />
    <p className="text-[13.5px] leading-snug min-w-0 truncate">
      <span className="font-bold text-[#211917]">{statusMeta.label}</span>
      <span className="text-[#705F58] font-medium"> · {etaLow}–{etaLow + 5} min prep</span>
    </p>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Sub-component: SearchBarShortcut
   Search shortcut button leading into the menu page.
───────────────────────────────────────────── */
const SearchBarShortcut = ({ onSearchClick }) => (
  <div className="px-4 mt-5">
    <button
      type="button"
      onClick={onSearchClick}
      className="relative w-full h-[46px] rounded-[14px] bg-white border border-[#EADFD6] flex items-center pl-11 pr-4 text-left text-[13.5px] text-[#95867E] shadow-2xs hover:bg-[#FFF7EE] active:bg-[#FFF7EE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 cursor-pointer"
      aria-label="Search the menu"
    >
      <Search className="absolute left-3.5 w-[18px] h-[18px] text-[#95867E]" aria-hidden="true" />
      Search dishes, curries or biryanis
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   Sub-component: RestaurantTrustFooter
   Brand-story content — kept at the very bottom, out of the ordering flow.
───────────────────────────────────────────── */
const RestaurantTrustFooter = ({ onOpenTrustProfile }) => (
  <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 px-4 py-6">
    <span className="text-[#95847C] text-[12px]">
      Since {RESTAURANT_INFO.established}
    </span>
    <span className="text-[#95847C] text-[10px]" aria-hidden="true">·</span>
    <span className="text-[#95847C] text-[12px]">
      {restaurantConfig.parentCompanyLabel}
    </span>
    <span className="text-[#95847C] text-[10px]" aria-hidden="true">·</span>
    <button
      onClick={onOpenTrustProfile}
      className="text-[#A30F3B] font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] rounded text-[12px] cursor-pointer"
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
    className="fixed left-0 bottom-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-[#EADFD6] px-4 pt-3"
    style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
  >
    <div className="max-w-[640px] mx-auto flex items-center gap-3">
      <button
        onClick={onCallWaiter}
        disabled={assistanceSent}
        className={`h-[48px] rounded-[14px] border border-[#A30F3B]/30 text-[#A30F3B] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#FBECEF]/50 active:bg-[#FBECEF] disabled:opacity-60 transition-colors cursor-pointer ${
          itemCount > 0 ? 'px-4 shrink-0' : 'flex-1'
        }`}
      >
        <Bell className="w-4 h-4" aria-hidden="true" />
        {assistanceSent ? 'Waiter notified' : 'Call Waiter'}
      </button>

      {itemCount > 0 && (
        <button
          onClick={onViewCart}
          className="flex-1 min-w-0 h-[48px] bg-[#A30F3B] hover:bg-[#7E0D2F] text-white rounded-[14px] flex items-center justify-between px-4 font-bold text-[13px] transition-colors cursor-pointer"
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
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <TopAppBar
        variant="brand"
        logoSrc={null}
        onOpenTrustProfile={() => setIsTrustOpen(true)}
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main
        className="flex-1 flex flex-col overflow-x-hidden"
        style={{
          paddingTop: 'calc(58px + env(safe-area-inset-top))',
          paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
        }}
      >
        <div className="w-full mx-auto flex flex-col max-w-[640px]">
          {/* ── Restaurant Hero ── */}
          <RestaurantHero heroImage={RESTAURANT_INFO.heroImage} />

          {/* ── Content stack ── */}
          <div className="flex flex-col">
            {/* Kitchen status strip (overlaps hero by ~18px) — table number lives only in the header chip */}
            <KitchenStatusStrip statusMeta={statusMeta} etaLow={etaLow} />

            {/* Primary CTA — dominant orange button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/menu')}
              className="mx-4 mt-5 flex items-center justify-center gap-2 bg-[#F47712] hover:bg-[#DB5F05] active:bg-[#DB5F05] text-white font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 group cursor-pointer"
              style={{ height: '54px', borderRadius: '14px', fontSize: '16px' }}
            >
              Browse Menu
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-active:translate-x-1" aria-hidden="true" />
            </motion.button>

            {/* ── Search shortcut ── */}
            <SearchBarShortcut onSearchClick={() => navigate('/menu', { state: { focusSearch: true } })} />

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
