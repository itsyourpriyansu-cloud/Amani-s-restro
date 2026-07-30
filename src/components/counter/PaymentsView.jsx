import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatInvoiceAmount, formatMenuPrice } from '../../utils/formatters';
import {
  CreditCard,
  Banknote,
  QrCode,
  Building,
  CheckCircle,
  AlertCircle,
  Printer,
  Sparkles,
  ArrowRight,
  Shield,
  Loader2,
  IndianRupee
} from 'lucide-react';

const PaymentsView = ({ billOrder, onPaymentComplete, onNavigateToReceipts }) => {
  const { processCounterPayment, toggleRegisterDrawer, registerSession } = useOrder();

  const activeBill = billOrder || {
    orderId: 'INV-8045',
    tableNumber: '05',
    serverName: 'Ananya Reddy',
    guestCount: 2,
    subtotal: 700.00,
    tax: 35.00,
    vat: 0,
    discountAmount: 0,
    serviceCharge: 0,
    grandTotal: 735.00,
    items: [
      { name: 'Chicken Dum Biryani', quantity: 2, price: 250 },
      { name: 'Sweet Lassi', quantity: 2, price: 100 },
    ]
  };

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'cash' | 'card' | 'upi' | 'transfer'
  const [tipPercent, setTipPercent] = useState('10'); // '0' | '10' | '15' | '20' | 'custom'
  const [customTip, setCustomTip] = useState('');
  
  // Cash Tender States
  const [tenderedAmount, setTenderedAmount] = useState('');
  
  // Card / Terminal Simulator States
  const [isTerminalProcessing, setIsTerminalProcessing] = useState(false);
  const [terminalMessage, setTerminalMessage] = useState('');
  
  // Completed Payment Receipt modal
  const [completedReceipt, setCompletedReceipt] = useState(null);

  // Tip Calculation
  let tipAmount = 0;
  const baseAmount = activeBill.grandTotal || 0;
  if (tipPercent === '10') tipAmount = baseAmount * 0.10;
  else if (tipPercent === '15') tipAmount = baseAmount * 0.15;
  else if (tipPercent === '20') tipAmount = baseAmount * 0.20;
  else if (tipPercent === 'custom') tipAmount = parseFloat(customTip) || 0;

  const totalPaymentDue = baseAmount + tipAmount;

  // Cash Change Calculation
  const numericTendered = parseFloat(tenderedAmount) || 0;
  const changeGiven = Math.max(0, numericTendered - totalPaymentDue);

  const handleCashPreset = (amount) => {
    setTenderedAmount(amount.toString());
  };

  const handleExecutePayment = () => {
    if (paymentMethod === 'cash' && numericTendered < totalPaymentDue) {
      alert(`Tendered amount (${formatInvoiceAmount(numericTendered)}) is less than total due (${formatInvoiceAmount(totalPaymentDue)})`);
      return;
    }

    if (paymentMethod === 'card' || paymentMethod === 'upi') {
      setIsTerminalProcessing(true);
      setTerminalMessage(
        paymentMethod === 'card'
          ? 'Contacting Payment Gateway / Card Reader...'
          : 'Waiting for Customer UPI Mobile Scan...'
      );

      setTimeout(() => {
        setTerminalMessage('Processing Security Handshake...');
      }, 1000);

      setTimeout(() => {
        setIsTerminalProcessing(false);
        finalizePaymentRecord();
      }, 2200);
    } else {
      finalizePaymentRecord();
    }
  };

  const finalizePaymentRecord = () => {
    let methodLabel = 'Credit Card';
    if (paymentMethod === 'cash') methodLabel = 'Cash';
    else if (paymentMethod === 'upi') methodLabel = 'UPI / QR Code';
    else if (paymentMethod === 'transfer') methodLabel = 'Room / Guest Transfer';

    if (paymentMethod === 'cash') {
      toggleRegisterDrawer(true);
    }

    const createdReceipt = processCounterPayment({
      orderId: activeBill.orderId,
      tableNumber: activeBill.tableNumber,
      serverName: activeBill.serverName,
      cashierName: registerSession.cashierName,
      paymentMethod: methodLabel,
      cardBrand: paymentMethod === 'card' ? 'Visa ending in 8842' : undefined,
      referenceNo: paymentMethod === 'upi' ? `UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
      tenderedAmount: paymentMethod === 'cash' ? numericTendered : totalPaymentDue,
      changeGiven: paymentMethod === 'cash' ? changeGiven : 0,
      subtotal: activeBill.subtotal,
      tax: activeBill.tax || (activeBill.subtotal * 0.05),
      vat: 0,
      discount: activeBill.discountAmount || 0,
      tip: tipAmount,
      grandTotal: totalPaymentDue,
      items: activeBill.items || [],
      billId: activeBill.billId
    });

    setCompletedReceipt(createdReceipt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left 5 Cols: Selected Bill Context Card */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
            <div>
              <span className="text-xs text-amber-700 font-mono font-bold uppercase">
                Payment Tender Target
              </span>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Table #{activeBill.tableNumber}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-mono">
              {activeBill.orderId}
            </span>
          </div>

          {/* Quick Breakdown */}
          <div className="space-y-2 font-mono text-xs text-stone-700 bg-stone-50 border border-stone-200 p-3 rounded-xl">
            <div className="flex justify-between">
              <span>Bill Subtotal:</span>
              <span>{formatInvoiceAmount(activeBill.subtotal || 0)}</span>
            </div>

            {activeBill.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Applied:</span>
                <span>-{formatInvoiceAmount(activeBill.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-500">
              <span>GST @ 5%:</span>
              <span>{formatInvoiceAmount(activeBill.tax || ((activeBill.subtotal || 0) * 0.05))}</span>
            </div>

            <div className="flex justify-between text-stone-500">
              <span>Optional Staff Tip:</span>
              <span>{formatInvoiceAmount(tipAmount)}</span>
            </div>

            <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm text-stone-900">
              <span>Bill Base Total:</span>
              <span>{formatInvoiceAmount(baseAmount)}</span>
            </div>
          </div>

          {/* Tip / Staff Gratuity Selector */}
          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-stone-800 font-semibold">Add Optional Staff Tip</span>
              <span className="text-amber-700 font-bold">{formatInvoiceAmount(tipAmount)}</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
              {['0', '10', '15', '20', 'custom'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipPercent(t)}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    tipPercent === t
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {t === '0' ? 'No Tip' : t === 'custom' ? 'Custom' : `${t}%`}
                </button>
              ))}
            </div>

            {tipPercent === 'custom' && (
              <input
                type="number"
                placeholder="Enter custom tip (₹)..."
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-500 mt-2"
              />
            )}
          </div>

          {/* Final Amount Charged Banner */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-900 font-sans block">Total Amount to Charge:</span>
              <span className="text-2xl font-bold font-mono text-amber-700">{formatInvoiceAmount(totalPaymentDue)}</span>
            </div>

            <div className="text-right text-[10px] text-stone-500 font-mono">
              Includes Taxes + Tip
            </div>
          </div>
        </div>
      </div>

      {/* Right 7 Cols: Payment Terminal Tender Panel */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-5">
          
          <h2 className="text-xs font-semibold text-stone-700 uppercase font-mono tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-600" />
            Select Payment Method
          </h2>

          {/* Payment Method Selector Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'card', label: 'Credit / Debit', icon: CreditCard },
              { id: 'cash', label: 'Cash Tender', icon: Banknote },
              { id: 'upi', label: 'UPI / QR', icon: QrCode },
              { id: 'transfer', label: 'Room Transfer', icon: Building }
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3.5 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 text-stone-900 shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="text-xs font-bold font-mono">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conditional Method Details Panel */}
          
          {/* CASH TENDER VIEW */}
          {paymentMethod === 'cash' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-mono font-bold text-stone-800 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Cash Register Tender Calculation
              </h3>

              {/* Quick Cash Presets */}
              <div>
                <label className="text-[11px] font-mono text-stone-500 block mb-1.5">
                  Quick Tender Presets:
                </label>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                  {[
                    Math.ceil(totalPaymentDue),
                    Math.ceil(totalPaymentDue / 50) * 50,
                    500,
                    1000
                  ].map((amt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCashPreset(amt)}
                      className="py-2 bg-white hover:bg-amber-600 hover:text-white text-stone-800 border border-stone-200 font-bold rounded-lg transition-colors shadow-xs"
                    >
                      {formatMenuPrice(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Cash Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-500">Cash Received (₹):</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={tenderedAmount}
                  onChange={(e) => setTenderedAmount(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base text-stone-900 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Change Return Box */}
              <div className="bg-white border border-stone-200 p-3 rounded-xl flex items-center justify-between font-mono">
                <span className="text-xs text-stone-600">Change Due to Guest:</span>
                <span className={`text-lg font-bold ${changeGiven > 0 ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {formatInvoiceAmount(changeGiven)}
                </span>
              </div>
            </div>
          )}

          {/* CARD TENDER VIEW */}
          {paymentMethod === 'card' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-xs font-mono font-bold text-stone-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  EMV Card Reader Simulator
                </h3>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">Reader Ready</span>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xl text-center space-y-2">
                <CreditCard className="w-10 h-10 text-amber-600 mx-auto animate-bounce" />
                <p className="text-xs text-stone-700 font-mono">
                  Tap, Insert, or Swipe Card on POS Terminal
                </p>
                <p className="text-[10px] text-stone-500 font-mono">
                  Accepts Visa, Mastercard, RuPay, UPI Tap, Apple Pay, Google Pay
                </p>
              </div>
            </div>
          )}

          {/* UPI / QR CODE VIEW */}
          {paymentMethod === 'upi' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3 text-center">
              <h3 className="text-xs font-mono font-bold text-stone-800 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-purple-600" />
                Scan QR Code to Pay
              </h3>

              <div className="bg-white p-4 rounded-xl inline-block border-2 border-amber-300 shadow-sm">
                <svg className="w-32 h-32 text-stone-900" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                  <rect x="35" y="5" width="10" height="20" />
                  <rect x="50" y="15" width="15" height="10" />
                  <rect x="35" y="35" width="30" height="30" />
                  <rect x="70" y="35" width="25" height="15" />
                  <rect x="70" y="70" width="25" height="25" />
                  <rect x="40" y="75" width="20" height="20" />
                </svg>
              </div>

              <p className="text-xs text-stone-700 font-mono">
                Amount: <span className="text-amber-700 font-bold">{formatInvoiceAmount(totalPaymentDue)}</span>
              </p>
            </div>
          )}

          {/* ROOM / TRANSFER VIEW */}
          {paymentMethod === 'transfer' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3 font-mono">
              <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-600" />
                Hotel Guest Room / Corporate Folio Charge
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-stone-500">Guest Room #:</label>
                  <input
                    type="text"
                    placeholder="e.g. 402"
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-amber-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500">Guest Last Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Reddy"
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-amber-500 mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleExecutePayment}
            disabled={isTerminalProcessing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            {isTerminalProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{terminalMessage}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Process Payment ({formatInvoiceAmount(totalPaymentDue)})</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Payment Success Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Payment Approved!</h3>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Receipt #{completedReceipt.receiptNo} generated
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-mono text-stone-700 space-y-1 text-left">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-amber-800 font-bold">{completedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="text-emerald-700 font-bold">{formatInvoiceAmount(completedReceipt.grandTotal)}</span>
              </div>
              {completedReceipt.changeGiven > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>Change Returned:</span>
                  <span>{formatInvoiceAmount(completedReceipt.changeGiven)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  onNavigateToReceipts();
                }}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View & Print Thermal Receipt</span>
              </button>

              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  onPaymentComplete();
                }}
                className="py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs"
              >
                New Bill
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentsView;
