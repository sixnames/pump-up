import set from 'lodash/set';
import { normalizeApostrophes } from './stringUtils';

function isObject(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type AlwaysStringValue = number | null | string | undefined | boolean | Date | Record<any, any> | Array<any> | unknown;

export function alwaysString(value: AlwaysStringValue, fallback?: string | null): string {
  let payload;

  if (!value) {
    payload = fallback || '';
  }
  if (typeof value === 'string') {
    payload = normalizeApostrophes(value);
  }
  if (typeof value === 'number') {
    payload = normalizeApostrophes(`${value}`);
  }
  if (typeof value === 'boolean') {
    payload = value ? 'Так' : 'Ні';
  }
  if (value instanceof Date) {
    payload = value.toLocaleDateString('uk-UA');
  }
  if (Array.isArray(value)) {
    payload = normalizeApostrophes(value.join(', '));
  }
  if (isObject(value)) {
    payload = JSON.stringify(value);
  }
  return normalizeApostrophes(`${payload}`);
}

export function alwaysNumber(value: number | null | string | undefined, fallback?: number): number {
  try {
    if (value === null || value === undefined) {
      return fallback || 0;
    }
    let numberValue: number;
    if (typeof value === 'string') {
      numberValue = parseFloat(value);
    } else {
      numberValue = value;
    }
    return isNaN(numberValue) ? fallback || 0 : numberValue;
  } catch (e) {
    console.error(e, 'alwaysNumber error');
    return fallback || 0;
  }
}

export function alwaysArray<T>(value?: T | T[] | null): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function castDocToUI<SR, CT>(doc?: SR | null): CT {
  const initialDoc = JSON.parse(JSON.stringify(doc));
  return set(initialDoc, 'id', initialDoc._id) as CT;
}
