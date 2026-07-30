import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { getStoredReservations, setStoredReservations, addAuditLog } from '../../services/managerService';
import { formatInvoiceAmount } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import {
  Grid,
  Plus,
  Users,
  Calendar,
  X,
  RefreshCw
} from 'lucide-react';

const SECTIONS = ['All Sections', 'Main Dining Room', 'Patio Garden', 'VIP Lounge', 'Bar Counter'];

const ManagerTablesView = () => {
  const { showToast } = useToast();
  const { waiterTables, updateWaiterTableStatus } = useOrder();

  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [activeTab, setActiveTab] = useState('floor_plan'); // 'floor_plan' | 'reservations'

  const [reservations, setReservations] = useState(() => getStoredReservations());

  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);

  const [tableForm, setTableForm] = useState({
    tableNumber: '',
    capacity: 4,
    section: 'Main Dining Room',
  });

  const [resForm, setResForm] = useState({
    guestName: '',
    phone: '',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    tableNumber: '04',
    section: 'Main Dining Room',
    notes: '',
  });

  const saveReservations = (updated) => {
    setReservations(updated);
    setStoredReservations(updated);
  };

  const handleClearTable = (tableNumber) => {
    updateWaiterTableStatus(tableNumber, 'available', {
      guestCount: 0,
      activeOrderId: null,
      totalBill: 0,
      serverName: 'Unassigned',
    });
    addAuditLog('Table Reset', `Manager cleared and reset Table ${tableNumber}`, 'system');
    showToast(`Table ${tableNumber} is now marked Available`, 'info');
  };

  const handleAssignWaiter = (tableNumber) => {
    const waiterName = prompt(`Enter assigned server name for Table ${tableNumber}:`, 'Ananya Reddy');
    if (waiterName) {
      updateWaiterTableStatus(tableNumber, 'seated', { serverName: waiterName });
      addAuditLog('Table Staff Assigned', `Assigned ${waiterName} to Table ${tableNumber}`, 'staff');
      showToast(`Assigned ${waiterName} to Table ${tableNumber}`, 'success');
    }
  };

  const handleAddReservation = (e) => {
    e.preventDefault();
    if (!resForm.guestName || !resForm.phone) {
      showToast('Please enter guest name and phone number', 'error');
      return;
    }

    const newRes = {
      id: `res-${Date.now()}`,
      guestName: resForm.guestName,
      phone: resForm.phone,
      partySize: parseInt(resForm.partySize, 10) || 2,
      date: resForm.date,
      time: resForm.time,
      tableNumber: resForm.tableNumber,
      section: resForm.section,
      status: 'Confirmed',
      notes: resForm.notes,
    };

    saveReservations([newRes, ...reservations]);
    addAuditLog('Reservation Created', `Booked table reservation for ${resForm.guestName} (Party of ${resForm.partySize})`, 'system');
    showToast(`Reservation created for ${resForm.guestName}`, 'success');
    setIsAddReservationOpen(false);
  };

  const handleToggleResStatus = (resId) => {
    const updated = reservations.map((r) => {
      if (r.id === resId) {
        const nextStatus = r.status === 'Confirmed' ? 'Checked-in' : r.status === 'Checked-in' ? 'Cancelled' : 'Confirmed';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    saveReservations(updated);
    showToast('Reservation status updated', 'info');
  };

  const filteredTables = waiterTables.filter((t) => {
    if (selectedSection === 'All Sections') return true;
    if (selectedSection === 'Main Dining Room') return !t.tableNumber.startsWith('P') && !t.tableNumber.startsWith('VIP') && !t.tableNumber.startsWith('BAR');
    if (selectedSection === 'Patio Garden') return t.tableNumber.startsWith('P') || t.section === 'Patio Garden';
    if (selectedSection === 'VIP Lounge') return t.tableNumber.startsWith('VIP') || t.section === 'VIP Lounge';
    if (selectedSection === 'Bar Counter') return t.tableNumber.startsWith('BAR') || t.section === 'Bar Counter';
    return true;
  });

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Table &amp; Reservation Management</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage table seating layouts, active orders, assigned waiters, and guest reservations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('floor_plan')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'floor_plan' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'}`}
            >
              Floor Plan
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'reservations' ? 'bg-surface-container-lowest text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'}`}
            >
              Reservations ({reservations.length})
            </button>
          </div>

          {activeTab === 'reservations' ? (
            <button
              onClick={() => setIsAddReservationOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddTableOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-on-surface hover:opacity-90 text-surface font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'floor_plan' ? (
        <>
          {/* Section Filter Pills */}
          <div className="bg-surface-container-lowest rounded-2xl p-3 border border-outline-variant shadow-sm flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-on-surface-variant pl-2 shrink-0">Section:</span>
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSection === sec
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Table Cards Floor Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.map((tbl) => {
              let badgeColor = 'bg-green-100 text-green-800 border-green-300';
              if (tbl.status === 'cooking') badgeColor = 'bg-secondary-container/40 text-on-secondary-container border-secondary-container';
              else if (tbl.status === 'ready') badgeColor = 'bg-green-600 text-white border-green-500';
              else if (tbl.status === 'bill_requested') badgeColor = 'bg-error-container text-on-error-container border-error/30';

              return (
                <div
                  key={tbl.tableNumber}
                  className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-base shadow-sm">
                          {tbl.tableNumber}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-on-surface">Table {tbl.tableNumber}</h3>
                          <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Seats {tbl.capacity || 4} guests
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border capitalize ${badgeColor}`}>
                        {tbl.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/40 pt-3">
                      <div className="flex items-center justify-between">
                        <span>Assigned Server:</span>
                        <span className="font-semibold text-on-surface">{tbl.serverName || 'Unassigned'}</span>
                      </div>

                      {tbl.guestCount > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Seated Guests:</span>
                          <span className="font-bold text-on-surface">{tbl.guestCount} People</span>
                        </div>
                      )}

                      {tbl.totalBill > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Current Bill:</span>
                          <span className="font-bold text-primary">{formatInvoiceAmount(tbl.totalBill)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40 gap-2">
                    <button
                      onClick={() => handleAssignWaiter(tbl.tableNumber)}
                      className="flex-1 py-1.5 px-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl text-[11px] font-semibold transition-colors text-center"
                    >
                      Assign Waiter
                    </button>

                    <button
                      onClick={() => handleClearTable(tbl.tableNumber)}
                      className="p-1.5 bg-surface-container hover:bg-error-container/40 text-on-surface-variant hover:text-error rounded-xl transition-colors"
                      title="Clear Table & Reset Status"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Reservations Log List */
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Guest Reservations
            </h3>
            <span className="text-xs text-on-surface-variant">{reservations.length} Bookings</span>
          </div>

          <div className="divide-y divide-outline-variant/40">
            {reservations.map((res) => (
              <div key={res.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary-container/40 text-on-secondary-container font-bold text-xs flex items-center justify-center shrink-0">
                    T-{res.tableNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{res.guestName}</h4>
                    <span className="text-[11px] text-on-surface-variant">
                      Party of {res.partySize} • {res.phone} • {res.section}
                    </span>
                    {res.notes && (
                      <p className="text-[11px] text-primary italic mt-0.5">"{res.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <div className="font-bold text-on-surface">{res.date}</div>
                    <div className="text-on-surface-variant">{res.time}</div>
                  </div>

                  <button
                    onClick={() => handleToggleResStatus(res.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      res.status === 'Confirmed'
                        ? 'bg-secondary-container/30 text-on-secondary-container border-secondary-container'
                        : res.status === 'Checked-in'
                        ? 'bg-green-50 text-green-900 border-green-300'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant'
                    }`}
                  >
                    {res.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant relative">
            <button onClick={() => setIsAddTableOpen(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-on-surface mb-1 flex items-center gap-2"><Grid className="w-4 h-4 text-primary" /> Add Floor Table</h3>
            <p className="text-xs text-on-surface-variant mb-4">Enter table number and seating capacity.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Table Number (e.g. 13, P-04)</label>
                <input
                  type="text"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  placeholder="13"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Guest Capacity</label>
                <input
                  type="number"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: parseInt(e.target.value, 10) })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Floor Section</label>
                <select
                  value={tableForm.section}
                  onChange={(e) => setTableForm({ ...tableForm, section: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Main Dining Room">Main Dining Room</option>
                  <option value="Patio Garden">Patio Garden</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Bar Counter">Bar Counter</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button onClick={() => setIsAddTableOpen(false)} className="px-4 py-2 bg-surface-container text-on-surface rounded-xl font-semibold hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (tableForm.tableNumber) {
                      updateWaiterTableStatus(tableForm.tableNumber, 'available', { guestCount: 0 });
                      showToast(`Added Table ${tableForm.tableNumber}`, 'success');
                      setIsAddTableOpen(false);
                    }
                  }}
                  className="px-4 py-2 bg-primary hover:brightness-110 text-on-primary rounded-xl font-semibold transition-all"
                >
                  Create Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Reservation Modal */}
      {isAddReservationOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant relative">
            <button onClick={() => setIsAddReservationOpen(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-on-surface mb-1">Create Guest Reservation</h3>
            <p className="text-xs text-on-surface-variant mb-4">Book table for VIP or dining guests.</p>

            <form onSubmit={handleAddReservation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  value={resForm.guestName}
                  onChange={(e) => setResForm({ ...resForm, guestName: e.target.value })}
                  placeholder="e.g. Dr. Meenakshi Raman"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={resForm.phone}
                    onChange={(e) => setResForm({ ...resForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Party Size</label>
                  <input
                    type="number"
                    value={resForm.partySize}
                    onChange={(e) => setResForm({ ...resForm, partySize: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Date</label>
                  <input
                    type="date"
                    value={resForm.date}
                    onChange={(e) => setResForm({ ...resForm, date: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Time</label>
                  <input
                    type="text"
                    value={resForm.time}
                    onChange={(e) => setResForm({ ...resForm, time: e.target.value })}
                    placeholder="19:30"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Notes / Preferences</label>
                <input
                  type="text"
                  value={resForm.notes}
                  onChange={(e) => setResForm({ ...resForm, notes: e.target.value })}
                  placeholder="Anniversary, window table request..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddReservationOpen(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface rounded-xl font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary hover:brightness-110 text-on-primary rounded-xl font-semibold shadow-md transition-all">
                  Book Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTablesView;
