import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  position = 'center', // 'center' | 'bottom'
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={position === 'bottom' ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={position === 'bottom' ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} bg-surface-container-lowest rounded-3xl shadow-2xl z-10 overflow-hidden border border-outline-variant/20 ${
              position === 'bottom' ? 'fixed bottom-0 rounded-b-none border-b-0' : 'my-auto'
            }`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
