import { DeclensionEnum, GenderEnum } from '@/@types/enums';
import { alwaysArray, alwaysNumber, alwaysString } from './commonUtils';
import { NUM_WORDS, ukrainianAlphabet } from './constants';

export function odSentenceCase(str?: string | null) {
  const cleanString = alwaysString(str);
  return cleanString.charAt(0).toUpperCase() + cleanString.slice(1);
}

export function noSentenceCase(str?: string) {
  if (!str) {
    return '';
  }
  const cleanString = alwaysString(str);

  const secondChar = alwaysString(cleanString.charAt(1));
  const isAbr = secondChar && secondChar === secondChar.toUpperCase();
  if (isAbr) {
    return str;
  }

  return cleanString.charAt(0).toLowerCase() + cleanString.slice(1);
}

export function getNumberWord(number?: number | string | null, gender?: GenderEnum, declension?: DeclensionEnum) {
  if (!number) {
    return 'нуль';
  }
  const castedNumber = alwaysNumber(number);
  const word = NUM_WORDS[castedNumber - 1];

  if (castedNumber === 1 && gender === GenderEnum.feminine) {
    if (declension === DeclensionEnum.accusative) {
      return 'одну';
    }

    return 'одна';
  }

  if (castedNumber === 1) {
    if (declension === DeclensionEnum.accusative) {
      return 'одного';
    }

    return 'один';
  }

  if (castedNumber === 2 && gender === GenderEnum.feminine) {
    return 'дві';
  }

  return word || 'нуль';
}

export function getReadableCurrency(initialValue: string | number | null | undefined): string {
  if (!initialValue) {
    return '';
  }
  return `${alwaysNumber(initialValue)} грн`;
}

export function getReadablePercent(initialValue: string | number | null | undefined): string {
  if (!initialValue) {
    return '';
  }
  const value = alwaysNumber(initialValue);
  return `${value}%`;
}

export function getWordsCommonBase(words: (string | undefined | null)[]): string {
  if (words.length === 0) {
    return '';
  }
  const cleanWords = words.filter((word) => word && word.length > 0) as string[];
  let base = cleanWords[0];

  for (const word of cleanWords) {
    let commonPrefix = '';
    for (let i = 0; i < base.length && i < word.length; i++) {
      if (base[i] === word[i]) {
        commonPrefix += base[i];
      } else {
        break;
      }
    }
    base = commonPrefix;
    if (base === '') break;
  }
  return base;
}

export function getFileCellValue(value: number | null | string | undefined | boolean | Date | Record<any, any> | Array<any>) {
  return alwaysString(value, ' ');
}

const apostrophe = "'";

export function normalizeString(input: string) {
  return input.trim().replace(/['’`ʹ]/g, apostrophe);
}

type GetWordsArrayFromStringValue = number | null | string | undefined | boolean | Date | Record<any, any> | Array<any>;

export function getWordsArrayFromString(value: GetWordsArrayFromStringValue) {
  return normalizeString(alwaysString(value))
    .split(' ')
    .map((q) => q.trim())
    .filter((q) => q && q.length > 0);
}

export function getSearchRegExp(value: GetWordsArrayFromStringValue) {
  const userNameQuery = getWordsArrayFromString(value).join('.*');
  return new RegExp(userNameQuery, 'i');
}

export function formatBoolean(value?: boolean | null) {
  return value ? 'Так' : 'Ні';
}

export function stringifyRegistrationNumber(value: string | number | null | undefined) {
  return alwaysString(value).replace('.', '/');
}

export function parseRegistrationNumber(value: string | number | null | undefined) {
  return alwaysNumber(alwaysString(value).replace('/', '.'));
}

export function getAlphabetItem(i: number, excludedLetters?: string[]): string {
  const filteredAlphabet = ukrainianAlphabet.filter((letter) => {
    return !alwaysArray(excludedLetters)
      .map((i) => i?.toLowerCase())
      .includes(letter.toLowerCase());
  });
  return alwaysString(filteredAlphabet[i]);
}

export function getQueAlphabetLetter(i: number): string {
  return getAlphabetItem(i, ['ґ']);
}

interface GetCountWordsParamsWords {
  nominative: string;
  genitive: string;
}

interface GetCountWordsParams {
  initialNumber: number | string | undefined | null;
  declension?: DeclensionEnum.genitive | DeclensionEnum.nominative;
  lessThenFive: string;
  moreThenFive: string;
  zeroItem: GetCountWordsParamsWords;
  singleItem: GetCountWordsParamsWords;
}

function getCountWords({
  initialNumber,
  declension = DeclensionEnum.genitive,
  lessThenFive,
  moreThenFive,
  singleItem,
  zeroItem,
}: GetCountWordsParams) {
  const amount = alwaysNumber(initialNumber);

  let countSuffix = amount < 5 ? lessThenFive : moreThenFive;
  if (amount === 1) {
    countSuffix = singleItem.nominative;
    if (declension === DeclensionEnum.genitive) {
      countSuffix = singleItem.genitive;
    }
  }
  if (amount === 0) {
    countSuffix = zeroItem.nominative;
    if (declension === DeclensionEnum.genitive) {
      countSuffix = zeroItem.genitive;
    }
  }

  return countSuffix;
}

export function getJumpsCountString(i: number | string | undefined | null) {
  const amount = alwaysNumber(i);
  const suffix = getCountWords({
    initialNumber: i,
    lessThenFive: 'стрибки',
    moreThenFive: 'стрибків',
    singleItem: {
      nominative: 'стрибок',
      genitive: 'стрибок',
    },
    zeroItem: {
      nominative: 'стрибків',
      genitive: 'стрибків',
    },
  });

  return `${amount} (${getNumberWord(amount, GenderEnum.masculine, DeclensionEnum.accusative)}) ${suffix}`;
}

export function getUnitsCountString(i: number | string | undefined | null) {
  const amount = alwaysNumber(i);
  const suffix = getCountWords({
    initialNumber: i,
    lessThenFive: 'військовослужбовця',
    moreThenFive: 'військовослужбовців',
    singleItem: {
      nominative: 'військовослужбовець',
      genitive: 'військовослужбовця',
    },
    zeroItem: {
      nominative: 'військовослужбовців',
      genitive: 'військовослужбовців',
    },
  });

  return `${amount} (${getNumberWord(amount, GenderEnum.masculine, DeclensionEnum.accusative)}) ${suffix}`;
}

export function getDayEventCountString(i: number | string | undefined | null) {
  const amount = alwaysNumber(i);
  const suffix = getCountWords({
    initialNumber: i,
    lessThenFive: 'події',
    moreThenFive: 'подій',
    singleItem: {
      nominative: 'подія',
      genitive: 'подію',
    },
    zeroItem: {
      nominative: 'подій',
      genitive: 'подій',
    },
  });

  return `${amount} ${suffix}`;
}
