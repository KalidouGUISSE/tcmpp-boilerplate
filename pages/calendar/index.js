import { loadData, formatAmount, isoDay } from '../../utils/autopay/store.js';
import { navigateBack } from '../../utils/autopay/navigation.js';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const SHORT_MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

Page({
  data: { weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], monthLabel: '', calendarCells: [], selectedDay: '', selectedPayments: [] },
  onLoad(options) {
    const today = isoDay(new Date());
    const upcoming = loadData().payments
      .filter((item) => item.status === 'scheduled' && item.date >= today)
      .sort((first, second) => first.date.localeCompare(second.date));
    const initialDate = options.date || (upcoming[0] && upcoming[0].date) || today;
    this._monthDate = new Date(`${initialDate}T00:00:00`);
    this.setData({ selectedDay: initialDate });
    this.refresh();
  },
  onShow() { this.refresh(); },
  refresh() {
    const data = loadData();
    const month = this._monthDate;
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const today = isoDay(new Date());
    const cellCount = Math.ceil((offset + total) / 7) * 7;
    const calendarCells = Array.from({ length: cellCount }, (_, index) => {
      const day = index - offset + 1;
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const key = isoDay(date);
      const inMonth = day > 0 && day <= total;
      return { key: `d${index}`, day: inMonth ? day : '', date: key, inMonth, today: key === today, selected: key === this.data.selectedDay, hasPayment: inMonth && data.payments.some((item) => item.date === key) };
    });
    const selectedPayments = data.payments.filter((item) => item.date === this.data.selectedDay).map((item) => {
      const [, month, day] = item.date.split('-');
      return { ...item, amountLabel: formatAmount(item.amount), dayNumber: Number(day), monthShort: SHORT_MONTHS[Number(month) - 1] };
    });
    this.setData({ monthLabel: `${MONTHS[month.getMonth()]} ${month.getFullYear()}`, calendarCells, selectedPayments });
  },
  changeMonth(event) { this._monthDate.setMonth(this._monthDate.getMonth() + Number(event.currentTarget.dataset.delta)); this.refresh(); },
  selectDay(event) { this.setData({ selectedDay: event.currentTarget.dataset.date }, () => this.refresh()); },
  openPayment(event) { wx.navigateTo({ url: `/pages/payment-detail/index?id=${event.currentTarget.dataset.id}` }); },
  back() { navigateBack(); },
});
