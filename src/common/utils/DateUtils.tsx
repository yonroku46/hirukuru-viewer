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
  const todayHours = businessHours.find((hour) => hour.dayOfWeek === today);

  if (todayHours) {
    const openTime = parseInt(todayHours.openTime.replace(':', ''), 10);
    const closeTime = parseInt(todayHours.closeTime.replace(':', ''), 10);
    return currentTime >= openTime && currentTime <= closeTime;
  }

  return false;
}

export function formatTodayBusinessHours(businessHours: BusinessHour[]): string {
  const today = dayjs().format('ddd').toLowerCase();
  const todayHours = businessHours.find((hour) => hour.dayOfWeek === today);

  if (todayHours) {
    const currentTime = dayjs().hour() * 100 + dayjs().minute();
    const openTime = parseInt(todayHours.openTime.replace(':', ''), 10);
    const closeTime = parseInt(todayHours.closeTime.replace(':', ''), 10);
    const isOutsideBusinessHours = currentTime < openTime || currentTime > closeTime;

    return `${dayMap[today]} ${todayHours.openTime} - ${todayHours.closeTime}${isOutsideBusinessHours ? '\n(営業時間外)' : ''}`;
  }

  return `${dayMap[today]}曜日休み`;
}

export function formatWeeklyBusinessHours(businessHours: BusinessHour[]): string {
  return daysOrder.map(day => {
    const dayHours = businessHours.find(hour => hour.dayOfWeek === day);
    if (dayHours) {
      return `${dayMap[day]}：${dayHours.openTime} - ${dayHours.closeTime}`;
    }
    return `${dayMap[day]}：休み`;
  }).join('\n');
}

export function getNextBusinessDay(businessHours: BusinessHour[]): dayjs.Dayjs {
  // 日曜日(0)を6に変換
  const todayIndex = (dayjs().day() + 6) % 7;
  const sortedBusinessHours = daysOrder.map(day => businessHours.find(hour => hour.dayOfWeek === day)).filter(Boolean);

  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDay = daysOrder[nextDayIndex];
    const nextDayHours = sortedBusinessHours.find(hour => hour?.dayOfWeek === nextDay);

    if (nextDayHours && nextDayHours.businessDay) {
      return dayjs().add(i, 'day').startOf('day');
    }
  }

  return dayjs().add(1, 'week').startOf('day');
}

export function timeUntil(targetTime: dayjs.Dayjs): string {
  const now = dateNow();

  if (targetTime.isBefore(now)) {
    return '過去の時間です';
  }

  let hours = targetTime.hour() - now.hour();
  let minutes = targetTime.minute() - now.minute();

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  if (hours === 0 && minutes > 0) {
    return `${minutes}分後`;
  }

  return `${hours}時間 ${minutes}分後`;
}