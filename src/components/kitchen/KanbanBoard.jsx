import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay
} from '@dnd-kit/core';
import KitchenOrderCard from './KitchenOrderCard';
import { Inbox, CookingPot, CheckCircle2, Archive } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const ACTIVE_COLUMNS = [
  {
    id: 'received',
    title: 'NEW ORDERS',
    subtitle: 'Awaiting kitchen acceptance',
    icon: Inbox,
    badgeClass: 'bg-[#F9E9EE] text-[#A30F3B]',
    dotAccent: 'bg-[#A30F3B]'
  },
  {
    id: 'preparing',
    title: 'PREPARING',
    subtitle: 'Currently cooking',
    icon: CookingPot,
    badgeClass: 'bg-[#FEF7E0] text-[#B06000]',
    dotAccent: 'bg-[#B06000]'
  },
  {
    id: 'ready',
    title: 'READY',
    subtitle: 'Waiting for pickup',
    icon: CheckCircle2,
    badgeClass: 'bg-[#E6F4EA] text-[#137333]',
    dotAccent: 'bg-[#137333]'
  }
];

const COMPLETED_COLUMN = {
  id: 'served',
  title: 'COMPLETED TODAY',
  subtitle: 'Served and cleared tickets',
  icon: Archive,
  badgeClass: 'bg-gray-100 text-gray-600',
  dotAccent: 'bg-gray-600'
};

