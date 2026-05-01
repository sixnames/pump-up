import { Config } from '@/payload-types';
import { Route } from 'next';

export type CollectionNames = keyof Config['collections'];

export interface SelectDataItem extends Record<any, any> {
  value: string;
  label: string;
}

export type OdUrl<T extends string = string> = Route<T>;

export type MaybeDate = Date | string | null | undefined;
