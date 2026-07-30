import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const EmptyState = ({
  icon: IconComp,
  title = 'Your cart is empty',
  description = 'Explore our regional menu of biryanis, curries and tandoor grills, and add your favorite dishes to start ordering.',
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-soft max-w-sm mx-auto my-8"
    >
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary border border-primary/10">
        {IconComp ? <IconComp className="text-4xl" /> : <Icon name="shopping_bag" className="text-4xl" />}
      </div>
      <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 h-12 bg-primary text-on-primary rounded-xl font-semibold active:scale-95 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
