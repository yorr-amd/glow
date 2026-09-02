export const isExfoliatingDay = () => {
  const day = new Date().getDay();
  return day === 3 || day === 6;
};

export const getCurrentDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getDayName = (date = new Date()) => {
  return date.toLocaleDateString('id-ID', { weekday: 'long' });
};

export const formatDateForDisplay = (date = new Date()) => {
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};