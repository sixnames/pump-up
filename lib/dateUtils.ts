import { DeclensionEnum } from '@/@types/enums';
import { alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { MONTH_WORDS, WEEK_DAYS } from '@/lib/constants';
import addZero from 'add-zero';
import { startOfToday } from 'date-fns';

export const APP_TIME_ZONE = 'Europe/Kyiv';

type AppDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const appDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  hourCycle: 'h23',
});

function getAppDateParts(date: Date): AppDateParts {
  const parts = appDateTimeFormatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return {
    year: alwaysNumber(parts.year),
    month: alwaysNumber(parts.month),
    day: alwaysNumber(parts.day),
    hour: alwaysNumber(parts.hour),
    minute: alwaysNumber(parts.minute),
    second: alwaysNumber(parts.second),
  };
}

function getTimeZoneOffset(date: Date) {
  const parts = getAppDateParts(date);
  const utcDate = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return utcDate - date.getTime();
}

function appDateToUtc(year: number, monthIndex: number, day: number, hour = 0, minute = 0, second = 0) {
  const utcDate = Date.UTC(year, monthIndex, day, hour, minute, second);
  const firstPassDate = new Date(utcDate - getTimeZoneOffset(new Date(utcDate)));
  return new Date(utcDate - getTimeZoneOffset(firstPassDate));
}

export function getAppDateKey(date?: Date | string | null) {
  const eventDate = safeDate(date);
  if (!eventDate) {
    return '';
  }
  const { year, month, day } = getAppDateParts(eventDate);
  return `${year}-${addZero(month)}-${addZero(day)}`;
}

function getAppWeekDayIndex(date: Date) {
  const weekDay = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIME_ZONE,
    weekday: 'short',
  }).format(date);

  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekDay);
}

export function getToday() {
  return startOfToday();
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

  const appDateParts = getAppDateParts(eventDate);
  const weekDayIndex = getAppWeekDayIndex(eventDate);
  const weekDay = WEEK_DAYS[weekDayIndex];

  const dateDay = appDateParts.day;
  const dateMonth = appDateParts.month;
  const dateYear = appDateParts.year;
  const dateHour = appDateParts.hour;
  const dateMinutes = appDateParts.minute;
  const monthStart = appDateToUtc(dateYear, dateMonth - 1, 1);
  const dateMonthWordNominative = MONTH_WORDS[dateMonth - 1]?.nominative;
  const dateMonthWord = MONTH_WORDS[dateMonth - 1]?.genitive;

  const initialReadableDate = eventDate.toLocaleDateString('uk-UA', {
    timeZone: APP_TIME_ZONE,
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
    isToday: getAppDateKey(eventDate) === getAppDateKey(getToday()),
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

export function getDayId(date?: Date | string | null) {
  if (!date) {
    return '';
  }
  const realDate = new Date(date);
  return `${realDate.getFullYear()}-${realDate.getMonth() + 1}-${realDate.getDate()}`;
}
