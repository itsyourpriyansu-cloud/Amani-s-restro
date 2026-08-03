import React, { useState } from 'react';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, CheckCircle, Clock, FileText } from 'lucide-react';

const REMOVAL_REASONS = [
  { key: 'REMOVE_FROM_GALLERY', label: 'Remove from restaurant gallery' },
  { key: 'WITHDRAW_REPOST_PERMISSION', label: 'Withdraw repost permission' },
  { key: 'REMOVE_PARTICIPATION_SUBMISSION', label: 'Remove participation submission' },
  { key: 'REMOVE_DISPLAY_NAME', label: 'Remove display name' },
  { key: 'OTHER_PRIVACY_REQUEST', label: 'Other privacy request' },
];

const ContentRemovalModal = ({ isOpen, onClose }) => {
  const { removalRequests, addRemovalRequest } = useOrder();
  const { showToast } = useToast();

  const [requestReason, setRequestReason] = useState('WITHDRAW_REPOST_PERMISSION');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedObj = REMOVAL_REASONS.find((r) => r.key === requestReason);

    addRemovalRequest({
      participationId: 'UGC-1048',
      orderId: 'ORD-1048',
      customerMemoryId: 'MEM-001',
      requestReason,
      requestReasonLabel: selectedObj?.label || requestReason,
      details,
    });

    setIsSubmitted(true);
    showToast('Content removal request submitted to restaurant privacy team.', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Content Removal">
      <div className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1">
        <div className="bg-warning/10 border border-warning/30 p-3.5 rounded-2xl text-xs text-on-background space-y-1">
          <div className="flex items-center gap-2 font-bold text-warning">
            <ShieldAlert className="w-4 h-4 text-warning" />
            Explicit Customer Privacy Rights
          </div>
          <p className="text-[11px] text-on-background/90 leading-relaxed">
            You may withdraw repost permissions or request removal of uploaded content at any time. Content removal does not revoke previously earned genuine visit milestones.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-xs">
              <label className="font-bold text-primary uppercase tracking-wider block">
                Select Removal Request Reason
              </label>
              <div className="space-y-2">
                {REMOVAL_REASONS.map((r) => (
                  <label
                    key={r.key}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      requestReason === r.key
                        ? 'border-primary bg-primary-container/20 font-bold text-primary'
                        : 'border-outline-variant/40 bg-surface text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span>{r.label}</span>
                    <input
                      type="radio"
                      name="removalReason"
                      value={r.key}
                      checked={requestReason === r.key}
                      onChange={(e) => setRequestReason(e.target.value)}
                      className="accent-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-primary uppercase tracking-wider block">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide specific notes regarding content or permission withdrawal..."
                rows={3}
                className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-highest"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90 transition-colors"
              >
                Submit Removal Request
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-success/10 rounded-2xl border border-success/30 space-y-2 text-xs text-on-background">
              <div className="flex items-center gap-2 font-bold text-success text-sm">
                <CheckCircle className="w-5 h-5 text-success" />
                Removal Request Submitted
              </div>
              <p className="text-[11px] text-on-background/90 leading-relaxed">
                Your request has been routed to the restaurant manager. The content display status will be updated shortly.
              </p>
            </div>

            {/* Live Request Status List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Your Removal Request History</h4>
              {removalRequests.map((req) => (
                <div key={req.requestId} className="p-3 rounded-xl bg-surface border border-outline-variant/30 text-xs space-y-1">
                  <div className="flex justify-between items-center font-semibold text-on-surface">
                    <span>{req.requestReasonLabel}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Request ID: <span className="font-mono">{req.requestId}</span></p>
                  <p className="text-[10px] text-outline">Submitted: {req.submittedAt}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContentRemovalModal;
