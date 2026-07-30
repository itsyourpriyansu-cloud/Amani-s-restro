import React from 'react';
import { PackageX, Users } from 'lucide-react';
import { ContextualButton } from './DashboardPrimitives';

const AvailabilityStaffSection = ({ outOfStockItems, employees, onManageAvailability, onViewStaff }) => {
  const onShift = employees.filter((e) => e.availability === 'On Shift').length;
  const onBreak = employees.filter((e) => e.availability === 'On Break').length;
  const onLeave = employees.filter((e) => e.availability === 'On Leave').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <PackageX className="w-4 h-4 text-on-surface-variant" />
          <h3 className="text-sm font-bold text-on-surface">Out-of-Stock Items</h3>
          <span className="text-xs font-semibold text-on-surface-variant">{outOfStockItems.length} unavailable</span>
        </div>

        {outOfStockItems.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-1">Everything on the menu is available.</p>
        ) : (
          <ul className="text-xs text-on-surface space-y-1">
            {outOfStockItems.slice(0, 3).map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="font-medium">{item.name}</span>
                <span className="text-on-surface-variant">{item.state}</span>
              </li>
            ))}
            {outOfStockItems.length > 3 && (
              <li className="text-on-surface-variant">+{outOfStockItems.length - 3} more</li>
            )}
          </ul>
        )}

        <ContextualButton variant="tertiary" size="sm" onClick={onManageAvailability}>Manage Availability</ContextualButton>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-on-surface-variant" />
          <h3 className="text-sm font-bold text-on-surface">Staff Availability</h3>
        </div>
        <p className="text-xs text-on-surface">
          <strong>{onShift}</strong> on shift · <strong>{onBreak}</strong> on break · <strong>{onLeave}</strong> on leave
        </p>
        <ContextualButton variant="tertiary" size="sm" onClick={onViewStaff}>View Staff</ContextualButton>
      </div>
    </div>
  );
};

export default AvailabilityStaffSection;
