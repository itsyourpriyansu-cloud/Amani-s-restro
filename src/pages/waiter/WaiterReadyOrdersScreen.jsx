import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/common/EmptyState';
import WaiterOrderOpsModal from '../../components/waiter/WaiterOrderOpsModal';
import {
  Search,
  Utensils,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  History,
  ChevronDown,
  Flame,
  Split,
  MoveRight,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = [
  { id: 'all', label: 'All Orders' },
  { id: 'high', label: 'High Priority' },
  { id: 'regular', label: 'Regular' },
];

const minutesAgo = (isoDate) => Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60)));

const WaiterReadyOrdersScreen = () => {
  const { kitchenOrders, orders, updateKitchenOrderStatus } = useOrder();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Ops Modal state
  const [opsModal, setOpsModal] = useState({ isOpen: false, modalType: null, targetOrder: null, targetItem: null });
  const openOpsModal = (type, order, item = null) => setOpsModal({ isOpen: true, modalType: type, targetOrder: order, targetItem: item });
  const closeOpsModal = () => setOpsModal({ isOpen: false, modalType: null, targetOrder: null, targetItem: null });

  const allReadyOrders = kitchenOrders.filter((o) => o.status === 'ready');
  const completedOrders = kitchenOrders.filter((o) => o.status === 'served');

  const readyOrders = allReadyOrders.filter((order) => {
    if (selectedFilter === 'high' && !order.isRush) return false;
    if (selectedFilter === 'regular' && order.isRush) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return order.orderId.toLowerCase().includes(q) || order.tableNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDeliverOrder = (orderId, tableNumber) => {
    updateKitchenOrderStatus(orderId, 'served');
    showToast(`Order #${orderId} delivered to Table #${tableNumber}!`, 'success');
  };

  return (
    <>
    <div className="space-y-4 pb-6">
      {/* Search & Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders or tables..."
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-on-surface-variant/60"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-on-surface text-surface shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-on-surface font-serif">Ready to Deliver</h2>
        <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-lg">
          {readyOrders.length} active
        </span>
      </div>

      {/* Ready Orders List */}
      {readyOrders.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {readyOrders.map((order) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-4 shadow-md space-y-3"
              >
                {/* Top Row: Table Number & Order ID */}
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-on-surface text-surface font-mono font-black text-base rounded-xl shadow-sm">
                      TBL #{order.tableNumber}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-on-surface font-mono">
                        #{order.orderId}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        Server: {order.serverName || 'Elena Vance'} • Ready {minutesAgo(order.createdAt)}m ago
                      </p>
                    </div>
                  </div>

                  {order.isRush ? (
                    <span className="px-2.5 py-1 bg-error-container/70 text-on-error-container border border-error/20 rounded-full text-xs font-bold uppercase tracking-wide">
                      High Priority
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Hot & Plated
                    </span>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-2 py-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-start justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-mono font-black text-xs rounded-lg">
                          {item.quantity}x
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-on-surface">
                            {item.name}
                          </h5>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <p className="text-[10px] text-on-surface-variant font-medium">
                              + {item.selectedOptions.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                        {item.station}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Special Instructions warning */}
                {order.specialNotes && (
                  <div className="p-2 bg-error-container/60 border border-error/20 rounded-xl text-xs text-on-error-container font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-error" />
                    <span className="text-[11px]">{order.specialNotes}</span>
                  </div>
                )}

                {/* Action Buttons: Deliver + Order Ops */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeliverOrder(order.orderId, order.tableNumber)}
                    className="flex-1 py-3 bg-primary hover:opacity-90 text-on-primary font-bold rounded-2xl text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Deliver to Table #{order.tableNumber}</span>
                  </button>

                  {/* Quick Op Buttons */}
                  <button
                    onClick={() => openOpsModal('REFIRE', order, order.items?.[0])}
                    title="Re-fire"
                    className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center hover:bg-red-100 shrink-0"
                  >
                    <Flame className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openOpsModal('SPLIT', order)}
                    title="Split Order"
                    className="w-10 h-10 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high shrink-0"
                  >
                    <Split className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openOpsModal('MOVE', order)}
                    title="Move Table"
                    className="w-10 h-10 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high shrink-0"
                  >
                    <MoveRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={Utensils}
          title="No ready orders waiting at kitchen pass"
          description="All cooked dishes have been served to guest tables."
        />
      )}

      {/* Completed Collapsible */}
      {completedOrders.length > 0 && (
        <div className="border-t border-outline-variant/30 pt-3">
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-on-surface-variant" />
              <span className="text-xs font-bold text-on-surface">Completed ({completedOrders.length})</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
          </button>

          {showCompleted && (
            <div className="space-y-2 pt-2 px-1">
              {completedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-on-surface-variant text-xs"
                >
                  <span className="font-mono">#{order.orderId} • Table {order.tableNumber}</span>
                  <span className="font-mono">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>

      {/* Order Ops Modal */}
      <WaiterOrderOpsModal
        isOpen={opsModal.isOpen}
        onClose={closeOpsModal}
        modalType={opsModal.modalType}
        targetOrder={opsModal.targetOrder}
        targetItem={opsModal.targetItem}
      />
    </>
  );
};

export default WaiterReadyOrdersScreen;
