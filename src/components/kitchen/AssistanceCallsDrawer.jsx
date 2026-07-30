import React from 'react';
import { X, BellRing, CheckCircle2, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssistanceCallsDrawer = ({ isOpen, onClose, requests = [], onResolveRequest }) => {
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[#E4DED8] z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E4DED8] bg-[#F7F5F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F9E9EE] text-[#A30F3B]">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E1B18]">Assistance Calls</h3>
                  <p className="text-xs text-[#6C625C]">
                    {pendingRequests.length} pending request{pendingRequests.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#6C625C] hover:bg-black/5 hover:text-[#1E1B18] transition-colors"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="py-16 text-center text-[#6C625C] space-y-2">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-[#21875A]" />
                  <p className="font-semibold text-sm">All calls resolved!</p>
                  <p className="text-xs text-[#6C625C]">No pending floor assistance requests.</p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-[#E4DED8] bg-white shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-[#F9E9EE] text-[#A30F3B] font-bold text-xs">
                          Table {req.tableNumber}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E1B18] mt-1">
                          {req.requestType || req.type || 'Waiter Assistance'}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#6C625C] flex items-center gap-1 bg-[#F1EEEA] px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        {req.timeAgo || 'Just now'}
                      </span>
                    </div>

                    {req.waiterName && (
                      <p className="text-xs text-[#6C625C] flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#1E1B18]" />
                        Assigned: <span className="font-medium text-[#1E1B18]">{req.waiterName}</span>
                      </p>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => onResolveRequest && onResolveRequest(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#21875A] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#1b6e49] transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve Call</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssistanceCallsDrawer;
