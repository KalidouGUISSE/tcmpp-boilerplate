const DATA_KEY = 'maxit_autopay_demo_v1';
const DRAFT_KEY = 'maxit_autopay_draft_v1';
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export const initials = (name) => (name || '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
export const isoDay = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const dateLabel = (date) => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
export const formatAmount = (amount) => Number(amount || 0).toLocaleString('fr-FR');

export const nextDueDate = (employee, fromDate = new Date(), frequency) => {
  const cadence = frequency || employee.frequency;
  if (cadence === 'Hebdomadaire') return new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + 7);
  const day = employee.day || 15;
  const result = new Date(fromDate.getFullYear(), fromDate.getMonth(), day);
  if (result < new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())) result.setMonth(result.getMonth() + 1);
  return result;
};

export const makeDemoData = () => {
  const employees = [
    { id: 'e1', name: 'Aminata Diallo', phone: '+221 77 123 45 67', amount: 100000, frequency: 'Mensuelle', day: 15, active: true },
    { id: 'e2', name: 'Moussa Sow', phone: '+221 76 987 65 43', amount: 75000, frequency: 'Mensuelle', day: 20, active: true },
    { id: 'e3', name: 'Ismaël Diop', phone: '+221 70 456 76 90', amount: 60000, frequency: 'Mensuelle', day: 25, active: true },
  ].map((item) => ({ ...item, avatarText: initials(item.name) }));
  const now = new Date();
  const payments = employees.map((employee, index) => {
    const due = nextDueDate(employee);
    return { id: `upcoming-${employee.id}`, employeeId: employee.id, name: employee.name, avatarText: employee.avatarText, phone: employee.phone, amount: employee.amount, date: isoDay(due), dateLabel: dateLabel(due), status: 'scheduled', statusLabel: 'Programmé', ref: `DEMO-${String(index + 1).padStart(3, '0')}`, fee: null, mode: 'Programmation de démonstration' };
  });
  const past = (daysAgo) => { const date = new Date(now); date.setDate(date.getDate() - daysAgo); return date; };
  const history = [
    { id: 'h1', employeeId: 'e1', name: employees[0].name, avatarText: employees[0].avatarText, phone: employees[0].phone, amount: 100000, date: isoDay(past(2)), dateLabel: `${dateLabel(past(2))} · 10:24`, status: 'success', statusLabel: 'Réussi', ref: 'DEMO-H001', fee: 0, mode: 'Simulation de démonstration' },
    { id: 'h2', employeeId: 'e2', name: employees[1].name, avatarText: employees[1].avatarText, phone: employees[1].phone, amount: 75000, date: isoDay(past(5)), dateLabel: `${dateLabel(past(5))} · 09:15`, status: 'pending', statusLabel: 'En attente', ref: 'DEMO-H002', fee: null, mode: 'Simulation de démonstration' },
    { id: 'h3', employeeId: 'e3', name: employees[2].name, avatarText: employees[2].avatarText, phone: employees[2].phone, amount: 60000, date: isoDay(past(8)), dateLabel: `${dateLabel(past(8))} · 14:32`, status: 'failed', statusLabel: 'Échoué', ref: 'DEMO-H003', fee: null, reason: 'Solde insuffisant', mode: 'Simulation de démonstration', verified: false },
    { id: 'h4', employeeId: 'e1', name: employees[0].name, avatarText: employees[0].avatarText, phone: employees[0].phone, amount: 100000, date: isoDay(past(35)), dateLabel: `${dateLabel(past(35))} · 10:20`, status: 'success', statusLabel: 'Réussi', ref: 'DEMO-H004', fee: 0, mode: 'Simulation de démonstration' },
  ];
  return { employees, payments, history };
};

export const loadData = () => {
  const stored = wx.getStorageSync(DATA_KEY);
  const data = stored && Array.isArray(stored.employees) ? stored : makeDemoData();
  data.payments = (data.payments || []).map((item) => ({ ...item, avatarText: item.avatarText || initials(item.name) }));
  data.history = (data.history || []).map((item) => ({ ...item, avatarText: item.avatarText || initials(item.name) }));
  data.employees = data.employees.map((item) => ({ ...item, avatarText: item.avatarText || initials(item.name) }));
  return data;
};
export const saveData = (data) => wx.setStorageSync(DATA_KEY, data);
export const loadDraft = () => wx.getStorageSync(DRAFT_KEY) || {};
export const saveDraft = (draft) => wx.setStorageSync(DRAFT_KEY, draft);
export const clearDraft = () => wx.removeStorageSync(DRAFT_KEY);
export const getUpcoming = (data) => data.payments.filter((item) => item.status === 'scheduled').sort((a, b) => a.date.localeCompare(b.date));
export const getSummary = (data) => ({
  activeCount: data.employees.filter((item) => item.active).length,
  upcomingCount: data.payments.filter((item) => item.status === 'scheduled').length,
  failedCount: data.history.filter((item) => item.status === 'failed').length,
  monthTotal: data.employees.reduce((sum, item) => sum + (item.active ? Number(item.amount) * (item.frequency === 'Hebdomadaire' ? 52 / 12 : 1) : 0), 0),
});
export const createScheduledPayment = (data, draft) => {
  const employee = data.employees.find((item) => item.id === draft.employeeId);
  const due = new Date(`${draft.startDate}T00:00:00`);
  if (!employee || !employee.active || !draft.amount || !draft.startDate || Number.isNaN(due.getTime())) throw new Error('Informations de programmation incomplètes.');
  const nextDue = nextDueDate(employee, due, draft.frequency);
  const stamp = Date.now();
  const payment = { id: `demo-${stamp}`, employeeId: employee.id, name: employee.name, avatarText: employee.avatarText, phone: employee.phone, amount: Number(draft.amount), date: isoDay(nextDue), dateLabel: dateLabel(nextDue), status: 'scheduled', statusLabel: 'Programmé · démo', ref: `DEMO-${String(stamp).slice(-6)}`, fee: null, mode: 'Mode démonstration — aucun transfert exécuté' };
  data.payments.unshift(payment);
  saveData(data);
  clearDraft();
  return payment;
};
