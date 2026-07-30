import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import CounterShell from '../../components/layout/CounterShell';
import { RefreshCw, Timer, Receipt, TableProperties, X } from 'lucide-react';

const timeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  return `${mins} mins ago`;
};

const PendingBillsScreen = () => {
  const navigate = useNavigate();
  const { billRequests, waiterTables } = useOrder();
  const [sortBy, setSortBy] = useState('time');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingBill, setViewingBill] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredBills = useMemo(() => {
    let list = [...billRequests];
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter);
    }
    if (sortBy === 'time') {
      list.sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt));
    } else if (sortBy === 'amount') {
      list.sort((a, b) => b.grandTotal - a.grandTotal);
    } else if (sortBy === 'table') {
      list.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));
    }
    return list;
  }, [billRequests, statusFilter, sortBy]);

  const pendingOnly = billRequests.filter((b) => b.status === 'pending');
  const avgWaitMinutes = pendingOnly.length
    ? Math.round(
        pendingOnly.reduce((sum, b) => sum + (Date.now() - new Date(b.requestedAt).getTime()), 0) /
          pendingOnly.length /
          60000
      )
    : 0;
  const pendingValue = pendingOnly.reduce((sum, b) => sum + b.grandTotal, 0);
  const activeTables = waiterTables.filter((t) => t.status !== 'available').length;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <CounterShell searchPlaceholder="Search orders, tables, or bills...">
      <div className="p-6 max-w-[1280px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Pending Bills</h2>
            <p className="text-on-surface-variant">{pendingOnly.length} active requests requiring attention</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="settled">Settled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="time">Sort by: Time</option>
              <option value="amount">Sort by: Amount</option>
              <option value="table">Sort by: Table</option>
            </select>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Bill ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Table</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                      No bill requests match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-primary">#{bill.id.toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4 text-on-surface">T-{bill.tableNumber}</td>
                      <td className="px-6 py-4 text-xl font-semibold text-on-surface">{formatInvoiceAmount(bill.grandTotal)}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{timeAgo(bill.requestedAt)}</td>
                      <td className="px-6 py-4">
                        {bill.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-container/30 text-on-secondary-container rounded-lg text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-highest text-on-surface-variant rounded-lg text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-tertiary" />
                            Settled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setViewingBill(bill)}
                            className="px-4 py-2 rounded-xl border border-outline text-on-surface-variant text-xs font-semibold hover:bg-surface-container transition-all"
                          >
                            View Bill
                          </button>
                          {bill.status === 'pending' && (
                            <button
                              onClick={() => navigate('/counter/payment', { state: { bill } })}
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-md hover:brightness-110 transition-all"
                            >
                              Process Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-surface-container-low/30 border-t border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Showing {filteredBills.length} of {billRequests.length} requests
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Avg. Wait Time</p>
              <p className="text-xl font-bold text-on-surface">{avgWaitMinutes}m</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Pending Value</p>
              <p className="text-xl font-bold text-on-surface">{formatInvoiceAmount(pendingValue)}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <TableProperties className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Active Tables</p>
              <p className="text-xl font-bold text-on-surface">
                {activeTables} / {waiterTables.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSync}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        title="Refresh bill requests"
      >
        <RefreshCw className={`w-7 h-7 ${isSyncing ? 'animate-spin' : ''}`} />
      </button>

      {viewingBill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="text-lg font-bold text-on-surface">Bill #{viewingBill.id.toUpperCase()}</h3>
              <button onClick={() => setViewingBill(null)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <div className="flex justify-between"><span>Table</span><span className="font-semibold text-on-surface">T-{viewingBill.tableNumber}</span></div>
              <div className="flex justify-between"><span>Server</span><span className="font-semibold text-on-surface">{viewingBill.serverName}</span></div>
              <div className="flex justify-between"><span>Guests</span><span className="font-semibold text-on-surface">{viewingBill.guestCount}</span></div>
              <div className="border-t border-outline-variant/20 pt-2 flex justify-between"><span>Subtotal</span><span>{formatInvoiceAmount(viewingBill.subtotal || 0)}</span></div>
              {(viewingBill.discount || viewingBill.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatInvoiceAmount(viewingBill.discount || viewingBill.discountAmount)}</span></div>
              )}
              {(viewingBill.packagingCharge || 0) > 0 && (
                <div className="flex justify-between"><span>Packaging Charge</span><span>{formatInvoiceAmount(viewingBill.packagingCharge || 0)}</span></div>
              )}
              <div className="flex justify-between"><span>GST @ 5%</span><span>{formatInvoiceAmount(viewingBill.gst || viewingBill.tax || 0)}</span></div>
              {(viewingBill.tip || 0) > 0 && (
                <div className="flex justify-between text-secondary"><span>Optional Staff Tip</span><span>{formatInvoiceAmount(viewingBill.tip || 0)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Total Payable</span><span className="text-primary">{formatInvoiceAmount(viewingBill.totalPayable || viewingBill.grandTotal || 0)}</span>
              </div>
            </div>
            <button
              onClick={() => setViewingBill(null)}
              className="w-full py-2.5 bg-surface-container text-on-surface font-semibold rounded-xl text-sm hover:bg-surface-container-high transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </CounterShell>
  );
};

export default PendingBillsScreen;
