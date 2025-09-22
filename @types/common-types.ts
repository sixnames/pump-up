import { Route } from 'next';

export interface SelectDataItem extends Record<any, any> {
  value: string;
  label: string;
}

export type OdUrl<T extends string = string> = Route<T>;

type MaxDepth = 5;
export type FieldsList<T, Prefix extends string = '', Depth extends number = 0> = {
  [K in keyof T]: Depth extends MaxDepth
    ? `${Prefix}${K & string}`
    : NonNullable<T[K]> extends object
      ? `${Prefix}${K & string}` | `${Prefix}${K & string}.${FieldsList<NonNullable<T[K]>, '', Increment<Depth>>}`
      : `${Prefix}${K & string}`;
}[keyof T];
type Increment<N extends number> = N extends 0 ? 1 : N extends 1 ? 2 : N extends 2 ? 3 : N extends 3 ? 4 : 5;
