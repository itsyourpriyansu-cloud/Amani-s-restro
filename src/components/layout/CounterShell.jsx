import React from 'react';
import CounterSidebar from '../counter/CounterSidebar';
import CounterTopBar from '../counter/CounterTopBar';

const CounterShell = ({ title, subtitle, showSearch, children }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <CounterSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CounterTopBar title={title} subtitle={subtitle} showSearch={showSearch} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CounterShell;
