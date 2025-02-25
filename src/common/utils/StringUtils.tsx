import dayjs from "dayjs";

import PendingIcon from '@mui/icons-material/Pending';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export const allergensList: { allergen: string, name: string, img: string }[] = [
  { allergen: '1', name: '卵', img: '/assets/icon/allergen/egg.svg' },
  { allergen: '2', name: '乳', img: '/assets/icon/allergen/milk.svg' },
  { allergen: '3', name: '小麦', img: '/assets/icon/allergen/wheat.svg' },
  { allergen: '4', name: 'そば', img: '/assets/icon/allergen/buckwheat.svg' },
  { allergen: '5', name: '落花生', img: '/assets/icon/allergen/peanut.svg' },
  { allergen: '6', name: 'えび', img: '/assets/icon/allergen/shrimp.svg' },
  { allergen: '7', name: 'かに', img: '/assets/icon/allergen/crab.svg' },
  { allergen: '8', name: 'くるみ', img: '/assets/icon/allergen/walnut.svg' },
];

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

export function optionsToString(options: ItemOption | ItemOption[]): string {
  if (!options) return '';

  const formatOption = (option: ItemOption) => {
    const priceString = option.optionPrice > 0
      ? `(+${currency(option.optionPrice)}円)`
      : option.optionPrice < 0
        ? `(-${currency(Math.abs(option.optionPrice))}円)`
        : `(無料)`;
    return `${option.optionName} ${priceString}`;
  };

  return Array.isArray(options)
    ? options.map(formatOption).join(' / ')
    : formatOption(options);
}

export function orderStatusDict(orderStatusType: OrderStatusCount['status'], key: 'key' | 'label' | 'color' | 'icon'): string | React.ReactNode {
  const orderStatus = [
    { key: "PENDING", label: "対応待ち", color: "var(--icon-color)", icon: <PendingIcon fontSize="inherit" /> },
    { key: "BOOKED", label: "予約", color: "var(--booked-color)", icon: <WatchLaterIcon fontSize="inherit" /> },
    { key: "PICKUP", label: "準備完了", color: "var(--pickup-color)", icon: <TakeoutDiningIcon fontSize="inherit" /> },
    { key: "DONE", label: "受取済み", color: "var(--done-color)", icon: <CheckIcon fontSize="inherit" /> },
    { key: "CANCEL", label: "キャンセル", color: "var(--icon-color)", icon: <CloseIcon fontSize="inherit" /> },
  ];
  return orderStatus.find((s) => s.key === orderStatusType)?.[key] || '';
}

export function payTypeDict(payTypeType: PayType['type'], key: 'label' | 'status'): string {
  const payType = [
    { key: "CASH", label: "現金", status: "現金払い" },
    { key: "CARD", label: "カード", status: "支払い済み" },
    { key: "APPLE", label: "Apple Pay", status: "支払い済み" },
    { key: "GOOGLE", label: "Google Pay", status: "支払い済み" },
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