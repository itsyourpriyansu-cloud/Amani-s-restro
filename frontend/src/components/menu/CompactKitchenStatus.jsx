import React from 'react';
import { Clock, Flame, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Compact marquee status strip that attaches directly to TopAppBar.
 * Features infinite marquee scrolling text displaying live Kitchen ETA, preparation status,
 * and brand trust assurances.
 */
const CompactKitchenStatus = ({ kitchenLoad }) => {
  const prepTime = kitchenLoad?.averagePreparationMinutes || 20;
  const estimatedRange = `${prepTime}–${prepTime + 5} min`;
  const isBusy = kitchenLoad?.status === 'BUSY' || kitchenLoad?.status === 'VERY_BUSY';

  const marqueeItems = (
    <div className="flex items-center gap-6 shrink-0">
      {/* Item 1: Kitchen ETA */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${isBusy ? 'bg-warning animate-pulse' : 'bg-success'}`}
          aria-hidden="true"
        />
        <Clock className="w-3.5 h-3.5 text-on-surface-variant" aria-hidden="true" />
        <span>
          Kitchen ETA <strong className="text-on-surface font-extrabold">{estimatedRange}</strong>
          {isBusy && <span className="text-warning font-bold ml-1">· Busy Queue</span>}
        </span>
      </div>

      <span className="text-outline-variant">·</span>

      {/* Item 2: Fresh Preparation */}
      <div className="flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
        <span>Authentic Stone-Ground Spices & Fresh Preparation</span>
      </div>

      <span className="text-outline-variant">·</span>

      {/* Item 3: Verified Quality */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-success" aria-hidden="true" />
        <span>100% Quality & Hygiene Standards</span>
      </div>

      <span className="text-outline-variant">·</span>

      {/* Item 4: Live Kitchen */}
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-highlight" aria-hidden="true" />
        <span>Freshly Cooked On Order</span>
      </div>

      <span className="text-outline-variant">·</span>
    </div>
  );

  return (
    <div
      className="w-full h-7 bg-surface backdrop-blur-md border-b border-outline-variant/60 flex items-center overflow-hidden relative select-none text-[11.5px] font-medium text-on-surface-variant"
      title="Live Kitchen Status & Standards"
    >
      {/* Left/Right Subtle Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

      {/* Infinite Marquee Track (Repeated twice for seamless loop) */}
      <div className="animate-marquee flex items-center">
        {marqueeItems}
        {marqueeItems}
      </div>
    </div>
  );
};

export default CompactKitchenStatus;
