import { toKatakana, toHiragana } from "wanakana";

export function createKanaSearchRegex(searchValue: string): RegExp {
  const searchKana = toKatakana(searchValue);
  const searchHiragana = toHiragana(searchValue);
  return new RegExp(`${searchValue}|${searchKana}|${searchHiragana}`, 'i');
}