import React from 'react';
import { TicketCheck, TicketPlus } from 'lucide-react';

const CouponPageHeader = ({ updatedAtLabel, onRedeemClick, onCreateClick, canCreate }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
          {updatedAtLabel}
        </span>
        <span className="text-[11px] font-bold text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded">
          Prototype Data
        </span>
      </div>
      <h1 className="text-[28px] font-bold text-on-surface leading-tight">Coupon & Loyalty Management</h1>
      <p className="text-sm text-on-surface-variant mt-1">
        Track, validate and manage WhatsApp milestone coupons issued to returning guests.
      </p>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {canCreate && (
        <button
          onClick={onCreateClick}
          title="Create and issue a custom coupon directly"
          className="h-12 px-4 rounded-xl bg-surface text-primary font-bold text-sm flex items-center gap-2 border border-primary/30 hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <TicketPlus className="w-4.5 h-4.5" />
          Create Coupon
        </button>
      )}
      <button
        onClick={onRedeemClick}
        title="Validate and mark an eligible coupon as redeemed"
        className="h-12 px-5 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center gap-2 shadow hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        <TicketCheck className="w-4.5 h-4.5" />
        Redeem Coupon
      </button>
    </div>
  </div>
);

export default CouponPageHeader;
