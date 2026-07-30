import React from 'react';
import { Info } from 'lucide-react';

const CATEGORY_DESCRIPTIONS = {
  all: 'Explore our complete authentic menu prepared fresh for your table',
  starters: 'Soups, tandoor kebabs, and crispy fried & Indo-Chinese starters',
  meals: 'Banana-leaf meals, curries, rice, pulaos and noodles for your table',
  biryanis: 'Slow dum-cooked fragrant basmati rice layered with delicate spices',
  rotis_breads: 'Freshly baked tandoori rotis, naan, parathas and pulkas',
  desserts: 'Traditional sweet gulab jamuns and slow-cooked carrot halwa',
  drinks: 'Refreshing lime mint coolers, sweet lassi and churned buttermilk',
};

const MenuSectionHeader = ({ selectedCategoryObj, dishCount = 0, onOpenTrustProfile }) => {
  const catId = selectedCategoryObj?.id || 'all';
  const title = selectedCategoryObj?.name || 'Full Menu';
  const description = CATEGORY_DESCRIPTIONS[catId] || 'Freshly prepared authentic regional dishes';

  return (
    <div className="px-4 mt-1 mb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[21px] sm:text-[23px] font-bold text-on-surface tracking-tight leading-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {onOpenTrustProfile && (
            <button
              type="button"
              onClick={onOpenTrustProfile}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Kitchen</span>
            </button>
          )}
          <span className="text-[12px] text-on-surface-variant font-bold bg-surface-container border border-outline-variant px-3 py-1 rounded-full shrink-0">
            {dishCount} {dishCount === 1 ? 'Dish' : 'Dishes'}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
};

export default MenuSectionHeader;
