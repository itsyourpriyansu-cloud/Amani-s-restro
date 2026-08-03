import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy } from 'lucide-react';
import CouponStatusBadge from './CouponStatusBadge';
import { daysUntil } from '../../../utils/couponValidation';
import { formatDiscountLabel, getCampaignLabel } from '../../../utils/couponFormatting';
import { useToast } from '../../../context/ToastContext';

const PRIMARY_ACTION_LABEL = {
  AWAITING_REVIEW: 'Review',
  ACTIVE: 'Redeem',
  EXPIRING_SOON: 'Redeem',
  REDEEMED: 'View Redemption',
  EXPIRED: 'View',
  REVOKED: 'View',
  DECLINED: 'Review',
};

const CouponLedgerRow = ({ row, onOpenDetails, onRedeem }) => {
  const { request, ledgerStatus } = row;
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrimaryAction = () => {
    if (ledgerStatus === 'ACTIVE' || ledgerStatus === 'EXPIRING_SOON') {
      onRedeem(request.coupon.code);
    } else {
      onOpenDetails(row);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(request.coupon.code);
    showToast('Coupon code copied', 'success');
    setMenuOpen(false);
  };

  const expiryLine = request.coupon?.expiresAt
    ? (ledgerStatus === 'EXPIRING_SOON' ? `Expires in ${daysUntil(request.coupon.expiresAt)} days` : `Expires ${request.coupon.validUntil}`)
    : null;

  return (
    <tr className="border-b border-outline-variant/15 hover:bg-surface-container-low/60 transition-colors">
      <td className="px-4 py-3">
        <p className="font-semibold text-on-surface">{request.customer.firstName}</p>
        <p className="text-on-surface-variant font-mono text-[11px]">{request.customer.maskedMobile}</p>
      </td>
      <td className="px-4 py-3">
        <p className="font-mono text-on-surface">{request.orderReference.invoiceId}</p>
        <p className="text-on-surface-variant text-[11px]">Order {request.orderReference.orderId} · Table {request.orderReference.tableId?.replace('TABLE-', '')}</p>
      </td>
      <td className="px-4 py-3">
        {request.coupon ? (
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-semibold text-on-surface">{request.coupon.code}</span>
            <button
              onClick={handleCopyCode}
              aria-label={`Copy coupon ${request.coupon.code}`}
              className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-on-surface-variant italic">Not issued</span>
        )}
      </td>
      <td className="px-4 py-3">
        <p className="font-semibold text-on-surface">{formatDiscountLabel(request.coupon || request.couponOffer)}</p>
        <p className="text-on-surface-variant text-[11px]">{getCampaignLabel(request.couponOffer)}</p>
      </td>
      <td className="px-4 py-3">
        <CouponStatusBadge status={ledgerStatus} />
      </td>
      <td className="px-4 py-3 text-on-surface-variant">
        {request.coupon ? (
          <>
            <p>Issued {request.coupon.issuedAt?.split(',')[0]}</p>
            <p className="text-[11px]">{expiryLine}</p>
          </>
        ) : '—'}
      </td>
      <td className="px-4 py-3">
        <p>Fulfilment: <strong className={request.consent.fulfilmentGranted ? 'text-emerald-700' : 'text-error'}>{request.consent.fulfilmentGranted ? 'Granted' : 'Not Granted'}</strong></p>
        <p>Marketing: <strong className={request.consent.marketingGranted ? 'text-emerald-700' : 'text-on-surface-variant'}>{request.consent.marketingGranted ? 'Granted' : 'Not Granted'}</strong></p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 relative" ref={menuRef}>
          <button
            onClick={handlePrimaryAction}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-[11px] font-bold shadow-xs hover:opacity-90"
          >
            {PRIMARY_ACTION_LABEL[ledgerStatus] || 'View'}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More actions"
            title="More actions"
            className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-44 bg-surface border border-outline-variant/40 rounded-xl shadow-lg py-1 text-xs">
              <button
                onClick={() => { onOpenDetails(row); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-surface-container-low text-on-surface font-semibold"
              >
                View Details
              </button>
              {request.coupon && (
                <button onClick={handleCopyCode} className="w-full text-left px-3 py-2 hover:bg-surface-container-low text-on-surface font-semibold">
                  Copy Coupon Code
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CouponLedgerRow;
