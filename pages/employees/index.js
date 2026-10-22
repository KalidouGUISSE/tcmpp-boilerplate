import { loadData, saveData, formatAmount } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { employees: [], query: '', activeCount: 0 },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() {
    const { employees } = loadData();
    const query = (this.data.query || '').toLowerCase();
    const filtered = employees.filter((item) => `${item.name} ${item.phone}`.toLowerCase().includes(query));
    this.setData({ employees: filtered.map((item) => ({ ...item, amountLabel: formatAmount(item.amount) })), activeCount: employees.filter((item) => item.active).length, totalCount: employees.length });
  },
  onSearch(event) { this.setData({ query: event.detail.value || '' }, () => this.refresh()); },
  addEmployee() { wx.navigateTo({ url: '/pages/employee-form/index' }); },
  editEmployee(event) { wx.navigateTo({ url: `/pages/employee-form/index?id=${event.currentTarget.dataset.id}` }); },
  schedule(event) { wx.navigateTo({ url: `/pages/schedule/index?employeeId=${event.currentTarget.dataset.id}` }); },
  toggleEmployee(event) {
    const id = event.currentTarget.dataset.id;
    const data = loadData();
    data.employees = data.employees.map((item) => item.id === id ? { ...item, active: !item.active } : item);
    saveData(data);
    this.refresh();
  },
  back() { navigateBack(); },
});
