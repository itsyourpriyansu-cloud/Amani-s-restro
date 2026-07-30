import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle2 } from 'lucide-react';
import { loyaltyCouponConditions } from '../../config/loyaltyCouponConfig';

const CouponConditionsSheet = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regular Guest Coupon Conditions" position="bottom">
      <div className="space-y-2 text-left max-h-[60vh] overflow-y-auto pr-1">
        <p className="text-xs text-on-surface-variant">
          Prototype conditions for this coupon offer:
        </p>
        <ul className="space-y-2">
          {loyaltyCouponConditions.map((condition, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-on-surface">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full mt-3 py-3 bg-surface-container-high text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-highest transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default CouponConditionsSheet;
