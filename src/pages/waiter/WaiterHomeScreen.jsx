import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutGrid,
  Utensils,
  BellRing,
  Receipt,
  ChevronRight,
  Plus,
  Droplet,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

const WaiterHomeScreen = ({ onNavigateTables, onNavigateOrders, onOpenRequests }) => {
  const { waiterTables, kitchenOrders, assistanceRequests, billRequests, updateKitchenOrderStatus } = useOrder();
  const { showToast } = useToast();

  const occupiedTablesCount = waiterTables.filter((t) => t.status !== 'available').length;
  const readyOrders = kitchenOrders.filter((o) => o.status === 'ready');
  const pendingRequests = assistanceRequests.filter((r) => r.status === 'pending');
  const pendingBills = billRequests.filter((b) => b.status === 'pending');
  const totalNotifications = readyOrders.length + pendingRequests.length + pendingBills.length;

  const QUICK_ACTIONS = [
    {
      id: 'tables',
      label: 'Tables',
      count: occupiedTablesCount,
      icon: LayoutGrid,
      bg: 'bg-primary-container text-on-primary-container',
      onClick: onNavigateTables,
    },
    {
      id: 'orders',
      label: 'Ready Orders',
      count: readyOrders.length,
      icon: Utensils,
      bg: 'bg-secondary-container text-on-secondary-container',
      accent: true,
      onClick: onNavigateOrders,
    },
    {
      id: 'requests',
      label: 'Customer Requests',
      count: pendingRequests.length,
      icon: BellRing,
      bg: 'bg-error-container text-on-error-container',
      onClick: () => onOpenRequests('customer'),
    },
    {
      id: 'bills',
      label: 'Bill Requests',
      count: pendingBills.length,
      icon: Receipt,
      bg: 'bg-tertiary-container text-on-tertiary-container',
      onClick: () => onOpenRequests('bill'),
    },
  ];

  const handlePickUp = (orderId, tableNumber) => {
    updateKitchenOrderStatus(orderId, 'served');
    showToast(`Order #${orderId} delivered to Table #${tableNumber}!`, 'success');
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Greeting */}
      <section>
        <h2 className="text-lg font-serif font-bold text-on-surface">Welcome back, Elena</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {totalNotifications > 0
            ? `You have ${totalNotifications} active notification${totalNotifications === 1 ? '' : 's'} to manage.`
            : 'All caught up — no pending notifications right now.'}
        </p>
      </section>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.96 }}
              onClick={action.onClick}
              className={`text-left bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm border border-outline-variant/30 flex flex-col gap-2 transition-all hover:border-outline-variant ${
                action.accent ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-semibold text-on-surface-variant">{action.label}</h3>
                <p className="text-xl font-bold text-primary font-mono">{action.count}</p>
              </div>
            </motion.button>
          );
        })}
      </section>

      {/* Today's Activity */}
      <section className="space-y-4">
        <h2 className="text-base font-serif font-bold text-on-surface">Today's Activity</h2>

        {/* Recently Ready Orders */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">Recently Ready Orders</h3>
            <button onClick={onNavigateOrders} className="text-xs font-bold text-primary hover:underline">
              View All
            </button>
          </div>

          {readyOrders.length > 0 ? (
            <div className="space-y-2">
              {readyOrders.slice(0, 2).map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface">Table {order.tableNumber}</p>
                    <p className="text-xs text-on-surface-variant truncate">{order.items?.[0]?.name}</p>
                  </div>
                  <button
                    onClick={() => handlePickUp(order.orderId, order.tableNumber)}
                    className="px-3.5 py-1.5 bg-primary hover:opacity-90 text-on-primary text-xs font-bold rounded-full transition-all shrink-0"
                  >
                    Pick Up
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/60 px-1">No orders ready at the kitchen pass.</p>
          )}
        </div>

        {/* Recent Customer Requests */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">Recent Customer Requests</h3>
            <button onClick={() => onOpenRequests('customer')} className="text-xs font-bold text-primary hover:underline">
              History
            </button>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-2">
              {pendingRequests.slice(0, 2).map((req, idx) => {
                const timeAgo = Math.floor((Date.now() - new Date(req.timestamp).getTime()) / (1000 * 60));
                const Icon = idx % 2 === 0 ? Droplet : Layers;
                return (
                  <button
                    key={req.id}
                    onClick={() => onOpenRequests('customer')}
                    className="w-full flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-on-surface">Table {req.tableNumber}</p>
                        <span className="text-[11px] font-mono text-error shrink-0">
                          {timeAgo === 0 ? 'Just now' : `${timeAgo}m ago`}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">{req.requestType}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-outline shrink-0" />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/60 px-1">No pending customer requests.</p>
          )}
        </div>
      </section>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          showToast('Tap a table to seat new guests', 'info');
          onNavigateTables();
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary hover:opacity-90 text-on-primary rounded-full shadow-lg flex items-center justify-center z-30 transition-all"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default WaiterHomeScreen;
