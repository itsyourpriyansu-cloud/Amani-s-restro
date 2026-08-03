import React from 'react';
import Toast from '../common/Toast';

const WaiterLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col pb-24">
      <Toast />

      {/* Subtle Background Layer */}
      <div className="fixed inset-0 bg-surface -z-10 pointer-events-none" />

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4">
        {children}
      </main>
    </div>
  );
};

export default WaiterLayout;
