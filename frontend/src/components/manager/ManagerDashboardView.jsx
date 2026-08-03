import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../../context/OrderContext';
import {
  INITIAL_PROTOTYPE_ORDERS,
  INITIAL_PROTOTYPE_TABLES,
  INITIAL_PROTOTYPE_BILLS,
  INITIAL_PROTOTYPE_EMPLOYEES,
  INITIAL_PROTOTYPE_AUDIT_LOGS,
} from '../../data/restaurantPrototypeData';
import { formatInvoiceAmount } from '../../utils/formatters';
import ActionConfirmationModal from '../common/ActionConfirmationModal';
import { CheckCircle, X, ShieldAlert, AlertCircle, Clock, Receipt, PackageX } from 'lucide-react';

import OperationsPageHeader from './dashboard/OperationsPageHeader';
import OperationsSummary from './dashboard/OperationsSummary';
import ExceptionStrip from './dashboard/ExceptionStrip';
import LiveOrdersPanel from './dashboard/LiveOrdersPanel';
import OperationsExceptionPanel from './dashboard/OperationsExceptionPanel';
import TableStatusSection from './dashboard/TableStatusSection';
import AvailabilityStaffSection from './dashboard/AvailabilityStaffSection';
import CustomerIssuesSection from './dashboard/CustomerIssuesSection';
import GuestOperationsSection from './dashboard/GuestOperationsSection';
import { OperationalDrawer, DetailRow, StatusBadge, ContextualButton } from './dashboard/DashboardPrimitives';

