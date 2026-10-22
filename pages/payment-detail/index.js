import { loadData, formatAmount } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { payment: null },
  onLoad(options) {
    const data = loadData();
    const found = [...data.payments, ...data.history].find((item) => item.id === options.id);
    if (!found) { wx.showToast({ title: 'Paiement introuvable.', icon: 'none' }); setTimeout(() => navigateBack(), 400); return; }
    const employee = data.employees.find((item) => item.id === found.employeeId);
    const payment = {
      ...found,
      avatarImage: found.avatarImage || (employee && employee.avatarImage) || '',
      amountLabel: formatAmount(found.amount),
      feeLabel: found.fee === 0 ? '0 FCFA' : found.fee == null ? 'À confirmer' : `${formatAmount(found.fee)} FCFA`,
      statusClass: found.status === 'success' ? 'status-success' : found.status === 'failed' ? 'status-failed' : 'status-pending',
    };
    this.setData({ payment });
  },
  downloadReceipt() {
    wx.showToast({ title: 'Aucun reçu réel pour un paiement de démonstration.', icon: 'none' });
  },
  back() { navigateBack(); },
});
