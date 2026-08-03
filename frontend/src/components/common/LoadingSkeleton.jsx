import React from 'react';

export const FoodCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-stone-100 flex gap-4 animate-pulse">
      <div className="w-28 h-28 bg-stone-200 rounded-2xl flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-stone-200 rounded-full" />
            <div className="h-4 bg-stone-200 rounded w-2/3" />
          </div>
          <div className="h-3 bg-stone-100 rounded w-full mb-1" />
          <div className="h-3 bg-stone-100 rounded w-4/5" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 bg-stone-200 rounded w-16" />
          <div className="h-9 bg-stone-200 rounded-2xl w-20" />
        </div>
      </div>
    </div>
  );
};

export const MenuSkeletonList = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <FoodCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const CategorySkeletonRow = () => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4 no-scrollbar">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="h-10 w-28 bg-stone-200 rounded-full flex-shrink-0 animate-pulse" />
      ))}
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="p-4 space-y-6 animate-pulse max-w-md mx-auto">
      <div className="h-48 bg-stone-200 rounded-3xl w-full" />
      <div className="h-8 bg-stone-200 rounded-xl w-3/4" />
      <div className="space-y-3">
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-200 rounded w-5/6" />
      </div>
      <div className="h-12 bg-stone-200 rounded-2xl w-full" />
    </div>
  );
};

export default FoodCardSkeleton;
