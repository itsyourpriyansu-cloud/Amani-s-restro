import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredKitchenPrefs, setStoredKitchenPrefs } from '../utils/storage';

const KitchenPrefsContext = createContext();

const DEFAULT_PREFS = {
  audioMuted: false,
  showTimers: true,
  textSize: 'normal', // 'small' | 'normal' | 'large'
  theme: 'light', // 'light' | 'dark'
  language: 'English',
};

const TEXT_SIZE_ROOT_PX = {
  small: 14,
  normal: 16,
  large: 18,
};

export const KitchenPrefsProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(() => ({
    ...DEFAULT_PREFS,
    ...(getStoredKitchenPrefs() || {}),
  }));

  useEffect(() => {
    setStoredKitchenPrefs(prefs);
  }, [prefs]);

  // Scale the root font-size while inside the kitchen module so text-size
  // preference affects all rem-based Tailwind utilities; reset on unmount.
  useEffect(() => {
    const previousFontSize = document.documentElement.style.fontSize;
    document.documentElement.style.fontSize = `${TEXT_SIZE_ROOT_PX[prefs.textSize] || 16}px`;
    return () => {
      document.documentElement.style.fontSize = previousFontSize;
    };
  }, [prefs.textSize]);

  const updatePref = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <KitchenPrefsContext.Provider value={{ prefs, updatePref }}>
      {children}
    </KitchenPrefsContext.Provider>
  );
};

export const useKitchenPrefs = () => {
  const context = useContext(KitchenPrefsContext);
  if (!context) {
    throw new Error('useKitchenPrefs must be used within KitchenPrefsProvider');
  }
  return context;
};
