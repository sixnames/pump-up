import { DeclensionEnum } from '@/@types/enums';
import { alwaysNumber } from '@/lib/commonUtils';
import { MONTH_WORDS, WEEK_DAYS } from '@/lib/constants';
import { getNumberWord } from '@/lib/stringUtils';
import addZero from 'add-zero';
import { getDay, isSameDay, startOfMonth } from 'date-fns';

export function getToday() {
  return process.env.NODE_ENV === 'development' ? new Date(2023, 1, 20) : new Date();
}

export type GetReadableDateMonthVariant = 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;

interface GetReadableDateParams {
  date?: Date | string | null;
  year?: 'numeric' | '2-digit' | undefined;
  month?: GetReadableDateMonthVariant;
  day?: 'numeric' | '2-digit' | undefined;
}

export type GetReadableDatePayload = {
  date?: Date;
  dateDay: number;
  dateDayString: string;
  dateFileName: string;
  dateFileNameWithTime: string;
  readableDateWithTime: string;
  dateHour: number;
  dateMinutes: number;
  dateMonth: number;
  dateMonthString: string;
  dateMonthWord: string;
  dateMonthWordNominative: string;
  dateShortYear: string;
  dateYear: number;
  dateYearString: string;
  isToday?: boolean;
  monthStart?: Date;
  readableDate?: string;
  readableDateWithShortYear: string;
  readableDateWithoutDay: string;
  weekDay: string;
};

const getReadableDateEmptyPayload: GetReadableDatePayload = {
  readableDate: '',
  readableDateWithoutDay: '',
  readableDateWithTime: '',
  dateDay: 0,
  dateMonth: 0,
  dateYear: 0,
  dateHour: 0,
  dateMinutes: 0,
  date: undefined,
  monthStart: undefined,
  dateFileName: '',
  dateFileNameWithTime: '',
  dateDayString: '',
  dateMonthString: '',
  dateYearString: '',
  dateShortYear: '',
  dateMonthWord: '',
  dateMonthWordNominative: '',
  readableDateWithShortYear: '',
  weekDay: '',
  isToday: false,
};

export function getReadableDate({
  date,
  day = 'numeric',
  month = 'numeric',
  year = 'numeric',
}: GetReadableDateParams): GetReadableDatePayload {
  const eventDate = safeDate(date);
  if (!eventDate) {
    return getReadableDateEmptyPayload;
  }

  const monthStart = startOfMonth(new Date(eventDate).setHours(0, 0, 0, 0));
  const weekDayIndex = getDay(eventDate);
  const weekDay = WEEK_DAYS[weekDayIndex];

  const dateDay = eventDate.getDate();
  const dateMonth = eventDate.getMonth() + 1;
  const dateYear = eventDate.getFullYear();
  const dateHour = eventDate.getHours();
  const dateMinutes = eventDate.getMinutes();
  const dateMonthWordNominative = MONTH_WORDS[eventDate.getMonth()]?.nominative;
  const dateMonthWord = MONTH_WORDS[eventDate.getMonth()]?.genitive;

  const initialReadableDate = eventDate.toLocaleDateString('uk-UA', {
    year,
    month,
    day,
  });

  const dateYearString = `${dateYear}`;

  const dateFileName = `${dateYear}-${addZero(dateMonth)}-${addZero(dateDay)}`;
  const dateFileNameWithTime = `${dateFileName}-${addZero(dateHour)}-${addZero(dateMinutes)}`;

  const readableDate = initialReadableDate.replace('р.', 'року');

  return {
    readableDate,
    readableDateWithShortYear: readableDate.replace(dateYearString, dateYearString.slice(2)),
    readableDateWithoutDay: readableDate.split('.').slice(1).join('.'),
    readableDateWithTime: `${readableDate} ${addZero(dateHour)}:${addZero(dateMinutes)}`,
    dateDay,
    dateMonth,
    dateYear,
    dateHour,
    dateMinutes,
    dateFileName,
    dateFileNameWithTime,
    date: eventDate,
    monthStart,
    dateDayString: addZero(dateDay),
    dateMonthString: addZero(dateMonth),
    dateYearString,
    dateShortYear: `${dateYear}`.slice(2),
    dateMonthWord,
    dateMonthWordNominative,
    weekDay,
    isToday: isSameDay(eventDate, getToday()),
  };
}

export function getDaySuffix(number?: number | string | null) {
  if (!number) {
    return 'днів';
  }
  const castedNumber = alwaysNumber(number);
  const lastDigit = castedNumber > 20 ? castedNumber % 10 : castedNumber;
  if (lastDigit === 1) {
    return 'день';
  }
  if (lastDigit < 5 && lastDigit > 1) {
    return 'дні';
  }
  return 'днів';
}

export function getFullDaySuffix(number?: number | string | null, declension?: DeclensionEnum) {
  if (!number) {
    return '';
  }
  const castedNumber = alwaysNumber(number);
  const lastDigit = castedNumber > 20 ? castedNumber % 10 : castedNumber;
  if (lastDigit === 1) {
    if (declension === DeclensionEnum.accusative) {
      return 'добу';
    }
    return 'доба';
  }
  if (lastDigit < 5 && lastDigit > 1) {
    return 'доби';
  }
  return 'діб';
}

export function getMonthSuffix(initialNumber?: number) {
  const number = alwaysNumber(initialNumber);
  const lastDigit = number > 20 ? number % 10 : number;
  if (lastDigit === 1) {
    return 'місяць';
  }
  if (lastDigit < 5 && lastDigit > 1) {
    return 'місяці';
  }
  return 'місяців';
}

export function getYearSuffix(initialNumber?: number) {
  const number = alwaysNumber(initialNumber);
  const lastDigit = number > 20 ? number % 10 : number;
  if (lastDigit === 1) {
    return 'рік';
  }
  if (lastDigit < 5 && lastDigit > 1) {
    return 'роки';
  }
  return 'років';
}

interface GetReadableDurationParams {
  years?: number;
  months?: number;
  days?: number;
}

export function getReadableDuration(params: GetReadableDurationParams) {
  const years = alwaysNumber(params.years);
  const months = alwaysNumber(params.months);
  const days = alwaysNumber(params.days);

  return `${years} (${getNumberWord(years)}) ${getYearSuffix(years)} ${months} (${getNumberWord(
    months,
  )}) ${getMonthSuffix(months)} ${days} (${getNumberWord(days)}) ${getDaySuffix(days)}`;
}

export function safeDate(date?: Date | string | null, fallback?: Date | string): Date | undefined {
  try {
    const currentDate = date ? new Date(date) : undefined;
    if (!currentDate && fallback) {
      return new Date(fallback);
    }
    return currentDate;
  } catch (e) {
    if (fallback) {
      return new Date(fallback);
    }
    return undefined;
  }
}

export function alwaysDate(date?: Date | string | null, fallback?: Date | string): Date {
  return safeDate(date, fallback) as Date;
}
