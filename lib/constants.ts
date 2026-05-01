import { SelectDataItem } from '@/@types/common-types';
import { getToday } from '@/lib/dateUtils';

// event variant ast block slugs
export const eventVariantTextBlockSlug = 'eventVariantTextBlock';
export const eventVariantGroupBlockSlug = 'eventVariantGroupBlock';
export const eventVariantUnitsBlockSlug = 'eventVariantUnitsBlock';
export const eventVariantTeamBlockSlug = 'eventVariantTeamBlock';
export const eventVariantCustomLinesBlockSlug = 'eventVariantCustomLinesBlock';
export const eventVariantSignersBlockSlug = 'eventVariantSignersBlock';
export const eventVariantCompanySignerBlockSlug = 'eventVariantCompanySignerBlock';
export const eventVariantPageBreakBlockSlug = 'eventVariantPageBreakBlock';
export const eventVariantTeamPaymentBlockSlug = 'eventVariantTeamPaymentBlock';
export const eventVariantLostProductsBlockSlug = 'eventVariantLostProductsBlock';

// event unit queries
export const unitEventsSort = ['-dayDate', '-eventDate', '-createdAt'];
export const UNIT_INDEX_PLACEHOLDER = `{unitIndex}`;
export const UNIT_FIELD_PATH_PLACEHOLDER = `units[${UNIT_INDEX_PLACEHOLDER}]`;

export const STANDARD_ERROR_MESSAGE = 'Упс! Щос пішло не так. Зверніться до разробника.';

// SORT
export const DEFAULT_SORT_ORDER = 1;
export const SORT_ASC_STR = 'asc';
export const SORT_DESC_STR = 'desc';

// PAGINATION
export const COMBO_LIMIT = 50;
export const DEFAULT_PAGINATION_PAGE = 1;

// TOAST TYPES
export const TOAST_SUCCESS = 'default';
export const TOAST_ERROR = 'destructive';
export const TOAST_WARNING = 'warning';

// DATES
export const REPORT_START_HOURS = 0;
export const REPORT_END_HOURS = 24;

