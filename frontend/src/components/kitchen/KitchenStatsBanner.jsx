import React from 'react';
import { Clock, ShieldAlert, BellRing, Sparkles, CheckCircle2, CookingPot } from 'lucide-react';

const isToday = (isoString) => {
  if (!isoString) return false;
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const KitchenStatsBanner = ({ orders = [], assistanceCount = 0 }) => {
  const activeOrders = orders.filter((o) => o.status !== 'served');
  const delayedCount = activeOrders.filter((o) => o.elapsedSeconds > 900 || o.isRush).length;
  const allergyCount = activeOrders.filter(
    (o) => o.specialNotes?.toLowerCase().includes('allergy') || o.items?.some((i) => i.allergyAlert)
  ).length;

  return (
    <div className="bg-white px-4 py-2 rounded-xl border border-[#E4DED8] flex flex-wrap items-center justify-between gap-4 text-xs shadow-2xs">
      <div className="flex items-center gap-4 text-[#6C625C] font-medium">
        <span>Active Work: <strong className="text-[#1E1B18] font-bold">{activeOrders.length}</strong></span>
        <span>•</span>
        {delayedCount > 0 ? (
          <span className="text-[#C93650] font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {delayedCount} Delayed
          </span>
        ) : (
          <span className="text-[#21875A] font-medium">0 Delayed</span>
        )}
        <span>•</span>
        {allergyCount > 0 ? (
          <span className="text-[#C93650] font-bold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> {allergyCount} Allergy Alerts
          </span>
        ) : (
          <span>0 Allergy Alerts</span>
        )}
      </div>

      {assistanceCount > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF4DD] text-[#D98B16] font-bold text-xs border border-[#D98B16]/30">
          <BellRing className="w-3.5 h-3.5" />
          <span>{assistanceCount} Pending Floor Request{assistanceCount === 1 ? '' : 's'}</span>
        </div>
      )}
    </div>
  );
};

export default KitchenStatsBanner;
