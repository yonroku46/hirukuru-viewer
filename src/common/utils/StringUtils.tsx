import dayjs from "dayjs";

export function createState(len: number) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function formatDaysAgo(dateString: string): string | undefined {
  const inputDate = dayjs(dateString).startOf('day');
  const currentDate = dayjs().startOf('day');

  if (!inputDate.isValid()) {
    return undefined;
  }

  const daysDifference = currentDate.diff(inputDate, 'day');
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = currentDate.diff(inputDate, 'month');
  const yearsDifference = currentDate.diff(inputDate, 'year');

  if (daysDifference === 0) {
    return '今日';
  } else if (daysDifference > 0 && daysDifference <= 7) {
    return `${daysDifference}日前`;
  } else if (weeksDifference > 0 && weeksDifference < 5) {
    return `${weeksDifference}週前`;
  } else if (monthsDifference > 0 && monthsDifference < 12) {
    return `${monthsDifference}ヶ月前`;
  } else if (yearsDifference > 0) {
    return `${yearsDifference}年前`;
  } else {
    return undefined;
  }
}

export function formatRating(rating: number): string {
  return rating === 0 ? "0" : rating.toFixed(1);
}

export function currency(num: number, unit?: string): string {
  if (num === undefined) return '';
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

export function optionsToString(options: FoodOption | FoodOption[]): string {
  if (!options) return '';

  const formatOption = (option: FoodOption) => {
    const priceString = option.price > 0
      ? `(+${currency(option.price)}円)`
      : option.price < 0
        ? `(-${currency(Math.abs(option.price))}円)`
        : `(無料)`;
    return `${option.name} ${priceString}`;
  };

  return Array.isArray(options)
    ? options.map(formatOption).join(' / ')
    : formatOption(options);
}

export function orderStatusDict(orderStatusType: OrderStatus['status'], key: 'label' | 'color'): string {
  const orderStatus = [
    { key: "done", label: "完了", color: "var(--done-color)" },
    { key: "pickup", label: "受け取り予定", color: "var(--pickup-color)" },
    { key: "booked", label: "予約", color: "var(--booked-color)" },
    { key: "review", label: "レビュー待ち", color: "var(--review-color)" },
    { key: "cancel", label: "キャンセル", color: "var(--cancel-color)" },
  ];
  return orderStatus.find((s) => s.key === orderStatusType)?.[key] || '';
}

export function payTypeDict(payTypeType: PayType['type'], key: 'label'): string {
  const payType = [
    { key: "cash", label: "現金" },
    { key: "card", label: "カード" },
    { key: "apple", label: "Apple Pay" },
    { key: "google", label: "Google Pay" },
  ];
  return payType.find((s) => s.key === payTypeType)?.[key] || '';
}

export function calculateAge(birthday: string): number {
  // 誕生日をDateオブジェクトに変換
  const birthDate = dayjs(birthday);
  const currentDate = dayjs();

  // 誕生日の年から現在の年を引く
  let age = currentDate.year() - birthDate.year();

  // 誕生日が過ぎていない場合は年齢を1減らす
  const monthDifference = currentDate.month() - birthDate.month();
  const dayDifference = currentDate.date() - birthDate.date();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}