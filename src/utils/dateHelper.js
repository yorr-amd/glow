export const isExfoliatingDay = (date) => {
  const isDefault = !date;
  const logicalDate = date ? new Date(date) : new Date();
  // Jika menggunakan waktu saat ini dan jam < 05:00 pagi, anggap masih bagian dari hari sebelumnya (Malam)
  if (isDefault && logicalDate.getHours() < 5) {
    logicalDate.setDate(logicalDate.getDate() - 1);
  }
  const day = logicalDate.getDay();
  return day === 3 || day === 6; // Rabu (3) & Sabtu (6)
};

export const getCurrentDateString = (date) => {
  const isDefault = !date;
  const logicalDate = date ? new Date(date) : new Date();
  if (isDefault && logicalDate.getHours() < 5) {
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

export const getDateDaysAgo = (days, baseDate) => {
  const isDefault = !baseDate;
  const date = baseDate ? new Date(baseDate) : new Date();
  if (isDefault && date.getHours() < 5) {
    date.setDate(date.getDate() - 1);
  }
  date.setDate(date.getDate() - days);
  return getCurrentDateString(date); // This won't shift because date is provided
};