import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import { formatInvoiceAmount, formatDateTime } from '../../utils/formatters';
import {
  Receipt,
  Search,
  Printer,
  Mail,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Filter,
  ArrowUpRight
} from 'lucide-react';

const ReceiptsView = () => {
  const { receipts, voidOrRefundReceipt } = useOrder();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('');

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.cashierName && r.cashierName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod =
      methodFilter === 'all' ? true : r.paymentMethod.toLowerCase().includes(methodFilter);

    return matchesSearch && matchesMethod;
  });

  const handlePrint = (rec) => {
    setSelectedReceipt(rec);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!customerEmail) return;
    setEmailSuccessMessage(`Receipt copy successfully sent to ${customerEmail}!`);
    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSuccessMessage('');
      setCustomerEmail('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Search Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Receipt #, Table #, Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="text-xs text-stone-500 font-mono">Method:</span>
          {['all', 'card', 'cash', 'upi'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                methodFilter === m
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Receipts History Ledger Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Table / Source</th>
                <th className="py-3 px-3">Cashier</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No matching receipts found.
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((rec) => (
                  <tr key={rec.receiptNo} className="hover:bg-stone-50 text-stone-800 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-700">
                      {rec.receiptNo}
                    </td>
                    <td className="py-3 px-3 text-stone-500">
                      {formatDateTime(rec.timestamp)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-stone-900">
                      Table #{rec.tableNumber}
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      {rec.cashierName || 'Suresh Kumar'}
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-700">
                      {rec.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700 text-sm">{formatInvoiceAmount(rec.grandTotal)}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          rec.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReceipt(rec)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="View Thermal Receipt"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-700" />
                        </button>

                        <button
                          onClick={() => handlePrint(rec)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-stone-600" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedReceipt(rec);
                            setIsEmailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Email Digital Receipt"
                        >
                          <Mail className="w-3.5 h-3.5 text-stone-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 80mm Thermal Receipt Viewer Modal */}
      {selectedReceipt && !isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-sm w-full p-4 space-y-4 shadow-2xl my-8">
            
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-xs font-mono text-stone-600">80mm Thermal Receipt Preview</span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-stone-500 hover:text-stone-900 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Thermal Receipt Paper */}
            <div className="bg-stone-50 text-stone-950 p-5 rounded-lg shadow-inner font-mono text-xs space-y-3 border border-stone-200">
              
              {/* Restaurant Header */}
              <div className="text-center space-y-0.5 border-b border-stone-300 pb-3">
                <h2 className="font-serif font-extrabold text-base tracking-wide uppercase">
                  {RESTAURANT_INFO.name}
                </h2>
                <p className="text-[10px] text-stone-600 font-sans">{RESTAURANT_INFO.tagline}</p>
                <p className="text-[10px] text-stone-500">{RESTAURANT_INFO.location}</p>
                <p className="text-[9px] text-stone-500">GSTIN: 29AAAAA0000A1Z5 | FSSAI: 11223344556677</p>
              </div>

              {/* Transaction Meta */}
              <div className="text-[10px] text-stone-700 space-y-0.5 border-b border-stone-300 pb-2">
                <div className="flex justify-between">
                  <span>RECEIPT #:</span>
                  <span className="font-bold">{selectedReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE/TIME:</span>
                  <span>{formatDateTime(selectedReceipt.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TABLE: #{selectedReceipt.tableNumber}</span>
                  <span>SERVER: {selectedReceipt.serverName}</span>
                </div>
                <div className="flex justify-between">
                  <span>CASHIER:</span>
                  <span>{selectedReceipt.cashierName || 'Suresh Kumar'}</span>
                </div>
              </div>

              {/* Itemized List */}
              <div className="space-y-1 py-1 border-b border-stone-300">
                <div className="flex justify-between font-bold text-[10px] text-stone-800 uppercase pb-1 border-b border-stone-200">
                  <span>QTY ITEM</span>
                  <span>AMT</span>
                </div>

                {selectedReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[200px]">{it.quantity}x {it.name}</span>
                    <span className="font-bold">{formatInvoiceAmount(it.total || it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Subtotals & Taxes */}
              <div className="space-y-1 text-[11px] text-stone-800 border-b border-stone-300 pb-2">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.subtotal)}</span>
                </div>
                
                {(selectedReceipt.discount || selectedReceipt.discountAmount) > 0 && (
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>DISCOUNT:</span>
                    <span>-{formatInvoiceAmount(selectedReceipt.discount || selectedReceipt.discountAmount)}</span>
                  </div>
                )}

                {(selectedReceipt.packagingCharge || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>PACKAGING CHARGE:</span>
                    <span>{formatInvoiceAmount(selectedReceipt.packagingCharge || 0)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-700">
                  <span>GST @ 5%:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.gst || selectedReceipt.tax || 0)}</span>
                </div>
                <div className="pl-2 flex justify-between text-[10px] text-stone-500">
                  <span>CGST @ 2.5%:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.cgst || (selectedReceipt.gst || selectedReceipt.tax || 0) / 2)}</span>
                </div>
                <div className="pl-2 flex justify-between text-[10px] text-stone-500">
                  <span>SGST @ 2.5%:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.sgst || (selectedReceipt.gst || selectedReceipt.tax || 0) / 2)}</span>
                </div>

                <div className="flex justify-between font-bold border-t border-stone-200 pt-1">
                  <span>TOTAL:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.total || (selectedReceipt.subtotal - (selectedReceipt.discount || 0) + (selectedReceipt.packagingCharge || 0) + (selectedReceipt.gst || selectedReceipt.tax || 0)))}</span>
                </div>

                <div className="flex justify-between text-stone-700">
                  <span>OPTIONAL STAFF TIP:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.tip || 0)}</span>
                </div>

                <div className="flex justify-between font-bold text-sm text-stone-950 pt-1 border-t-2 border-stone-400 mt-1">
                  <span>TOTAL PAYABLE:</span>
                  <span>{formatInvoiceAmount(selectedReceipt.totalPayable || selectedReceipt.grandTotal || 0)}</span>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="text-[10px] text-stone-700 space-y-0.5">
                <div className="flex justify-between">
                  <span>TENDER METHOD:</span>
                  <span className="font-bold">{selectedReceipt.paymentMethod}</span>
                </div>
                {selectedReceipt.tenderedAmount && (
                  <div className="flex justify-between">
                    <span>CASH TENDERED:</span>
                    <span>{formatInvoiceAmount(selectedReceipt.tenderedAmount)}</span>
                  </div>
                )}
                {selectedReceipt.changeGiven > 0 && (
                  <div className="flex justify-between font-bold">
                    <span>CHANGE RETURNED:</span>
                    <span>{formatInvoiceAmount(selectedReceipt.changeGiven)}</span>
                  </div>
                )}
              </div>

              {/* Barcode & Footer */}
              <div className="text-center pt-3 border-t border-dashed border-stone-400 space-y-1">
                <div className="font-mono text-[9px] tracking-widest text-stone-500 uppercase">
                  |||||| | ||||| |||| ||||||| |||
                </div>
                <p className="text-[10px] font-serif font-bold text-stone-800 uppercase">
                  Thank you! Visit again!
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handlePrint(selectedReceipt)}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Thermal Receipt</span>
              </button>

              {selectedReceipt.status === 'paid' && (
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to void / refund receipt ${selectedReceipt.receiptNo}?`)) {
                      voidOrRefundReceipt(selectedReceipt.receiptNo);
                      setSelectedReceipt(null);
                    }
                  }}
                  className="py-2.5 px-3 bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Void</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Email Digital Copy Modal */}
      {isEmailModalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600" />
                Email Receipt #{selectedReceipt.receiptNo}
              </h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-stone-500 hover:text-stone-900 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {emailSuccessMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                <p>{emailSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-stone-600 block mb-1">Customer Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send PDF Receipt</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ReceiptsView;
