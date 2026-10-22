import { loadData, loadDraft, createScheduledPayment, formatAmount, nextDueDate, dateLabel } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { employee: null, amountLabel: '', dueLabel: '', draft: {}, consent: false, confirmed: false, payment: null },
  onLoad() {
    const draft = loadDraft();
    const employee = loadData().employees.find((item) => item.id === draft.employeeId);
    const start = draft.startDate ? new Date(`${draft.startDate}T00:00:00`) : new Date();
    const due = employee ? nextDueDate(employee, start, draft.frequency) : null;
    this.setData({ draft, employee, amountLabel: formatAmount(draft.amount), dueLabel: due ? dateLabel(due) : '' });
  },
  toggleConsent() { this.setData({ consent: !this.data.consent }); },
  confirm() {
    if (!this.data.consent) { wx.showToast({ title: 'Veuillez confirmer votre accord.', icon: 'none' }); return; }
    try {
      const payment = createScheduledPayment(loadData(), this.data.draft);
      this.setData({ confirmed: true, payment });
    } catch (error) {
      wx.showToast({ title: error.message || 'Impossible d’enregistrer.', icon: 'none' });
    }
  },
  openCalendar() { wx.redirectTo({ url: `/pages/calendar/index?date=${this.data.payment.date}` }); },
  back() { navigateBack('/pages/schedule/index'); },
});
