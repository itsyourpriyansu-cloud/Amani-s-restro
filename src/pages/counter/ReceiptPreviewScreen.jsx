import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import { formatInvoiceAmount, formatDateTime } from '../../utils/formatters';
import CounterShell from '../../components/layout/CounterShell';
import {
  UtensilsCrossed,
  Printer,
  Download,
  Mail,
  Send,
  ArrowLeft,
  Lightbulb,
  QrCode,
  MessageCircle,
  Share2,
  X,
  CheckCircle2
} from 'lucide-react';

const ReceiptPreviewScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receipts } = useOrder();

  const receipt = location.state?.receipt || receipts[0];

  const paperRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePhone, setSharePhone] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) / 20;
    const rotateY = (rect.width / 2 - x) / 20;
    setTilt({ x: rotateX, y: rotateY });
  };

  if (!receipt) {
    return (
      <CounterShell showSearch={false}>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
          <p>No receipt to display yet.</p>
          <button
            onClick={() => navigate('/counter/pending-bills')}
            className="text-primary font-semibold hover:underline"
          >
            Go process a payment
          </button>
        </div>
      </CounterShell>
    );
  }

  return (
    <CounterShell showSearch={false}>
      <main className="p-8 flex flex-col md:flex-row gap-12 items-start justify-center">
        {/* Receipt Paper */}
        <div className="w-full md:w-auto flex justify-center" style={{ perspective: '1000px' }}>
          <div
            ref={paperRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
              fontFamily: "'Courier New', Courier, monospace",
            }}
            className="w-[380px] p-8 bg-white text-on-surface shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative rounded-sm"
          >
            {/* Receipt Header */}
            <div className="text-center mb-6 border-b border-dashed border-on-surface-variant/40 pb-4">
              <div className="flex justify-center mb-2">
                <img
                  src={RESTAURANT_INFO.logo || '/logo.png'}
                  alt={RESTAURANT_INFO.name}
                  className="w-12 h-12 rounded-full object-cover border border-stone-200"
                />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wider">{RESTAURANT_INFO.name}</h2>
              <p className="text-xs text-stone-600 mt-0.5">{RESTAURANT_INFO.address || RESTAURANT_INFO.location}</p>
              <div className="mt-2 text-xs font-semibold space-y-0.5 text-stone-700">
                <p>GSTIN: {RESTAURANT_INFO.gstin || '29AAAAA0000A1Z5'}</p>
                <p>FSSAI: {RESTAURANT_INFO.fssai || '11223344556677'}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200">
                <span className="text-xs font-bold uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded">TAX INVOICE</span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="border-b border-dashed border-on-surface-variant/40 pb-4 mb-4 text-xs space-y-1 text-stone-800">
              <div className="flex justify-between"><span>Invoice Number:</span><span className="font-bold">{receipt.receiptNo || 'INV-2026-001'}</span></div>
              <div className="flex justify-between"><span>Order ID:</span><span className="font-bold">#{receipt.orderId}</span></div>
              <div className="flex justify-between"><span>Date and Time:</span><span>{formatDateTime(receipt.timestamp)}</span></div>
              <div className="flex justify-between"><span>Table Number:</span><span className="font-bold">{receipt.tableNumber}</span></div>
              <div className="flex justify-between"><span>Server:</span><span>{receipt.serverName}</span></div>
              <div className="flex justify-between"><span>Cashier:</span><span>{receipt.cashierName || 'Suresh Kumar'}</span></div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {receipt.items.map((it, idx) => (
                  <div key={idx} className="flex flex-col text-xs font-mono border-b border-stone-100 pb-1">
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <span className="w-5 font-bold">{it.quantity}x</span>
                        <span className="truncate max-w-[180px] font-bold">{it.name}</span>
                      </div>
                      <span className="font-semibold">{formatInvoiceAmount(it.total || (it.unitPrice || it.price) * it.quantity)}</span>
                    </div>

                    {/* Compact Modifier Text */}
                    {((it.selectedCustomizations && it.selectedCustomizations.length > 0) || it.makeVegan || it.jainPreparation) && (
                      <div className="pl-7 text-[10px] text-stone-600 space-y-0.5 mt-0.5">
                        {it.makeVegan && <div>- Vegan Prep</div>}
                        {it.jainPreparation && <div>- Jain Prep</div>}
                        {it.selectedCustomizations?.map((mod, mIdx) => (
                          <div key={mIdx}>- {mod.label || mod.name}</div>
                        ))}
                      </div>
                    )}
                    {it.allergyAlert && (
                      <div className="pl-7 text-[10px] font-bold text-red-700">
                        ! ALLERGY: {it.allergyAlert}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Clean Summary Breakdown */}
              <div className="border-t border-dashed border-on-surface-variant/40 pt-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatInvoiceAmount(receipt.subtotal || 0)}</span></div>
                {(receipt.discount || receipt.discountAmount) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span><span>-{formatInvoiceAmount(receipt.discount || receipt.discountAmount)}</span>
                  </div>
                )}
                {(receipt.packagingCharge || 0) > 0 && (
                  <div className="flex justify-between"><span>Packaging Charge</span><span>{formatInvoiceAmount(receipt.packagingCharge || 0)}</span></div>
                )}
                
                <div className="flex justify-between">
                  <span>GST @ 5%</span>
                  <span>{formatInvoiceAmount(receipt.gst || receipt.tax || 0)}</span>
                </div>
                <div className="pl-3 flex justify-between text-[11px] text-stone-500">
                  <span>CGST @ 2.5%</span>
                  <span>{formatInvoiceAmount(receipt.cgst || (receipt.gst || receipt.tax || 0) / 2)}</span>
                </div>
                <div className="pl-3 flex justify-between text-[11px] text-stone-500">
                  <span>SGST @ 2.5%</span>
                  <span>{formatInvoiceAmount(receipt.sgst || (receipt.gst || receipt.tax || 0) / 2)}</span>
                </div>

                <div className="flex justify-between font-bold pt-1 border-t border-stone-200">
                  <span>Total</span>
                  <span>{formatInvoiceAmount(receipt.total || (receipt.subtotal - (receipt.discount || 0) + (receipt.packagingCharge || 0) + (receipt.gst || receipt.tax || 0)))}</span>
                </div>

                <div className="flex justify-between text-stone-700">
                  <span>Optional Staff Tip</span>
                  <span>{formatInvoiceAmount(receipt.tip || 0)}</span>
                </div>

                <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-stone-900 mt-2 text-stone-950">
                  <span>Total Payable</span>
                  <span>{formatInvoiceAmount(receipt.totalPayable || receipt.grandTotal || 0)}</span>
                </div>
              </div>
            </div>

            {/* How was this total calculated? */}
            <div className="mt-6 pt-4 border-t border-dashed border-stone-300 text-[10px] text-stone-600 space-y-1.5 font-sans">
              <p className="font-bold text-stone-800 text-xs">How was this total calculated?</p>
              <p><strong>Government Tax:</strong> GST applied to taxable restaurant bill.</p>
              <p><strong>Packaging Charge:</strong> Applied only when packaging is required.</p>
              <p><strong>Restaurant Service Charge:</strong> No service charge added.</p>
              <p><strong>Voluntary Staff Tip:</strong> Optional amount selected by customer.</p>
            </div>

            <div className="mt-8 text-center text-xs space-y-2">
              <div className="flex justify-center text-on-surface-variant">
                <QrCode className="w-14 h-14" />
              </div>
              <p className="font-bold">Thank you for dining with us!</p>
              <p className="text-[10px] text-stone-500">Prices & taxes calculated as per statutory compliance.</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full max-w-md space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/20">
            <header className="mb-6">
              <h3 className="text-xl font-bold text-on-surface mb-1">Payment Successful</h3>
              <p className="text-on-surface-variant">
                The transaction of <strong>{formatInvoiceAmount(receipt.grandTotal)}</strong> was processed successfully. How
                would the customer like their receipt?
              </p>
            </header>

            <div className="space-y-4">
              <button
                onClick={() => window.print()}
                className="w-full h-14 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <Printer className="w-5 h-5" />
                <span className="text-base">Print Receipt</span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => showToast('Receipt PDF downloaded.')}
                  className="h-14 bg-background text-on-surface border border-outline rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => showToast('Receipt emailed to guest.')}
                  className="h-14 bg-background text-on-surface border border-outline rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-95 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>
              </div>
              <div className="pt-2">
                <label className="block text-xs text-on-surface-variant mb-1 ml-1">Send to Phone (SMS)</label>
                <div className="relative flex">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-12 px-4 pr-12 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-0 text-on-surface outline-none"
                  />
                  <button
                    onClick={() => phone && showToast(`Receipt sent via SMS to ${phone}`)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary hover:bg-primary-fixed rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

              <div className="mt-6 pt-5 border-t border-outline-variant/30 flex flex-col gap-3 items-center">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share Receipt
                </button>
                <button
                  onClick={() => navigate('/counter')}
                  className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-semibold transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-2xl border border-secondary-container">
            <Lightbulb className="w-5 h-5 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Loyalty Rewards</h4>
              <p className="text-xs">
                This guest is eligible for {Math.round(receipt.grandTotal * 0.2)} bonus points! Mention the rewards
                program to them.
              </p>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          {toast}
        </div>
      )}

      {/* RECEIPT SHARE MOCK MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-sm border border-outline-variant/40 shadow-2xl overflow-hidden">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-bold text-base text-on-surface">Share Receipt</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-on-surface-variant">Choose how to share this receipt with the guest:</p>

              {/* Channel buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { showToast('Receipt shared via WhatsApp mock.'); setShowShareModal(false); }}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all"
                >
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold">WhatsApp</span>
                </button>
                <button
                  onClick={() => { showToast('Receipt emailed to guest.'); setShowShareModal(false); }}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high transition-all text-on-surface"
                >
                  <Mail className="w-6 h-6 text-primary" />
                  <span className="font-bold">Email</span>
                </button>
                <button
                  onClick={() => { showToast('QR code displayed to guest (mock).'); setShowShareModal(false); }}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high transition-all text-on-surface"
                >
                  <QrCode className="w-6 h-6 text-primary" />
                  <span className="font-bold">QR Code</span>
                </button>
                <button
                  onClick={() => { showToast('PDF downloaded (mock).'); setShowShareModal(false); }}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high transition-all text-on-surface"
                >
                  <Download className="w-6 h-6 text-primary" />
                  <span className="font-bold">PDF</span>
                </button>
              </div>

              {/* SMS with phone input */}
              <div className="pt-2">
                <label className="font-bold text-on-surface block mb-1">Send via SMS</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={sharePhone}
                    onChange={e => setSharePhone(e.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="flex-1 p-2 rounded-xl border border-outline-variant bg-surface text-on-surface"
                  />
                  <button
                    onClick={() => {
                      if (sharePhone) { showToast(`Receipt SMS sent to ${sharePhone} (mock).`); setShowShareModal(false); }
                    }}
                    className="px-3 py-2 rounded-xl bg-primary text-on-primary font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-1 text-center">
                <p className="text-[10px] text-on-surface-variant/60 italic">These are prototype mock actions — no real messages are sent.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </CounterShell>
  );
};

export default ReceiptPreviewScreen;
