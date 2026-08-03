import React from 'react';
import { BellRing, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssistanceStreamView = ({ requests = [], onResolveRequest }) => {
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const resolvedRequests = requests.filter((r) => r.status === 'resolved');

  return (
    <div className="p-8 max-w-4xl mx-auto">
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-error-container/50 text-error flex items-center justify-center">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              Customer Table Assistance Calls
            </h2>
            <p className="text-xs text-on-surface-variant">
              Live feed of guest requests sent directly from dining tables
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-error-container/50 text-on-error-container border border-error/20 rounded-lg text-xs font-bold">
          {pendingRequests.length} Pending Calls
        </span>
      </div>

      {/* Pending Requests Stream */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>Active Requests ({pendingRequests.length})</span>
        </h3>

        <AnimatePresence>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((req) => {
              const timeAgo = Math.floor(
                (Date.now() - new Date(req.timestamp).getTime()) / (1000 * 60)
              );

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-4 rounded-xl bg-surface-container-lowest border border-error/20 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 bg-on-surface text-surface font-black rounded-lg text-sm shadow-sm">
                      TBL #{req.tableNumber}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-on-surface">
                        {req.requestType}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo === 0 ? 'Just now' : `${timeAgo} min ago`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onResolveRequest(req.id)}
                    className="px-4 py-2 bg-primary hover:brightness-110 text-on-primary rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Acknowledge &amp; Resolve</span>
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low">
              <CheckCircle className="w-8 h-8 mx-auto text-tertiary mb-1" />
              <p className="text-xs text-on-surface-variant font-medium">
                No active table assistance calls
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Resolved History */}
      {resolvedRequests.length > 0 && (
        <div className="pt-4 border-t border-outline-variant/20 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Recently Resolved Calls ({resolvedRequests.length})
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {resolvedRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant opacity-70"
              >
                <span>Table #{req.tableNumber} — {req.requestType}</span>
                <span className="text-tertiary text-[10px] flex items-center gap-1 font-bold">
                  <CheckCircle className="w-3 h-3" /> Resolved
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AssistanceStreamView;
