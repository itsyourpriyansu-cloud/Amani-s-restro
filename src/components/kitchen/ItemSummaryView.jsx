import React from 'react';
import { ChefHat, Layers, CheckCircle } from 'lucide-react';

const ItemSummaryView = ({ orders = [], selectedStation = 'All' }) => {
  const activeOrders = orders.filter((o) => o.status !== 'served');

  // Aggregate items across all active orders
  const itemMap = {};

  activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      // Filter by station if selected
      if (selectedStation !== 'All' && item.station !== selectedStation) return;

      if (!itemMap[item.name]) {
        itemMap[item.name] = {
          name: item.name,
          station: item.station,
          totalQuantity: 0,
          pendingQuantity: 0,
          tables: [],
          optionsList: [],
        };
      }

      itemMap[item.name].totalQuantity += item.quantity;
      if (!item.isDone) {
        itemMap[item.name].pendingQuantity += item.quantity;
      }
      if (!itemMap[item.name].tables.includes(order.tableNumber)) {
        itemMap[item.name].tables.push(order.tableNumber);
      }
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        item.selectedOptions.forEach((opt) => {
          if (!itemMap[item.name].optionsList.includes(opt)) {
            itemMap[item.name].optionsList.push(opt);
          }
        });
      }
    });
  });

  const summaryItems = Object.values(itemMap).sort(
    (a, b) => b.pendingQuantity - a.pendingQuantity
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm space-y-6">
      {/* View Title */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              Batch Cook Summary Queue
            </h2>
            <p className="text-xs text-on-surface-variant">
              Aggregated dish quantities requiring active prep across all tables
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs font-bold text-on-surface">
          {summaryItems.length} Unique Dishes
        </span>
      </div>

      {/* Grid of Summarized Dishes */}
      {summaryItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryItems.map((summary, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                summary.pendingQuantity > 0
                  ? 'bg-surface-container-lowest border-outline-variant/20 shadow-sm hover:border-primary/50'
                  : 'bg-surface-container-low border-outline-variant/10 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-primary text-on-primary font-extrabold text-sm rounded-lg shadow-sm">
                    {summary.pendingQuantity}x PENDING
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant/20">
                    {summary.station}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-on-surface tracking-wide">
                  {summary.name}
                </h3>

                {/* Custom Options Requested */}
                {summary.optionsList.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {summary.optionsList.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className="px-1.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant/20 text-[10px]"
                      >
                        + {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Table Numbers List */}
              <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Tables:
                </span>
                <div className="flex flex-wrap gap-1">
                  {summary.tables.map((tbl, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 bg-on-surface text-surface font-bold rounded-md text-[11px]"
                    >
                      #{tbl}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-xl">
          <CheckCircle className="w-10 h-10 mx-auto text-tertiary mb-2" />
          <p className="text-sm text-on-surface-variant font-medium">
            All kitchen prep is currently caught up!
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default ItemSummaryView;
