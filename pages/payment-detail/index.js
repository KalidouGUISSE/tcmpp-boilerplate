import { loadData, formatAmount } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { payment: null },
  onLoad(options) {
    const data = loadData();
    const payment = [...data.payments, ...data.history].find((item) => item.id === options.id);
    if (!payment) { wx.showToast({ title: 'Paiement introuvable.', icon: 'none' }); setTimeout(() => navigateBack(), 400); return; }
    this.setData({ payment: { ...payment, amountLabel: formatAmount(payment.amount), statusClass: payment.status === 'success' ? 'status-success' : payment.status === 'failed' ? 'status-failed' : 'status-pending' } });
  },
  back() { navigateBack(); },
});
