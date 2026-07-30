import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  fullWidth = true,
  className = '',
  icon: Icon,
  type = 'button',
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs font-semibold rounded-xl',
    md: 'px-5 py-3 text-sm font-bold rounded-2xl',
    lg: 'px-6 py-4 text-base font-bold rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center gap-2 bg-saffron-600 hover:bg-saffron-500 text-white shadow-md shadow-maroon-900/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default PrimaryButton;
