import React, { useState, useMemo } from 'react';
import { StatusBadge, SectionHeading, ContextualButton } from './DashboardPrimitives';

const FILTERS = ['All', 'Available', 'Occupied', 'Preparing', 'Bill Requested', 'Reserved', 'Cleaning'];

const OCCUPIED_STATUSES = ['Dining', 'Occupied', 'Ordering'];

const matchesFilter = (status, filter) => {
  if (filter === 'All') return true;
  if (filter === 'Occupied') return OCCUPIED_STATUSES.includes(status);
  if (filter === 'Preparing') return status === 'Food Preparing';
  return status === filter;
};

const STATUS_STYLE = {
  Available: { border: 'border-t-emerald-500', tint: 'bg-emerald-500/5', badge: 'green' },
  'Bill Requested': { border: 'border-t-violet-500', tint: 'bg-violet-500/5', badge: 'violet' },
  'Food Preparing': { border: 'border-t-amber-500', tint: 'bg-amber-500/5', badge: 'amber' },
  Reserved: { border: 'border-t-blue-500', tint: 'bg-blue-500/5', badge: 'blue' },
  Cleaning: { border: 'border-t-outline-variant', tint: 'bg-surface-container-low', badge: 'neutral' },
  Dining: { border: 'border-t-primary', tint: 'bg-primary/5', badge: 'primary' },
  Occupied: { border: 'border-t-primary', tint: 'bg-primary/5', badge: 'primary' },
  Ordering: { border: 'border-t-primary', tint: 'bg-primary/5', badge: 'primary' },
};

const TableStatusCard = ({ table, onViewTable, onMarkAvailable, onReviewBill }) => {
  const style = STATUS_STYLE[table.status] || STATUS_STYLE.Occupied;

  let action = null;
  if (table.status === 'Cleaning') {
    action = <ContextualButton variant="secondary" size="sm" onClick={() => onMarkAvailable(table)} className="w-full">Mark Available</ContextualButton>;
  } else if (table.status === 'Bill Requested') {
    action = <ContextualButton variant="primary" size="sm" onClick={() => onReviewBill(table)} className="w-full">Review Bill</ContextualButton>;
  } else if (table.status === 'Reserved') {
    action = <ContextualButton variant="tertiary" size="sm" onClick={() => onViewTable(table)}>View Table</ContextualButton>;
  } else if (table.status !== 'Available') {
    action = <ContextualButton variant="tertiary" size="sm" onClick={() => onViewTable(table)}>View Table</ContextualButton>;
  }

  return (
    <div className={`rounded-2xl shadow-sm hover:shadow-md transition-shadow border-t-[3px] ${style.border} ${style.tint} p-3.5 flex flex-col justify-between gap-3 min-h-[136px]`}>
      <div>
        <div className="flex justify-between items-start gap-2">
          <span className="font-extrabold text-sm text-on-surface">Table {table.tableNumber}</span>
          <StatusBadge tone={style.badge}>{table.status}</StatusBadge>
        </div>
        <div className="text-[11px] text-on-surface-variant mt-2 space-y-0.5">
          <div>{table.guestCount || 0} guest{table.guestCount === 1 ? '' : 's'}</div>
          {table.currentOrderId && <div>Order #{table.currentOrderId.replace('ORD-', '')}</div>}
          {table.assignedWaiter && <div>Waiter {table.assignedWaiter}</div>}
          <div className="text-on-surface-variant/70">In state {table.timeInState}</div>
        </div>
      </div>
      {action && <div className="pt-1 border-t border-outline-variant/15">{action}</div>}
    </div>
  );
};

const TableStatusSection = ({ tables, onViewTable, onMarkAvailable, onReviewBill }) => {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => tables.filter((t) => matchesFilter(t.status, filter)), [tables, filter]);
  const occupiedCount = tables.filter((t) => t.status !== 'Available').length;

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-card">
      <SectionHeading
        title="Table Status"
        subtitle="Live dining-floor state and seating assignments"
        count={<span className="text-xs font-semibold text-on-surface-variant">{occupiedCount} / {tables.length} occupied</span>}
      />

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
              filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
        {filtered.map((t) => (
          <TableStatusCard
            key={t.tableId}
            table={t}
            onViewTable={onViewTable}
            onMarkAvailable={onMarkAvailable}
            onReviewBill={onReviewBill}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-8 text-center text-xs text-on-surface-variant font-medium">No tables match this filter.</div>
      )}
    </div>
  );
};

export default TableStatusSection;
