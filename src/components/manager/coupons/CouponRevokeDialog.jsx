import React, { useState } from 'react';
import Modal from '../../common/Modal';
import { REVOKE_REASONS } from '../../../constants/coupons';
import { useToast } from '../../../context/ToastContext';

const CouponRevokeDialog = ({ request, onClose, onRevoke, staffName }) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState(REVOKE_REASONS[0]);
  const [note, setNote] = useState('');

  if (!request?.coupon) return null;

  const handleConfirm = () => {
    onRevoke(request.requestId, reason, note, staffName);
    showToast('Coupon revoked.', 'info');
    onClose();
  };

  return (
    <Modal isOpen={!!request} onClose={onClose} title={`Revoke ${request.coupon.code}?`}>
      <div className="space-y-4 text-left text-xs">
        <p className="text-on-surface-variant">
          The guest will no longer be able to redeem this coupon. Historical records will be retained.
        </p>

        <div>
          <label className="font-bold text-on-surface block mb-1">Reason *</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
          >
            {REVOKE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="font-bold text-on-surface block mb-1">Optional Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl">
            Cancel
          </button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 bg-error text-on-error font-bold text-xs rounded-xl shadow">
            Revoke Coupon
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CouponRevokeDialog;
