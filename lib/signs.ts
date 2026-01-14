/**
 * 星座基础数据
 * 单一真实数据源
 */

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
export type SignCode = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

/**
 * 星座属性
 */
export interface Sign {
  name: string;
  code: SignCode;
  element: Element;
  modality: Modality;
  index: number; // 0..11，按白羊为 0，顺时针
}

/**
 * 12 星座属性表
 */
export const SIGNS: readonly Sign[] = [
  { name: '白羊座', code: 'Aries', element: 'Fire', modality: 'Cardinal', index: 0 },
  { name: '金牛座', code: 'Taurus', element: 'Earth', modality: 'Fixed', index: 1 },
  { name: '双子座', code: 'Gemini', element: 'Air', modality: 'Mutable', index: 2 },
  { name: '巨蟹座', code: 'Cancer', element: 'Water', modality: 'Cardinal', index: 3 },
  { name: '狮子座', code: 'Leo', element: 'Fire', modality: 'Fixed', index: 4 },
  { name: '处女座', code: 'Virgo', element: 'Earth', modality: 'Mutable', index: 5 },
  { name: '天秤座', code: 'Libra', element: 'Air', modality: 'Cardinal', index: 6 },
  { name: '天蝎座', code: 'Scorpio', element: 'Water', modality: 'Fixed', index: 7 },
  { name: '射手座', code: 'Sagittarius', element: 'Fire', modality: 'Mutable', index: 8 },
  { name: '摩羯座', code: 'Capricorn', element: 'Earth', modality: 'Cardinal', index: 9 },
  { name: '水瓶座', code: 'Aquarius', element: 'Air', modality: 'Fixed', index: 10 },
  { name: '双鱼座', code: 'Pisces', element: 'Water', modality: 'Mutable', index: 11 },
] as const;

/**
 * 根据代码获取星座
 */
export function getSignByCode(code: string): Sign | null {
  return SIGNS.find(s => s.code.toLowerCase() === code.toLowerCase()) ?? null;
}

/**
 * 根据中文名获取星座
 */
export function getSignByName(name: string): Sign | null {
  return SIGNS.find(s => s.name === name) ?? null;
}

/**
 * 根据索引获取星座
 */
export function getSignByIndex(index: number): Sign | null {
  if (index < 0 || index > 11) return null;
  return SIGNS[index];
}

/**
 * 获取所有星座代码
 */
export function getAllSignCodes(): SignCode[] {
  return SIGNS.map(s => s.code);
}

/**
 * 验证星座代码是否有效
 */
export function isValidSignCode(code: string): boolean {
  return getSignByCode(code) !== null;
}
