import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ShoppingBag,
  Clock,
  BadgePercent,
  Tag,
  Loader2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/**
 * Modernized Dynamic Promotional Coupon Bottom-Sheet Modal.
 * Dynamically adapts hero gradients, accents, coupon styling, and CTAs 
 * to match whichever offer banner card was selected by the user.
 */
const CouponTicketModal = ({ isOpen, onClose, offer, onApplyCoupon }) => {
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const { showToast } = useToast() || {};

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!offer) return null;

  // Dynamic theme accent color matching clicked offer card
  const themeColor = offer.accentColor || '#87351F';
  const heroGradient = offer.gradient || 'from-[#093527] via-[#0f5441] to-[#1bb587]';

  const handleCopy = async (e) => {
    e?.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(offer.code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = offer.code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast?.(`Coupon code "${offer.code}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleApply = (e) => {
    e?.stopPropagation();
    if (isApplying || isApplied) return;

    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
      onApplyCoupon?.(offer.code);
      showToast?.(`Coupon "${offer.code}" applied successfully!`, 'success');

      setTimeout(() => {
        setIsApplied(false);
        onClose?.();
      }, 850);
    }, 400);
  };

  // Helper to personalize savings preview banner text
  const getSavingsText = (currentOffer) => {
    if (currentOffer.title?.includes('₹150')) return 'You save ₹150 on this order';
    if (currentOffer.title?.includes('₹200')) return 'You save ₹200 on this order';
    if (currentOffer.title?.includes('20%')) return 'Instant 20% discount applied to active bill';
    if (currentOffer.title?.includes('FREE')) return 'Complimentary sweet box added to order';
    return 'Instant savings applied at checkout';
  };

  // Format minimum order display text
  const formatMinOrder = (minOrder) => {
    if (!minOrder) return '₹599 or above';
    if (minOrder.startsWith('ABOVE ')) {
      return `${minOrder.replace('ABOVE ', '')} or above`;
    }
    if (minOrder === 'NO MIN ORDER') {
      return 'No minimum order required';
    }
    return minOrder;
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-2.5 sm:p-4 overflow-hidden select-none">
          {/* Soft Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-[#1C100B]/58 backdrop-blur-md cursor-pointer"
            onClick={onClose}
            aria-label="Close offer backdrop"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coupon-offer-title"
            aria-describedby="coupon-offer-subtitle"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 45, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[calc(100%-20px)] max-w-[430px] sm:max-w-[450px] bg-[#FFF8F2] rounded-[30px] shadow-[0_24px_70px_rgba(35,18,12,0.28)] z-10 overflow-hidden my-auto mb-[calc(10px+env(safe-area-inset-bottom,0px))] sm:mb-auto max-h-[min(90dvh,760px)] flex flex-col focus:outline-none border border-[#683A28]/10"
          >
            {/* 1. HERO SECTION (Dynamic Banner Colors) */}
            <div
              className={`relative w-full p-5 sm:p-6 text-white overflow-hidden shrink-0 flex flex-col justify-between bg-gradient-to-r ${heroGradient}`}
              style={{ minHeight: '210px' }}
            >
              {/* Ambient Radial Lighting Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_70%)] pointer-events-none" />

              {/* Subtle Motifs Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Close Button */}
              <div className="absolute top-3.5 right-3.5 z-20">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close offer"
                  className="w-[36px] h-[36px] rounded-full bg-black/25 hover:bg-black/45 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-xs"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Floating Dish PNG Visual */}
              {offer.image && (
                <div className="absolute right-3.5 sm:right-4 bottom-2.5 sm:bottom-3 w-[105px] h-[105px] sm:w-[120px] sm:h-[120px] pointer-events-none z-10 flex items-center justify-center">
                  {/* Subtle Ambient Halo */}
                  <div className="absolute w-20 h-20 rounded-full bg-white/20 blur-xl pointer-events-none" />

                  {/* Floating Image */}
                  <motion.img
                    src={offer.image}
                    alt={offer.imageAlt || offer.title}
                    initial={{ scale: 0.88, rotate: -3 }}
                    animate={{ scale: 1, rotate: 0, y: [0, -4, 0] }}
                    transition={{
                      y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                      default: { duration: 0.4, ease: 'easeOut' },
                    }}
                    className="w-full h-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative z-10"
                  />
                </div>
              )}

              {/* Hero Text Content */}
              <div className="relative z-10 max-w-[63%] sm:max-w-[65%] space-y-2 pt-0.5">
                {/* Hot Deal Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase shadow-xs border border-white/30 backdrop-blur-xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{offer.badgeText || 'SPECIAL OFFER'}</span>
                </motion.div>

                {/* Primary Headline */}
                <motion.h2
                  id="coupon-offer-title"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-[28px] font-[800] leading-tight text-white tracking-tight drop-shadow-xs whitespace-nowrap"
                >
                  {offer.title}
                </motion.h2>

                {/* Supporting Subtitle */}
                <motion.p
                  id="coupon-offer-subtitle"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-[12.5px] sm:text-[13px] text-white/90 font-medium leading-snug flex items-start gap-1.5 pt-0.5"
                >
                  <BadgePercent className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>{offer.footerText || offer.subtitle}</span>
                </motion.p>
              </div>
            </div>

            {/* SCROLLABLE BODY CONTENT */}
            <div className="overflow-y-auto overscroll-contain flex-1 p-4 space-y-3">
              {/* 2. OFFER DETAILS CARD */}
              <div className="bg-white/74 rounded-[20px] p-4 border border-[#683A28]/10 shadow-xs space-y-3">
                <h3 className="text-[13px] font-semibold text-[#24130D] flex items-center gap-1.5">
                  <Tag className="w-4 h-4" style={{ color: themeColor }} />
                  <span>Offer details</span>
                </h3>

                <div className="space-y-2.5 pt-0.5">
                  {/* Benefit Row 1: Minimum order */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#DFF5EC] flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-[#087A61]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-semibold text-[#24130D]">
                        Minimum order
                      </span>
                      <span className="text-[12px] text-[#756761] font-medium">
                        {formatMinOrder(offer.minOrder)}
                      </span>
                    </div>
                  </div>

                  {/* Benefit Row 2: Valid today */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FEF3D6] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-[#D97706]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-semibold text-[#24130D]">
                        Valid today
                      </span>
                      <span className="text-[12px] text-[#756761] font-medium">
                        Online and dine-in orders
                      </span>
                    </div>
                  </div>

                  {/* Benefit Row 3: Best saving applied */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${themeColor}15` }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: themeColor }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-semibold text-[#24130D]">
                        Best saving applied
                      </span>
                      <span className="text-[12px] text-[#756761] font-medium">
                        Automatically selects maximum eligible discount
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. COUPON CODE CARD (Matching Banner Theme Color) */}
              <div
                className="bg-[#FFF8F2] border-[1.5px] border-dashed rounded-[18px] p-3.5 pl-4 flex items-center justify-between"
                style={{ borderColor: `${themeColor}40` }}
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#756761] uppercase tracking-wider">
                    Coupon code
                  </span>
                  <span
                    className="text-[22px] font-bold tracking-[0.03em] font-mono leading-tight"
                    style={{ color: themeColor }}
                  >
                    {offer.code}
                  </span>
                </div>

                {/* Copy Button */}
                <motion.button
                  type="button"
                  onClick={handleCopy}
                  whileTap={{ scale: 0.96 }}
                  className={`h-[42px] min-w-[96px] px-4 rounded-[13px] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none focus:outline-none focus:ring-2 ${
                    copied
                      ? 'bg-[#198754] text-white focus:ring-[#198754]/50'
                      : 'text-white focus:ring-black/20'
                  }`}
                  style={copied ? {} : { backgroundColor: themeColor }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
                <span className="sr-only" aria-live="polite">
                  {copied ? `Coupon code ${offer.code} copied` : ''}
                </span>
              </div>
            </div>

            {/* 4. STICKY PRIMARY ACTION AREA */}
            <div className="sticky bottom-0 bg-[#FFF8F2] px-4 pt-2 pb-[calc(16px+env(safe-area-inset-bottom,0px))] border-t border-[#683A28]/08 shadow-[0_-10px_20px_rgba(255,248,242,0.9)] space-y-2 mt-auto">
              {/* Savings Summary Preview */}
              <div className="bg-[#DFF5EC] text-[#087A61] rounded-[13px] py-2 px-3.5 flex items-center justify-center gap-2 text-[13px] font-semibold border border-[#087A61]/10">
                <Sparkles className="w-4 h-4 shrink-0 text-[#087A61]" />
                <span>{getSavingsText(offer)}</span>
              </div>

              {/* Primary Apply Button (Matching Banner Accent Color) */}
              <motion.button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                whileTap={{ scale: 0.985 }}
                className={`w-full h-[54px] rounded-[17px] font-bold text-[15px] sm:text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer border-none text-white focus:outline-none ${
                  isApplied ? 'bg-[#198754]' : ''
                } ${isApplying ? 'opacity-90 cursor-wait' : ''}`}
                style={
                  isApplied
                    ? { boxShadow: '0 10px 24px rgba(25,135,84,0.24)' }
                    : {
                        backgroundColor: themeColor,
                        boxShadow: `0 10px 24px ${themeColor}44`,
                      }
                }
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Applying…</span>
                  </>
                ) : isApplied ? (
                  <>
                    <Check className="w-5 h-5 stroke-[2.5] text-white" />
                    <span>Coupon Applied</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Apply Coupon</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CouponTicketModal;
