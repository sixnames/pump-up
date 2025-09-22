import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { normalizeString } from './stringUtils';

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
    payload = value;
  }
  if (typeof value === 'number') {
    payload = `${value}`;
  }
  if (typeof value === 'boolean') {
    payload = value ? 'Так' : 'Ні';
  }
  if (value instanceof Date) {
    payload = value.toLocaleDateString('uk-UA');
  }
  if (Array.isArray(value)) {
    payload = value.join(', ');
  }
  if (isObject(value)) {
    payload = JSON.stringify(value);
  }
  return normalizeString(`${payload}`);
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

export function getMissingNumbers(numArr: number[], excludedNumbers?: number[]) {
  const arr = cloneDeep(numArr).sort((a, b) => a - b);
  const missingNumbers: number[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const currentNum = arr[i];
    const nextNum = arr[i + 1];

    if (nextNum - currentNum > 1) {
      for (let j = currentNum + 1; j < nextNum; j++) {
        missingNumbers.push(j);
      }
    }
  }
  return missingNumbers.filter((num) => !alwaysArray(excludedNumbers).includes(num));
}

export function getInOrderPositionName(origin: string): string {
  return `який перебуває в розпорядженні командира військової частини ${origin}`;
}

export function castDocToUI<SR, CT>(doc?: SR | null): CT {
  const initialDoc = JSON.parse(JSON.stringify(doc));
  return set(initialDoc, 'id', initialDoc._id) as CT;
}
