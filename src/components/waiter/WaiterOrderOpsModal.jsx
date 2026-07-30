import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { DISHES } from '../../utils/mockData';
import {
  X,
  AlertTriangle,
  Flame,
  Clock,
  Split,
  GitMerge,
  MoveRight
} from 'lucide-react';

const REJECTION_REASONS = [
  'Sold Out',
  'Ingredient Unavailable',
  'Kitchen Temporarily Paused',
  'Item Available Later',
  'Preparation Not Possible',
  'Other'
];

const REFIRE_REASONS = [
  'Food served cold',
  'Incorrect spice level',
  'Wrong dish delivered',
  'Foreign object / hair',
  'Undercooked / Overcooked',
  'Other'
];

const WaiterOrderOpsModal = ({ isOpen, onClose, modalType, targetOrder, targetItem }) => {
  const {
    acceptRejectOrderItem,
    refireOrderItem,
    splitOrder,
    mergeOrders,
    moveOrderTable,
    waiterTables
  } = useOrder();
  const { showToast } = useToast();

  const [rejectReason, setRejectReason] = useState('Sold Out');
  const [selectedReplacementId, setSelectedReplacementId] = useState('');
  const [refireReason, setRefireReason] = useState('Food served cold');
  const [refireQty, setRefireQty] = useState(1);
  const [refireExplanation, setRefireExplanation] = useState('Preparing a fresh hot replacement immediately.');
  const [discardOriginal, setDiscardOriginal] = useState(true);

  const [selectedSplitItems, setSelectedSplitItems] = useState([]);
  const [moveDestinationTableId, setMoveDestinationTableId] = useState('');
  const [moveConflictChoice, setMoveConflictChoice] = useState('MERGE');

  if (!isOpen || !targetOrder) return null;

  const handleRejectSubmit = () => {
    const replacementDish = DISHES.find(d => d.id === selectedReplacementId) || null;
    acceptRejectOrderItem(
      targetOrder.orderId,
      targetItem.orderItemId || targetItem.id,
      'REJECT',
      rejectReason,
      replacementDish ? { dishId: replacementDish.id, name: replacementDish.name, price: replacementDish.price } : null
    );
    showToast(`Rejected "${targetItem.name}" (${rejectReason}). Customer notified.`, 'info');
    onClose();
  };

  const handleRefireSubmit = () => {
    refireOrderItem(
      targetOrder.orderId,
      targetItem.orderItemId || targetItem.id,
      {
        reason: refireReason,
        quantity: refireQty,
        staffName: 'Rahul Sharma',
        customerExplanation: refireExplanation,
        discardOriginalItem: discardOriginal
      }
    );
    showToast(`Re-fire priority ticket created for "${targetItem.name}"!`, 'success');
    onClose();
  };

  const handleSplitSubmit = () => {
    if (selectedSplitItems.length === 0) {
      showToast('Select at least one item to split.', 'warning');
      return;
    }
    const newOrd = splitOrder(targetOrder.orderId, selectedSplitItems);
    showToast(`Order split successfully! New Order #${newOrd?.orderId || 'ORD-1052'} created.`, 'success');
    onClose();
  };

  const handleMoveSubmit = () => {
    if (!moveDestinationTableId) {
      showToast('Select a destination table.', 'warning');
      return;
    }
    const destTable = waiterTables.find(t => t.tableId === moveDestinationTableId);
    if (destTable && destTable.currentOrderId && destTable.currentOrderId !== targetOrder.orderId) {
      if (moveConflictChoice === 'MERGE') {
        mergeOrders(targetOrder.orderId, destTable.currentOrderId, 'Rahul Sharma');
        moveOrderTable(targetOrder.orderId, targetOrder.tableId, moveDestinationTableId, 'Rahul Sharma');
        showToast(`Moved and merged order into Table ${destTable.tableNumber}!`, 'success');
      } else {
        moveOrderTable(targetOrder.orderId, targetOrder.tableId, moveDestinationTableId, 'Rahul Sharma');
        showToast(`Moved order to Table ${destTable.tableNumber} as separate order.`, 'success');
      }
    } else {
      moveOrderTable(targetOrder.orderId, targetOrder.tableId, moveDestinationTableId, 'Rahul Sharma');
      showToast(`Order #${targetOrder.orderId} moved to Table ${moveDestinationTableId.replace('TABLE-', '')}!`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md border border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            {modalType === 'REJECT' && <AlertTriangle className="w-5 h-5 text-error" />}
            {modalType === 'REFIRE' && <Flame className="w-5 h-5 text-error animate-pulse" />}
            {modalType === 'SPLIT' && <Split className="w-5 h-5 text-primary" />}
            {modalType === 'MOVE' && <MoveRight className="w-5 h-5 text-primary" />}
            <h3 className="font-bold text-on-surface text-base">
              {modalType === 'REJECT' && `Reject Item — ${targetItem?.name}`}
              {modalType === 'REFIRE' && `Re-fire Ticket — ${targetItem?.name}`}
              {modalType === 'SPLIT' && `Split Order #${targetOrder.orderId}`}
              {modalType === 'MOVE' && `Move Order #${targetOrder.orderId}`}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* REJECT ITEM MODAL */}
          {modalType === 'REJECT' && (
            <>
              <div className="bg-error/10 p-3 rounded-2xl border border-error/20 text-error space-y-1">
                <p className="font-bold">Item Unavailable Action</p>
                <p className="text-[11px] leading-relaxed">
                  Rejecting this single item will update the order status to <strong>Partially Accepted</strong> and notify the customer to choose a replacement or remove it.
                </p>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Reason for Rejection *</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-primary/20"
                >
                  {REJECTION_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Suggest Replacement Item (Optional)</label>
                <select
                  value={selectedReplacementId}
                  onChange={(e) => setSelectedReplacementId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                >
                  <option value="">No replacement suggested</option>
                  {DISHES.map(d => (
                    <option key={d.id} value={d.id}>{d.name} · ₹{d.price}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold">
                  Cancel
                </button>
                <button onClick={handleRejectSubmit} className="px-5 py-2 rounded-xl bg-error text-on-error font-bold shadow-sm">
                  Confirm Rejection
                </button>
              </div>
            </>
          )}

          {/* REFIRE ITEM MODAL */}
          {modalType === 'REFIRE' && (
            <>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 space-y-1 font-medium">
                <p className="font-bold flex items-center gap-1"><Flame className="w-4 h-4 text-amber-600" /> High Priority Re-fire</p>
                <p className="text-[11px]">This creates a priority KOT for the kitchen linked to original item <strong>#{targetItem?.orderItemId || targetItem?.id}</strong>.</p>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Re-fire Reason *</label>
                <select
                  value={refireReason}
                  onChange={(e) => setRefireReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                >
                  {REFIRE_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Quantity to Re-fire</label>
                <input
                  type="number"
                  min="1"
                  max={targetItem?.quantity || 5}
                  value={refireQty}
                  onChange={(e) => setRefireQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Customer-Facing Explanation</label>
                <textarea
                  value={refireExplanation}
                  onChange={(e) => setRefireExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                  rows="2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="discardCheck"
                  checked={discardOriginal}
                  onChange={(e) => setDiscardOriginal(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="discardCheck" className="text-on-surface font-medium">Discard original item in kitchen record</label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold">
                  Cancel
                </button>
                <button onClick={handleRefireSubmit} className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold shadow-sm">
                  Confirm Re-fire
                </button>
              </div>
            </>
          )}

          {/* SPLIT ORDER MODAL */}
          {modalType === 'SPLIT' && (
            <>
              <p className="text-on-surface-variant leading-relaxed">
                Select items from <strong>Order #{targetOrder.orderId}</strong> to move into a separate new order.
              </p>

              <div className="space-y-2 border border-outline-variant/30 p-3 rounded-2xl bg-surface-container-low max-h-48 overflow-y-auto">
                {targetOrder.items.map((it) => {
                  const itemId = it.orderItemId || it.id;
                  const isSelected = selectedSplitItems.includes(itemId);
                  return (
                    <label key={itemId} className="flex items-center gap-3 p-2 bg-surface-container-lowest rounded-xl cursor-pointer border border-outline-variant/20 hover:border-primary/40">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSplitItems([...selectedSplitItems, itemId]);
                          else setSelectedSplitItems(selectedSplitItems.filter(id => id !== itemId));
                        }}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface">{it.quantity} × {it.name}</p>
                        <p className="text-[11px] text-on-surface-variant font-mono">₹{(it.unitPrice || 0) * it.quantity}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold">
                  Cancel
                </button>
                <button onClick={handleSplitSubmit} className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm">
                  Split Selected Items
                </button>
              </div>
            </>
          )}

          {/* MOVE ORDER MODAL */}
          {modalType === 'MOVE' && (
            <>
              <div className="bg-primary/5 p-3 rounded-2xl border border-primary/20 text-on-surface space-y-1">
                <p className="font-bold text-primary">Move Order #{targetOrder.orderId}</p>
                <p className="text-[11px]">Current Table: <strong>Table {targetOrder.tableNumber}</strong></p>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Select Destination Table *</label>
                <select
                  value={moveDestinationTableId}
                  onChange={(e) => setMoveDestinationTableId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                >
                  <option value="">Choose table...</option>
                  {waiterTables.filter(t => t.tableId !== targetOrder.tableId).map(t => (
                    <option key={t.tableId} value={t.tableId}>
                      Table {t.tableNumber} ({t.capacity} seats) — {t.status} {t.currentOrderId ? `(Occupied #${t.currentOrderId})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {moveDestinationTableId && waiterTables.find(t => t.tableId === moveDestinationTableId)?.currentOrderId && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Destination Table is Occupied!
                  </p>
                  <p className="text-[11px]">Table {moveDestinationTableId.replace('TABLE-', '')} currently has active order.</p>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="conflictChoice"
                        value="MERGE"
                        checked={moveConflictChoice === 'MERGE'}
                        onChange={() => setMoveConflictChoice('MERGE')}
                        className="accent-primary"
                      />
                      <span>Merge Orders Together</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="conflictChoice"
                        value="SEPARATE"
                        checked={moveConflictChoice === 'SEPARATE'}
                        onChange={() => setMoveConflictChoice('SEPARATE')}
                        className="accent-primary"
                      />
                      <span>Keep Separate Orders for Same Table</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold">
                  Cancel
                </button>
                <button onClick={handleMoveSubmit} className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm">
                  Confirm Table Move
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaiterOrderOpsModal;
