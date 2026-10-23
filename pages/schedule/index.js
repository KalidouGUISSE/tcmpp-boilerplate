import { loadData, loadDraft, saveDraft, formatAmount, nextDueDate, dateLabel } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

const todayString = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };

Page({
  data: { activeEmployees: [], selectedEmployees: [], employeeIndex: 0, selectedEmployee: null, multiple: false, frequencyOptions: ['Journalier', 'Hebdomadaire', 'Mensuelle'], draft: {}, nextDueLabel: '' },
  onLoad(options) {
    this.initialEmployeeId = options.employeeId || '';
    const employees = loadData().employees;
    const employee = employees.find((item) => item.id === this.initialEmployeeId && item.active) || employees.find((item) => item.active);
    const draft = { employeeId: employee ? employee.id : '', employeeIds: employee ? [employee.id] : [], multiple: false, amount: employee ? String(employee.amount) : '', frequency: employee ? employee.frequency : 'Mensuelle', startDate: todayString(), endDate: '' };
    saveDraft(draft);
    this.refresh();
  },
  onShow() { this.refresh(); },
  refresh() {
    const activeEmployees = loadData().employees.filter((item) => item.active);
    let draft = loadDraft();
    if (!draft.startDate) {
      const employee = activeEmployees.find((item) => item.id === this.initialEmployeeId) || activeEmployees[0];
      draft = { employeeId: employee ? employee.id : '', employeeIds: employee ? [employee.id] : [], multiple: false, amount: employee ? String(employee.amount) : '', frequency: employee ? employee.frequency : 'Mensuelle', startDate: todayString(), endDate: '' };
      saveDraft(draft);
    }
    const employeeIds = Array.isArray(draft.employeeIds) ? draft.employeeIds : [draft.employeeId];
    const activeWithSelection = activeEmployees.map((item) => ({ ...item, amountLabel: formatAmount(item.amount), selected: employeeIds.includes(item.id) }));
    const selectedEmployees = activeWithSelection.filter((item) => item.selected);
    const selectedEmployee = activeEmployees.find((item) => item.id === draft.employeeId) || selectedEmployees[0] || null;
    const employeeIndex = Math.max(0, activeEmployees.findIndex((item) => item.id === (selectedEmployee && selectedEmployee.id)));
    const start = draft.startDate ? new Date(`${draft.startDate}T00:00:00`) : new Date();
    const due = selectedEmployee ? nextDueDate(selectedEmployee, start, draft.frequency) : null;
    this.setData({ activeEmployees: activeWithSelection, selectedEmployees, employeeIndex, selectedEmployee, multiple: Boolean(draft.multiple), draft, nextDueLabel: due ? dateLabel(due) : '' });
  },
  updateDraft(changes) { const draft = { ...this.data.draft, ...changes }; saveDraft(draft); this.setData({ draft }, () => this.refresh()); },
  selectEmployee(event) {
    const index = Number(event.detail.value);
    const employee = this.data.activeEmployees[index];
    if (!employee) return;
    this.updateDraft({ employeeId: employee.id, employeeIds: [employee.id], amount: String(employee.amount), frequency: employee.frequency });
  },
  toggleMultiple() {
    const draft = this.data.draft;
    if (draft.multiple) {
      const employeeId = (draft.employeeIds || [])[0] || draft.employeeId || '';
      const employee = this.data.activeEmployees.find((item) => item.id === employeeId);
      this.updateDraft({ multiple: false, employeeId, employeeIds: [], amount: employee ? String(employee.amount) : draft.amount, frequency: employee ? employee.frequency : draft.frequency });
      return;
    }
    const employeeIds = draft.employeeIds && draft.employeeIds.length ? draft.employeeIds : (draft.employeeId ? [draft.employeeId] : []);
    this.updateDraft({ multiple: true, employeeIds });
  },
  toggleBeneficiary(event) {
    const id = event.currentTarget.dataset.id;
    const employeeIds = this.data.draft.employeeIds || [];
    const nextIds = employeeIds.includes(id) ? employeeIds.filter((item) => item !== id) : [...employeeIds, id];
    this.updateDraft({ employeeIds: nextIds, employeeId: nextIds[0] || '' });
  },
  input(event) { this.updateDraft({ [event.currentTarget.dataset.field]: event.detail.value }); },
  chooseFrequency(event) { this.updateDraft({ frequency: event.currentTarget.dataset.frequency }); },
  addEmployee() { saveDraft(this.data.draft); wx.navigateTo({ url: '/pages/employee-form/index' }); },
  continue() {
    const draft = this.data.draft;
    if (draft.multiple) {
      const selectedIds = this.data.selectedEmployees.map((item) => item.id);
      if (!selectedIds.length || !draft.startDate) { wx.showToast({ title: 'Choisissez au moins un bénéficiaire et une date.', icon: 'none' }); return; }
      draft.employeeIds = selectedIds;
      saveDraft(draft);
    } else if (!this.data.selectedEmployee || !Number(draft.amount) || Number(draft.amount) <= 0 || !draft.startDate) { wx.showToast({ title: 'Choisissez un bénéficiaire, un montant et une date.', icon: 'none' }); return; }
    if (draft.endDate && draft.endDate < draft.startDate) { wx.showToast({ title: 'La date de fin doit suivre la date de début.', icon: 'none' }); return; }
    wx.navigateTo({ url: '/pages/confirmation/index' });
  },
  back() { navigateBack(); },
});
