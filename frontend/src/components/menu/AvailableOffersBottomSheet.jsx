import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Percent, Check, X, Sparkles, Tag, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatInvoiceAmount } from '../../utils/formatters';

export const AVAILABLE_OFFERS = [
  {
    id: 'offer-1',
    code: 'AMANI10',
    title: '10% OFF on All Orders',
    description: 'Get 10% instant discount on order subtotal above ₹199',
    discountPercent: 10,
    minOrderValue: 199,
    minOrderDisplay: '₹199',
    badgeText: 'MOST POPULAR',
    badgeClass: 'bg-primary text-on-primary',
  },
  {
    id: 'offer-2',
    code: 'AMANI20',
    title: '20% OFF Feast Deal',
    description: 'Save 20% on orders above ₹499',
    discountPercent: 20,
    minOrderValue: 499,
    minOrderDisplay: '₹499',
    badgeText: 'MEGA SAVINGS',
    badgeClass: 'bg-success text-on-success',
  },
  {
    id: 'offer-3',
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF First Order',
    description: 'Flat ₹50 discount for new dining guests on orders above ₹299',
    flatDiscount: 50,
    minOrderValue: 299,
    minOrderDisplay: '₹299',
    badgeText: 'NEW GUEST',
    badgeClass: 'bg-amber-600 text-white',
  },
  {
    id: 'offer-4',
    code: 'BIRYANILOVE15',
    title: '15% OFF Biryanis & Thalis',
    description: 'Special 15% discount on signature items for subtotal above ₹349',
    discountPercent: 15,
    minOrderValue: 349,
    minOrderDisplay: '₹349',
    badgeText: 'CHEF SPECIAL',
    badgeClass: 'bg-tertiary text-on-tertiary',
  },
];

/**
 * Bottom Pop-Up Sheet for Available Offers & Coupons.
 * Allows users to view, validate, and 1-tap apply coupons in real time.
 */
const AvailableOffersBottomSheet = ({
  isOpen,
  onClose,
  subtotal = 0,
  appliedPromo = null,
  onApplyOffer,
  onRemoveOffer,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
        {/* Backdrop click trigger */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={onClose}
          aria-label="Close available offers"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-surface border border-outline-variant/70 rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col text-on-surface mb-0 sm:mb-auto"
        >
          {/* Mobile Grab Handle */}
          <div className="w-12 h-1 bg-outline-variant/80 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-outline-variant/60 flex items-center justify-between gap-3 shrink-0 bg-surface">
            <h3 className="text-base font-extrabold text-on-surface leading-tight">
              Available Offers & Coupons
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-outline-variant/60"
              aria-label="Close offers pop-up"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal Indicator Bar */}
          <div className="px-5 py-2.5 bg-surface-container-lowest border-b border-outline-variant/40 flex items-center justify-between text-xs font-semibold shrink-0">
            <span className="text-on-surface-variant">Cart Subtotal:</span>
            <span className="text-primary font-extrabold text-sm">{formatInvoiceAmount(subtotal)}</span>
          </div>

          {/* Scrollable Coupon Cards List — pb-32 prevents any overlap with bottom nav bar */}
          <div className="p-4 sm:p-5 pb-32 sm:pb-8 overflow-y-auto space-y-3.5 no-scrollbar flex-1">
            {AVAILABLE_OFFERS.map((offer) => {
              const isApplied = appliedPromo?.code === offer.code;
              const isEligible = subtotal >= offer.minOrderValue;
              const shortfall = offer.minOrderValue - subtotal;

              return (
                <div
                  key={offer.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col gap-3 ${
                    isApplied
                      ? 'bg-success/8 border-success/40 shadow-xs'
                      : isEligible
                      ? 'bg-surface-container-lowest border-outline-variant/70 shadow-2xs hover:border-primary/40'
                      : 'bg-surface-container-low/60 border-outline-variant/40 opacity-80'
                  }`}
                >
                  {/* Top Badge & Coupon Code */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${offer.badgeClass}`}>
                        {offer.badgeText}
                      </span>
                    </div>

                    {/* Dashed Code Box */}
                    <div className="px-2.5 py-1 rounded-lg bg-surface border border-dashed border-primary/40 font-mono text-xs font-extrabold text-primary tracking-wider">
                      {offer.code}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-[14px] font-extrabold text-on-surface leading-tight">
                      {offer.title}
                    </h4>
                    <p className="text-[12px] text-on-surface-variant font-medium mt-1 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Footer Actions & Eligibility */}
                  <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-medium text-on-surface-variant">
                      {isEligible ? (
                        <span className="text-success font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Order qualifies for this deal
                        </span>
                      ) : (
                        <span className="text-error font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Add {formatInvoiceAmount(shortfall)} more to unlock
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    {isApplied ? (
                      <button
                        type="button"
                        onClick={() => onRemoveOffer && onRemoveOffer()}
                        className="px-3.5 py-1.5 rounded-xl bg-success text-on-success text-xs font-extrabold flex items-center gap-1 shadow-2xs cursor-pointer hover:brightness-95 transition-all"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Applied</span>
                      </button>
                    ) : isEligible ? (
                      <button
                        type="button"
                        onClick={() => onApplyOffer && onApplyOffer(offer)}
                        className="px-4 py-1.5 rounded-xl bg-primary hover:brightness-90 text-on-primary text-xs font-extrabold shadow-2xs cursor-pointer active:scale-95 transition-all"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface-variant text-[11px] font-bold cursor-not-allowed border border-outline-variant/60"
                      >
                        Min {offer.minOrderDisplay}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AvailableOffersBottomSheet;
