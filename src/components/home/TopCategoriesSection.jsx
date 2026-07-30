import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import biryaniIcon from '../../assets/categories/biryani.png';
import curriesIcon from '../../assets/categories/curries.png';
import mealsIcon from '../../assets/categories/meals.png';
import drinksIcon from '../../assets/categories/drinks.png';
import { ArrowRight, ChevronRight, Sparkles, Star, Utensils, Zap } from 'lucide-react';

/* ─────────────────────────────────────────────
   4 Base Categories configured for a 2x2 grid layout
   with transparent floating 3D icons, seamless mix-blend,
   and settled top tags for ideal UI/UX.
───────────────────────────────────────────── */
const BASE_CATEGORIES = [
  {
    id: 'biryanis',
    title: 'Biryani',
    subtitle: 'Slow-cooked Dum Specials',
    badge: 'Most Loved',
    itemCount: '18+ Items',
    icon: biryaniIcon,
    accentColor: 'var(--color-primary)',
    bgColor: 'bg-primary/8',
    borderColor: 'border-primary/15',
    hoverBorder: 'hover:border-primary/40',
    badgeBg: 'bg-primary text-on-primary',
    badgeIcon: Star,
  },
  {
    id: 'starters', // curries category in menu
    title: 'Curries',
    subtitle: 'Rich Andhra Gravies',
    badge: 'Chef Special',
    itemCount: '24+ Items',
    icon: curriesIcon,
    accentColor: 'var(--color-error)',
    bgColor: 'bg-error/8',
    borderColor: 'border-error/15',
    hoverBorder: 'hover:border-error/40',
    badgeBg: 'bg-error text-on-error',
    badgeIcon: Sparkles,
  },
  {
    id: 'meals',
    title: 'Meals',
    subtitle: 'Banana Leaf Thalis',
    badge: 'Best Value',
    itemCount: '14+ Items',
    icon: mealsIcon,
    accentColor: 'var(--color-success)',
    bgColor: 'bg-success/8',
    borderColor: 'border-success/15',
    hoverBorder: 'hover:border-success/40',
    badgeBg: 'bg-success text-on-success',
    badgeIcon: Utensils,
  },
  {
    id: 'drinks',
    title: 'Drinks',
    subtitle: 'Coolers & Sodas',
    badge: 'Fresh Picks',
    itemCount: '10+ Items',
    icon: drinksIcon,
    accentColor: 'var(--color-information)',
    bgColor: 'bg-information/8',
    borderColor: 'border-information/15',
    hoverBorder: 'hover:border-information/40',
    badgeBg: 'bg-information text-on-info',
    badgeIcon: Zap,
  },
];

/* ─────────────────────────────────────────────
   TopCategoriesSection Component
   Renders a 2x2 Grid with seamless 3D floating icons
   and settled tag pill layout for ideal UI/UX.
───────────────────────────────────────────── */
const TopCategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate('/menu', { state: { category: categoryId } });
  };

  return (
    <section 
      aria-label="Top categories"
      className="w-full px-4 mt-5 mb-4 flex flex-col max-w-[640px] mx-auto font-sans"
    >
      {/* 2x2 Grid Layout — perfectly proportioned card architecture */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {BASE_CATEGORIES.map((cat, index) => {
          const BadgeIcon = cat.badgeIcon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCategoryClick(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
              className={`group relative overflow-hidden rounded-[26px] p-4 flex flex-col justify-between border ${cat.bgColor} ${cat.borderColor} ${cat.hoverBorder} shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(122,31,36,0.09)] transition-all duration-300 cursor-pointer min-h-[195px] sm:min-h-[210px]`}
            >
              {/* Settled Top Tag Badge */}
              <div className="w-full flex items-center justify-start gap-2 z-10">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-tight whitespace-nowrap shadow-2xs ${cat.badgeBg}`}>
                  <BadgeIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>{cat.badge}</span>
                </span>
              </div>

              {/* Seamless Floating 3D Object — mix-blend-multiply eliminates background box */}
              <div className="relative my-1.5 flex items-center justify-center w-full h-[95px] sm:h-[110px]">
                {/* Soft ambient color glow behind object */}
                <div 
                  className="absolute w-20 h-20 rounded-full blur-xl opacity-25 pointer-events-none"
                  style={{ backgroundColor: cat.accentColor }}
                />
                
                <img
                  src={cat.icon}
                  alt={`${cat.title} category icon`}
                  className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                  loading="lazy"
                />
              </div>

              {/* Category Title & Subtitle */}
              <div className="w-full text-center z-10">
                <div className="flex items-center justify-center gap-1">
                  <h3 className="text-[17px] sm:text-[19px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                </div>

                <p className="text-[11.5px] sm:text-[12.5px] text-on-surface-variant mt-0.5 font-medium line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopCategoriesSection;
