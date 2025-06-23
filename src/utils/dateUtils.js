export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getToday = () => {
  return formatDate(new Date());
};

export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

export const getDateRange = (days) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(getDaysAgo(i));
  }
  return dates;
};

export const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    dates.push(formatDate(start));
    start.setDate(start.getDate() + 1);
  }
  
  return dates;
};

export const getDateDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const isPreviousDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setDate(d1.getDate() + 1);
  return formatDate(d1) === date2;
};