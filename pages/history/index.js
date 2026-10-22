import { loadData, formatAmount } from '../../utils/autopay/store.js';

Page({
  data: { filter: 'all', items: [], failedCount: 0 },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() {
    const data = loadData();
    const items = data.history.filter((item) => this.data.filter === 'all' || item.status === this.data.filter).sort((a, b) => b.date.localeCompare(a.date)).map((item) => ({ ...item, amountLabel: formatAmount(item.amount) }));
    this.setData({ items, failedCount: data.history.filter((item) => item.status === 'failed').length });
  },
  setFilter(event) { this.setData({ filter: event.currentTarget.dataset.filter }, () => this.refresh()); },
  openPayment(event) { wx.navigateTo({ url: `/pages/payment-detail/index?id=${event.currentTarget.dataset.id}` }); },
  openFailures() { wx.navigateTo({ url: '/pages/failures/index' }); },
});