const KanbanColumn = ({ col, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 rounded-2xl transition-colors space-y-3 touch-pan-y ${
        isOver ? 'bg-[#F9E9EE]/40 ring-2 ring-[#A30F3B]/30 ring-inset' : ''
      }`}
    >
      {children}
    </div>
  );
};

const KanbanBoard = ({
  orders = [],
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  filterStation = 'All',
  activeFilter = 'ALL',
  searchQuery = '',
  densityMode = 'comfortable'
}) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [showCompletedPanel, setShowCompletedPanel] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  // Filter orders based on searchQuery, station, and active filter flags
  const filteredOrders = orders.filter((order) => {
    // 1. Search Query Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTable = (order.tableNumber || '').toLowerCase().includes(q);
      const matchId = (order.orderId || '').toLowerCase().includes(q);
      const matchItem = order.items?.some((it) => (it.name || '').toLowerCase().includes(q));
      if (!matchTable && !matchId && !matchItem) return false;
    }

    // 2. Active Quick Filter
    if (activeFilter === 'DELAYED') {
      const isDelayed = order.elapsedSeconds > 900 || order.isRush;
      if (!isDelayed) return false;
    } else if (activeFilter === 'ALLERGY') {
      const hasAllergy =
        order.specialNotes?.toLowerCase().includes('allergy') ||
        order.specialNotes?.toLowerCase().includes('gluten') ||
        order.items?.some((i) => i.allergyAlert);
      if (!hasAllergy) return false;
    } else if (activeFilter === 'REFIRE') {
      const hasRefire = order.items?.some((i) => i.isRefire);
      if (!hasRefire) return false;
    }

    // 3. Station Filter
    if (filterStation !== 'All' && filterStation !== 'MY_STATION') {
      const hasStationItem = order.items?.some((i) => i.station === filterStation);
      if (!hasStationItem) return false;
    }

    return true;
  });

  const handleDragStart = (event) => {
    const order = filteredOrders.find((o) => o.orderId === event.active.id);
    setActiveOrder(order || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveOrder(null);
    if (!over) return;

    const newStatus = over.id;
    const order = filteredOrders.find((o) => o.orderId === active.id);
    if (order && order.status !== newStatus) {
      onUpdateStatus(order.orderId, newStatus);
    }
  };

  const completedOrders = filteredOrders.filter((o) => o.status === 'served');

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveOrder(null)}
    >
      <div className="flex flex-col h-full space-y-2.5 min-h-0 overflow-hidden">
        {/* Board Sub-header with Completed Switcher */}
        <div className="flex items-center justify-between shrink-0 px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-gray-900">Active Live Queues</h3>
            <span className="text-xs text-gray-500 font-medium">
              ({filteredOrders.filter((o) => o.status !== 'served').length} active)
            </span>
          </div>

          <button
            onClick={() => setShowCompletedPanel(!showCompletedPanel)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              showCompletedPanel
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Completed Today ({completedOrders.length})</span>
          </button>
        </div>

        {/* Board Columns Grid */}
        <div
          className={`grid gap-4 flex-1 min-h-0 overflow-x-auto pb-1 ${
            showCompletedPanel
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
          style={
            !showCompletedPanel
              ? { gridTemplateColumns: 'repeat(3, minmax(320px, 1fr))' }
              : undefined
          }
        >
          {ACTIVE_COLUMNS.map((col) => {
            const ColumnIcon = col.icon;
            const colOrders = filteredOrders.filter((o) => o.status === col.id);

            return (
              <section key={col.id} className="flex flex-col h-full min-w-[320px] max-h-full bg-[#F8F9FA] rounded-2xl p-2.5 min-h-0 border-none shadow-2xs">
                {/* Column Sticky Header - Google UI White Card */}
                <div className="shrink-0 bg-white px-3.5 py-2.5 rounded-xl shadow-xs mb-2.5 border-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dotAccent}`} />
                      <ColumnIcon className="w-4 h-4 text-gray-800" />
                      <h4 className="font-extrabold text-sm text-gray-900 tracking-tight">
                        {col.title}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono ${col.badgeClass}`}>
                      {colOrders.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 pl-4 truncate">{col.subtitle}</p>
                </div>

                {/* Column Scrollable Body */}
                <KanbanColumn col={col}>
                  <AnimatePresence mode="popLayout">
                    {colOrders.length > 0 ? (
                      colOrders.map((order) => (
                        <KitchenOrderCard
                          key={order.orderId}
                          order={order}
                          onUpdateStatus={onUpdateStatus}
                          onToggleItemDone={onToggleItemDone}
                          onToggleRush={onToggleRush}
                          filterStation={filterStation}
                          densityMode={densityMode}
                        />
                      ))
                    ) : (
                      <div className="py-12 px-4 text-center rounded-2xl bg-white/60 shadow-2xs">
                        <ColumnIcon className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-500 font-semibold">
                          No active tickets in {col.title.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </KanbanColumn>
              </section>
            );
          })}

          {/* Optional Completed Panel Column */}
          {showCompletedPanel && (
            <section className="flex flex-col h-full min-w-[320px] max-h-full bg-[#F8F9FA] rounded-2xl p-2.5 min-h-0 border-none shadow-2xs">
              <div className="shrink-0 bg-white px-3.5 py-2.5 rounded-xl shadow-xs mb-2.5 border-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                    <Archive className="w-4 h-4 text-gray-700" />
                    <h4 className="font-extrabold text-sm text-gray-900 tracking-tight">
                      {COMPLETED_COLUMN.title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono bg-gray-100 text-gray-600">
                    {completedOrders.length}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 pl-4 truncate">{COMPLETED_COLUMN.subtitle}</p>
              </div>

              <KanbanColumn col={COMPLETED_COLUMN}>
                <AnimatePresence mode="popLayout">
                  {completedOrders.length > 0 ? (
                    completedOrders.map((order) => (
                      <KitchenOrderCard
                        key={order.orderId}
                        order={order}
                        onUpdateStatus={onUpdateStatus}
                        onToggleItemDone={onToggleItemDone}
                        onToggleRush={onToggleRush}
                        filterStation={filterStation}
                        densityMode={densityMode}
                      />
                    ))
                  ) : (
                    <div className="py-12 px-4 text-center rounded-2xl bg-white/60 shadow-2xs">
                      <Archive className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-500 font-semibold">
                        No completed tickets today
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </KanbanColumn>
            </section>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
        {activeOrder && (
          <div className="rounded-2xl bg-white shadow-2xl p-4 w-[340px] rotate-2 opacity-95">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-base text-gray-900">Table {activeOrder.tableNumber}</span>
              <span className="text-xs font-mono text-[#A30F3B] font-bold">#{activeOrder.orderId}</span>
            </div>
            <p className="text-xs text-gray-500">
              {activeOrder.items?.length || 0} item{(activeOrder.items?.length || 0) === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
