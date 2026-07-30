import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { MOCK_PERMISSIONS } from '../../data/restaurantPrototypeData';

/**
 * Reusable Safe Action Confirmation Dialog for High-Impact & Destructive Operations
 */
const ActionConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  affectedRecord,
  consequenceExplanation,
  requiredPermission,
  currentRole = 'MANAGER',
  reasons = [
    'Temporarily discontinued',
    'Seasonal variation',
    'Recipe unavailable',
    'Duplicate entry',
    'Operational mistake',
    'Other'
  ],
  confirmButtonText = 'Confirm Action',
  confirmButtonVariant = 'warning' // 'warning' | 'danger' | 'primary'
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Verify Mock Permission
  const userPermissions = MOCK_PERMISSIONS[currentRole] || [];
  const hasPermission = !requiredPermission || userPermissions.includes(requiredPermission);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasPermission) {
      setError('You do not have permission to perform this action.');
      return;
    }
    if (!selectedReason) {
      setError('Please select a valid reason before confirming.');
      return;
    }
    setError('');
    onConfirm({
      reason: selectedReason,
      note,
      performedBy: `${currentRole} Demo`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    });
    setSelectedReason('');
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${confirmButtonVariant === 'danger' ? 'bg-error-container/40 text-error' : 'bg-amber-500/10 text-amber-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-on-surface tracking-tight">{title}</h3>
                {affectedRecord && (
                  <p className="text-xs font-semibold text-primary">{affectedRecord}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Permission Banner */}
            {!hasPermission ? (
              <div className="p-3.5 rounded-xl bg-error-container/30 border border-error/20 flex items-start gap-2.5 text-xs text-error font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Permission Denied</span>
                  You do not have permission to perform this action. Required permission: <code className="font-mono">{requiredPermission}</code>.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Permission Verified: {currentRole}</span>
              </div>
            )}

            {/* Consequence Explanation */}
            {consequenceExplanation && (
              <div className="p-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
                {consequenceExplanation}
              </div>
            )}

            {/* Reason Selector */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Reason Required <span className="text-error">*</span>
              </label>
              <select
                disabled={!hasPermission}
                value={selectedReason}
                onChange={(e) => {
                  setSelectedReason(e.target.value);
                  setError('');
                }}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a reason...</option>
                {reasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Optional Internal Note
              </label>
              <textarea
                disabled={!hasPermission}
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add additional context or supervisor note..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-error font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasPermission}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  !hasPermission
                    ? 'bg-outline-variant text-on-surface-variant/50 cursor-not-allowed'
                    : confirmButtonVariant === 'danger'
                    ? 'bg-error text-on-error hover:bg-error/90'
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                }`}
              >
                {confirmButtonText}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActionConfirmationModal;
