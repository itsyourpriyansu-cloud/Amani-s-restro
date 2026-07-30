import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';
import { BellRing, Receipt, CheckCircle, CheckCircle2, Clock, CreditCard, Users, Printer, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WaiterStaffRequestsScreen = ({ subTab, setSubTab }) => {
  const {
    assistanceRequests,
    resolveAssistanceRequest,
    billRequests,
    settleBillRequest,
    issuesList,
    updateIssueWorkflow
  } = useOrder();
  const { showToast } = useToast();

  const pendingRequests = assistanceRequests.filter((r) => r.status === 'pending');
  const resolvedRequests = assistanceRequests.filter((r) => r.status === 'resolved');
  const pendingBills = billRequests.filter((b) => b.status === 'pending');
  const settledBills = billRequests.filter((b) => b.status === 'settled');
  const activeIssues = (issuesList || []).filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED');

  const handleResolve = (requestId, tableNumber, requestType) => {
    resolveAssistanceRequest(requestId);
    showToast(`Request "${requestType}" for Table #${tableNumber} resolved!`, 'success');
  };

  const handleAcceptIssue = (issueId, tableNumber) => {
    updateIssueWorkflow(issueId, {
      assignedOwner: 'Rahul Sharma (Waiter)',
      assignedRole: 'Waiter',
      status: 'ACTION_IN_PROGRESS',
      statusLabel: 'Rahul is handling this',
      recoveryAction: 'Staff checking table directly'
    });
    showToast(`Assigned yourself as owner for Issue #${issueId} (Table ${tableNumber})`, 'success');
  };

  const handleSettle = (billId, tableNumber, amount) => {
    settleBillRequest(billId, tableNumber);
    showToast(`Table #${tableNumber} bill (${formatInvoiceAmount(amount)}) settled & table cleared!`, 'success');
  };

  const handlePrintCheck = (tableNumber) => {
    showToast(`Receipt printed for Table #${tableNumber}`, 'info');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Segmented Tabs */}
      <div className="flex p-1 bg-surface-container-low rounded-2xl">
        <button
          onClick={() => setSubTab('customer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === 'customer' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
          }`}
        >
          Customer Calls &amp; Issues
        </button>
        <button
          onClick={() => setSubTab('bill')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === 'bill' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
          }`}
        >
          Bill Requests
        </button>
      </div>

      {subTab === 'customer' ? (
        <div key="customer" className="space-y-4">
          {/* Active Issue Alerts */}
          {activeIssues.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Reported Customer Issues ({activeIssues.length})
                </h3>
              </div>

              {activeIssues.map((iss) => (
                <div key={iss.issueId} className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-rose-950 dark:text-rose-200 text-sm">Table #{iss.tableNumber} — Ticket #{iss.issueId}</span>
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {iss.categoryLabel}
                    </span>
                  </div>
                  <p className="text-on-surface font-semibold">Affected Dish: {iss.affectedItemName || 'Order'}</p>
                  <p className="text-on-surface-variant italic">"{iss.description || 'Customer reported a problem.'}"</p>
                  <div className="flex justify-between items-center pt-2 border-t border-rose-500/20">
                    <span className="text-[11px] text-on-surface-variant">Owner: <strong>{iss.assignedOwner}</strong></span>
                    <button
                      onClick={() => handleAcceptIssue(iss.issueId, iss.tableNumber)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow"
                    >
                      Accept Issue Ownership
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Header Info */}
          <div className="bg-error-container/30 border border-error/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-error text-on-error flex items-center justify-center shadow-md">
                <BellRing className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface font-serif">Guest Assistance Calls</h2>
                <p className="text-xs text-on-surface-variant">Live notifications from customer smartphones</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-error text-on-error font-mono font-black text-xs rounded-xl shadow-sm">
              {pendingRequests.length} Pending
            </span>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {pendingRequests.map((req) => {
                  const timeAgo = Math.floor((Date.now() - new Date(req.timestamp).getTime()) / (1000 * 60));
                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-surface-container-lowest border border-error/15 rounded-3xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-2 bg-on-surface text-surface font-black font-mono rounded-xl text-base shadow-sm">
                          TBL #{req.tableNumber}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">{req.requestType}</h4>
                          <p className="text-xs text-on-surface-variant font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 inline" />
                            {timeAgo === 0 ? 'Just now' : `${timeAgo} min ago`}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleResolve(req.id, req.tableNumber, req.requestType)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-primary hover:opacity-90 text-on-primary rounded-2xl text-xs font-bold tracking-wide shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Acknowledge &amp; Resolve</span>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              icon={BellRing}
              title="No pending customer table calls"
              description="All table assistance requests have been addressed."
            />
          )}

          {resolvedRequests.length > 0 && (
            <div className="pt-4 border-t border-outline-variant/30 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                Recently Resolved Calls ({resolvedRequests.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {resolvedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant opacity-75 shadow-xs"
                  >
                    <span>Table #{req.tableNumber} — {req.requestType}</span>
                    <span className="text-emerald-700 font-mono text-[10px] flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3 h-3 inline" /> Resolved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div key="bill" className="space-y-4">
          {/* Header Info */}
          <div className="bg-secondary-container/20 border border-secondary-container/50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface font-serif">Table Check &amp; Bill Requests</h2>
                <p className="text-xs text-on-surface-variant">Payment processing and table settlement</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-secondary text-on-secondary font-mono font-black text-xs rounded-xl shadow-sm">
              {pendingBills.length} Bills
            </span>
          </div>

          {pendingBills.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {pendingBills.map((bill) => (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-4 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-on-surface text-surface font-mono font-black text-base rounded-xl shadow-sm">
                          TBL #{bill.tableNumber}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-on-surface flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-on-surface-variant" /> {bill.guestCount} Guests
                          </h4>
                          <p className="text-[10px] text-on-surface-variant font-medium">Server: {bill.serverName}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-xs font-bold flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{bill.paymentMethod}</span>
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-1.5 text-xs">
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold">{formatInvoiceAmount(bill.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>GST @ 5%:</span>
                        <span className="font-mono font-semibold">{formatInvoiceAmount(bill.gst || bill.tax || 0)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface font-bold border-t border-outline-variant/30 pt-1.5 text-sm">
                        <span>Total Payable:</span>
                        <span className="font-mono text-primary">{formatInvoiceAmount(bill.totalPayable || bill.grandTotal || 0)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handlePrintCheck(bill.tableNumber)}
                        className="py-2.5 bg-surface-container text-on-surface border border-outline-variant/40 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Printer className="w-4 h-4 text-on-surface-variant" />
                        <span>Print Check</span>
                      </button>

                      <button
                        onClick={() => handleSettle(bill.id, bill.tableNumber, bill.grandTotal)}
                        className="py-2.5 bg-primary hover:opacity-90 text-on-primary rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Settle &amp; Clear Table</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No pending bill settlement requests"
              description="All table checks have been processed."
            />
          )}

          {settledBills.length > 0 && (
            <div className="pt-4 border-t border-outline-variant/30 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                Recently Settled Bills ({settledBills.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {settledBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant opacity-75 shadow-xs"
                  >
                    <span>Table #{bill.tableNumber} — {formatInvoiceAmount(bill.grandTotal)}</span>
                    <span className="text-emerald-700 font-mono text-[10px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 inline" /> Settled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WaiterStaffRequestsScreen;
