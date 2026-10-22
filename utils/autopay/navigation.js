const ROUTES = {
  home: '/pages/index/index',
  employees: '/pages/employees/index',
  calendar: '/pages/calendar/index',
  history: '/pages/history/index',
};

export const navigateTab = (tab) => {
  const url = ROUTES[tab] || ROUTES.home;
  wx.reLaunch({ url });
};

export const navigateBack = (fallback = ROUTES.home) => {
  const stack = getCurrentPages();
  if (stack.length > 1) wx.navigateBack({ delta: 1 });
  else wx.redirectTo({ url: fallback });
};
