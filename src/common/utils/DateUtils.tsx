export const daysOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const dayMap: { [key: string]: string } = {
  mon: '月',  tue: '火',  wed: '水',  thu: '木',  fri: '金',  sat: '土',  sun: '日',
};

export function isBusinessOpen(businessHours: BusinessHour[]): boolean {
  const today = new Date().toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
  const currentTime = new Date().getHours() * 100 + new Date().getMinutes();
  const todayHours = businessHours.find((hour) => hour.day === today);

  if (todayHours) {
    const openTime = parseInt(todayHours.open.replace(':', ''), 10);
    const closeTime = parseInt(todayHours.close.replace(':', ''), 10);
    return currentTime >= openTime && currentTime <= closeTime;
  }

  return false;
}

export function formatTodayBusinessHours(businessHours: BusinessHour[]): string {
  const today = new Date().toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
  const todayHours = businessHours.find((hour) => hour.day === today);

  if (todayHours) {
    return `${dayMap[today]} ${todayHours.open} - ${todayHours.close}`;
  }

  return `${dayMap[today]}曜日休み`;
}