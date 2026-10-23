import { loadData, loadDraft, createScheduledPayment, createScheduledPayments, formatAmount, nextDueDate, dateLabel } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { employee: null, employees: [], multiple: false, amountLabel: '', totalAmountLabel: '', dueLabel: '', draft: {}, consent: false, confirmed: false, payment: null, payments: [] },
  onLoad() {
    const draft = loadDraft();
    const allEmployees = loadData().employees;
    const multiple = Boolean(draft.multiple);
    const employees = multiple ? (draft.employeeIds || []).map((id) => allEmployees.find((item) => item.id === id && item.active)).filter(Boolean).map((item) => ({ ...item, amountLabel: formatAmount(item.amount) })) : [];
    const employee = allEmployees.find((item) => item.id === draft.employeeId) || employees[0] || null;
    const start = draft.startDate ? new Date(`${draft.startDate}T00:00:00`) : new Date();
    const due = employee ? nextDueDate(employee, start, multiple ? employee.frequency : draft.frequency) : null;
    const totalAmount = employees.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    this.setData({ draft, employee, employees, multiple, amountLabel: formatAmount(draft.amount), totalAmountLabel: formatAmount(totalAmount), dueLabel: due ? dateLabel(due) : '' });
  },
  toggleConsent() { this.setData({ consent: !this.data.consent }); },
  confirm() {
    if (!this.data.consent) { wx.showToast({ title: 'Veuillez confirmer votre accord.', icon: 'none' }); return; }
    try {
      if (this.data.multiple) {
        const payments = createScheduledPayments(loadData(), this.data.draft);
        this.setData({ confirmed: true, payment: payments[0], payments });
      } else {
        const payment = createScheduledPayment(loadData(), this.data.draft);
        this.setData({ confirmed: true, payment, payments: [payment] });
      }
    } catch (error) {
      wx.showToast({ title: error.message || 'Impossible d’enregistrer.', icon: 'none' });
    }
  },
  openCalendar() { wx.redirectTo({ url: `/pages/calendar/index?date=${this.data.payment.date}` }); },
  back() { navigateBack('/pages/schedule/index'); },
});
