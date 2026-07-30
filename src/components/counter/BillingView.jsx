import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO, DISHES } from '../../utils/mockData';
import {
  Users,
  Receipt,
  Plus,
  Trash2,
  Percent,
  Scissors,
  Printer,
  ArrowRight,
  Utensils,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const BillingView = ({ onProceedToPayment, selectedBillOrder, setSelectedBillOrder }) => {
  const { waiterTables, kitchenOrders, billRequests } = useOrder();

  // Local state for bill adjustments
  const [discountType, setDiscountType] = useState('none'); // 'none' | '5' | '10' | '15' | 'custom'
  const [customDiscount, setCustomDiscount] = useState('');
  const [isServiceChargeAdded, setIsServiceChargeAdded] = useState(false); // No tip by default
  const [splitCount, setSplitCount] = useState(2);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [searchTable, setSearchTable] = useState('');

  // Default demo check if no order is selected
  const defaultItems = [
    { id: 'b-1', name: 'Special Chicken Dum Biryani', quantity: 2, price: 300.00 },
    { id: 'b-2', name: 'Aritaku Bojanam (Veg)', quantity: 1, price: 250.00 },
    { id: 'b-3', name: 'Gobi 65', quantity: 1, price: 220.00 },
    { id: 'b-4', name: 'Sweet Lassi', quantity: 2, price: 100.00 }
  ];

  const currentOrder = selectedBillOrder || {
    orderId: 'ORD-8045',
    tableNumber: '05',
    serverName: 'Elena Vance',
    guestCount: 2,
    items: defaultItems,
    createdAt: new Date().toISOString()
  };

  const handleSelectTable = (tbl) => {
    const matchedKitchen = kitchenOrders.find((k) => k.tableNumber === tbl.tableNumber);
    const matchedBillReq = billRequests.find((b) => b.tableNumber === tbl.tableNumber);

    let items = defaultItems;
    if (matchedKitchen && matchedKitchen.items && matchedKitchen.items.length > 0) {
      items = matchedKitchen.items.map((it) => {
        const dish = DISHES.find((d) => d.id === it.dishId) || {};
        return {
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          price: dish.price || 180.00
        };
      });
    }

    setSelectedBillOrder({
      orderId: matchedKitchen?.orderId || `ORD-TBL-${tbl.tableNumber}`,
      tableNumber: tbl.tableNumber,
      serverName: tbl.serverName || 'Elena Vance',
      guestCount: tbl.guestCount || 2,
      billId: matchedBillReq?.id,
      items,
      createdAt: new Date().toISOString()
    });
  };

  // Calculations
  const subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (discountType === '5') discountAmount = subtotal * 0.05;
  else if (discountType === '10') discountAmount = subtotal * 0.10;
  else if (discountType === '15') discountAmount = subtotal * 0.15;
  else if (discountType === 'custom') discountAmount = parseFloat(customDiscount) || 0;

  const packagingCharge = 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount + packagingCharge);
  const gst = taxableAmount * (RESTAURANT_INFO.taxRate || 0.05); // 5% GST
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = taxableAmount + gst;
  const tipAmount = isServiceChargeAdded ? subtotal * 0.05 : 0; // optional 5% staff tip
  const totalPayable = total + tipAmount;
  const grandTotal = totalPayable;

  const perPersonSplit = (grandTotal / (splitCount || 1)).toFixed(2);

  const activeTablesList = waiterTables.filter((t) =>
    searchTable ? t.tableNumber.includes(searchTable) : true
  );

  const handleProceed = () => {
    const finalBillData = {
      ...currentOrder,
      subtotal,
      discountAmount,
      tax,
      vat,
      serviceCharge,
      grandTotal,
      items: currentOrder.items
    };
    onProceedToPayment(finalBillData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left 4 Cols: Active Tables / Orders Selection */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-stone-700 uppercase font-mono tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-600" />
              Active Tables & Checks
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {waiterTables.filter((t) => t.status !== 'available').length} Occupied
            </span>
          </div>

          {/* Quick Table Search */}
          <input
            type="text"
            placeholder="Search Table #..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-500 mb-3"
          />

          {/* Table Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {activeTablesList.map((tbl) => {
              const isSelected = currentOrder.tableNumber === tbl.tableNumber;
              const hasBillRequest = billRequests.some(
                (b) => b.tableNumber === tbl.tableNumber && b.status === 'pending'
              );

              return (
                <button
                  key={tbl.tableNumber}
                  onClick={() => handleSelectTable(tbl)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 text-stone-900 shadow-sm'
                      : tbl.status === 'available'
                      ? 'bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300'
                      : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  {hasBillRequest && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm">T-{tbl.tableNumber}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        hasBillRequest
                          ? 'bg-amber-500 text-white font-bold'
                          : tbl.status === 'bill_requested'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : tbl.status === 'cooking'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : tbl.status === 'ready'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {hasBillRequest ? 'Bill Ready' : tbl.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500 font-mono flex items-center justify-between">
                    <span>{tbl.serverName || 'Elena'}</span>
                    <span className="font-bold text-amber-700">
                      ₹{(tbl.totalBill || 47.46).toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Walk-In Check Button */}
          <button
            onClick={() =>
              setSelectedBillOrder({
                orderId: `ORD-WALKIN-${Date.now().toString().slice(-4)}`,
                tableNumber: 'Walk-In',
                serverName: 'Counter Express',
                guestCount: 1,
                items: [
                  { id: 'w-1', name: 'Chicken Dum Biryani', quantity: 1, price: 250 },
                  { id: 'w-2', name: 'Lime & Mint', quantity: 1, price: 120 }
                ],
                createdAt: new Date().toISOString()
              })
            }
            className="w-full mt-3 py-2 bg-cream border border-border hover:border-saffron-600/40 hover:bg-sand rounded-xl text-xs font-semibold text-maroon-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Quick Counter Sale</span>
          </button>
        </div>
      </div>

      {/* Right 8 Cols: Billing Worksheet */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-5">
          
          {/* Bill Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif font-bold text-stone-900">
                  Table #{currentOrder.tableNumber}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-mono font-medium">
                  {currentOrder.orderId}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Server: {currentOrder.serverName} • Guests: {currentOrder.guestCount}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSplitModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-xs text-stone-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Scissors className="w-3.5 h-3.5 text-amber-600" />
                <span>Split Bill</span>
              </button>

              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 text-xs text-stone-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span>Pre-Bill Check</span>
              </button>
            </div>
          </div>

          {/* Itemized Table Check List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currentOrder.items.map((item, idx) => (
                  <tr key={item.id || idx} className="text-stone-800 hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-sans font-medium text-stone-900">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right text-stone-500">₹{item.price.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Discount & Adjustments Panel */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-stone-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-600" />
                Apply Discount
              </span>

              <div className="flex items-center gap-1.5">
                {['none', '5', '10', '15'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscountType(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      discountType === d
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {d === 'none' ? 'None' : `${d}%`}
                  </button>
                ))}
                
                <button
                  onClick={() => setDiscountType('custom')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    discountType === 'custom'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {discountType === 'custom' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-mono text-stone-600">Discount Amount (₹):</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-500 w-28"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-stone-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-stone-700">
                <input
                  type="checkbox"
                  checked={isServiceChargeAdded}
                  onChange={(e) => setIsServiceChargeAdded(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-amber-500"
                />
                Include 5% Optional Staff Tip
              </label>

              <span className="text-xs font-mono text-stone-600">
                ₹{tipAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 italic mt-1">The staff tip is completely optional and is not a government tax or restaurant service charge.</p>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-stone-200 pt-3 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Applied:</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {packagingCharge > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Packaging Charge:</span>
                <span>₹{packagingCharge.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>GST @ 5%:</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="pl-2 flex justify-between text-[10px] text-stone-500">
              <span>CGST @ 2.5%:</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="pl-2 flex justify-between text-[10px] text-stone-500">
              <span>SGST @ 2.5%:</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-stone-600 border-t border-stone-100 pt-1">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-stone-700">
              <span>Optional Staff Tip:</span>
              <span>₹{tipAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t-2 border-stone-900 mt-1">
              <span>Total Payable:</span>
              <span className="text-maroon-800 font-mono">₹{totalPayable.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed to Payment Action */}
          <button
            onClick={handleProceed}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/20"
          >
            <span>Proceed to Payment Tender</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Bill Calculator Modal */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-600" />
                Split Bill Calculator
              </h3>
              <button
                onClick={() => setIsSplitModalOpen(false)}
                className="text-stone-500 hover:text-stone-900 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">Total Check Amount:</span>
                <span className="text-amber-700 font-bold text-sm">₹{grandTotal.toFixed(2)}</span>
              </div>

              <div>
                <label className="text-xs text-stone-600 block mb-1.5">Number of Guests / Splits:</label>
                <div className="flex items-center gap-3">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSplitCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        splitCount === num
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {num} Way
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-1">
                <span className="text-xs text-amber-900 font-sans">Each Guest Pays:</span>
                <div className="text-2xl font-bold font-mono text-amber-700">₹{perPersonSplit}</div>
                <span className="text-[10px] text-stone-500 block">
                  ({splitCount} equal payments of ₹{perPersonSplit})
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSplitModalOpen(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Pre-Bill Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white text-stone-900 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl font-mono text-xs border border-stone-200">
            <div className="text-center border-b border-stone-300 pb-3">
              <h3 className="font-serif font-bold text-base uppercase text-stone-900">
                {RESTAURANT_INFO.name}
              </h3>
              <p className="text-[10px] text-stone-600">{RESTAURANT_INFO.location}</p>
              <p className="text-[10px] text-stone-500 font-bold mt-1 uppercase tracking-widest">
                *** PRE-BILL CHECK ***
              </p>
            </div>

            <div className="flex justify-between text-[11px] text-stone-600 border-b border-stone-200 pb-2">
              <span>Table: #{currentOrder.tableNumber}</span>
              <span>Server: {currentOrder.serverName}</span>
            </div>

            <div className="space-y-1">
              {currentOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span>₹{(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-stone-400 pt-2 space-y-1 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & VAT:</span>
                <span>₹{(tax + vat).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-stone-300">
                <span>Total Due:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-stone-500 pt-2">
              Gratuity Not Included • Thank You!
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setIsPreviewModalOpen(false);
                }}
                className="flex-1 py-2 bg-amber-600 text-white font-bold rounded-lg text-xs hover:bg-amber-700"
              >
                Print Check
              </button>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="py-2 px-3 bg-stone-200 text-stone-800 font-bold rounded-lg text-xs hover:bg-stone-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BillingView;
