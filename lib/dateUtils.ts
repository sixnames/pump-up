import { DeclensionEnum } from '@/@types/enums';
import { alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { MONTH_WORDS, WEEK_DAYS } from '@/lib/constants';
import addZero from 'add-zero';
import { getDay, isSameDay, startOfDay, startOfMonth, startOfToday } from 'date-fns';

export function getToday() {
  return process.env.NODE_ENV === 'development' ? startOfDay(new Date(2023, 1, 20)) : startOfToday();
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
  readableDateWithTime: string;
  dateHour: number;
  dateMinutes: number;
  dateMonth: number;
  dateMonthString: string;
  dateMonthWord: string;
  dateMonthWordNominative: string;
  dateYearShort: string;
  dateYear: number;
  fileNameDate: string;
  dateYearString: string;
  isToday?: boolean;
  monthStart?: Date;
  readableDate?: string;
  readableDateWithShortYear: string;
  readableDateWithoutDay: string;
  weekDay: string;
  time: string;
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
  dateDayString: '',
  dateMonthString: '',
  dateYearString: '',
  dateYearShort: '',
  dateMonthWord: '',
  dateMonthWordNominative: '',
  readableDateWithShortYear: '',
  fileNameDate: '',
  weekDay: '',
  time: '',
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

  const monthStart = startOfMonth(eventDate);
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

  const readableDate = initialReadableDate.replace('р.', 'року');

  const dateDayString = addZero(dateDay);
  const dateMonthString = addZero(dateMonth);

  return {
    date: eventDate,
    readableDate,

    readableDateWithShortYear: readableDate.replace(dateYearString, dateYearString.slice(2)),
    readableDateWithoutDay: readableDate.split('.').slice(1).join('.'),
    readableDateWithTime: `${readableDate} ${addZero(dateHour)}:${addZero(dateMinutes)}`,

    dateDay,
    dateMonth,
    dateYear,
    dateHour,
    dateMinutes,
    monthStart,
    time: `${addZero(alwaysString(dateHour), 2)}:${addZero(alwaysString(dateMinutes), 2)}`,

    dateDayString,
    dateMonthString,
    dateYearString,
    dateYearShort: `${dateYear}`.slice(2),

    dateMonthWord,
    dateMonthWordNominative,
    weekDay,
    fileNameDate: `${dateYearString}-${dateMonthString}-${dateDayString}`,
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
