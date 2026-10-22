import { initials, loadData, saveData } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { id: '', editing: false, frequencyOptions: ['Hebdomadaire', 'Mensuelle'], form: { name: '', phone: '', amount: '', frequency: 'Mensuelle', email: '' } },
  onLoad(options) {
    const person = options.id ? loadData().employees.find((item) => item.id === options.id) : null;
    if (person) this.setData({ id: person.id, editing: true, form: { name: person.name, phone: person.phone, amount: String(person.amount), frequency: person.frequency, email: person.email || '' } });
  },
  input(event) { const field = event.currentTarget.dataset.field; this.setData({ [`form.${field}`]: event.detail.value }); },
  chooseFrequency(event) { this.setData({ 'form.frequency': this.data.frequencyOptions[Number(event.detail.value)] || 'Mensuelle' }); },
  save() {
    const { name, phone, amount, frequency, email } = this.data.form;
    if (!name.trim() || !/^\+?[0-9 ()-]{8,20}$/.test(phone.trim()) || !Number(amount) || Number(amount) <= 0) {
      wx.showToast({ title: 'Vérifiez le nom, le numéro et le montant.', icon: 'none' }); return;
    }
    const data = loadData();
    const old = data.employees.find((item) => item.id === this.data.id);
    const person = { ...(old || {}), id: old ? old.id : `e${Date.now()}`, name: name.trim(), avatarText: initials(name), phone: phone.trim(), amount: Number(amount), frequency, email: email.trim(), day: old ? old.day : 15, active: old ? old.active : true };
    data.employees = old ? data.employees.map((item) => item.id === old.id ? person : item) : [...data.employees, person];
    saveData(data);
    wx.showToast({ title: old ? 'Bénéficiaire modifié.' : 'Bénéficiaire enregistré.', icon: 'success' });
    setTimeout(() => navigateBack('/pages/employees/index'), 350);
  },
  back() { navigateBack('/pages/employees/index'); },
});
