import React from 'react';
import { motion } from 'framer-motion';

const SecondaryButton = ({
  children,
  onClick,
  disabled = false,
  fullWidth = true,
  className = '',
  icon: Icon,
  type = 'button',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs font-semibold rounded-xl',
    md: 'px-5 py-3 text-sm font-bold rounded-2xl',
    lg: 'px-6 py-4 text-base font-bold rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 bg-transparent hover:bg-secondary-container text-secondary border border-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-highlight/60 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-secondary" />}
      <span>{children}</span>
    </motion.button>
  );
};

export default SecondaryButton;
