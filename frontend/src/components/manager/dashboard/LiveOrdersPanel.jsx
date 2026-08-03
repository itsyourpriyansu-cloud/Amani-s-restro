import React, { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { formatInvoiceAmount } from '../../../utils/formatters';
import { StatusBadge, SectionHeading, overdueLabel } from './DashboardPrimitives';

const FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'BILL_REQUESTED', label: 'Bill Requested' },
];

const ORDER_STATUS_MAP = {
  NEW: ['RECEIVED', 'ACCEPTED', 'PARTIALLY_ACCEPTED'],
  PREPARING: ['PREPARING'],
  READY: ['READY'],
  BILL_REQUESTED: ['BILL_REQUESTED'],
};

const STATUS_BADGE_TONE = {
  RECEIVED: 'primary',
  ACCEPTED: 'primary',
  PARTIALLY_ACCEPTED: 'primary',
  PREPARING: 'amber',
  READY: 'green',
  BILL_REQUESTED: 'violet',
};

const STATUS_LABEL = {
  RECEIVED: 'New',
  ACCEPTED: 'New',
  PARTIALLY_ACCEPTED: 'New',
  PREPARING: 'Preparing',
  READY: 'Ready',
  BILL_REQUESTED: 'Bill Requested',
};

const LiveOrderRow = ({ order, isDelayed, onView }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:shadow-md shadow-sm transition-all px-4 py-3.5 ${
      isDelayed ? 'border-l-[3px] border-l-amber-500' : ''
    }`}
  >
    <div className="min-w-0 space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-extrabold text-sm text-on-surface tabular-nums">Order #{order.orderId.replace('ORD-', '')}</span>
        <StatusBadge tone="neutral">Table {order.tableNumber}</StatusBadge>
        <StatusBadge tone={STATUS_BADGE_TONE[order.orderStatus] || 'neutral'}>
          {STATUS_LABEL[order.orderStatus] || order.orderStatus}
        </StatusBadge>
        {isDelayed && <StatusBadge tone="amber">{overdueLabel(order)}</StatusBadge>}
      </div>
      <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>Placed <strong className="text-on-surface font-semibold">{order.placedAt}</strong></span>
        <span>ETA <strong className="text-on-surface font-semibold">{order.estimatedReadyAt}</strong></span>
        <span>Waiter <strong className="text-on-surface font-semibold">{order.assignedWaiter}</strong></span>
      </div>
    </div>

    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
      <span className="font-mono text-sm font-bold text-primary tabular-nums">{formatInvoiceAmount(order.total)}</span>
      <button
        onClick={() => onView(order)}
        className="px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-sm text-xs font-bold text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5 shrink-0"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>View</span>
      </button>
    </div>
  </div>
);

const LiveOrdersPanel = ({ orders, delayedOrderIds, onViewOrder }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredOrders = useMemo(() => {
    if (filter === 'ALL') return orders;
    const allowed = ORDER_STATUS_MAP[filter] || [];
    return orders.filter((o) => allowed.includes(o.orderStatus));
  }, [orders, filter]);

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-card h-full">
      <SectionHeading
        title="Live Orders"
        subtitle="Kitchen and dining-floor transactions"
        count={<StatusBadge tone="primary">{orders.length} active</StatusBadge>}
      />

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
              filter === f.value ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-10 text-center text-xs text-on-surface-variant font-medium">
          No orders in this view right now.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => (
            <LiveOrderRow
              key={order.orderId}
              order={order}
              isDelayed={delayedOrderIds.has(order.orderId)}
              onView={onViewOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveOrdersPanel;
