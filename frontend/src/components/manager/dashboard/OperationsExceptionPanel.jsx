import React from 'react';
import { formatInvoiceAmount } from '../../../utils/formatters';
import { StatusBadge, ContextualButton, overdueLabel } from './DashboardPrimitives';

const TABS = [
  { value: 'DELAYED', label: 'Delayed' },
  { value: 'BILLS', label: 'Pending Bills' },
  { value: 'PAYMENTS', label: 'Payments' },
  { value: 'ISSUES', label: 'Issues' },
];

const EmptyRow = ({ label }) => (
  <div className="py-8 text-center text-xs text-on-surface-variant font-medium">{label}</div>
);

const DelayedTab = ({ orders, onViewOrder }) => (
  orders.length === 0 ? <EmptyRow label="No delayed orders." /> : (
    <div className="space-y-2.5">
      {orders.map((o) => {
        const primaryStation = o.items?.[0]?.station?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        return (
          <div key={o.orderId} className="rounded-xl bg-amber-500/8 shadow-sm p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-extrabold text-on-surface">Order #{o.orderId.replace('ORD-', '')} · Table {o.tableNumber}</span>
              <StatusBadge tone="amber">{overdueLabel(o)}</StatusBadge>
            </div>
            <div className="text-[11px] text-on-surface-variant space-y-0.5">
              <div>{o.kitchenStatus === 'IN_PROGRESS' ? 'Preparing' : o.kitchenStatus}{primaryStation ? ` · ${primaryStation}` : ''}</div>
              <div>Waiter <strong className="text-on-surface">{o.assignedWaiter}</strong></div>
              <div>Updated ETA <strong className="text-on-surface">{o.estimatedReadyAt}</strong></div>
              {o.delayReason && <div className="italic pt-0.5">Reason: {o.delayReason}</div>}
            </div>
            <ContextualButton variant="tertiary" size="sm" onClick={() => onViewOrder(o)}>View Order</ContextualButton>
          </div>
        );
      })}
    </div>
  )
);

const BillsTab = ({ bills, onViewBill }) => (
  bills.length === 0 ? <EmptyRow label="No bills waiting on payment." /> : (
    <div className="space-y-2.5">
      {bills.map((b) => (
        <div key={b.billId} className="rounded-xl bg-surface-container-low shadow-sm p-3.5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-extrabold text-on-surface">Bill #{b.billId.replace('BILL-', '')} · Table {b.tableNumber}</span>
            {b.waitingDurationMinutes > 20 && <StatusBadge tone="amber">{b.waitingDurationMinutes}m waiting</StatusBadge>}
          </div>
          <div className="text-[11px] text-on-surface-variant space-y-0.5">
            <div>Amount <strong className="text-on-surface font-mono">{formatInvoiceAmount(b.invoiceTotal)}</strong></div>
            <div>Waiting <strong className="text-on-surface">{b.waitingDurationMinutes} min</strong></div>
            <div>Assigned counter <strong className="text-on-surface">{b.assignedCounter}</strong></div>
          </div>
          <ContextualButton variant="tertiary" size="sm" onClick={() => onViewBill(b)}>View Bill</ContextualButton>
        </div>
      ))}
    </div>
  )
);

const PaymentsTab = ({ bills, onViewBill }) => (
  bills.length === 0 ? <EmptyRow label="No payment mismatches." /> : (
    <div className="space-y-2.5">
      {bills.map((b) => (
        <div key={b.billId} className="rounded-xl bg-rose-500/8 shadow-sm p-3.5 space-y-2">
          <span className="text-sm font-extrabold text-on-surface block">Bill #{b.billId.replace('BILL-', '')} · Table {b.tableNumber}</span>
          <div className="text-[11px] text-on-surface-variant space-y-0.5">
            <div>Invoice <strong className="text-on-surface font-mono">{formatInvoiceAmount(b.invoiceTotal)}</strong></div>
            <div>Recorded <strong className="text-on-surface font-mono">{formatInvoiceAmount(b.paidAmount)}</strong></div>
            <div>Difference <strong className="text-rose-700 font-mono">{formatInvoiceAmount(b.reconciliationDifference)}</strong></div>
          </div>
          <ContextualButton variant="secondary" size="sm" onClick={() => onViewBill(b)}>Review Payment</ContextualButton>
        </div>
      ))}
    </div>
  )
);

const ISSUE_TONE = { HIGH: 'red', MEDIUM: 'amber', LOW: 'neutral' };

const IssuesTab = ({ issues, onViewIssue }) => (
  issues.length === 0 ? <EmptyRow label="No unresolved issues." /> : (
    <div className="space-y-2.5">
      {issues.map((iss) => (
        <button
          key={iss.issueId}
          onClick={() => onViewIssue(iss)}
          className="w-full text-left rounded-xl bg-surface-container-low shadow-sm hover:bg-surface-container hover:shadow-md p-3.5 space-y-1.5 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-extrabold text-on-surface">#{iss.issueId} · Table {iss.tableNumber}</span>
            <StatusBadge tone={ISSUE_TONE[iss.priority] || 'neutral'}>{iss.categoryLabel}</StatusBadge>
          </div>
          <p className="text-[11px] text-on-surface-variant line-clamp-2">{iss.statusLabel || iss.status}</p>
        </button>
      ))}
    </div>
  )
);

const OperationsExceptionPanel = ({ activeTab, onTabChange, delayedOrders, pendingBills, mismatchBills, unresolvedIssues, onViewOrder, onViewBill, onViewIssue }) => {
  const counts = {
    DELAYED: delayedOrders.length,
    BILLS: pendingBills.length,
    PAYMENTS: mismatchBills.length,
    ISSUES: unresolvedIssues.length,
  };

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-card h-full flex flex-col">
      <h3 className="text-base font-bold text-on-surface mb-3">Exceptions</h3>
      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-outline-variant/20 pb-4" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={activeTab === t.value}
            onClick={() => onTabChange(t.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === t.value ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.label}
            {counts[t.value] > 0 && (
              <span className={`px-1.5 rounded-full text-[10px] ${activeTab === t.value ? 'bg-on-primary/25' : 'bg-primary/15 text-primary'}`}>
                {counts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'DELAYED' && <DelayedTab orders={delayedOrders} onViewOrder={onViewOrder} />}
        {activeTab === 'BILLS' && <BillsTab bills={pendingBills} onViewBill={onViewBill} />}
        {activeTab === 'PAYMENTS' && <PaymentsTab bills={mismatchBills} onViewBill={onViewBill} />}
        {activeTab === 'ISSUES' && <IssuesTab issues={unresolvedIssues} onViewIssue={onViewIssue} />}
      </div>
    </div>
  );
};

export default OperationsExceptionPanel;
