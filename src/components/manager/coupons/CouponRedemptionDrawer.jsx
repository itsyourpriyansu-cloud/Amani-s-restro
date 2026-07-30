import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, CheckCircle2, Copy, Ticket } from 'lucide-react';
import { useOrder } from '../../../context/OrderContext';
import { useToast } from '../../../context/ToastContext';
import { restaurantConfig } from '../../../config/restaurantConfig';
import { validateCouponForRedemption } from '../../../utils/couponValidation';
import { rowMatchesQuery } from '../../../services/couponService';
import { formatRupeesFromPaise, formatDiscountLabel, computeDiscountAmount } from '../../../utils/couponFormatting';
import CouponStatusBadge from './CouponStatusBadge';

const previewBillDiscount = (bill, couponOffer) => {
  const subtotal = bill.subtotal || 0;
  const discount = computeDiscountAmount(subtotal, couponOffer);
  const subtotalAfterDiscount = subtotal - discount;
  const gstRate = (restaurantConfig.taxStructure.totalRate || 5) / 100;
  const gst = Math.round(subtotalAfterDiscount * gstRate * 100) / 100;
  const updatedPayable = subtotalAfterDiscount + (bill.packagingCharge || 0) + gst;
  return { subtotal, discount, updatedPayable };
};

const CouponRedemptionDrawer = ({ isOpen, onClose, staffName, initialQuery = '' }) => {
  const { couponRequests, bills, managerRedeemCoupon } = useOrder();
  const { showToast } = useToast();

  const [query, setQuery] = useState(initialQuery);
  const [billQuery, setBillQuery] = useState('');
  const [note, setNote] = useState('');
  const [stage, setStage] = useState('SEARCH'); // SEARCH | CONFIRM | DONE
  const [redemptionResult, setRedemptionResult] = useState(null);

  useEffect(() => {
    if (isOpen) setQuery(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialQuery]);

  const requestsWithCoupon = useMemo(() => couponRequests.filter((r) => r.coupon), [couponRequests]);

  const matchResult = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return { type: 'EMPTY' };

    const exactCode = requestsWithCoupon.find((r) => r.coupon.code.toLowerCase() === trimmed.toLowerCase());
    if (exactCode) return { type: 'MATCH', request: exactCode };

    const matches = couponRequests.filter((r) => rowMatchesQuery(r, trimmed));
    if (matches.length === 1) return { type: 'MATCH', request: matches[0] };
    if (matches.length > 1) return { type: 'AMBIGUOUS', count: matches.length };
    return { type: 'NOT_FOUND' };
  }, [query, requestsWithCoupon, couponRequests]);

  const request = matchResult.type === 'MATCH' ? matchResult.request : null;
  const validation = request ? validateCouponForRedemption(request) : null;

  const matchedBill = bills.find((b) => b.billId === billQuery.trim() || b.orderId === billQuery.trim());
  const preview = matchedBill && request ? previewBillDiscount(matchedBill, request.coupon) : null;

  const handleClose = () => {
    setQuery('');
    setBillQuery('');
    setNote('');
    setStage('SEARCH');
    setRedemptionResult(null);
    onClose();
  };

  const handleConfirmRedemption = () => {
    const result = managerRedeemCoupon(request.requestId, { billId: billQuery.trim() || null, note, staffName });
    if (result.success) {
      setRedemptionResult(result.redemption);
      setStage('DONE');
      showToast('Coupon redeemed successfully', 'success');
    } else {
      showToast(result.message || 'Could not redeem coupon.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={handleClose} />
      <div className="relative w-full sm:w-[480px] h-full bg-surface-container-lowest border-l border-outline-variant shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-surface-container-lowest px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-on-surface">Redeem Coupon</h3>
            <p className="text-[11px] text-on-surface-variant">Validate a coupon before applying it to the current transaction.</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant" aria-label="Close redemption drawer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {stage === 'SEARCH' && (
            <>
              <div>
                <label htmlFor="redeem-search" className="font-bold text-on-surface block mb-1">Coupon code or mobile number</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="redeem-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter MGR15-AB42 or guest mobile number"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant bg-surface text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {matchResult.type === 'EMPTY' && (
                <p className="text-on-surface-variant italic">Enter a coupon code or mobile number to begin.</p>
              )}

              {matchResult.type === 'AMBIGUOUS' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <p className="font-bold">Multiple matches found ({matchResult.count})</p>
                  <p>Try the full coupon code or full mobile number for an exact match.</p>
                </div>
              )}

              {matchResult.type === 'NOT_FOUND' && (
                <div className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl">
                  <p className="font-bold text-on-surface">No coupon found</p>
                  <p className="text-on-surface-variant">Check the code or mobile number and try again.</p>
                </div>
              )}

              {request && validation && (
                <div className="p-3 rounded-xl border space-y-2" style={{ borderColor: validation.valid ? '#BDE8D0' : '#F3BBC5', backgroundColor: validation.valid ? '#E8F7EF' : '#FDEBED' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">
                      {validation.status === 'AWAITING_REVIEW' ? 'Coupon Not Issued Yet' :
                       validation.status === 'ALREADY_REDEEMED' ? 'Already Redeemed' :
                       validation.status === 'EXPIRED' ? 'Coupon Expired' :
                       validation.status === 'REVOKED' ? 'Coupon Revoked' :
                       validation.status === 'DECLINED' ? 'Request Declined' :
                       validation.valid ? 'Valid Coupon' : 'Coupon Not Redeemable'}
                    </span>
                    {request.coupon && <CouponStatusBadge status={validation.status === 'VALID' ? (validation.warnings.length ? 'EXPIRING_SOON' : 'ACTIVE') : undefined} />}
                  </div>

                  {request.coupon && (
                    <div className="text-on-surface space-y-0.5">
                      <p className="font-mono font-bold">{request.coupon.code} · {formatDiscountLabel(request.coupon)}</p>
                      <p>Guest: {request.customer.firstName}</p>
                      <p>Mobile: {request.customer.maskedMobile}</p>
                      <p>Valid until: {request.coupon.validUntil}</p>
                    </div>
                  )}

                  {validation.status === 'ALREADY_REDEEMED' && request.coupon.redemption && (
                    <p className="text-on-surface-variant">
                      Redeemed on {request.coupon.redemption.redeemedAt} · Invoice: {request.coupon.redemption.sourceInvoiceId} · By: {request.coupon.redemption.redeemedBy}
                    </p>
                  )}
                  {validation.status === 'REVOKED' && request.coupon.revocation && (
                    <p className="text-on-surface-variant">
                      Reason: {request.coupon.revocation.reason} · Revoked by: {request.coupon.revocation.revokedBy}
                    </p>
                  )}
                  {validation.status === 'EXPIRED' && (
                    <p className="text-on-surface-variant">Expired on {request.coupon.validUntil}</p>
                  )}
                  {validation.warnings.map((w, i) => (
                    <p key={i} className="text-amber-800 font-semibold">{w}</p>
                  ))}
                  {validation.blockingReasons.map((r, i) => (
                    <p key={i} className="text-error font-semibold">{r}</p>
                  ))}
                </div>
              )}

              {request && validation?.valid && (
                <>
                  <div>
                    <label htmlFor="redeem-bill" className="font-bold text-on-surface block mb-1">Bill / Invoice / Order reference *</label>
                    <input
                      id="redeem-bill"
                      type="text"
                      value={billQuery}
                      onChange={(e) => setBillQuery(e.target.value)}
                      placeholder="e.g. BILL-1082 or ORD-1082"
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
                    />
                  </div>

                  {billQuery.trim() && !matchedBill && (
                    <p className="text-on-surface-variant italic">
                      No live bill found for this reference — redemption will be recorded with this reference only (no discount preview).
                    </p>
                  )}

                  {preview && (
                    <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-1">
                      <p className="text-[10px] font-bold text-amber-700 bg-amber-500/10 inline-block px-2 py-0.5 rounded">Prototype discount preview</p>
                      <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{formatRupeesFromPaise(preview.subtotal * 100)}</span></div>
                      <div className="flex justify-between text-error"><span>Coupon Discount ({formatDiscountLabel(request.coupon)})</span><span className="font-mono">-{formatRupeesFromPaise(preview.discount * 100)}</span></div>
                      <div className="flex justify-between font-bold border-t border-outline-variant/20 pt-1"><span>Updated Payable</span><span className="font-mono">{formatRupeesFromPaise(preview.updatedPayable * 100)}</span></div>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-on-surface block mb-1">Optional Note</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
                    />
                  </div>

                  <button
                    onClick={() => setStage('CONFIRM')}
                    disabled={!billQuery.trim()}
                    className="w-full h-11 min-h-[44px] rounded-xl bg-primary text-on-primary font-bold text-sm shadow disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mark as Redeemed
                  </button>
                </>
              )}
            </>
          )}

          {stage === 'CONFIRM' && request && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-1">
                <p className="font-bold text-on-surface text-sm">Redeem {request.coupon.code}?</p>
                <p className="text-on-surface-variant">This will mark the coupon as used and prevent future redemption.</p>
                <div className="pt-2 space-y-0.5">
                  <p><strong>Guest:</strong> {request.customer.firstName}</p>
                  <p><strong>Offer:</strong> {formatDiscountLabel(request.coupon)}</p>
                  <p><strong>Bill:</strong> {billQuery.trim()}</p>
                  {preview && <p><strong>Discount:</strong> {formatRupeesFromPaise(preview.discount * 100)}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStage('SEARCH')} className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleConfirmRedemption} className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow">
                  Confirm Redemption
                </button>
              </div>
            </div>
          )}

          {stage === 'DONE' && redemptionResult && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
                <p className="font-bold flex items-center gap-1.5 text-sm"><CheckCircle2 className="w-4 h-4" /> Coupon Redeemed</p>
                <p>{redemptionResult.couponCode} was successfully marked as redeemed.</p>
                <div className="pt-1 space-y-0.5">
                  <p><strong>Bill:</strong> {redemptionResult.sourceBillId || '—'}</p>
                  <p><strong>Discount Applied:</strong> {formatRupeesFromPaise(redemptionResult.discountPaise)}</p>
                  <p><strong>Redeemed by:</strong> {redemptionResult.redeemedBy}</p>
                  <p><strong>Time:</strong> {redemptionResult.redeemedAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(redemptionResult.redemptionId);
                    showToast('Redemption reference copied', 'success');
                  }}
                  className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Reference
                </button>
                <button onClick={handleClose} className="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow flex items-center justify-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" /> Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponRedemptionDrawer;
