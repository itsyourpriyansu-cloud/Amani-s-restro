import React from 'react';
import { History } from 'lucide-react';

const CouponAuditTimeline = ({ entries = [] }) => (
  <div className="space-y-1.5">
    <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
      <History className="w-3.5 h-3.5" />
      Audit History
    </h4>
    <div className="text-xs text-on-surface bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 space-y-2">
      {entries.length === 0 && <p className="text-on-surface-variant">No audit entries yet.</p>}
      {entries.map((entry, idx) => (
        <div key={idx} className="flex gap-2 text-[11px] border-l-2 border-primary/30 pl-2">
          <span className="text-on-surface-variant font-mono shrink-0">{entry.time}</span>
          <span>{entry.text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CouponAuditTimeline;