const ManagerDashboardView = ({ onNavigateTab }) => {
  const {
    issuesList,
    updateIssueWorkflow,
    kitchenLoad,
    updateKitchenLoadStatus,
    feedbacksList,
    updateFeedbackStatus,
    ugcSubmissions,
    removalRequests,
    updateRemovalRequestStatus,
    customerMembership,
  } = useOrder();

  const [lastUpdated, setLastUpdated] = useState('7:24 PM');
  const [orders] = useState(INITIAL_PROTOTYPE_ORDERS);
  const [tables, setTables] = useState(INITIAL_PROTOTYPE_TABLES);
  const [bills] = useState(INITIAL_PROTOTYPE_BILLS);
  const [employees] = useState(INITIAL_PROTOTYPE_EMPLOYEES);
  const [, setAuditLogs] = useState(INITIAL_PROTOTYPE_AUDIT_LOGS);
  const [outOfStockItems] = useState([
    { id: 'cveg-gobi-65', name: 'Gobi 65', category: 'Chinese Veg Starters', state: 'Temporarily Unavailable', lastUpdated: '6:45 PM', updatedBy: 'Chef Arjun Rao' },
    { id: 'dessert-carrot-halwa', name: 'Carrot Halwa', category: 'Desserts', state: 'Limited', lastUpdated: '6:30 PM', updatedBy: 'Sneha Patel' },
    { id: 'cveg-crispy-corn', name: 'Crispy Corn Kernel', category: 'Chinese Veg Starters', state: 'Sold Out', lastUpdated: '5:50 PM', updatedBy: 'Chef Arjun Rao' },
  ]);

  const [notificationBanner, setNotificationBanner] = useState('');
  const [exceptionTab, setExceptionTab] = useState('DELAYED');
  const [drawer, setDrawer] = useState(null); // { type: 'order'|'table'|'bill'|'issue'|'feedback', data }
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, title: '', affectedRecord: '', consequenceExplanation: '', requiredPermission: '', confirmAction: null, reasons: [] });

  const liveOpsGridRef = useRef(null);
  const tableSectionRef = useRef(null);
  const stockSectionRef = useRef(null);
  const customerIssuesRef = useRef(null);

  const notify = (message) => {
    setNotificationBanner(message);
    setTimeout(() => setNotificationBanner(''), 3000);
  };

  const scrollToRef = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleJump = (key) => {
    if (['DELAYED', 'delayed'].includes(key)) { setExceptionTab('DELAYED'); scrollToRef(liveOpsGridRef); }
    else if (['BILLS', 'pendingBills'].includes(key)) { setExceptionTab('BILLS'); scrollToRef(liveOpsGridRef); }
    else if (['PAYMENTS', 'paymentMismatch'].includes(key)) { setExceptionTab('PAYMENTS'); scrollToRef(liveOpsGridRef); }
    else if (key === 'activeOrders') { scrollToRef(liveOpsGridRef); }
    else if (['ISSUES', 'unresolvedIssues'].includes(key)) { scrollToRef(customerIssuesRef); }
    else if (key === 'STOCK') { scrollToRef(stockSectionRef); }
    else if (key === 'occupiedTables') { scrollToRef(tableSectionRef); }
  };

  const handleRefreshData = () => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(timeStr);
    notify(`Operational data refreshed at ${timeStr}`);
  };

  // --- Derived, bug-corrected operational state -----------------------------------
  // Completed orders never belong in the active/delayed views, even if their elapsed
  // time would otherwise look "overdue" in the raw prototype data.
  const activeOrders = useMemo(() => orders.filter((o) => o.orderStatus !== 'COMPLETED'), [orders]);
  const delayedOrders = useMemo(() => activeOrders.filter((o) => o.isDelayed || o.elapsedMinutes > 30), [activeOrders]);
  const delayedOrderIds = useMemo(() => new Set(delayedOrders.map((o) => o.orderId)), [delayedOrders]);
  const pendingBills = useMemo(() => bills.filter((b) => b.status === 'PENDING_PAYMENT'), [bills]);
  const mismatchBills = useMemo(() => bills.filter((b) => b.paymentStatus === 'MISMATCH'), [bills]);
  const billsWaitingOver20 = useMemo(() => bills.filter((b) => b.status !== 'PAID' && (b.waitingDurationMinutes || 0) > 20), [bills]);
  const unresolvedIssues = useMemo(() => issuesList.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'), [issuesList]);
  const highPriorityIssues = useMemo(() => unresolvedIssues.filter((i) => i.priority === 'HIGH'), [unresolvedIssues]);

  const metrics = {
    activeOrders: activeOrders.length,
    delayed: delayedOrders.length,
    pendingBills: pendingBills.length,
    paymentMismatch: mismatchBills.length,
    unresolvedIssues: unresolvedIssues.length,
    occupiedTables: `${tables.filter((t) => t.status !== 'Available').length} / ${tables.length}`,
  };

  const exceptions = [
    { key: 'ISSUES', icon: ShieldAlert, tone: 'red', count: highPriorityIssues.length, label: `${highPriorityIssues.length} high-priority customer issue${highPriorityIssues.length === 1 ? '' : 's'}` },
    { key: 'PAYMENTS', icon: AlertCircle, tone: 'red', count: mismatchBills.length, label: `${mismatchBills.length} payment mismatch${mismatchBills.length === 1 ? '' : 'es'}` },
    { key: 'DELAYED', icon: Clock, tone: 'amber', count: delayedOrders.length, label: `${delayedOrders.length} delayed order${delayedOrders.length === 1 ? '' : 's'}` },
    { key: 'BILLS', icon: Receipt, tone: 'amber', count: billsWaitingOver20.length, label: `${billsWaitingOver20.length} bill${billsWaitingOver20.length === 1 ? '' : 's'} waiting over 20 minutes` },
    { key: 'STOCK', icon: PackageX, tone: 'neutral', count: outOfStockItems.length, label: `${outOfStockItems.length} out-of-stock item${outOfStockItems.length === 1 ? '' : 's'}` },
  ];

  // --- Table actions ---------------------------------------------------------------
  const openDrawer = (type, data) => setDrawer({ type, data });
  const closeDrawer = () => setDrawer(null);

  const findBillForTable = (table) => bills.find((b) => b.tableNumber === table.tableNumber);

  const handleMarkAvailable = (table) => {
    setTables((prev) => prev.map((t) => (t.tableId === table.tableId ? { ...t, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null, timeInState: '0m' } : t)));
    notify(`Table ${table.tableNumber} marked available.`);
  };

  const handleReviewBill = (table) => {
    const bill = findBillForTable(table);
    openDrawer(bill ? 'bill' : 'table', bill || table);
  };

  const initiateCloseTableSession = (table) => {
    const linkedOrder = orders.find((o) => o.tableNumber === table.tableNumber && o.paymentStatus !== 'PAID');
    const linkedBill = bills.find((b) => b.tableNumber === table.tableNumber && b.status !== 'PAID');

    if (linkedBill && linkedBill.status !== 'PAID') {
      notify(`Table ${table.tableNumber} cannot be closed — Bill #${linkedBill.billId.replace('BILL-', '')} is still unpaid.`);
      return;
    }
    if (!linkedBill && linkedOrder && linkedOrder.paymentStatus === 'UNPAID') {
      notify(`Table ${table.tableNumber} cannot be closed — payment is still outstanding.`);
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: `Close Session for Table ${table.tableNumber}?`,
      affectedRecord: `Table ${table.tableNumber} (${table.status})`,
      consequenceExplanation: 'This will reset the table status to Available and clear active seating assignments.',
      requiredPermission: 'TABLE_CLOSE',
      reasons: ['Guest departed after payment', 'Manual session cleanup', 'Reservation cancelled', 'Duplicate seating record'],
      confirmAction: (formData) => {
        setTables((prev) => prev.map((t) => (t.tableId === table.tableId ? { ...t, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null } : t)));
        setAuditLogs((prev) => [{
          actionId: `AUD-${Date.now()}`,
          actionType: 'TABLE_SESSION_CLOSED',
          entityType: 'TABLE',
          entityId: table.tableId,
          entityLabel: `Table ${table.tableNumber}`,
          reason: formData.reason,
          note: formData.note,
          performedBy: formData.performedBy,
          performedAt: formData.timestamp,
        }, ...prev]);
        closeDrawer();
      },
    });
  };

  // --- Issue / feedback / community actions -----------------------------------------
  const handleApplyIssueAction = (issueId, updates) => {
    updateIssueWorkflow(issueId, updates);
    notify(`Staff owner assigned to Issue ${issueId}`);
  };

  const handleUpdateFeedbackStatus = (feedbackId, newStatus) => {
    updateFeedbackStatus(feedbackId, newStatus);
    notify(`Feedback #${feedbackId} status updated to ${newStatus}`);
  };

  const handleMockRepost = (participationId) => notify(`Mock repost triggered for #${participationId}`);

  const handleUpdateRemovalRequestStatus = (requestId, newStatus) => {
    updateRemovalRequestStatus(requestId, newStatus);
    notify(`Removal request #${requestId} status set to ${newStatus}`);
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      <AnimatePresence>
        {notificationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />{notificationBanner}</span>
            <button onClick={() => setNotificationBanner('')}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <OperationsPageHeader
        kitchenLoadStatus={kitchenLoad?.status}
        onKitchenLoadChange={updateKitchenLoadStatus}
        lastUpdated={lastUpdated}
        onRefresh={handleRefreshData}
      />

      <ExceptionStrip exceptions={exceptions} onReview={handleJump} />

      <OperationsSummary metrics={metrics} onJump={handleJump} />

      <div ref={liveOpsGridRef} className="grid grid-cols-1 xl:grid-cols-12 gap-6 scroll-mt-4">
        <div className="xl:col-span-8">
          <LiveOrdersPanel orders={activeOrders} delayedOrderIds={delayedOrderIds} onViewOrder={(o) => openDrawer('order', o)} />
        </div>
        <div className="xl:col-span-4">
          <OperationsExceptionPanel
            activeTab={exceptionTab}
            onTabChange={setExceptionTab}
            delayedOrders={delayedOrders}
            pendingBills={pendingBills}
            mismatchBills={mismatchBills}
            unresolvedIssues={unresolvedIssues}
            onViewOrder={(o) => openDrawer('order', o)}
            onViewBill={(b) => openDrawer('bill', b)}
            onViewIssue={(i) => openDrawer('issue', i)}
          />
        </div>
      </div>

      <div ref={tableSectionRef} className="scroll-mt-4">
        <TableStatusSection
          tables={tables}
          onViewTable={(t) => openDrawer('table', t)}
          onMarkAvailable={handleMarkAvailable}
          onReviewBill={handleReviewBill}
        />
      </div>

      <div ref={stockSectionRef} className="scroll-mt-4">
        <AvailabilityStaffSection
          outOfStockItems={outOfStockItems}
          employees={employees}
          onManageAvailability={() => onNavigateTab?.('menu')}
          onViewStaff={() => onNavigateTab?.('employee')}
        />
      </div>

      <div ref={customerIssuesRef} className="scroll-mt-4">
        <CustomerIssuesSection issues={issuesList} onApplyAction={handleApplyIssueAction} onViewIssue={(i) => openDrawer('issue', i)} />
      </div>

      <GuestOperationsSection
        feedbacksList={feedbacksList}
        ugcSubmissions={ugcSubmissions}
        removalRequests={removalRequests}
        customerMembership={customerMembership}
        onViewFeedback={(f) => openDrawer('feedback', f)}
        onMockRepost={handleMockRepost}
        onUpdateRemovalRequestStatus={handleUpdateRemovalRequestStatus}
      />

      {/* Progressive-disclosure detail drawer, shared by every section */}
      <OperationalDrawer isOpen={!!drawer} onClose={closeDrawer} eyebrow={drawer && DRAWER_EYEBROW[drawer.type]} title={drawer ? drawerTitle(drawer) : ''}>
        {drawer?.type === 'order' && <OrderDrawerContent order={drawer.data} />}
        {drawer?.type === 'table' && (
          <TableDrawerContent
            table={drawer.data}
            linkedBill={findBillForTable(drawer.data)}
            onClose={() => initiateCloseTableSession(drawer.data)}
            onReviewBill={() => handleReviewBill(drawer.data)}
          />
        )}
        {drawer?.type === 'bill' && <BillDrawerContent bill={drawer.data} />}
        {drawer?.type === 'issue' && <IssueDrawerContent issue={drawer.data} />}
        {drawer?.type === 'feedback' && <FeedbackDrawerContent feedback={drawer.data} onUpdateStatus={handleUpdateFeedbackStatus} />}
      </OperationalDrawer>

      <ActionConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={(formData) => {
          confirmationModal.confirmAction?.(formData);
          notify('Action executed and activity audit logged successfully.');
        }}
        title={confirmationModal.title}
        affectedRecord={confirmationModal.affectedRecord}
        consequenceExplanation={confirmationModal.consequenceExplanation}
        requiredPermission={confirmationModal.requiredPermission}
        currentRole="MANAGER"
        reasons={confirmationModal.reasons}
      />
    </div>
  );
};

