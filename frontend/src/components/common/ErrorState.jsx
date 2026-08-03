import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import SecondaryButton from './SecondaryButton';

const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an issue loading the menu. Please check your connection and try again.",
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-red-50 border border-red-100 rounded-3xl text-center max-w-sm mx-auto my-8 shadow-sm"
    >
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-red-700">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-red-950 mb-1">{title}</h3>
      <p className="text-red-700 text-xs mb-4 leading-relaxed">{message}</p>
      
      {onRetry && (
        <SecondaryButton
          onClick={onRetry}
          icon={RefreshCw}
          size="sm"
          fullWidth={false}
          className="bg-white text-red-900 border-red-200 hover:bg-red-100"
        >
          Try Again
        </SecondaryButton>
      )}
    </motion.div>
  );
};

export default ErrorState;
