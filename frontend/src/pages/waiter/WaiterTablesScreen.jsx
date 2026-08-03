import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import {
  Users,
  Clock,
  Receipt,
  BellRing,
  Utensils,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_META = {
  available: {
    label: 'Available',
    icon: CheckCircle2,
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  seated: {
    label: 'Seated',
    icon: Users,
    border: 'border-l-secondary',
    badge: 'bg-secondary-container text-on-secondary-container',
  },
  cooking: {
    label: 'Cooking',
    icon: Utensils,
    border: 'border-l-primary',
    badge: 'bg-error-container text-on-error-container',
  },
  ready: {
    label: 'Ready to Serve',
    icon: Sparkles,
    border: 'border-l-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  call_waiter: {
    label: 'Assistance Call',
    icon: BellRing,
    border: 'border-l-error ring-2 ring-error/25',
    badge: 'bg-error text-on-error animate-pulse',
  },
  bill_requested: {
    label: 'Billing',
    icon: Receipt,
    border: 'border-l-violet-600',
    badge: 'bg-violet-50 text-violet-700',
  },
};

const FILTERS = [
  { id: 'all', label: 'All Tables' },
  { id: 'available', label: 'Available' },
  { id: 'occupied', label: 'Occupied' },
];

const WaiterTablesScreen = () => {
  const {
    waiterTables,
    updateWaiterTableStatus,
    addBillRequest,
    settleBillRequest,
    kitchenOrders,
    assistanceRequests,
    resolveAssistanceRequest,
    billRequests,
  } = useOrder();
  const { showToast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTableNo, setActiveTableNo] = useState(null);
  const activeModalTable = activeTableNo
    ? waiterTables.find((t) => t.tableNumber === activeTableNo)
    : null;

  const availableCount = waiterTables.filter((t) => t.status === 'available').length;
  const occupiedCount = waiterTables.length - availableCount;

  const billForTable = (tableNo) =>
    billRequests.find((b) => b.tableNumber === tableNo && b.status === 'pending');

  const filteredTables = waiterTables.filter((tbl) => {
    if (selectedFilter === 'available') return tbl.status === 'available';
    if (selectedFilter === 'occupied') return tbl.status !== 'available';
    return true;
  });

  const handleStatusChange = (tableNo, newStatus, extraData = {}) => {
    updateWaiterTableStatus(tableNo, newStatus, extraData);
    showToast(`Table #${tableNo} marked as "${STATUS_META[newStatus]?.label}"`, 'success');
  };

  const handleSeatGuests = (tableNo) => {
    handleStatusChange(tableNo, 'seated', { guestCount: 2, serverName: 'Elena Vance' });
  };

  const handleRequestBill = (tbl) => {
    addBillRequest(tbl.tableNumber, {
      guestCount: tbl.guestCount,
      serverName: tbl.serverName,
      grandTotal: tbl.totalBill || 45.0,
    });
    showToast(`Bill requested for Table #${tbl.tableNumber}`, 'success');
    setActiveTableNo(null);
  };

  const handleSettleBill = (tbl) => {
    const matchingBill = billForTable(tbl.tableNumber);
    if (matchingBill) {
      settleBillRequest(matchingBill.id, tbl.tableNumber);
      showToast(`Table #${tbl.tableNumber} bill settled & table cleared!`, 'success');
      setActiveTableNo(null);
    }
  };

  const handleClearTable = (tableNo) => {
    updateWaiterTableStatus(tableNo, 'available', {
      guestCount: 0,
      activeOrderId: null,
      totalBill: 0,
      serverName: 'Unassigned',
    });
    showToast(`Table #${tableNo} cleared & now available`, 'success');
    setActiveTableNo(null);
  };

  const handleResolveRequest = (requestId, tableNo, requestType) => {
    resolveAssistanceRequest(requestId);
    showToast(`Request "${requestType}" for Table #${tableNo} resolved!`, 'success');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => {
          const count = f.id === 'available' ? availableCount : f.id === 'occupied' ? occupiedCount : null;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {f.label}
              {count !== null ? ` (${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Floor Plan Tables Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredTables.map((tbl) => {
          const meta = STATUS_META[tbl.status] || STATUS_META.available;
          const StatusIcon = meta.icon;
          const tableOrder = kitchenOrders.find(
            (ko) => ko.tableNumber === tbl.tableNumber && ko.status !== 'served'
          );

          return (
            <motion.div
              key={tbl.tableNumber}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTableNo(tbl.tableNumber)}
              className={`bg-surface-container-lowest rounded-[20px] p-3.5 shadow-sm border-l-[6px] ${meta.border} cursor-pointer flex flex-col justify-between h-[132px] transition-all`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-2xl font-bold text-on-surface font-mono">{tbl.tableNumber}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${meta.badge}`}>
                  {meta.label}
                </span>
              </div>

              <div className="space-y-1 my-1">
                <p className="text-[10px] text-on-surface-variant/70 font-medium truncate">{tbl.section}</p>

                {tbl.status === 'available' ? (
                  <div className="flex items-center gap-1 text-on-surface-variant/60">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Up to {tbl.capacity}</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{tbl.guestCount} Guests</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      {tbl.status === 'bill_requested' ? (
                        <>
                          <IndianRupee className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-bold text-primary font-mono">{formatInvoiceAmount(tbl.totalBill)}</span>
                        </>
                      ) : tbl.status === 'seated' ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{tbl.seatedMinutes}m</span>
                        </>
                      ) : (
                        <>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{meta.label}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-on-surface-variant font-medium">
                <span className="truncate">{tbl.serverName || 'Unassigned'}</span>
                {tableOrder && (
                  <span className="px-1.5 py-0.5 bg-surface-container text-on-surface rounded font-mono font-bold shrink-0">
                    #{tableOrder.orderId}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table Detail Bottom Sheet */}
      {activeModalTable && (
        <Modal
          isOpen={Boolean(activeModalTable)}
          onClose={() => setActiveTableNo(null)}
          title={`Table #${activeModalTable.tableNumber} Details`}
          position="bottom"
        >
          <div className="space-y-5">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-on-surface-variant">
                  {activeModalTable.status === 'available'
                    ? `Section: ${activeModalTable.section}`
                    : `Seated ${activeModalTable.seatedMinutes}m ago • Server: ${activeModalTable.serverName}`}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase ${STATUS_META[activeModalTable.status]?.badge}`}>
                {STATUS_META[activeModalTable.status]?.label}
              </span>
            </div>

            {/* Order Summary */}
            {(() => {
              const order = kitchenOrders.find(
                (ko) => ko.tableNumber === activeModalTable.tableNumber && ko.status !== 'served'
              );
              if (!order) return null;
              return (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Order Summary</h3>
                    <span className="text-xs font-bold text-on-surface">{formatInvoiceAmount(activeModalTable.totalBill)}</span>
                  </div>
                  <div className="space-y-2 bg-surface-container-low rounded-2xl p-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-on-surface">
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Customer Requests */}
            {(() => {
              const req = assistanceRequests.find(
                (r) => r.tableNumber === activeModalTable.tableNumber && r.status === 'pending'
              );
              if (!req) return null;
              return (
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Customer Requests</h3>
                  <div className="flex items-center gap-3 bg-secondary-container/15 p-3 rounded-2xl border border-secondary-container/40">
                    <BellRing className="w-4 h-4 text-secondary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-secondary-container truncate">{req.requestType}</p>
                    </div>
                    <button
                      onClick={() => handleResolveRequest(req.id, activeModalTable.tableNumber, req.requestType)}
                      className="px-3 py-1.5 bg-secondary text-on-secondary rounded-full text-xs font-bold shrink-0"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {activeModalTable.status === 'available' && (
                <button
                  onClick={() => handleSeatGuests(activeModalTable.tableNumber)}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Users className="w-4 h-4" />
                  Seat Guests
                </button>
              )}

              {activeModalTable.status === 'seated' && (
                <button
                  onClick={() => handleStatusChange(activeModalTable.tableNumber, 'cooking')}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Utensils className="w-4 h-4" />
                  Mark Cooking
                </button>
              )}

              {activeModalTable.status === 'cooking' && (
                <button
                  onClick={() => handleStatusChange(activeModalTable.tableNumber, 'ready')}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Mark Ready to Serve
                </button>
              )}

              {activeModalTable.status === 'ready' && (
                <button
                  onClick={() => handleStatusChange(activeModalTable.tableNumber, 'seated')}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Served
                </button>
              )}

              {activeModalTable.status === 'bill_requested' && (
                <button
                  onClick={() => handleSettleBill(activeModalTable)}
                  className="w-full h-14 bg-primary text-on-primary rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Settle & Clear Table
                </button>
              )}

              {['seated', 'cooking', 'ready'].includes(activeModalTable.status) && (
                <button
                  onClick={() => handleRequestBill(activeModalTable)}
                  className="w-full h-14 border border-outline text-on-surface rounded-2xl text-sm font-bold active:scale-[0.98] transition-all"
                >
                  Request Bill
                </button>
              )}

              {activeModalTable.status !== 'available' && (
                <button
                  onClick={() => handleClearTable(activeModalTable.tableNumber)}
                  className="w-full h-12 text-on-surface-variant text-sm font-bold opacity-70"
                >
                  Mark Available
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WaiterTablesScreen;
