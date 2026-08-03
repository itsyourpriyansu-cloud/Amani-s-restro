import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const TONE_STYLES = {
  red: { wrap: 'bg-rose-500/8', icon: 'text-rose-600', text: 'text-rose-900' },
  amber: { wrap: 'bg-amber-500/8', icon: 'text-amber-700', text: 'text-amber-900' },
  neutral: { wrap: 'bg-surface-container-low', icon: 'text-on-surface-variant', text: 'text-on-surface' },
};

/* "Needs Attention" — compact action-oriented chips, sorted by urgency.
   Zero-count exceptions are omitted entirely rather than shown as decorative KPIs. */
const ExceptionStrip = ({ exceptions, onReview }) => {
  const visible = exceptions.filter((e) => e.count > 0);

  if (visible.length === 0) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-emerald-500/8 shadow-card text-emerald-800">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="text-xs font-bold">All clear — no active exceptions right now.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider pl-0.5">Needs Attention</h2>
      <div className="flex flex-wrap gap-2.5">
        {visible.map((exc) => {
          const style = TONE_STYLES[exc.tone] || TONE_STYLES.neutral;
          const Icon = exc.icon;
          return (
            <motion.button
              key={exc.key}
              type="button"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onReview(exc.key)}
              className={`flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-xl shadow-card min-h-[52px] transition-shadow hover:shadow-md ${style.wrap}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${style.icon}`} />
              <span className={`text-xs font-bold ${style.text}`}>{exc.label}</span>
              <span className="text-[11px] font-bold text-primary px-2 py-1 rounded-lg hover:bg-primary/10">Review</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ExceptionStrip;
