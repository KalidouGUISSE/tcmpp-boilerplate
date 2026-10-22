import { loadData, saveData, formatAmount } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { items: [] },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() { this.setData({ items: loadData().history.filter((item) => item.status === 'failed').map((item) => ({ ...item, amountLabel: formatAmount(item.amount) })) }); },
  verify(event) {
    const id = event.currentTarget.dataset.id;
    const data = loadData();
    data.history = data.history.map((item) => item.id === id ? { ...item, verified: true, verificationMessage: 'Vérification de démonstration : aucun transfert exécuté.' } : item);
    saveData(data);
    this.refresh();
    wx.showToast({ title: 'Aucun transfert exécuté (démo).', icon: 'none' });
  },
  retry(event) {
    const id = event.currentTarget.dataset.id;
    const data = loadData();
    const found = data.history.find((item) => item.id === id);
    if (!found || !found.verified) { wx.showToast({ title: 'Vérifiez d’abord le statut.', icon: 'none' }); return; }
    data.history = data.history.map((item) => item.id === id ? { ...item, status: 'pending', statusLabel: 'À vérifier · démo', reason: 'Nouvelle tentative simulée — aucun transfert exécuté', ref: `DEMO-RETRY-${String(Date.now()).slice(-5)}` } : item);
    saveData(data);
    this.refresh();
    wx.showToast({ title: 'Nouvelle tentative simulée.', icon: 'none' });
  },
  detail(event) { wx.navigateTo({ url: `/pages/payment-detail/index?id=${event.currentTarget.dataset.id}` }); },
  back() { navigateBack('/pages/history/index'); },
});