// --- Drawer content -------------------------------------------------------------------

const DRAWER_EYEBROW = { order: 'Order Detail', table: 'Table Detail', bill: 'Bill Detail', issue: 'Customer Issue', feedback: 'Guest Feedback' };

const drawerTitle = (drawer) => {
  const { type, data } = drawer;
  if (type === 'order') return `Order #${data.orderId.replace('ORD-', '')}`;
  if (type === 'table') return `Table ${data.tableNumber}`;
  if (type === 'bill') return `Bill #${data.billId.replace('BILL-', '')}`;
  if (type === 'issue') return `#${data.issueId}`;
  if (type === 'feedback') return `#${data.feedbackId}`;
  return '';
};

const OrderDrawerContent = ({ order }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <StatusBadge tone="primary">Table {order.tableNumber}</StatusBadge>
      <StatusBadge tone="neutral">{order.orderStatus}</StatusBadge>
      {order.isDelayed && <StatusBadge tone="amber">Delayed</StatusBadge>}
    </div>
    <div>
      <DetailRow label="Waiter" value={order.assignedWaiter} />
      <DetailRow label="Placed" value={order.placedAt} />
      <DetailRow label="Estimated Ready" value={order.estimatedReadyAt} />
      <DetailRow label="Payment Status" value={order.paymentStatus} />
      {order.delayReason && <DetailRow label="Delay Reason" value={order.delayReason} />}
    </div>
    <div>
      <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Items</h4>
      <div className="space-y-2">
        {order.items?.map((it) => (
          <div key={it.orderItemId} className="flex items-center justify-between text-xs bg-surface-container-low rounded-lg px-3 py-2">
            <span className="font-semibold text-on-surface">{it.quantity}× {it.name}</span>
            <span className="font-mono text-on-surface-variant">{formatInvoiceAmount(it.total)}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="pt-2 border-t border-outline-variant/20">
      <DetailRow label="Subtotal" value={formatInvoiceAmount(order.subtotal)} />
      <DetailRow label="Tax" value={formatInvoiceAmount(order.tax)} />
      <DetailRow label="Total" value={formatInvoiceAmount(order.total)} />
    </div>
  </div>
);

const OCCUPIED_STATUSES = ['Dining', 'Occupied', 'Ordering', 'Food Preparing'];

const TableDrawerContent = ({ table, linkedBill, onClose, onReviewBill }) => {
  const canOfferClose = OCCUPIED_STATUSES.includes(table.status) || table.status === 'Bill Requested';
  const blocked = linkedBill && linkedBill.status !== 'PAID';

  return (
    <div className="space-y-4">
      <StatusBadge tone="neutral">{table.status}</StatusBadge>
      <div>
        <DetailRow label="Guests" value={table.guestCount || '—'} />
        <DetailRow label="Capacity" value={table.capacity} />
        {table.currentOrderId && <DetailRow label="Order" value={`#${table.currentOrderId.replace('ORD-', '')}`} />}
        {table.assignedWaiter && <DetailRow label="Waiter" value={table.assignedWaiter} />}
        <DetailRow label="Time in State" value={table.timeInState} />
      </div>

      {canOfferClose && (
        <div className="pt-3 border-t border-outline-variant/20 space-y-2">
          {blocked ? (
            <>
              <p className="text-xs text-amber-800 bg-amber-500/10 rounded-xl p-3">
                This table cannot be closed until Bill #{linkedBill.billId.replace('BILL-', '')} is paid.
              </p>
              <ContextualButton variant="secondary" onClick={onReviewBill}>Review Bill</ContextualButton>
            </>
          ) : (
            <ContextualButton variant="primary" onClick={onClose}>Close Session</ContextualButton>
          )}
        </div>
      )}
    </div>
  );
};

const BillDrawerContent = ({ bill }) => (
  <div className="space-y-4">
    <StatusBadge tone={bill.paymentStatus === 'MISMATCH' ? 'red' : 'neutral'}>{bill.status}</StatusBadge>
    <div>
      <DetailRow label="Table" value={bill.tableNumber} />
      <DetailRow label="Invoice Total" value={formatInvoiceAmount(bill.invoiceTotal)} />
      <DetailRow label="Paid Amount" value={formatInvoiceAmount(bill.paidAmount)} />
      <DetailRow label="Balance Due" value={formatInvoiceAmount(bill.balanceDue)} />
      <DetailRow label="Assigned Counter" value={bill.assignedCounter} />
      <DetailRow label="Waiting" value={`${bill.waitingDurationMinutes} min`} />
    </div>
    {bill.paymentStatus === 'MISMATCH' && (
      <p className="text-xs text-rose-800 bg-rose-500/10 rounded-xl p-3">
        {bill.mismatchNote || 'Recorded payment does not match invoice total.'}
      </p>
    )}
  </div>
);

const IssueDrawerContent = ({ issue }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <StatusBadge tone={issue.priority === 'HIGH' ? 'red' : 'amber'}>{issue.categoryLabel}</StatusBadge>
      <StatusBadge tone="neutral">{issue.statusLabel || issue.status}</StatusBadge>
    </div>
    <div>
      <DetailRow label="Table" value={issue.tableNumber} />
      <DetailRow label="Order" value={`#${issue.orderId?.replace('ORD-', '')}`} />
      <DetailRow label="Owner" value={issue.assignedOwner || 'Unassigned'} />
      <DetailRow label="Reported At" value={issue.reportedAt} />
      <DetailRow label="Customer Confirmation" value={issue.customerConfirmed ? 'Confirmed Resolved' : 'Pending'} />
    </div>
    {issue.description && (
      <p className="text-xs text-on-surface bg-surface-container-low rounded-xl p-3">{issue.description}</p>
    )}
    {issue.recoveryAction && (
      <div>
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Recovery Action</h4>
        <p className="text-xs text-on-surface bg-primary/5 rounded-xl p-3">{issue.recoveryAction}</p>
      </div>
    )}
    <div>
      <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Timeline</h4>
      <div className="space-y-2">
        {(issue.timeline || []).map((entry, idx) => (
          <div key={idx} className="flex gap-3 text-xs">
            <span className="text-on-surface-variant font-mono shrink-0 w-14">{entry.time}</span>
            <span className="text-on-surface">{entry.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FEEDBACK_STATUS_OPTIONS = ['New', 'Reviewing', 'Contacted Guest', 'Action Recorded', 'Closed'];
const FEEDBACK_RATING_LABELS = { food: 'Food Quality', service: 'Service', speed: 'Preparation Speed', cleanliness: 'Cleanliness', value: 'Value for Money' };

const FeedbackDrawerContent = ({ feedback, onUpdateStatus }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <StatusBadge tone="neutral">Table {feedback.tableNumber}</StatusBadge>
      <StatusBadge tone={feedback.feedbackRoute === 'PRIVATE_MANAGER_REVIEW' ? 'amber' : 'green'}>
        {feedback.feedbackRoute === 'PRIVATE_MANAGER_REVIEW' ? 'Private Manager Review' : 'Standard Log'}
      </StatusBadge>
    </div>
    <div>
      {Object.entries(FEEDBACK_RATING_LABELS).map(([key, label]) => (
        feedback.ratings?.[key] !== undefined && <DetailRow key={key} label={label} value={`${feedback.ratings[key]}/5`} />
      ))}
    </div>
    {feedback.comment && (
      <p className="text-xs italic text-on-surface bg-surface-container-low rounded-xl p-3">&quot;{feedback.comment}&quot;</p>
    )}
    {feedback.improvementCategoriesLabels?.length > 0 && (
      <p className="text-xs text-rose-800"><strong>Improvement areas:</strong> {feedback.improvementCategoriesLabels.join(', ')}</p>
    )}
    <div className="pt-3 border-t border-outline-variant/20">
      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Status</label>
      <select
        value={feedback.status}
        onChange={(e) => onUpdateStatus(feedback.feedbackId, e.target.value)}
        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl font-semibold text-xs outline-none"
      >
        {FEEDBACK_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    {feedback.managerNotes && <p className="text-[11px] text-on-surface-variant italic">{feedback.managerNotes}</p>}
  </div>
);

export default ManagerDashboardView;
