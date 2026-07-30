import React from 'react';
import { formatWholeRupees } from '../../../utils/couponFormatting';

const StatCard = ({ title, value, subtitle, source, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className="text-left p-4 bg-surface rounded-2xl border border-outline-variant/30 shadow-xs space-y-0.5 disabled:cursor-default hover:border-outline-variant transition-colors"
  >
    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">{title}</p>
    <p className="text-2xl font-bold text-primary leading-tight">{value}</p>
    {subtitle && <p className="text-[11px] text-on-surface-variant">{subtitle}</p>}
    {source && <p className="text-[10px] text-on-surface-variant/70">{source}</p>}
  </button>
);

const CouponStatsOverview = ({ stats, onDrillDown }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <StatCard
      title="Total Coupons Claimed"
      value={stats.totalClaimed}
      subtitle="This month"
      source="Source: Coupon requests"
      onClick={() => onDrillDown('ALL')}
    />
    <StatCard
      title="Active Coupons"
      value={stats.active}
      subtitle={stats.expiringSoon > 0 ? `${stats.expiringSoon} expiring soon` : undefined}
      onClick={() => onDrillDown('ACTIVE')}
    />
    <StatCard
      title="Redeemed Coupons"
      value={stats.redeemed}
      subtitle={stats.issuedCount > 0 ? `${stats.redemptionRatePct}% of issued coupons` : undefined}
      onClick={() => onDrillDown('REDEEMED')}
    />
    <StatCard
      title="Attributed Revenue"
      value={formatWholeRupees(stats.attributedRevenuePaise, { fromPaise: true })}
      subtitle="From orders where a redeemed coupon was applied"
      source="Source: Completed paid orders linked to redeemed coupons"
    />
  </div>
);

export default CouponStatsOverview;
