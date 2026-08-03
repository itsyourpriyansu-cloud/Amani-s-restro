import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { DISHES } from '../../utils/mockData';
import { formatInvoiceAmount, formatMenuPrice } from '../../utils/formatters';
import CounterShell from '../../components/layout/CounterShell';
import {
  Banknote,
  CreditCard,
  Wallet,
  QrCode,
  SplitSquareHorizontal,
  Ticket,
  CheckCircle2,
  Delete,
  Sparkles,
  Users,
  AlertTriangle,
  RotateCcw,
  MinusCircle,
  Tag,
  ShieldOff,
  Info,
  X
} from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Credit Card', icon: CreditCard },
  { id: 'debit', label: 'Debit Card', icon: Wallet },
  { id: 'upi', label: 'UPI', icon: QrCode },
  { id: 'split', label: 'Split Payment', icon: SplitSquareHorizontal },
  { id: 'voucher', label: 'Voucher', icon: Ticket },
];

const METHOD_LABELS = {
  cash: 'Cash',
  card: 'Credit Card',
  debit: 'Debit Card',
  upi: 'UPI',
  split: 'Split Payment',
  voucher: 'Voucher',
};

const DEFAULT_BILL = {
  id: 'demo-bill',
  orderId: 'INV-8045',
  tableNumber: '08',
  serverName: 'Ananya Reddy',
  guestCount: 2,
  subtotal: 920.00,
  packagingCharge: 0,
  gst: 46.00,
  tax: 46.00,
  cgst: 23.00,
  sgst: 23.00,
  vat: 0,
  total: 966.00,
  tip: 0,
  totalPayable: 966.00,
  grandTotal: 966.00,
};

const PaymentProcessingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { kitchenOrders, processCounterPayment, toggleRegisterDrawer, registerSession } = useOrder();

  const bill = location.state?.bill || DEFAULT_BILL;

  const items = useMemo(() => {
    const matchedKitchen = kitchenOrders.find((k) => k.tableNumber === bill.tableNumber);
    if (matchedKitchen?.items?.length) {
      return matchedKitchen.items.map((it) => {
        const dish = DISHES.find((d) => d.id === it.dishId) || {};
        return { name: it.name, quantity: it.quantity, price: dish.price || bill.subtotal / (it.quantity || 1) };
      });
    }
    return [
      { name: 'Special Chicken Dum Biryani', quantity: 2, price: 300.00 },
      { name: 'Aritaku Bojanam (Veg)', quantity: 1, price: 250.00 },
      { name: 'Sweet Lassi', quantity: 1, price: 100.00 }
    ];
  }, [kitchenOrders, bill]);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState((bill.totalPayable || bill.grandTotal || 966).toFixed(2));
  const [loyaltyAdded, setLoyaltyAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Split bill state
  const [splitMode, setSplitMode] = useState(null); // null | 'equal' | 'item'
  const [splitCount, setSplitCount] = useState(2);
  const [splitItemSelections, setSplitItemSelections] = useState([]);

  // Partial payment tracking
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer changed mind');
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [showDiscountPanel, setShowDiscountPanel] = useState(false);
  const [discountType, setDiscountType] = useState('PERCENT'); // 'PERCENT' | 'FLAT'
  const [discountValue, setDiscountValue] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [compItemNote, setCompItemNote] = useState('');

  const totalPayableAmount = bill.totalPayable || bill.grandTotal || 966;
  const totalPaid = paymentRecords.reduce((s, r) => s + r.amount, 0);
  const balanceDue = Math.max(0, totalPayableAmount - totalPaid);
  const isFullyPaid = totalPaid >= totalPayableAmount;

  const quickAmounts = useMemo(() => {
    const rounded100 = Math.ceil(totalPayableAmount / 100) * 100;
    return [Math.ceil(totalPayableAmount), rounded100, rounded100 + 100];
  }, [totalPayableAmount]);

  const handleNumpad = (val) => {
    setAmount((prev) => {
      if (val === 'backspace') return prev.slice(0, -1) || '0';
      if (val === '.' && prev.includes('.')) return prev;
      if (prev === totalPayableAmount.toFixed(2)) return val === '.' ? '0.' : val;
      return prev + val;
    });
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    const methodLabel = METHOD_LABELS[paymentMethod];
    if (paymentMethod === 'cash') toggleRegisterDrawer(true);

    // Record partial payment
    const paidAmt = parseFloat(amount) || totalPayableAmount;
    const newRecord = {
      paymentId: `PAY-${Date.now()}`,
      method: methodLabel,
      amount: paidAmt,
      timestamp: new Date().toISOString()
    };
    const updatedRecords = [...paymentRecords, newRecord];
    setPaymentRecords(updatedRecords);

    const newTotal = updatedRecords.reduce((s, r) => s + r.amount, 0);
    if (newTotal < totalPayableAmount) {
      setIsProcessing(false);
      return; // partial — more payments needed
    }

    const receipt = processCounterPayment({
      orderId: bill.orderId || `INV-${bill.tableNumber}`,
      tableNumber: bill.tableNumber,
      serverName: bill.serverName,
      cashierName: registerSession.cashierName,
      paymentMethod: methodLabel,
      cardBrand: paymentMethod === 'card' || paymentMethod === 'debit' ? 'Visa ending in 8842' : undefined,
      referenceNo: paymentMethod === 'upi' ? `UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
      tenderedAmount: paidAmt,
      changeGiven: Math.max(0, paidAmt - totalPayableAmount),
      subtotal: bill.subtotal,
      packagingCharge: bill.packagingCharge || 0,
      tax: bill.gst || bill.tax || 0,
      gst: bill.gst || bill.tax || 0,
      cgst: bill.cgst || ((bill.gst || bill.tax || 0) / 2),
      sgst: bill.sgst || ((bill.gst || bill.tax || 0) / 2),
      vat: 0,
      discount: bill.discount || 0,
      tip: bill.tip || 0,
      totalPayable: totalPayableAmount,
      grandTotal: totalPayableAmount,
      items,
      billId: bill.id,
    });

    setTimeout(() => {
      navigate('/counter/receipt', { state: { receipt } });
    }, 400);
  };

  return (
    <>
    <CounterShell showSearch={false}>
      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface">Order Summary</h2>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Table {bill.tableNumber}
              </span>
            </div>
            <div className="flex flex-col gap-4 mb-8">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-on-surface">
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  <span className="text-base text-on-surface">{formatInvoiceAmount(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-outline-variant/40 flex flex-col gap-2 text-sm text-on-surface-variant font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatInvoiceAmount(bill.subtotal)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatInvoiceAmount(bill.discount)}</span>
                </div>
              )}
              {bill.packagingCharge > 0 && (
                <div className="flex justify-between">
                  <span>Packaging Charge</span>
                  <span>{formatInvoiceAmount(bill.packagingCharge)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST @ 5%</span>
                <span>{formatInvoiceAmount(bill.gst || bill.tax || 0)}</span>
              </div>
              {(bill.tip || 0) > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Optional Staff Tip</span>
                  <span>{formatInvoiceAmount(bill.tip || 0)}</span>
                </div>
              )}
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-outline-variant/30">
                <span className="text-xl font-bold text-on-surface">Total Payable</span>
                <span className="text-3xl font-bold text-primary">{formatInvoiceAmount(totalPayableAmount)}</span>
              </div>
            </div>
          </div>

        {/* Billing Controls Row */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setSplitMode(splitMode ? null : 'equal')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                splitMode ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <SplitSquareHorizontal className="w-3.5 h-3.5" />
              Split Bill
            </button>
            <button
              onClick={() => setShowDiscountPanel(!showDiscountPanel)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                showDiscountPanel ? 'bg-secondary-container text-on-secondary-container border-secondary-container' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Discount
            </button>
            <button
              onClick={() => setShowRefundModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refund
            </button>
            <button
              onClick={() => setShowVoidModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border border-error/30 text-error bg-error/5 hover:bg-error/10"
            >
              <ShieldOff className="w-3.5 h-3.5" />
              Void Bill
            </button>
          </div>

          {/* Split Bill Panel */}
          {splitMode && (
            <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSplitMode('equal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    splitMode === 'equal' ? 'bg-primary text-on-primary' : 'bg-surface-container border-outline-variant/30'
                  }`}
                >
                  Split Equally
                </button>
                <button
                  onClick={() => setSplitMode('item')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    splitMode === 'item' ? 'bg-primary text-on-primary' : 'bg-surface-container border-outline-variant/30'
                  }`}
                >
                  By Item
                </button>
              </div>

              {splitMode === 'equal' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-on-surface">Split among:</label>
                    <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant font-bold text-sm flex items-center justify-center">−</button>
                    <span className="font-black text-primary font-mono w-6 text-center">{splitCount}</span>
                    <button onClick={() => setSplitCount(Math.min(10, splitCount + 1))} className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant font-bold text-sm flex items-center justify-center">+</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: splitCount }).map((_, i) => {
                      const share = (totalPayableAmount / splitCount);
                      const floored = Math.floor(share * 100) / 100;
                      const remainder = Math.round((totalPayableAmount - floored * splitCount) * 100);
                      const thisShare = i === 0 ? floored + remainder / 100 : floored;
                      return (
                        <div key={i} className="bg-white p-3 rounded-xl border border-primary/20 text-xs">
                          <p className="font-bold text-on-surface">Guest {i + 1}</p>
                          <p className="text-xl font-black text-primary font-mono">{formatInvoiceAmount(thisShare)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {splitMode === 'item' && (
                <div className="text-xs text-on-surface-variant">
                  <p className="font-medium mb-2">Select items for Guest A (rest go to Guest B):</p>
                  <div className="space-y-1.5">
                    {items.map((it, idx) => {
                      const isSel = splitItemSelections.includes(idx);
                      return (
                        <label key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-outline-variant/30 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => {
                              if (isSel) setSplitItemSelections(splitItemSelections.filter(i => i !== idx));
                              else setSplitItemSelections([...splitItemSelections, idx]);
                            }}
                            className="w-3.5 h-3.5 accent-primary"
                          />
                          <span className="font-semibold text-on-surface flex-1">{it.quantity}× {it.name}</span>
                          <span className="font-bold text-primary font-mono">{formatInvoiceAmount(it.price * it.quantity)}</span>
                        </label>
                      );
                    })}
                  </div>
                  {splitItemSelections.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-white p-2.5 rounded-xl border border-primary/20 text-center">
                        <p className="font-bold text-on-surface text-[11px]">Guest A</p>
                        <p className="font-black text-primary font-mono">{formatInvoiceAmount(splitItemSelections.reduce((s, idx) => s + items[idx].price * items[idx].quantity, 0))}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-outline-variant/30 text-center">
                        <p className="font-bold text-on-surface text-[11px]">Guest B</p>
                        <p className="font-black text-on-surface font-mono">{formatInvoiceAmount(totalPayableAmount - splitItemSelections.reduce((s, idx) => s + items[idx].price * items[idx].quantity, 0))}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Discount Panel */}
          {showDiscountPanel && (
            <div className="mt-4 p-4 bg-secondary-container/20 rounded-2xl border border-secondary-container/50 space-y-3">
              <p className="text-xs font-bold text-on-surface">Apply Discount</p>
              <div className="flex items-center gap-2">
                <select
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value)}
                  className="p-2 rounded-xl border border-outline-variant bg-surface text-xs"
                >
                  <option value="PERCENT">% Percent</option>
                  <option value="FLAT">₹ Flat Amount</option>
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder={discountType === 'PERCENT' ? 'e.g. 10' : 'e.g. 50'}
                  value={discountValue}
                  onChange={e => setDiscountValue(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-outline-variant bg-surface text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Reason for discount (required for manager log)..."
                value={discountReason}
                onChange={e => setDiscountReason(e.target.value)}
                className="w-full p-2 rounded-xl border border-outline-variant bg-surface text-xs"
              />
              {discountValue > 0 && (
                <p className="text-xs font-bold text-emerald-700">
                  New Total: {formatInvoiceAmount(
                    discountType === 'PERCENT'
                      ? totalPayableAmount * (1 - parseFloat(discountValue) / 100)
                      : totalPayableAmount - parseFloat(discountValue)
                  )}
                </p>
              )}
            </div>
          )}

          {/* Partial Payment Progress */}
          {paymentRecords.length > 0 && (
            <div className="mt-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-on-surface">Payment Progress</p>
                {!isFullyPaid && (
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">Balance Due: {formatInvoiceAmount(balanceDue)}</span>
                )}
                {isFullyPaid && (
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Fully Paid</span>
                )}
              </div>
              {paymentRecords.map((rec, i) => (
                <div key={i} className="flex justify-between text-xs text-on-surface-variant">
                  <span>{rec.method}</span>
                  <span className="font-bold text-on-surface font-mono">{formatInvoiceAmount(rec.amount)}</span>
                </div>
              ))}
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalPaid / totalPayableAmount) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-surface-container-high/40 p-5 rounded-2xl border border-dashed border-outline flex items-center gap-4">
            <Sparkles className="w-7 h-7 text-secondary shrink-0" />
            <div>
              <p className="text-sm font-bold text-on-surface">Add Loyalty Member</p>
              <p className="text-xs text-on-surface-variant">Earn {Math.round(bill.grandTotal)} points on this order</p>
            </div>
            <button
              onClick={() => setLoyaltyAdded(true)}
              className="ml-auto text-primary font-bold text-sm shrink-0"
            >
              {loyaltyAdded ? 'Added ✓' : 'Add'}
            </button>
          </div>
        </div>

        {/* Right: Payment Workflow */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-on-surface mb-6">Select Payment Method</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
                const isActive = paymentMethod === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border relative transition-all ${
                      isActive ? 'border-2 border-primary bg-background' : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <span className={`text-sm ${isActive ? 'font-bold text-on-surface' : 'text-on-surface'}`}>{label}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 right-2" />}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Amount to Pay
                  </label>
                  <div className="bg-surface-container-low p-6 rounded-xl flex justify-between items-center border-2 border-transparent focus-within:border-primary transition-all">
                    <span className="text-4xl text-on-surface">₹</span>
                    <span className="text-4xl text-on-surface">{amount}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-on-surface">Quick Amounts</p>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toFixed(2))}
                        className="px-5 py-2.5 rounded-full bg-surface-variant text-sm font-semibold text-on-surface hover:brightness-95 transition-all"
                      >
                        {formatMenuPrice(amt)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleNumpad(key)}
                    className="h-16 bg-surface-container-high rounded-xl text-xl font-semibold flex items-center justify-center hover:brightness-95 active:scale-95 transition-transform"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={() => handleNumpad('backspace')}
                  className="h-16 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-auto pt-8">
              <button
                onClick={handleCompletePayment}
                disabled={isProcessing}
                className="flex-grow bg-primary text-on-primary h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0px_10px_30px_rgba(147,0,11,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </button>
              <button
                onClick={() => navigate('/counter/pending-bills')}
                className="px-8 border-2 border-on-surface-variant text-on-surface-variant h-14 rounded-2xl font-bold text-lg hover:bg-surface-variant active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </CounterShell>

      {/* REFUND MODAL */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md border border-outline-variant/40 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <RotateCcw className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-bold text-lg text-on-surface">Process Refund</h3>
              <button onClick={() => setShowRefundModal(false)} className="ml-auto text-on-surface-variant hover:text-on-surface"><X className="w-4 h-4" /></button>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Partial or Full Refund</p>
              <p className="text-[11px]">Original Bill: <strong>{formatInvoiceAmount(totalPayableAmount)}</strong> · Total Paid: <strong>{formatInvoiceAmount(totalPaid)}</strong></p>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1.5">Refund Amount *</label>
              <input
                type="number"
                min="0"
                max={totalPaid}
                placeholder={`Max: ${totalPaid.toFixed(2)}`}
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1.5">Refund Reason *</label>
              <select
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
              >
                {['Customer changed mind', 'Item not delivered', 'Food quality issue', 'Overcharged', 'Duplicate payment', 'Other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setShowRefundModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant font-semibold hover:bg-surface-container">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!refundAmount || parseFloat(refundAmount) <= 0) return;
                  setPaymentRecords(prev => prev.map((r, i) => i === prev.length - 1 ? { ...r, refunded: parseFloat(refundAmount) } : r));
                  setShowRefundModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm"
              >
                Confirm Refund — {refundAmount ? formatInvoiceAmount(parseFloat(refundAmount)) : '₹0'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOID BILL MODAL */}
      {showVoidModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md border border-outline-variant/40 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <ShieldOff className="w-5 h-5 text-error" />
              <h3 className="font-serif font-bold text-lg text-error">Void Bill</h3>
              <button onClick={() => setShowVoidModal(false)} className="ml-auto text-on-surface-variant hover:text-on-surface"><X className="w-4 h-4" /></button>
            </div>

            {paymentRecords.length > 0 ? (
              <div className="bg-error/10 p-4 rounded-2xl border border-error/20 text-error space-y-2">
                <p className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Cannot Void — Payments Exist</p>
                <p className="text-[11px] leading-relaxed">
                  This bill has <strong>{paymentRecords.length} payment record(s)</strong> totalling <strong>{formatInvoiceAmount(totalPaid)}</strong>. 
                  You must process a full refund first before voiding this bill.
                </p>
                <button
                  onClick={() => { setShowVoidModal(false); setShowRefundModal(true); }}
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-error text-on-error font-bold"
                >
                  Go to Refund Flow
                </button>
              </div>
            ) : (
              <>
                <div className="bg-error/10 p-3 rounded-2xl border border-error/20 text-error">
                  <p className="font-bold">Confirm Void Action</p>
                  <p className="text-[11px] mt-1 leading-relaxed">Voiding this bill removes it from the active queue permanently. This action is logged in the audit trail and requires manager acknowledgement.</p>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button onClick={() => setShowVoidModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant font-semibold hover:bg-surface-container">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowVoidModal(false);
                      navigate('/counter/pending-bills');
                    }}
                    className="px-5 py-2 rounded-xl bg-error text-on-error font-bold shadow-sm"
                  >
                    Confirm Void
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentProcessingScreen;