export const NUM_WORDS = [
  'один',
  'два',
  'три',
  'чотири',
  "п'ять",
  'шість',
  'сім',
  'вісім',
  "дев'ять",
  'десять',
  'одинадцять',
  'дванадцять',
  'тринадцять',
  'чотирнадцять',
  "п'ятнадцять",
  'шістнадцять',
  'сімнадцять',
  'вісімнадцять',
  "дев'ятнадцять",
  'двадцять',
  'двадцять один',
  'двадцять два',
  'двадцять три',
  'двадцять чотири',
  "двадцять п'ять",
  'двадцять шість',
  'двадцять сім',
  'двадцять вісім',
  "двадцять дев'ять",
  'тридцять',
  'тридцять один',
  'тридцять два',
  'тридцять три',
  'тридцять чотири',
  "тридцять п'ять",
  'тридцять шість',
  'тридцять сім',
  'тридцять вісім',
  "тридцять дев'ять",
  'сорок',
  'сорок один',
  'сорок два',
  'сорок три',
  'сорок чотири',
  "сорок п'ять",
  'сорок шість',
  'сорок сім',
  'сорок вісім',
  "сорок дев'ять",
  "п'ятдесят",
  "п'ятдесят один",
  "п'ятдесят два",
  "п'ятдесят три",
  "п'ятдесят чотири",
  "п'ятдесят п'ять",
  "п'ятдесят шість",
  "п'ятдесят сім",
  "п'ятдесят вісім",
  "п'ятдесят дев'ять",
  'шістдесят',
  'шістдесят один',
  'шістдесят два',
  'шістдесят три',
  'шістдесят чотири',
  "шістдесят п'ять",
  'шістдесят шість',
  'шістдесят сім',
  'шістдесят вісім',
  "шістдесят дев'ять",
  'сімдесят',
  'сімдесят один',
  'сімдесят два',
  'сімдесят три',
  'сімдесят чотири',
  "сімдесят п'ять",
  'сімдесят шість',
  'сімдесят сім',
  'сімдесят вісім',
  "сімдесят дев'ять",
  'вісімдесят',
  'вісімдесят один',
  'вісімдесят два',
  'вісімдесят три',
  'вісімдесят чотири',
  "вісімдесят п'ять",
  'вісімдесят шість',
  'вісімдесят сім',
  'вісімдесят вісім',
  "вісімдесят дев'ять",
  "дев'яносто",
  "дев'яносто один",
  "дев'яносто два",
  "дев'яносто три",
  "дев'яносто чотири",
  "дев'яносто п'ять",
  "дев'яносто шість",
  "дев'яносто сім",
  "дев'яносто вісім",
  "дев'яносто дев'ять",
  'сто',
  'сто один',
  'сто два',
  'сто три',
  'сто чотири',
  "сто п'ять",
  'сто шість',
  'сто сім',
  'сто вісім',
  "сто дев'ять",
  'сто десять',
  'сто одинадцять',
  'сто дванадцять',
  'сто тринадцять',
  'сто чотирнадцять',
  "сто п'ятнадцять",
  'сто шістнадцять',
  'сто сімнадцять',
  'сто вісімнадцять',
  "сто дев'ятнадцять",
  'сто двадцять',
  'сто двадцять один',
  'сто двадцять два',
  'сто двадцять три',
  'сто двадцять чотири',
  "сто двадцять п'ять",
  'сто двадцять шість',
  'сто двадцять сім',
  'сто двадцять вісім',
  "сто двадцять дев'ять",
  'сто тридцять',
  'сто тридцять один',
  'сто тридцять два',
  'сто тридцять три',
  'сто тридцять чотири',
  "сто тридцять п'ять",
  'сто тридцять шість',
  'сто тридцять сім',
  'сто тридцять вісім',
  "сто тридцять дев'ять",
  'сто сорок',
  'сто сорок один',
  'сто сорок два',
  'сто сорок три',
  'сто сорок чотири',
  "сто сорок п'ять",
  'сто сорок шість',
  'сто сорок сім',
  'сто сорок вісім',
  "сто сорок дев'ять",
  "сто п'ятдесят",
  "сто п'ятдесят один",
  "сто п'ятдесят два",
  "сто п'ятдесят три",
  "сто п'ятдесят чотири",
  "сто п'ятдесят п'ять",
  "сто п'ятдесят шість",
  "сто п'ятдесят сім",
  "сто п'ятдесят вісім",
  "сто п'ятдесят дев'ять",
  'сто шістдесят',
  'сто шістдесят один',
  'сто шістдесят два',
  'сто шістдесят три',
  'сто шістдесят чотири',
  "сто шістдесят п'ять",
  'сто шістдесят шість',
  'сто шістдесят сім',
  'сто шістдесят вісім',
  "сто шістдесят дев'ять",
  'сто сімдесят',
  'сто сімдесят один',
  'сто сімдесят два',
  'сто сімдесят три',
  'сто сімдесят чотири',
  "сто сімдесят п'ять",
  'сто сімдесят шість',
  'сто сімдесят сім',
  'сто сімдесят вісім',
  "сто сімдесят дев'ять",
  'сто вісімдесят',
  'сто вісімдесят один',
  'сто вісімдесят два',
  'сто вісімдесят три',
  'сто вісімдесят чотири',
  "сто вісімдесят п'ять",
  'сто вісімдесят шість',
  'сто вісімдесят сім',
  'сто вісімдесят вісім',
  "сто вісімдесят дев'ять",
  "сто дев'яносто",
  "сто дев'яносто один",
  "сто дев'яносто два",
  "сто дев'яносто три",
  "сто дев'яносто чотири",
  "сто дев'яносто п'ять",
  "сто дев'яносто шість",
  "сто дев'яносто сім",
  "сто дев'яносто вісім",
  "сто дев'яносто дев'ять",
  'двісті',
];

export interface MontWordsConfig {
  nominative: string;
  genitive: string;
}

export const MONTH_WORDS: MontWordsConfig[] = [
  {
    nominative: 'січень',
    genitive: 'січня',
  },
  {
    nominative: 'лютий',
    genitive: 'лютого',
  },
  {
    nominative: 'березень',
    genitive: 'березня',
  },
  {
    nominative: 'квітень',
    genitive: 'квітня',
  },
  {
    nominative: 'травень',
    genitive: 'травня',
  },
  {
    nominative: 'червень',
    genitive: 'червня',
  },
  {
    nominative: 'липень',
    genitive: 'липня',
  },
  {
    nominative: 'серпень',
    genitive: 'серпня',
  },
  {
    nominative: 'вересень',
    genitive: 'вересня',
  },
  {
    nominative: 'жовтень',
    genitive: 'жовтня',
  },
  {
    nominative: 'листопад',
    genitive: 'листопада',
  },
  {
    nominative: 'грудень',
    genitive: 'грудня',
  },
];

