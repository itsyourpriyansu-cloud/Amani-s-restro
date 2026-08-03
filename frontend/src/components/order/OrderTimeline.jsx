import React from 'react';
import { ClipboardCheck, ChefHat, BellRing, PartyPopper, Check } from 'lucide-react';

const STAGES = [
  { id: 'received', title: 'Order Received', icon: ClipboardCheck, subtitle: 'Confirmed by our kitchen team' },
  { id: 'preparing', title: 'Preparing', icon: ChefHat, subtitle: 'Freshly cooking your dishes' },
  { id: 'ready', title: 'Ready', icon: BellRing, subtitle: 'Final plating and garnish' },
  { id: 'served', title: 'Served', icon: PartyPopper, subtitle: 'Enjoy your meal!' },
];

const OrderTimeline = ({ currentStageIndex = 1 }) => {
  return (
    <ol className="space-y-1">
      {STAGES.map((stage, idx) => {
        const isCompleted = idx < currentStageIndex;
        const isCurrent = idx === currentStageIndex;
        const isUpcoming = idx > currentStageIndex;
        const isLast = idx === STAGES.length - 1;
        const StageIcon = stage.icon;

        return (
          <li key={stage.id} className="flex gap-4" aria-current={isCurrent ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-primary text-on-primary'
                    : isCurrent
                    ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                    : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  <StageIcon className="w-[18px] h-[18px]" strokeWidth={isCurrent ? 2.5 : 2} />
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[28px] my-1 rounded-full ${
                    isCompleted ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                />
              )}
            </div>

            <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
              <div className="flex items-center gap-2 pt-1.5">
                <h3
                  className={`text-sm font-bold ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant/60'
                  }`}
                >
                  {stage.title}
                </h3>
                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                    In progress
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isUpcoming ? 'text-on-surface-variant/50' : 'text-on-surface-variant'
                }`}
              >
                {stage.subtitle}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderTimeline;
