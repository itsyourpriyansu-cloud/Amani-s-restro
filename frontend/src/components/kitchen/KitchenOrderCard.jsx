import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import {
  Clock,
  CheckCircle2,
  Square,
  AlertOctagon,
  CookingPot,
  RotateCcw,
  Sparkles,
  Eye,
  GripVertical,
  AlertTriangle,
  Flame,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const KitchenOrderCard = ({
  order,
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  filterStation = 'All'
}) => {
  const navigate = useNavigate();
  const { prefs } = useKitchenPrefs();
  const [elapsedSeconds, setElapsedSeconds] = useState(order.elapsedSeconds || 0);

  // Card expansion state - default compact/collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // Set up dnd-kit draggable on the card
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.orderId
  });
  const dragStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  useEffect(() => {
    const createdTime = new Date(order.createdAt).getTime();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - createdTime) / 1000);
      setElapsedSeconds(seconds > 0 ? seconds : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isOverdue = minutes >= 15 || order.isRush;
  const isApproaching = minutes >= 10 && minutes < 15;

  // Filter items by station
  const displayedItems = filterStation === 'All' || filterStation === 'MY_STATION'
    ? order.items
    : order.items.filter((it) => it.station === filterStation);

  if (displayedItems.length === 0 && filterStation !== 'All' && filterStation !== 'MY_STATION') {
    return null;
  }

  // Note classification
  const noteText = order.specialNotes || '';
  const isAllergy = noteText.toLowerCase().includes('allergy') || noteText.toLowerCase().includes('gluten') || noteText.toLowerCase().includes('nut') || displayedItems.some((i) => i.allergyAlert);
  const isTableNote = noteText.toLowerCase().includes('table') || noteText.toLowerCase().includes('course') || noteText.toLowerCase().includes('kid');

  // Google Material UI status chip styling
  let statusChipStyle = 'bg-gray-100 text-gray-700';
  let statusLabel = 'NEW';
  if (isOverdue || order.isRush) {
    statusChipStyle = 'bg-[#FCE8E6] text-[#C5221F] font-bold';
    statusLabel = 'OVERDUE';
  } else if (order.status === 'preparing') {
    statusChipStyle = 'bg-[#FEF7E0] text-[#B06000] font-bold';
    statusLabel = 'PREPARING';
  } else if (order.status === 'ready') {
    statusChipStyle = 'bg-[#E6F4EA] text-[#137333] font-bold';
    statusLabel = 'READY';
  } else if (order.status === 'served') {
    statusChipStyle = 'bg-gray-100 text-gray-600 font-medium';
    statusLabel = 'COMPLETED';
  }

  // SLA Timer Styling
  let timerBadgeStyle = 'bg-gray-100 text-gray-700 font-medium';
  if (isOverdue) timerBadgeStyle = 'bg-[#FCE8E6] text-[#C5221F] font-bold';
  else if (isApproaching) timerBadgeStyle = 'bg-[#FEF7E0] text-[#B06000] font-bold';

  // Compact item summary string for collapsed view
  const itemSummaryText = displayedItems
    .map((it) => `${it.quantity}× ${it.name}`)
    .join(', ');

  const totalItemCount = displayedItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const completedItemCount = displayedItems.filter((it) => it.isDone).length;

  const handleHeaderClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`${isDragging ? 'relative z-40 opacity-40 shadow-none' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="rounded-2xl bg-white shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        {/* Google Card Header: Clean, borderless, table number ON TOP */}
        <div
          onClick={handleHeaderClick}
          className="p-3.5 bg-white hover:bg-gray-50/60 cursor-pointer transition-colors flex flex-col gap-2 shrink-0 select-none"
        >
          {/* Top Row 1: Drag handle, Table Number ON TOP, SLA Timer & Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Drag Handle */}
              <div
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                className="p-1 -ml-1.5 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                title="Drag ticket to move"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Table Number ON TOP - Prominent and Hero */}
              <h3 className="font-extrabold text-2xl tracking-tight text-gray-900 leading-none">
                Table {order.tableNumber}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Rush Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRush(order.orderId);
                }}
                className={`p-1.5 rounded-xl text-xs transition-colors ${
                  order.isRush
                    ? 'bg-[#C5221F] text-white'
                    : 'bg-gray-100 text-gray-500 hover:text-[#C5221F] hover:bg-[#FCE8E6]'
                }`}
                title="Toggle Rush Priority"
              >
                <Flame className="w-3.5 h-3.5" />
              </button>

              {/* SLA Timer */}
              {prefs.showTimers && (
                <div className={`px-2.5 py-1 rounded-xl text-xs font-mono flex items-center gap-1 ${timerBadgeStyle}`}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{formattedTime}</span>
                </div>
              )}

              {/* Expand / Collapse Chevron Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title={isExpanded ? 'Collapse ticket details' : 'Expand ticket details'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Row 2: Status Chips & Order Details stacked BELOW Table Number */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
            <div className="flex items-center gap-1.5">
              {/* Status Chip */}
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide shrink-0 ${statusChipStyle}`}>
                {statusLabel}
              </span>

              {/* High priority Allergy alert tag */}
              {isAllergy && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FCE8E6] text-[#C5221F] font-bold text-[11px] uppercase flex items-center gap-1 shrink-0">
                  <AlertTriangle className="w-3 h-3 text-[#C5221F]" />
                  <span>ALLERGY</span>
                </span>
              )}
            </div>

            {/* Order #, Items & Waiter */}
            <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <span>
                Order <strong className="text-gray-900 font-bold">#{order.orderId}</strong> · {totalItemCount} item{totalItemCount === 1 ? '' : 's'}
                {completedItemCount > 0 ? ` (${completedItemCount}/${displayedItems.length} done)` : ''}
              </span>
              {order.serverName && (
                <span className="text-xs text-gray-500 flex items-center gap-1 border-l border-gray-200 pl-2">
                  <User className="w-3 h-3 text-gray-400" />
                  {order.serverName}
                </span>
              )}
            </div>
          </div>

          {/* Minimal Item Preview Line when Collapsed */}
          {!isExpanded && (
            <div className="flex items-center justify-between gap-2 pt-1.5">
              <p className="font-medium text-xs text-gray-700 truncate bg-gray-50 px-2.5 py-1.5 rounded-xl flex-1">
                {itemSummaryText}
              </p>

              {/* Quick Primary Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (order.status === 'received') onUpdateStatus(order.orderId, 'preparing');
                  else if (order.status === 'preparing') onUpdateStatus(order.orderId, 'ready');
                  else if (order.status === 'ready') onUpdateStatus(order.orderId, 'served');
                  else if (order.status === 'served') onUpdateStatus(order.orderId, 'preparing');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0 text-white transition-all active:scale-98 shadow-xs ${
                  order.status === 'received'
                    ? 'bg-[#A30F3B] hover:bg-[#850c2f]'
                    : order.status === 'preparing'
                    ? 'bg-[#B06000] hover:bg-[#8c4c00]'
                    : order.status === 'ready'
                    ? 'bg-[#137333] hover:bg-[#0e5726]'
                    : 'bg-gray-700 hover:bg-gray-800'
                }`}
              >
                {order.status === 'received' && 'Accept'}
                {order.status === 'preparing' && 'Ready'}
                {order.status === 'ready' && 'Pickup'}
                {order.status === 'served' && 'Recall'}
              </button>
            </div>
          )}
        </div>

        {/* Expanded Details Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white flex flex-col"
            >
              {/* Structured Special Notes Banner */}
              {noteText && (
                <div>
                  {isAllergy ? (
                    <div className="bg-[#FCE8E6] p-3 text-xs text-[#C5221F] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-wider">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-[#C5221F]" />
                        <span>ALLERGY ALERT</span>
                      </div>
                      <p className="font-semibold text-xs leading-snug text-gray-900">
                        {noteText}
                      </p>
                    </div>
                  ) : isTableNote ? (
                    <div className="bg-[#FEF7E0] p-3 text-xs text-[#B06000] flex items-start gap-2">
                      <AlertOctagon className="w-4 h-4 shrink-0 text-[#B06000] mt-0.5" />
                      <div>
                        <span className="font-bold uppercase text-[10px] block">TABLE NOTE</span>
                        <p className="font-semibold text-xs leading-snug text-gray-900">{noteText}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-3 text-xs text-blue-800">
                      <span className="font-bold uppercase text-[10px] block text-blue-600">SERVICE NOTE</span>
                      <p className="font-semibold text-xs leading-snug text-gray-900">{noteText}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Items List grouped by station */}
              <div className="p-3.5 space-y-3 bg-gray-50/50">
                {Object.entries(
                  displayedItems.reduce((acc, item) => {
                    const stationName = (item.station || 'MAIN KITCHEN').replace(/_/g, ' ');
                    if (!acc[stationName]) acc[stationName] = [];
                    acc[stationName].push(item);
                    return acc;
                  }, {})
                ).map(([stationHeader, items]) => (
                  <div key={stationHeader} className="space-y-2">
                    {/* Station Chip */}
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 font-bold text-[11px] uppercase tracking-wider max-w-full truncate">
                      {stationHeader}
                    </div>

                    {items.map((item) => {
                      const formattedModifiers = [];
                      if (item.makeVegan) formattedModifiers.push('MAKE VEGAN (NO DAIRY)');
                      if (item.jainPreparation) formattedModifiers.push('JAIN PREPARATION (NO ONION/GARLIC)');

                      if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
                        item.selectedOptions.forEach((opt) => formattedModifiers.push(opt));
                      } else if (item.modifiers && Array.isArray(item.modifiers)) {
                        item.modifiers.forEach((m) => formattedModifiers.push(typeof m === 'string' ? m : m.name));
                      }

                      const isHold = item.readinessStatus === 'HOLD' || item.courseAction === 'HOLD';
                      const isRefire = item.isRefire;

                      return (
                        <div
                          key={item.id || item.orderItemId || item.cartItemId || item.name}
                          onClick={() => onToggleItemDone(order.orderId, item.id || item.orderItemId || item.cartItemId)}
                          className={`p-3 rounded-2xl bg-white shadow-2xs transition-all cursor-pointer ${
                            item.isDone ? 'opacity-60 bg-gray-100/80' : 'hover:shadow-xs'
                          }`}
                        >
                          {/* Badges for RE-FIRE / HOLD */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            {isRefire && (
                              <span className="bg-[#C5221F] text-white font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Flame className="w-3 h-3" /> RE-FIRE · PRIORITY HIGH
                              </span>
                            )}
                            {isHold && (
                              <span className="bg-[#FEF7E0] text-[#B06000] font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#B06000]" /> HOLD — Wait for request
                              </span>
                            )}
                          </div>

                          {/* Item Row */}
                          <div className="flex items-start gap-2.5">
                            {/* Checkbox Target */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleItemDone(order.orderId, item.id || item.orderItemId || item.cartItemId);
                              }}
                              className="mt-0.5 p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                              title={item.isDone ? 'Mark item pending' : 'Mark item completed'}
                            >
                              {item.isDone ? (
                                <CheckCircle2 className="w-6 h-6 text-[#137333]" />
                              ) : (
                                <Square className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>

                            {/* Quantity & Item Name */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono font-extrabold text-lg text-gray-900">
                                  {item.quantity} ×
                                </span>
                                <h4
                                  className={`font-bold text-base text-gray-900 leading-snug ${
                                    item.isDone ? 'text-gray-500 line-through' : ''
                                  }`}
                                >
                                  {item.name}
                                </h4>
                              </div>

                              {/* Modifiers Box */}
                              {formattedModifiers.length > 0 && (
                                <div className="mt-2 p-2.5 rounded-xl bg-gray-100 text-gray-700 font-mono text-xs space-y-0.5">
                                  {formattedModifiers.map((mod, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                                      <span>▪</span>
                                      <span>{mod}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Allergy Item Alert */}
                              {item.allergyAlert && (
                                <div className="mt-2 p-2.5 rounded-xl bg-[#FCE8E6] text-[#C5221F] font-mono text-xs font-bold flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 shrink-0" />
                                  <span>{item.allergyAlert}</span>
                                </div>
                              )}

                              {/* Special Instruction */}
                              {item.notes && (
                                <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded-xl italic">
                                  "{item.notes}"
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Expanded Card Footer Action Bar */}
              <div className="p-3.5 bg-white flex items-center gap-2 shrink-0 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/kitchen/orders/${order.orderId}`)}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="View full order details page"
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </button>

                {order.status === 'received' && (
                  <button
                    onClick={() => onUpdateStatus(order.orderId, 'preparing')}
                    className="flex-1 py-2.5 bg-[#A30F3B] hover:bg-[#850c2f] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <CookingPot className="w-4 h-4" />
                    <span>Accept Order</span>
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => onUpdateStatus(order.orderId, 'ready')}
                    className="flex-1 py-2.5 bg-[#B06000] hover:bg-[#8c4c00] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Ready</span>
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => onUpdateStatus(order.orderId, 'served')}
                    className="flex-1 py-2.5 bg-[#137333] hover:bg-[#0e5726] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm Pickup</span>
                  </button>
                )}

                {order.status === 'served' && (
                  <button
                    onClick={() => onUpdateStatus(order.orderId, 'preparing')}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recall Ticket</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default KitchenOrderCard;