const yearOptionsStart = 1930;
const yearOptionsEnd = getToday().getFullYear() + 5;
const yearOptionsLength = yearOptionsEnd - yearOptionsStart;
export const options = Array.from({ length: yearOptionsLength }, (_, i) => {
  const value = `${yearOptionsStart + i}`;
  return {
    value,
    label: value,
  };
}).reverse();

export const monthOptions: SelectDataItem[] = MONTH_WORDS.map((item, index) => {
  return {
    value: `${index}`,
    label: item.nominative,
  };
});

export const WEEK_DAYS = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота'];

export const GENDER_WORDS = {
  masculine: {
    ['виконав']: 'виконав',
    ['призначеного']: 'призначеного',
    ['звільненого']: 'звільненого',
    ['направлений']: 'направлений',
    ['таким']: 'таким',
    ['прийняв']: 'прийняв',
    ['приступив']: 'приступив',
    ['вибув']: 'вибув',
    ['здав']: 'здав',
    ['використав']: 'використав',
    ['отримував']: 'отримував',
    ['здійснив']: 'здійснив',
    ['забезпечувався']: 'забезпечувався',
    ['який']: 'який',
    ['увільненого']: 'увільненого',
    ['загинув']: 'загинув',
    ['Народився']: 'Народився',
    ['Підданий']: 'Підданий',
    ['Похований']: 'Похований',
    ['був']: 'був',
    ['евакуйований']: 'евакуйований',
    ['отримав']: 'отримав',
    ['відчув']: 'відчув',
    ['забезпечений']: 'забезпечений',
    ['вважався']: 'вважався',
  },
  feminine: {
    ['виконав']: 'виконала',
    ['призначеного']: 'призначеної',
    ['звільненого']: 'звільненої',
    ['направлений']: 'направлена',
    ['таким']: 'такою',
    ['прийняв']: 'прийняла',
    ['приступив']: 'приступила',
    ['вибув']: 'вибула',
    ['здав']: 'здала',
    ['використав']: 'використала',
    ['отримував']: 'отримувала',
    ['здійснив']: 'здійснила',
    ['забезпечувався']: 'забезпечувалася',
    ['який']: 'яка',
    ['увільненого']: 'увільненої',
    ['загинув']: 'загинула',
    ['Народився']: 'Народилася',
    ['Підданий']: 'Піддана',
    ['Похований']: 'Похована',
    ['був']: 'була',
    ['евакуйований']: 'евакуйована',
    ['отримав']: 'отримала',
    ['відчув']: 'відчула',
    ['забезпечений']: 'забезпечена',
    ['вважався']: 'вважалася',
  },
} as const;

export const ukrainianAlphabet: string[] = [
  'а',
  'б',
  'в',
  'г',
  'ґ',
  'д',
  'е',
  'є',
  'ж',
  'з',
  'и',
  'і',
  'ї',
  'й',
  'к',
  'л',
  'м',
  'н',
  'о',
  'п',
  'р',
  'с',
  'т',
  'у',
  'ф',
  'х',
  'ц',
  'ч',
  'ш',
  'щ',
  'ь',
  'ю',
  'я',
];

// api
export const DAY_EVENT_API_URL = `/api/docx/day-event`;
export const DAY_EVENT_ZIP_API_URL = `/api/zip/day-event`;
export const DAILY_REPORT_API_URL = `/api/xlsx/daily-report`;

// permissions
export const PERMISSION_ALLOW = 'allow';

// messages
export const FORBIDDEN_PERMISSION = 'Недостатньо прав';
export const CREATE_SUCCESS_MESSAGE = 'Успішно створено';
export const CREATE_FAILURE_MESSAGE = 'Помилка при створенні';
export const READ_SUCCESS_MESSAGE = 'Успішно знайдено';
export const READ_FAILURE_MESSAGE = 'Не знайдено';
export const UPDATE_SUCCESS_MESSAGE = 'Успішно оновлено';
export const UPDATE_FAILURE_MESSAGE = 'Помилка при оновленні';
export const DELETE_SUCCESS_MESSAGE = 'Успішно видалено';
export const DELETE_FAILURE_MESSAGE = 'Помилка при видаленні';

export const ADD_SUCCESS_MESSAGE = 'Успішно додано';
export const ADD_FAILURE_MESSAGE = 'Помилка при додаванні';
