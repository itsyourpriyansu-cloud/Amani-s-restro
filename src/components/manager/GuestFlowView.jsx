import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  CalendarDays,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Grid,
  Sparkles,
  AlertTriangle,
  X,
  HeartHandshake
} from 'lucide-react';

const SPECIAL_REQUEST_OPTIONS = [
  'Quiet Section',
  'Indoor',
  'Outdoor',
  'High Chair',
  'Wheelchair Access',
  'Birthday',
  'Anniversary',
  'Jain Meal Request',
  'Allergy Assistance',
  'Large Group'
];

const GuestFlowView = () => {
  const {
    guestFlow,
    waiterTables,
    addReservation,
    addWalkInGuest,
    markGuestArrived,
    assignTableToGuest,
    groupTablesForGuest,
    markGuestNoShow
  } = useOrder();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'RESERVATIONS' | 'WALK_IN' | 'ARRIVALS' | 'TABLES' | 'COMPLETED'
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('WALK_IN'); // 'WALK_IN' | 'RESERVATION'

  // Form State
  const [guestName, setGuestName] = useState('');
  const [mobile, setMobile] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [dateStr, setDateStr] = useState('2026-07-27');
  const [timeStr, setTimeStr] = useState('20:00');
  const [seatingPref, setSeatingPref] = useState('Quiet Section');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [internalNote, setInternalNote] = useState('');

  // Modals & Target State
  const [duplicateWarningModal, setDuplicateWarningModal] = useState(null);
  const [assignTableModalGuest, setAssignTableModalGuest] = useState(null);
  const [selectedAssignTableId, setSelectedAssignTableId] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [groupTablesModalGuest, setGroupTablesModalGuest] = useState(null);
  const [selectedGroupTableIds, setSelectedGroupTableIds] = useState([]);
  const [noShowModalGuest, setNoShowModalGuest] = useState(null);
  const [noShowNote, setNoShowNote] = useState('');

  const filteredGuests = guestFlow.filter(g => {
    const query = search.toLowerCase();
    const nameMatch = g.guestName.toLowerCase().includes(query) || (g.guestFlowId && g.guestFlowId.toLowerCase().includes(query));

    if (!nameMatch) return false;
    if (activeTab === 'RESERVATIONS') return g.guestType === 'RESERVATION';
    if (activeTab === 'WALK_IN') return g.guestType === 'WALK_IN';
    if (activeTab === 'ARRIVALS') return g.status === 'ARRIVED';
    if (activeTab === 'TABLES') return g.status === 'SEATED';
    if (activeTab === 'COMPLETED') return g.status === 'COMPLETED' || g.status === 'NO_SHOW' || g.status === 'CANCELLED';
    return true;
  });

  const toggleRequest = (req) => {
    if (selectedRequests.includes(req)) {
      setSelectedRequests(selectedRequests.filter(r => r !== req));
    } else {
      setSelectedRequests([...selectedRequests, req]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      showToast('Please enter guest name', 'warning');
      return;
    }

    const payload = {
      guestName,
      maskedMobile: mobile ? `******${mobile.slice(-4)}` : '******4821',
      partySize: parseInt(partySize) || 2,
      requestedDate: dateStr,
      requestedTime: timeStr,
      seatingPreference: seatingPref,
      specialRequests: selectedRequests,
      internalNote,
      repeatGuest: false,
      completedVisits: 1
    };

    if (addMode === 'WALK_IN') {
      const { newWalkIn, duplicateWarning } = addWalkInGuest(payload);
      if (duplicateWarning) {
        setDuplicateWarningModal({ newRecord: newWalkIn, existing: duplicateWarning });
      } else {
        showToast(`Added ${guestName} to Walk-In Queue! Expected wait: ${newWalkIn.expectedWaitMinutes}`, 'success');
      }
    } else {
      const { newRes, duplicateWarning } = addReservation(payload);
      if (duplicateWarning) {
        setDuplicateWarningModal({ newRecord: newRes, existing: duplicateWarning });
      } else {
        showToast(`Reservation confirmed for ${guestName}!`, 'success');
      }
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setGuestName('');
    setMobile('');
    setPartySize(2);
    setSelectedRequests([]);
    setInternalNote('');
  };

  const handleConfirmTableAssignment = () => {
    if (!selectedAssignTableId || !assignTableModalGuest) return;
    assignTableToGuest(assignTableModalGuest.guestFlowId, selectedAssignTableId, overrideReason);
    showToast(`Seated ${assignTableModalGuest.guestName} at Table ${selectedAssignTableId.replace('TABLE-', '')}!`, 'success');
    setAssignTableModalGuest(null);
    setSelectedAssignTableId('');
    setOverrideReason('');
  };

  const handleConfirmGroupSeating = () => {
    if (selectedGroupTableIds.length === 0 || !groupTablesModalGuest) return;
    groupTablesForGuest(groupTablesModalGuest.guestFlowId, selectedGroupTableIds);
    showToast(`Grouped ${selectedGroupTableIds.length} tables for ${groupTablesModalGuest.guestName}!`, 'success');
    setGroupTablesModalGuest(null);
    setSelectedGroupTableIds([]);
  };

  const handleConfirmNoShow = () => {
    if (!noShowModalGuest) return;
    markGuestNoShow(noShowModalGuest.guestFlowId, noShowNote || 'Grace period expired');
    showToast(`Marked ${noShowModalGuest.guestName} as No-Show.`, 'info');
    setNoShowModalGuest(null);
    setNoShowNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-mono">
              UNIFIED GUEST FLOW
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Reservations & Walk-In Queue</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-on-surface mt-1">Live Guest Operations</h2>
          <p className="text-xs text-on-surface-variant">
            Manage reservations, walk-in waitlists, seating table recommendations, and repeat guest hospitality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAddMode('WALK_IN');
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-primary text-on-primary rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-In</span>
          </button>
          <button
            onClick={() => {
              setAddMode('RESERVATION');
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-surface-container-high text-on-surface rounded-2xl text-xs font-bold flex items-center gap-2 border border-outline-variant/40 hover:bg-surface-container-highest transition-all"
          >
            <CalendarDays className="w-4 h-4 text-primary" />
            <span>Add Reservation</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Confirmed Reservations', count: guestFlow.filter(g => g.guestType === 'RESERVATION' && g.status === 'CONFIRMED').length, icon: CalendarDays, color: 'text-primary' },
          { label: 'Walk-Ins Waiting', count: guestFlow.filter(g => g.guestType === 'WALK_IN' && g.status === 'WAITING').length, icon: Clock, color: 'text-amber-600' },
          { label: 'Arrived & Waiting', count: guestFlow.filter(g => g.status === 'ARRIVED').length, icon: UserCheck, color: 'text-emerald-600' },
          { label: 'Currently Seated', count: guestFlow.filter(g => g.status === 'SEATED').length, icon: Users, color: 'text-purple-600' }
        ].map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${st.color}`} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface-variant">{st.label}</p>
                <p className="text-xl font-bold font-mono text-on-surface">{st.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'ALL', label: 'All Guests' },
            { id: 'RESERVATIONS', label: 'Reservations' },
            { id: 'WALK_IN', label: 'Walk-In Queue' },
            { id: 'ARRIVALS', label: 'Arrived' },
            { id: 'TABLES', label: 'Seated' },
            { id: 'COMPLETED', label: 'Completed / No-Show' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === t.id
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guest or #GF..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.length > 0 ? (
          filteredGuests.map(guest => {
            const isReservation = guest.guestType === 'RESERVATION';
            return (
              <div
                key={guest.guestFlowId}
                className={`bg-surface-container-lowest rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                  guest.status === 'ARRIVED'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : guest.status === 'SEATED'
                    ? 'border-purple-300 opacity-90'
                    : 'border-outline-variant/40 hover:border-outline-variant'
                }`}
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                          isReservation ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {guest.guestType}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-mono">{guest.guestFlowId}</span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-on-surface mt-1">{guest.guestName}</h4>
                      <p className="text-xs text-on-surface-variant font-mono">{guest.maskedMobile}</p>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        guest.status === 'ARRIVED' ? 'bg-emerald-100 text-emerald-900' :
                        guest.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-900' :
                        guest.status === 'WAITING' ? 'bg-amber-100 text-amber-900' :
                        guest.status === 'SEATED' ? 'bg-purple-100 text-purple-900' :
                        guest.status === 'NO_SHOW' ? 'bg-red-100 text-red-900' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guest.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Party Size:</span>
                      <span className="font-bold text-on-surface font-mono">{guest.partySize} Guests</span>
                    </div>
                    {isReservation ? (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Requested Time:</span>
                        <span className="font-bold text-on-surface font-mono">{guest.requestedTime}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Expected Wait:</span>
                        <span className="font-bold text-amber-700 font-mono">{guest.expectedWaitMinutes}</span>
                      </div>
                    )}
                    {guest.estimateUpdatedAt && (
                      <div className="text-[10px] text-on-surface-variant/70 italic text-right">
                        Estimate updated at {guest.estimateUpdatedAt}
                      </div>
                    )}
                    {guest.assignedTableId && (
                      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-1 mt-1">
                        <span className="font-medium">Assigned Table:</span>
                        <span className="font-bold text-primary font-mono">Table {guest.assignedTableId.replace('TABLE-', '')}</span>
                      </div>
                    )}
                  </div>

                  {/* Repeat Guest Banner */}
                  {guest.repeatGuest && (
                    <div className="mt-3 bg-primary/5 p-2.5 rounded-2xl border border-primary/20 text-xs flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-primary text-[11px]">Returning Guest ({guest.completedVisits} visits)</p>
                        <p className="text-[10px] text-on-surface-variant">Usual pref: {guest.seatingPreference || 'Quiet Section'}</p>
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {guest.specialRequests && guest.specialRequests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {guest.specialRequests.map((req, idx) => (
                        <span key={idx} className="bg-surface-container-high border border-outline-variant/30 px-2 py-0.5 rounded-full text-[10px] font-semibold text-on-surface">
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                  {guest.status !== 'SEATED' && guest.status !== 'NO_SHOW' && guest.status !== 'COMPLETED' && (
                    <>
                      {guest.status !== 'ARRIVED' && (
                        <button
                          onClick={() => {
                            markGuestArrived(guest.guestFlowId);
                            showToast(`Marked ${guest.guestName} as Arrived!`, 'success');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-emerald-700"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Mark Arrived</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setAssignTableModalGuest(guest);
                          const matchingTable = waiterTables.find(t => t.capacity >= guest.partySize && t.status === 'Available');
                          if (matchingTable) setSelectedAssignTableId(matchingTable.tableId);
                        }}
                        className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs hover:opacity-90"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Assign Table</span>
                      </button>

                      {guest.partySize > 6 && (
                        <button
                          onClick={() => setGroupTablesModalGuest(guest)}
                          className="px-2.5 py-1.5 bg-surface-container-high text-on-surface rounded-xl text-xs font-bold flex items-center gap-1 border border-outline-variant/40"
                          title="Group Tables"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>Group</span>
                        </button>
                      )}

                      <button
                        onClick={() => setNoShowModalGuest(guest)}
                        className="px-2.5 py-1.5 text-error hover:bg-error/10 rounded-xl text-xs font-bold"
                        title="Mark No Show"
                      >
                        No-Show
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 text-on-surface-variant">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
            <p className="font-bold">No guest records found</p>
            <p className="text-xs text-on-surface-variant/70 mt-1">Try adjusting search or tab filters.</p>
          </div>
        )}
      </div>

      {/* ADD WALK-IN / RESERVATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md border border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-on-surface">
                {addMode === 'WALK_IN' ? 'Add Walk-In Guest' : 'Add Reservation'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Party Size *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={partySize}
                    onChange={e => setPartySize(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Mobile (Optional)</label>
                  <input
                    type="tel"
                    placeholder="98401XXXXX"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                  />
                </div>
              </div>

              {addMode === 'RESERVATION' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Date</label>
                    <input
                      type="date"
                      value={dateStr}
                      onChange={e => setDateStr(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Time</label>
                    <input
                      type="time"
                      value={timeStr}
                      onChange={e => setTimeStr(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-on-surface block mb-1">Seating Preference</label>
                <select
                  value={seatingPref}
                  onChange={e => setSeatingPref(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                >
                  <option value="Quiet Section">Quiet Section</option>
                  <option value="Main Hall">Main Hall</option>
                  <option value="Window Bay">Window Bay</option>
                  <option value="Outdoor Deck">Outdoor Deck</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1.5">Special Requests (Subject to availability)</label>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIAL_REQUEST_OPTIONS.map(req => {
                    const isSel = selectedRequests.includes(req);
                    return (
                      <button
                        type="button"
                        key={req}
                        onClick={() => toggleRequest(req)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                          isSel ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                        }`}
                      >
                        {req}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-xs">
                  Save {addMode === 'WALK_IN' ? 'Walk-In' : 'Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TABLE MODAL */}
      {assignTableModalGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md border border-outline-variant/40 shadow-2xl overflow-hidden p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-serif font-bold text-lg text-on-surface">Assign Table for {assignTableModalGuest.guestName}</h3>
              <button onClick={() => setAssignTableModalGuest(null)} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-on-surface-variant">
              Party Size: <strong>{assignTableModalGuest.partySize} Guests</strong> • Seating Preference: <strong>{assignTableModalGuest.seatingPreference || 'Quiet Section'}</strong>
            </p>

            <div>
              <label className="font-bold text-on-surface block mb-1.5">Recommended Suitable Tables</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {waiterTables.map(t => {
                  const isCapMatch = t.capacity >= assignTableModalGuest.partySize;
                  const isAvail = t.status === 'Available';
                  const isSel = selectedAssignTableId === t.tableId;
                  return (
                    <button
                      key={t.tableId}
                      onClick={() => setSelectedAssignTableId(t.tableId)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSel ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-outline-variant/30 bg-surface-container-low hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-on-surface">
                        <span>Table {t.tableNumber}</span>
                        <span className="font-mono text-[11px]">{t.capacity} seats</span>
                      </div>
                      <p className={`text-[10px] mt-1 font-semibold ${isAvail ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {t.status} {!isCapMatch ? '(Capacity warning)' : ''}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedAssignTableId && waiterTables.find(t => t.tableId === selectedAssignTableId)?.capacity < assignTableModalGuest.partySize && (
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <p className="font-bold">Capacity Warning Override</p>
                <input
                  type="text"
                  placeholder="Enter reason for capacity override..."
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full mt-1.5 p-2 rounded-lg border border-amber-300 bg-white text-xs"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setAssignTableModalGuest(null)} className="px-4 py-2 rounded-xl text-on-surface-variant font-semibold">
                Cancel
              </button>
              <button onClick={handleConfirmTableAssignment} className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-xs">
                Confirm Table Seating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NO SHOW MODAL */}
      {noShowModalGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md border border-outline-variant/40 shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-error font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Mark No-Show — {noShowModalGuest.guestName}</span>
            </div>

            <div className="bg-error/10 p-3 rounded-2xl border border-error/20 text-error space-y-1">
              <p className="font-bold">Grace Period Verification</p>
              <p className="text-[11px]">Reservation time: {noShowModalGuest.requestedTime || '8:00 PM'} (20 min grace period passed).</p>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Attempted Contact Note *</label>
              <textarea
                value={noShowNote}
                onChange={e => setNoShowNote(e.target.value)}
                placeholder="e.g. Called mobile twice at 8:20 PM with no answer."
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface"
                rows="2"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setNoShowModalGuest(null)} className="px-4 py-2 rounded-xl text-on-surface-variant font-semibold">
                Cancel
              </button>
              <button onClick={handleConfirmNoShow} className="px-5 py-2 rounded-xl bg-error text-on-error font-bold shadow-xs">
                Confirm No-Show
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestFlowView;
