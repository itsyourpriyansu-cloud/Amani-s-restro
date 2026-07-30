import React, { useState } from 'react';
import { Percent, Copy, Check, X, Sparkles, Tag, ShieldCheck, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/**
 * Authentic Ticket-shaped detailed Coupon Dialog Box.
 * Features semicircular side cutouts, perforated dashed line, copy code option, and apply CTA.
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Backdrop overlay click trigger */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close offer details"
      />

      {/* Ticket Container */}
      <div className="relative w-full max-w-[360px] sm:max-w-[390px] bg-white rounded-[26px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 z-10 overflow-hidden border border-amber-900/15 my-auto">
        
        {/* Semicircular Ticket Notch Cutouts */}
        <div className="absolute left-[-12px] top-[54%] -translate-y-1/2 w-6 h-6 rounded-full bg-black/65 z-30 shadow-inner" />
        <div className="absolute right-[-12px] top-[54%] -translate-y-1/2 w-6 h-6 rounded-full bg-black/65 z-30 shadow-inner" />

        {/* Top Ticket Header Banner */}
        <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-amber-950 p-6 text-white text-center relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

          {/* Close Trigger Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Scalloped Offer Badge Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 mx-auto flex items-center justify-center shadow-lg mb-3">
            <Percent className="w-7 h-7 stroke-[2.5]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-2 border border-amber-400/30">
            {offer.badgeText || 'SPECIAL OFFER'}
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight text-white">
            {offer.title}
          </h2>

          <p className="text-xs text-amber-100/90 font-medium mt-1.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{offer.footerText || 'Exclusive Mangamma Ruchulu Deal'}</span>
          </p>
        </div>

        {/* Middle Offer Terms & Benefits Details */}
        <div className="p-5 space-y-3.5 bg-amber-50/30">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-maroon-800" />
            <span>Offer Details & Terms</span>
          </div>

          <ul className="space-y-2 text-xs text-gray-700 font-medium">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Minimum spend requirement: <strong>{offer.minOrder}</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Valid on all online & dine-in orders today</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tertiary shrink-0" />
              <span>Cannot be combined with other ongoing vouchers</span>
            </li>
          </ul>
        </div>

        {/* Ticket Perforated Dashed Line Divider */}
        <div className="relative px-6 py-1 bg-white">
          <div className="w-full border-b-2 border-dashed border-gray-300" />
        </div>

        {/* Bottom Ticket Code & Action Stub */}
        <div className="p-5 pt-3 bg-white space-y-3.5">
          {/* Coupon Code Block */}
          <div className="bg-amber-500/10 border-2 border-dashed border-maroon-800/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                COUPON CODE
              </span>
              <span className="text-lg font-black text-maroon-900 tracking-wider font-mono">
                {offer.code}
              </span>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-maroon-900 text-white hover:bg-maroon-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
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

          {/* Primary Apply CTA */}
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3.5 px-4 rounded-xl bg-maroon-900 hover:bg-maroon-950 text-white font-extrabold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply Coupon to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponTicketModal;
