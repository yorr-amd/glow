export const isExfoliatingDay = (date = new Date()) => {
  // Jika jam masih di bawah 05:00 pagi, anggap masih bagian dari hari sebelumnya (Malam)
  const logicalDate = new Date(date);
  if (logicalDate.getHours() < 5) {
    logicalDate.setDate(logicalDate.getDate() - 1);
  }
  const day = logicalDate.getDay();
  return day === 3 || day === 6; // Rabu (3) & Sabtu (6)
};

export const getCurrentDateString = (date = new Date()) => {
  const logicalDate = new Date(date);
  if (logicalDate.getHours() < 5) {
    logicalDate.setDate(logicalDate.getDate() - 1);
  }
  const year = logicalDate.getFullYear();
  const month = String(logicalDate.getMonth() + 1).padStart(2, '0');
  const day = String(logicalDate.getDate()).padStart(2, '0');
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