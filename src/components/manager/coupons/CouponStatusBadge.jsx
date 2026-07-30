import React from 'react';
import { CheckCircle2, Clock, Ban, XCircle, HelpCircle, Ticket } from 'lucide-react';
import { couponStatusTheme } from '../../../constants/coupons';

const STATUS_ICON = {
  ACTIVE: CheckCircle2,
  EXPIRING_SOON: Clock,
  REDEEMED: Ticket,
  EXPIRED: XCircle,
  REVOKED: Ban,
  AWAITING_REVIEW: HelpCircle,
  DECLINED: XCircle,
};

/** Status is always communicated via icon + text label, never colour alone. */
const CouponStatusBadge = ({ status }) => {
  const theme = couponStatusTheme[status];
  const StatusIcon = STATUS_ICON[status] || HelpCircle;
  if (!theme) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border"
      style={{ color: theme.text, backgroundColor: theme.background, borderColor: theme.border }}
    >
      <StatusIcon className="w-3 h-3" />
      {theme.label}
    </span>
  );
};

export default CouponStatusBadge;
