import React from 'react';
import { ClipboardList, Clock, Receipt, AlertCircle, MessageSquareWarning, Grid3x3 } from 'lucide-react';
import { StatTile } from './DashboardPrimitives';

/* Compact single-row operational summary — the "understand state in 5 seconds" strip.
   Neutral by default; amber/red tones reserved for values that represent exceptions. */
const OperationsSummary = ({ metrics, onJump }) => {
  const items = [
    { key: 'activeOrders', icon: ClipboardList, label: 'Active Orders', value: metrics.activeOrders, tone: 'neutral' },
    { key: 'delayed', icon: Clock, label: 'Delayed', value: metrics.delayed, tone: metrics.delayed > 0 ? 'amber' : 'neutral' },
    { key: 'pendingBills', icon: Receipt, label: 'Pending Bills', value: metrics.pendingBills, tone: metrics.pendingBills > 0 ? 'amber' : 'neutral' },
    { key: 'paymentMismatch', icon: AlertCircle, label: 'Payment Mismatch', value: metrics.paymentMismatch, tone: metrics.paymentMismatch > 0 ? 'red' : 'neutral' },
    { key: 'unresolvedIssues', icon: MessageSquareWarning, label: 'Unresolved Issues', value: metrics.unresolvedIssues, tone: metrics.unresolvedIssues > 0 ? 'red' : 'neutral' },
    { key: 'occupiedTables', icon: Grid3x3, label: 'Occupied Tables', value: metrics.occupiedTables, tone: 'neutral' },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y divide-x-0 sm:divide-y-0 sm:divide-x divide-outline-variant/15">
        {items.map((item) => (
          <StatTile
            key={item.key}
            icon={item.icon}
            label={item.label}
            value={item.value}
            tone={item.tone}
            onClick={onJump ? () => onJump(item.key) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default OperationsSummary;
