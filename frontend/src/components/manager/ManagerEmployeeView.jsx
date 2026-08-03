import React, { useState } from 'react';
import { getStoredEmployees, setStoredEmployees, addAuditLog } from '../../services/managerService';
import { useToast } from '../../context/ToastContext';
import ActionConfirmationModal from '../common/ActionConfirmationModal';
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Edit2,
  Archive,
  Mail,
  Phone,
  X,
  AlertTriangle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

const ROLES = [
  'Restaurant Manager',
  'Shift Manager',
  'Cashier',
  'Counter Staff',
  'Waiter',
  'Captain',
  'Head Chef',
  'Kitchen Staff',
  'Steward',
  'Host',
  'Cleaning Staff'
];

const ManagerEmployeeView = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState(() => getStoredEmployees());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Safe Action Confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    employee: null
  });

  const [formData, setFormData] = useState({
    name: '',
    role: 'Waiter',
    email: '',
    phone: '',
    avatar: '',
    shift: 'Morning Shift (09:00 - 18:00)',
    status: 'On Shift',
    department: 'Floor Service',
    assignedSection: 'Main Dining Hall'
  });

  const saveEmployees = (updated) => {
    setEmployees(updated);
    setStoredEmployees(updated);
  };

  const handleToggleStatus = (empId) => {
    const updated = employees.map((e) => {
      if (e.id === empId) {
        const newStatus = e.status === 'On Shift' ? 'Off Duty' : 'On Shift';
        addAuditLog('Staff Status Toggled', `Toggled ${e.name} status to ${newStatus}`, 'staff');
        showToast(`${e.name} is now ${newStatus}`, 'info');
        return { ...e, status: newStatus, availability: newStatus };
      }
      return e;
    });
    saveEmployees(updated);
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: 'Waiter',
      email: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      shift: 'Morning Shift (09:00 - 18:00)',
      status: 'On Shift',
      department: 'Floor Service',
      assignedSection: 'Main Dining Hall'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      role: emp.role || 'Waiter',
      email: emp.email || '',
      phone: emp.phone || '',
      avatar: emp.avatar || '',
      shift: emp.shift || 'Morning Shift (09:00 - 18:00)',
      status: emp.status || 'On Shift',
      department: emp.department || 'Floor Service',
      assignedSection: emp.assignedSection || 'Main Dining Hall'
    });
    setIsModalOpen(true);
  };

  const initiateArchiveEmployee = (emp) => {
    // Check if employee has active assigned tables
    if (emp.assignedTables && emp.assignedTables.length > 0) {
      alert(`Reassign ${emp.assignedTables.length} active tables (${emp.assignedTables.join(', ')}) before archiving this employee.`);
      return;
    }

    setConfirmationModal({
      isOpen: true,
      employee: emp
    });
  };

  const handleConfirmArchive = (modalData) => {
    const emp = confirmationModal.employee;
    if (!emp) return;

    const updated = employees.filter((e) => e.id !== emp.id);
    saveEmployees(updated);
    addAuditLog(
      'EMPLOYEE_ARCHIVED',
      `Archived employee ${emp.name} (${emp.role}) - Reason: ${modalData.reason}`,
      'staff'
    );
    showToast(`Archived employee "${emp.name}" successfully`, 'success');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please fill in employee name and phone number', 'error');
      return;
    }

    if (editingEmployee) {
      const updated = employees.map((e) =>
        e.id === editingEmployee.id
          ? {
              ...e,
              name: formData.name,
              role: formData.role,
              email: formData.email,
              phone: formData.phone,
              avatar: formData.avatar || e.avatar,
              shift: formData.shift,
              status: formData.status,
              availability: formData.status,
              department: formData.department,
              assignedSection: formData.assignedSection
            }
          : e
      );
      saveEmployees(updated);
      addAuditLog('Employee Updated', `Updated staff member ${formData.name}`, 'staff');
      showToast(`Updated employee "${formData.name}"`, 'success');
    } else {
      const newEmp = {
        id: `staff-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@amanisrestro.in`,
        phone: formData.phone,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        shift: formData.shift,
        status: formData.status,
        availability: formData.status,
        department: formData.department,
        assignedSection: formData.assignedSection,
        assignedTables: [],
        joinDate: new Date().toISOString().split('T')[0]
      };
      const updated = [newEmp, ...employees];
      saveEmployees(updated);
      addAuditLog('Employee Added', `Added new staff member ${formData.name}`, 'staff');
      showToast(`Added employee "${formData.name}"`, 'success');
    }
    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.phone && emp.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-on-surface">Employee Roster</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {employees.length} Staff Members
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Operational shift management, table assignments, and section roles
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee by name, role or phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-on-surface rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-on-surface rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="On Shift">On Shift</option>
            <option value="Off Duty">Off Duty</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-outline-variant/40"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-on-surface">{emp.name}</h3>
                    <span className="inline-block text-xs font-bold text-primary">{emp.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleStatus(emp.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      emp.status === 'On Shift'
                        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                    }`}
                  >
                    {emp.status}
                  </button>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-outline-variant/20 space-y-1.5 text-xs text-on-surface-variant font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{emp.phone || '+91 98400 00000'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="text-[11px] pt-1">
                  Shift: <strong className="text-on-surface">{emp.shift}</strong>
                </div>
                {emp.assignedTables?.length > 0 ? (
                  <div className="text-[11px]">
                    Assigned Tables: <strong className="text-primary font-bold">{emp.assignedTables.join(', ')}</strong>
                  </div>
                ) : (
                  <div className="text-[11px] text-on-surface-variant/60 italic">No active table assignments</div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenEditModal(emp)}
                className="px-3 py-1.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container font-bold text-on-surface flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-primary" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => initiateArchiveEmployee(emp)}
                className="px-3 py-1.5 rounded-xl border border-error/20 hover:bg-error-container/30 text-error font-bold flex items-center gap-1.5 transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-extrabold text-base text-on-surface">
                {editingEmployee ? `Edit Employee (${editingEmployee.name})` : 'Add New Employee'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98401 11223"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Shift</label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                >
                  <option value="Morning Shift (09:00 - 18:00)">Morning Shift (09:00 - 18:00)</option>
                  <option value="Evening Shift (14:00 - 23:00)">Evening Shift (14:00 - 23:00)</option>
                  <option value="Full Shift (08:30 - 17:30)">Full Shift (08:30 - 17:30)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-2.5 font-semibold text-on-surface"
                >
                  <option value="On Shift">On Shift</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Action Confirmation Modal */}
      <ActionConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, employee: null })}
        onConfirm={handleConfirmArchive}
        title={`Archive Employee ${confirmationModal.employee?.name}?`}
        affectedRecord={`${confirmationModal.employee?.name} (${confirmationModal.employee?.role})`}
        consequenceExplanation="This staff member will be archived from active shifts and floor rosters, but preserved in historical activity logs and past order records."
        requiredPermission="EMPLOYEE_ARCHIVE"
        currentRole="MANAGER"
        reasons={[
          'End of employment contract',
          'Transferred to sister branch',
          'Extended medical leave',
          'Role restructuring',
          'Other'
        ]}
        confirmButtonText="Archive Employee"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default ManagerEmployeeView;
