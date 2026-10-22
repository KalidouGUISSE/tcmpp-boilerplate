import { getSummary, getUpcoming, loadData, formatAmount } from '../../utils/autopay/store.js';

Page({
  data: { userName: 'Fatou', monthTotal: '', activeCount: 0, upcomingCount: 0, lateCount: 0, nextPayment: null, payments: [] },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() {
    const data = loadData();
    const summary = getSummary(data);
    const payments = getUpcoming(data).map((item) => ({ ...item, amountLabel: formatAmount(item.amount) }));
    this.setData({ ...summary, monthTotal: formatAmount(summary.monthTotal), lateCount: summary.failedCount, payments, nextPayment: payments[0] || null });
  },
  openSchedule() { wx.navigateTo({ url: '/pages/schedule/index' }); },
  openEmployees() { wx.navigateTo({ url: '/pages/employees/index' }); },
  openPayment(event) { wx.navigateTo({ url: `/pages/payment-detail/index?id=${event.currentTarget.dataset.id}` }); },
  openFailures() { wx.navigateTo({ url: '/pages/failures/index' }); },
});
