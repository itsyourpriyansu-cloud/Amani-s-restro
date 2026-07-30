import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Table2,
  Clock,
  CheckCircle2,
  CookingPot,
  CheckCheck,
  Printer,
  Flag,
  Square,
  CheckSquare,
  PackageSearch
} from 'lucide-react';

const STATUS_META = {
  received: { label: 'New Order', badge: 'bg-secondary-container/30 text-on-secondary-container' },
  preparing: { label: 'Preparing', badge: 'bg-primary-container/20 text-primary' },
  ready: { label: 'Ready', badge: 'bg-tertiary-container/30 text-on-tertiary-container' },
  served: { label: 'Completed', badge: 'bg-surface-container-highest text-on-surface-variant' },
};

const timeAgo = (isoString) => {
  const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (minutes <= 0) return 'just now';
  if (minutes === 1) return '1 min ago';
  return `${minutes} mins ago`;
};

const OrderDetailsScreen = ({ orders = [], onUpdateStatus, onToggleItemDone, onToggleRush }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    return (
      <div className="p-8 max-w-3xl mx-auto py-16 text-center space-y-4">
        <PackageSearch className="w-12 h-12 mx-auto text-on-surface-variant/40" />
        <h2 className="text-xl font-bold text-on-surface">Order Not Found</h2>
        <p className="text-sm text-on-surface-variant">
          Order #{orderId} could not be located in the current ticket queue.
        </p>
        <button
          onClick={() => navigate('/kitchen')}
          className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md hover:brightness-110 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const statusMeta = STATUS_META[order.status] || STATUS_META.received;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/kitchen')}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </button>

      {/* Hero */}
      <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-on-surface">
              Order #{order.orderId}
            </h1>
            <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusMeta.badge}`}>
              {statusMeta.label}
            </span>
            {order.isRush && (
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-error text-on-error animate-pulse">
                Rush
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-5 text-on-surface-variant text-sm">
            <span className="flex items-center gap-1.5">
              <Table2 className="w-4 h-4" />
              <span className="font-bold text-on-surface">Table {order.tableNumber}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Received {timeAgo(order.createdAt)}
            </span>
          </div>
        </div>

        {order.specialNotes && (
          <div className="bg-error-container/60 text-on-error-container px-5 py-3 rounded-xl border border-error/20 flex items-center gap-3 max-w-md">
            <AlertTriangle className="w-7 h-7 shrink-0" />
            <div>
              <p className="font-bold leading-tight text-sm">Urgent Note</p>
              <p className="text-xs opacity-90">{order.specialNotes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-bold text-on-surface px-1">Order Items</h2>

          {order.items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItemDone(order.orderId, item.id)}
              className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start gap-3 ${
                item.isDone ? 'opacity-55' : ''
              }`}
            >
              <div className="mt-1 shrink-0">
                {item.isDone ? (
                  <CheckSquare className="w-5 h-5 text-tertiary" />
                ) : (
                  <Square className="w-5 h-5 text-outline" />
                )}
              </div>
              <div className="text-2xl font-extrabold text-primary pt-0.5 leading-none">
                {item.quantity}x
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className={`text-base font-bold text-on-surface ${item.isDone ? 'line-through' : ''}`}>
                    {item.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant/20">
                    {item.station}
                  </span>
                </div>
                <div className="space-y-1.5 mt-1.5">
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.selectedOptions.map((opt, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded-lg border border-secondary-container/30 text-xs font-medium"
                        >
                          + {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs italic text-primary flex items-center gap-1.5 bg-primary-container/10 border border-primary/20 px-2 py-1 rounded-lg w-fit">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes + Actions */}
        <div className="space-y-5">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-on-surface px-1">Customer Notes</h2>
            <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
              <p className="text-sm text-on-surface leading-relaxed">
                {order.specialNotes || 'No additional notes for this order.'}
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 sticky top-4">
            {order.status === 'received' && (
              <button
                onClick={() => onUpdateStatus(order.orderId, 'preparing')}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <CookingPot className="w-5 h-5" />
                Start Preparing
              </button>
            )}

            {order.status === 'preparing' && (
              <button
                onClick={() => onUpdateStatus(order.orderId, 'ready')}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark as Ready
              </button>
            )}

            {order.status === 'ready' && (
              <button
                onClick={() => onUpdateStatus(order.orderId, 'served')}
                className="w-full h-14 bg-on-surface text-surface font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                <CheckCheck className="w-5 h-5" />
                Bump / Complete Order
              </button>
            )}

            {order.status === 'served' && (
              <div className="w-full h-14 bg-surface-container text-on-surface-variant font-bold rounded-2xl flex items-center justify-center gap-2 border border-outline-variant/30">
                <CheckCheck className="w-5 h-5" />
                Order Completed
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.print()}
                className="h-14 bg-surface-container-lowest text-on-surface-variant border border-outline font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-surface-container transition-all"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => onToggleRush(order.orderId)}
                className={`h-14 border font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${
                  order.isRush
                    ? 'bg-error text-on-error border-error'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                }`}
              >
                <Flag className="w-4 h-4" />
                {order.isRush ? 'Unflag' : 'Flag Issue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsScreen;
