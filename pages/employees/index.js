import { loadData, saveData, formatAmount, nextDueDate, dateLabel } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

Page({
  data: { employees: [], query: '', statusFilter: 'all', filters: [], totalCount: 0, activeCount: 0, inactiveCount: 0, emptyTitle: '', emptyMessage: '' },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() {
    const { employees: allEmployees } = loadData();
    const query = (this.data.query || '').trim().toLowerCase();
    const phoneQuery = query.replace(/\D/g, '');
    const activeCount = allEmployees.filter((item) => item.active).length;
    const inactiveCount = allEmployees.length - activeCount;
    const employees = allEmployees.filter((item) => {
      const matchesStatus = this.data.statusFilter === 'all'
        || (this.data.statusFilter === 'active' && item.active)
        || (this.data.statusFilter === 'inactive' && !item.active);
      const nameAndPhone = `${item.name || ''} ${item.phone || ''}`.toLowerCase();
      const phoneDigits = String(item.phone || '').replace(/\D/g, '');
      const matchesQuery = !query || nameAndPhone.includes(query) || (phoneQuery && phoneDigits.includes(phoneQuery));
      return matchesStatus && matchesQuery;
    }).map((item) => ({
      ...item,
      amountLabel: formatAmount(item.amount),
      nextDueLabel: item.active ? dateLabel(nextDueDate(item)) : '',
    }));
    this.setData({
      employees,
      totalCount: allEmployees.length,
      activeCount,
      inactiveCount,
      filters: [
        { id: 'all', label: `Tous (${allEmployees.length})` },
        { id: 'active', label: `Actifs (${activeCount})` },
        { id: 'inactive', label: `Inactifs (${inactiveCount})` },
      ],
      emptyTitle: allEmployees.length ? 'Aucun bénéficiaire trouvé' : 'Aucun bénéficiaire',
      emptyMessage: allEmployees.length ? 'Modifiez la recherche ou le filtre sélectionné.' : 'Ajoutez votre premier bénéficiaire pour commencer.',
    });
  },
  onSearch(event) { this.setData({ query: event.detail.value || '' }, () => this.refresh()); },
  selectFilter(event) { this.setData({ statusFilter: event.currentTarget.dataset.filter }, () => this.refresh()); },
  onAvatarError(event) {
    const id = event.currentTarget.dataset.id;
    this.setData({ employees: this.data.employees.map((item) => item.id === id ? { ...item, avatarImage: '' } : item) });
  },
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
