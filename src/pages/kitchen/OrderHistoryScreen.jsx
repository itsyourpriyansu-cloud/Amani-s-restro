import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Printer,
  Eye,
  ListOrdered,
  CheckCircle2,
  Activity,
  ArrowUpDown
} from 'lucide-react';

const STATUS_META = {
  received: { label: 'New', badge: 'bg-secondary-container/30 text-on-secondary-container' },
  preparing: { label: 'Preparing', badge: 'bg-primary-container/20 text-primary' },
  ready: { label: 'Ready', badge: 'bg-tertiary-container/30 text-on-tertiary-container' },
  served: { label: 'Completed', badge: 'bg-surface-container-highest text-on-surface-variant' },
};

const STATUS_FILTERS = [
  { id: 'all', label: 'All Status' },
  { id: 'received', label: 'New' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'served', label: 'Completed' },
];

const formatDateTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const elapsedLabel = (isoString) => {
  const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (minutes < 1) return '<1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

const OrderHistoryScreen = ({ orders = [] }) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortLatestFirst, setSortLatestFirst] = useState(true);

  const totalOrders = orders.length;
  const completedTodayCount = orders.filter((o) => o.status === 'served').length;
  const activeNowCount = orders.filter((o) => o.status !== 'served').length;

  const visibleOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.tableNumber.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortLatestFirst ? -diff : diff;
    });

    return list;
  }, [orders, statusFilter, searchQuery, sortLatestFirst]);

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Order History</h2>
          <p className="text-on-surface-variant">
            Review kitchen tickets across every status — <span className="text-primary font-semibold">{totalOrders} total orders</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
          <button
            onClick={() => setSortLatestFirst((v) => !v)}
            className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortLatestFirst ? 'Latest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order #, Table, or Item..."
          className="w-full h-11 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder:text-on-surface-variant/60"
        />
      </div>

      {/* Order List */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 divide-y divide-outline-variant/10 overflow-hidden">
        {visibleOrders.length === 0 && (
          <div className="py-16 text-center text-on-surface-variant text-sm">
            No orders match your filters.
          </div>
        )}

        {visibleOrders.map((order) => {
          const isExpanded = expandedId === order.orderId;
          const statusMeta = STATUS_META[order.status] || STATUS_META.received;

          return (
            <div key={order.orderId} className="transition-all">
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.orderId)}
                className="w-full p-5 flex flex-wrap items-center justify-between gap-4 text-left hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-5 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Order ID</span>
                    <span className="font-black text-primary text-sm">#{order.orderId}</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-outline-variant/30" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Table</span>
                    <span className="font-bold text-on-surface">{order.tableNumber}</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-outline-variant/30" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Date &amp; Time</span>
                    <span className="text-sm font-medium text-on-surface">{formatDateTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusMeta.badge}`}>
                    {statusMeta.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-outline-variant/20 p-5 bg-surface-container-low/40 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Ordered Items</h4>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>
                            <span className="text-primary font-bold">{item.quantity}x</span> {item.name}
                          </span>
                          <span className="text-on-surface-variant text-xs">{item.station}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase block mb-1">Placed At</span>
                        <span className="text-sm font-bold text-on-surface">{formatDateTime(order.createdAt)}</span>
                      </div>
                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase block mb-1">
                          {order.status === 'served' ? 'Total Time' : 'Elapsed'}
                        </span>
                        <span className="text-sm font-bold text-on-surface">{elapsedLabel(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 h-11 bg-surface-container-lowest border border-outline text-on-surface-variant font-semibold rounded-xl text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                      <button
                        onClick={() => navigate(`/kitchen/orders/${order.orderId}`)}
                        className="flex-1 h-11 bg-primary text-on-primary font-semibold rounded-xl text-sm shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total Orders</p>
            <p className="text-xl font-bold text-on-surface">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Completed</p>
            <p className="text-xl font-bold text-on-surface">{completedTodayCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Active Now</p>
            <p className="text-xl font-bold text-on-surface">{activeNowCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryScreen;
