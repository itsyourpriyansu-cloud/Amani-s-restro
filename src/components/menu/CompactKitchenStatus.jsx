import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Slim sticky status strip that pairs with TopAppBar's table chip to form
 * one compact header block — kitchen ETA only, table info lives in TopAppBar
 * so it is never shown twice.
 */
const CompactKitchenStatus = ({ kitchenLoad }) => {
  if (!kitchenLoad) return null;

  const prepTime = kitchenLoad.averagePreparationMinutes || 20;
  const estimatedRange = `${prepTime}–${prepTime + 5} min`;
  const isBusy = kitchenLoad.status === 'BUSY' || kitchenLoad.status === 'VERY_BUSY';

  return (
    <div
      className="sticky z-30 w-full h-9 px-4 flex items-center justify-center gap-1.5 text-[12px] bg-white/95 backdrop-blur-md border-b border-[#EADFD6]"
      style={{ top: 'calc(58px + env(safe-area-inset-top))' }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isBusy ? 'bg-[#F47712]' : 'bg-[#238653]'}`}
        aria-hidden="true"
      />
      <Clock className="w-3.5 h-3.5 text-[#95867E] shrink-0" aria-hidden="true" />
      <span className="text-[#6F5F58] truncate">
        Kitchen ETA <span className="font-bold text-[#211917]">{estimatedRange}</span>
        {isBusy && <span className="text-[#B56B08] font-semibold"> · Busy</span>}
      </span>
    </div>
  );
};

export default CompactKitchenStatus;
