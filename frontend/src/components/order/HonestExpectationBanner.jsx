import React from 'react';
import Icon from '../common/Icon';

const HonestExpectationBanner = ({ kitchenLoad, estimatedRange, isCompact = false }) => {
  if (!kitchenLoad) return null;

  // Solid, always-dark-on-light text — this card never switches to a dark
  // background, so a `dark:` text variant here would (and did) wash out to
  // pale yellow-on-yellow when the device has a dark color-scheme preference.
  const getStatusBadge = () => {
    switch (kitchenLoad.status) {
      case 'BUSY':
        return {
          bg: 'bg-warning/15 border-warning/40',
          text: 'text-on-background',
          iconBg: 'bg-warning/25',
          tagBg: 'bg-warning/30',
          icon: 'schedule',
          label: 'Kitchen is currently busy',
          statusTag: 'Busy',
        };
      case 'VERY_BUSY':
        return {
          bg: 'bg-error/15 border-error/40',
          text: 'text-on-background',
          iconBg: 'bg-error/25',
          tagBg: 'bg-error/30',
          icon: 'warning',
          label: 'Longer preparation times are expected',
          statusTag: 'Very Busy',
        };
      case 'PAUSED':
        return {
          bg: 'bg-error/25 border-error/60',
          text: 'text-on-background',
          iconBg: 'bg-error/35',
          tagBg: 'bg-error/40',
          icon: 'pause_circle',
          label: 'New food orders are temporarily paused',
          statusTag: 'Paused',
        };
      default:
        return {
          bg: 'bg-success/15 border-success/40',
          text: 'text-on-background',
          iconBg: 'bg-success/25',
          tagBg: 'bg-success/30',
          icon: 'check_circle',
          label: 'Kitchen running normally',
          statusTag: 'Normal',
        };
    }
  };

  const badge = getStatusBadge();

  if (isCompact) {
    return (
      <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 ${badge.bg} ${badge.text}`}>
        <Icon name={badge.icon} className="text-sm shrink-0" />
        <span className="truncate">{badge.label}</span>
      </div>
    );
  }

  // Single status card with one shared estimate — never show two different
  // preparation-time ranges on the same screen.
  return (
    <div className={`px-3.5 py-3 rounded-xl border flex items-center gap-3 text-xs ${badge.bg} ${badge.text}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${badge.iconBg}`}>
        <Icon name={badge.icon} className="text-xl" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-bold text-sm block leading-snug">{badge.label}</span>
        {estimatedRange ? (
          <span className="font-semibold">Expected preparation: {estimatedRange}</span>
        ) : (
          <span>Standard preparation times apply</span>
        )}
      </div>
      <span className={`shrink-0 px-2 py-1 rounded-full font-bold text-[11px] self-start ${badge.tagBg}`}>
        {badge.statusTag}
      </span>
    </div>
  );
};

export default HonestExpectationBanner;
