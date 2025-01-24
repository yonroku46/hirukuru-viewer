import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const daysOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const dayMap: { [key: string]: string } = {
  mon: '月',  tue: '火',  wed: '水',  thu: '木',  fri: '金',  sat: '土',  sun: '日',
};

export const dateNow = (): dayjs.Dayjs => {
  return dayjs().tz('Asia/Tokyo');
};

export function isBusinessOpen(businessHours: BusinessHour[]): boolean {
  const today = dayjs().format('ddd').toLowerCase();
  const currentTime = dayjs().hour() * 100 + dayjs().minute();
  const todayHours = businessHours.find((hour) => hour.day === today);

  if (todayHours) {
    const openTime = parseInt(todayHours.open.replace(':', ''), 10);
    const closeTime = parseInt(todayHours.close.replace(':', ''), 10);
    return currentTime >= openTime && currentTime <= closeTime;
  }

  return false;
}

export function formatTodayBusinessHours(businessHours: BusinessHour[]): string {
  const today = dayjs().format('ddd').toLowerCase();
  const todayHours = businessHours.find((hour) => hour.day === today);

  if (todayHours) {
    return `${dayMap[today]} ${todayHours.open} - ${todayHours.close}`;
  }

  return `${dayMap[today]}曜日休み`;
}

export function formatWeeklyBusinessHours(businessHours: BusinessHour[]): string {
  return daysOrder.map(day => {
    const dayHours = businessHours.find(hour => hour.day === day);
    if (dayHours) {
      return `${dayMap[day]}：${dayHours.open} - ${dayHours.close}`;
    }
    return `${dayMap[day]}：休み`;
  }).join('\n');
}