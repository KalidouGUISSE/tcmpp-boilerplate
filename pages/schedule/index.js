import { loadData, loadDraft, saveDraft, nextDueDate, dateLabel } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

const todayString = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };

Page({
  data: { activeEmployees: [], employeeIndex: 0, selectedEmployee: null, frequencyOptions: ['Journalier', 'Hebdomadaire', 'Mensuelle'], draft: {}, nextDueLabel: '' },
  onLoad(options) {
    this.initialEmployeeId = options.employeeId || '';
    const employee = loadData().employees.find((item) => item.id === this.initialEmployeeId && item.active) || loadData().employees.find((item) => item.active);
    const draft = { employeeId: employee ? employee.id : '', amount: employee ? String(employee.amount) : '', frequency: employee ? employee.frequency : 'Mensuelle', startDate: todayString(), endDate: '' };
    saveDraft(draft);
    this.refresh();
  },
  onShow() { this.refresh(); },
  refresh() {
    const activeEmployees = loadData().employees.filter((item) => item.active);
    let draft = loadDraft();
    if (!draft.startDate) {
      const employee = activeEmployees.find((item) => item.id === this.initialEmployeeId) || activeEmployees[0];
      draft = { employeeId: employee ? employee.id : '', amount: employee ? String(employee.amount) : '', frequency: employee ? employee.frequency : 'Mensuelle', startDate: todayString(), endDate: '' };
      saveDraft(draft);
    }
    const employeeIndex = Math.max(0, activeEmployees.findIndex((item) => item.id === draft.employeeId));
    const selectedEmployee = activeEmployees.find((item) => item.id === draft.employeeId) || null;
    const start = draft.startDate ? new Date(`${draft.startDate}T00:00:00`) : new Date();
    const due = selectedEmployee ? nextDueDate(selectedEmployee, start, draft.frequency) : null;
    this.setData({ activeEmployees, employeeIndex, selectedEmployee, draft, nextDueLabel: due ? dateLabel(due) : '' });
  },
  updateDraft(changes) { const draft = { ...this.data.draft, ...changes }; saveDraft(draft); this.setData({ draft }, () => this.refresh()); },
  selectEmployee(event) {
    const index = Number(event.detail.value);
    const employee = this.data.activeEmployees[index];
    if (!employee) return;
    this.updateDraft({ employeeId: employee.id, amount: String(employee.amount), frequency: employee.frequency });
  },
  input(event) { this.updateDraft({ [event.currentTarget.dataset.field]: event.detail.value }); },
  chooseFrequency(event) { this.updateDraft({ frequency: event.currentTarget.dataset.frequency }); },
  addEmployee() { saveDraft(this.data.draft); wx.navigateTo({ url: '/pages/employee-form/index' }); },
  continue() {
    const draft = this.data.draft;
    if (!this.data.selectedEmployee || !Number(draft.amount) || Number(draft.amount) <= 0 || !draft.startDate) { wx.showToast({ title: 'Choisissez un bénéficiaire, un montant et une date.', icon: 'none' }); return; }
    if (draft.endDate && draft.endDate < draft.startDate) { wx.showToast({ title: 'La date de fin doit suivre la date de début.', icon: 'none' }); return; }
    wx.navigateTo({ url: '/pages/confirmation/index' });
  },
  back() { navigateBack(); },
});
