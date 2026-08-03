import React, { useState } from 'react';
import { Copy, Check, X, Sparkles, Tag, ShieldCheck, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/**
 * Authentic Ticket-shaped detailed Coupon Dialog Box.
 * Features semicircular side cutouts, perforated dashed line, copy code option, floating dish image, and apply CTA.
 */
const CouponTicketModal = ({ isOpen, onClose, offer, onApplyCoupon }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !offer) return null;

  const handleCopy = (e) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(offer.code);
    setCopied(true);
    showToast?.(`Coupon code "${offer.code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApply = () => {
    handleCopy();
    if (onApplyCoupon) {
      onApplyCoupon(offer.code);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay click trigger */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close offer details"
      />

      {/* Ticket Container */}
      <div className="relative w-full max-w-[360px] sm:max-w-[390px] bg-surface rounded-[28px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-250 z-10 overflow-hidden border border-outline-variant/30 my-auto">
        
        {/* Semicircular Ticket Notch Cutouts */}
        <div className="absolute left-[-13px] top-[56%] -translate-y-1/2 w-6 h-6 rounded-full bg-black/70 z-30 shadow-inner" />
        <div className="absolute right-[-13px] top-[56%] -translate-y-1/2 w-6 h-6 rounded-full bg-black/70 z-30 shadow-inner" />

        {/* Top Header Banner matching clicked Offer Theme */}
        <div className={`bg-gradient-to-r ${offer.gradient || 'from-[#4a1805] via-[#78350f] to-[#d97706]'} p-6 pt-7 text-white text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[190px]`}>
          
          {/* Ambient Lighting Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.22),transparent_70%)] pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer z-20 backdrop-blur-xs border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Floating Dish PNG Cutout (Imagery from clicked Banner) */}
          {offer.image && (
            <div className="relative w-28 h-24 mb-2 flex items-center justify-center pointer-events-none">
              <div className="absolute w-24 h-24 rounded-full bg-white/15 blur-md" />
              <img
                src={offer.image}
                alt={offer.title}
                className="max-h-full w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] transform rotate-[-2deg] scale-110"
              />
            </div>
          )}

          {/* Badge Tag */}
          <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest mb-1.5 border border-white/30 backdrop-blur-xs shadow-xs">
            {offer.badgeText || 'SPECIAL OFFER'}
          </span>

          {/* Title */}
          <h2 className="text-2xl font-extrabold leading-tight text-white tracking-tight drop-shadow-sm">
            {offer.title}
          </h2>

          {/* Subtitle / Footer Perk */}
          <p className="text-xs text-white/90 font-medium mt-1 flex items-center justify-center gap-1.5 max-w-[280px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{offer.footerText || offer.subtitle}</span>
          </p>
        </div>

        {/* Middle Offer Terms & Benefits Details */}
        <div className="p-5 space-y-3 bg-surface-container/40 dark:bg-zinc-900/50">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant/70 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>Offer Details & Terms</span>
          </div>

          <ul className="space-y-2 text-xs text-on-surface/85 font-medium">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              <span>Minimum order requirement: <strong className="text-on-surface font-extrabold">{offer.minOrder}</strong></span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Valid on all online & dine-in orders today</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Auto-applies maximum savings to your active bill</span>
            </li>
          </ul>
        </div>

        {/* Ticket Perforated Dashed Line Divider */}
        <div className="relative px-6 py-1 bg-surface">
          <div className="w-full border-b-2 border-dashed border-outline-variant/40" />
        </div>

        {/* Bottom Ticket Code & Action Section */}
        <div className="p-5 pt-3 bg-surface space-y-3.5">
          {/* Dotted Coupon Code Block */}
          <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant/70">
                COUPON CODE
              </span>
              <span className="text-xl font-black text-primary tracking-widest font-mono">
                {offer.code}
              </span>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs ${
                copied
                  ? 'bg-success text-on-success'
                  : 'bg-primary text-on-primary hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Apply CTA Button */}
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:opacity-95 text-on-primary font-extrabold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Apply Coupon to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponTicketModal;

