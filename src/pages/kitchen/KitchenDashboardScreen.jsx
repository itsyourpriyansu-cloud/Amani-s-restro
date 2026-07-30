import React, { useState } from 'react';
import KitchenHeader from '../../components/kitchen/KitchenHeader';
import KanbanBoard from '../../components/kitchen/KanbanBoard';

const KitchenDashboardScreen = ({
  orders = [],
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  defaultStation = 'All'
}) => {
  const [selectedStation, setSelectedStation] = useState(defaultStation);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [densityMode, setDensityMode] = useState('comfortable');

  return (
    <div className="flex flex-col h-full space-y-3 min-h-0 overflow-hidden">
      {/* Sleek Operational Toolbar */}
      <KitchenHeader
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        densityMode={densityMode}
        setDensityMode={setDensityMode}
        orders={orders}
      />

      {/* 3-Column Live Operational Kanban Workspace */}
      <div className="flex-1 min-h-0">
        <KanbanBoard
          orders={orders}
          onUpdateStatus={onUpdateStatus}
          onToggleItemDone={onToggleItemDone}
          onToggleRush={onToggleRush}
          filterStation={selectedStation}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          densityMode={densityMode}
        />
      </div>
    </div>
  );
};

export default KitchenDashboardScreen;
