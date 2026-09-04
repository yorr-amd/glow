export const isExfoliatingDay = (date = new Date()) => {
  const day = date.getDay();
  return day === 3 || day === 6;
};

export const getCurrentDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDayName = (date = new Date()) => {
  return date.toLocaleDateString('id-ID', { weekday: 'long' });
};

export const formatDateForDisplay = (date = new Date()) => {
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const getDateDaysAgo = (days, baseDate = new Date()) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() - days);
  return getCurrentDateString(date);
};