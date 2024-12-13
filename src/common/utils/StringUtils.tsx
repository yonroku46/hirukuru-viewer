export const daysOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function createState(len: number) {
  let characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function currency(num: number, unit?: string): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (unit || '');
}

export function calcDiscountRate(price: number, priceSale: number): string | undefined {
  if (priceSale !== undefined && priceSale < price) {
    const discountRate = ((price - priceSale) / price) * 100;
    return discountRate.toString() + '% ';
  }
  return undefined;
}

export function dateToString(date: Date): string {
  const formatDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatDate.format(date);
}

export function extractDelimiter(target: string, delimiter = '/'): string {
  const splitedTarget = target.split(delimiter);
  const result = splitedTarget.length >= 3 ? `${delimiter}${splitedTarget.slice(1, 3).join(delimiter)}` : '';
  return result;
}

export function calculateAge(birthday: string): number {
  // String to Date object
  const birthDate = new Date(birthday);
  const currentDate = new Date();

  // Subtract birth year from current year
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // If birthday hasn't passed yet, subtract 1 from age
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  const dayDifference = currentDate.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}