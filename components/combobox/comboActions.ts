'use server';

import { CollectionNames } from '@/@types/common-types';
import { QueryComboOption } from '@/components/combobox/QueryCombo';
import { alwaysArray, alwaysString } from '@/lib/commonUtils';
import { COMBO_LIMIT, SORT_DESC_STR } from '@/lib/constants';
import { odSafeQuery } from '@/lib/safeAction';
import { getWordsArrayFromString } from '@/lib/stringUtils';
import { BasePayload } from 'payload';

export interface GetTreesListParams {
  query?: string | null;
}

interface GetQueryRegExpsParams extends GetTreesListParams {
  payload: BasePayload;
  searchableField: string;
}

export async function getQueryRegExps({ query, payload, searchableField }: GetQueryRegExpsParams) {

  const finalQuery = alwaysString(query);
  const queryQuery = getWordsArrayFromString(query).join('.*');

  const unitNameBaseRegExp = queryQuery ? new RegExp(queryQuery, 'i') : null;

  let dbQuery = {};
  if (finalQuery) {
    const orArray = [];
    if (queryQuery) {
      orArray.push({
        [searchableField]: {
          $regex: unitNameBaseRegExp,
        },
      });
    }
    if (orArray.length > 0) {
      dbQuery = {
        $or: orArray,
      };
    }
  }

  return {
    finalQuery,
    queryQuery,
    unitNameBaseRegExp,
    dbQuery,
  };
}

interface GetComboOptionsParams {
  payload: BasePayload;
  collectionName: CollectionNames;
  searchableField: string;
  sortableField: string;
  query?: string;
  limit?: number;
  sortDirection?: 'asc' | 'desc';
  additionalDbQuery?: Record<string, unknown>;
  optionsMapper?: (option: QueryComboOption) => QueryComboOption;
}

export async function getComboOptions({
                                        payload,
                                        collectionName,
                                        query,
                                        searchableField,
                                        sortableField,
                                        limit = COMBO_LIMIT,
                                        sortDirection = SORT_DESC_STR,
                                        additionalDbQuery,
                                        optionsMapper,
                                      }: GetComboOptionsParams) {
  const { dbQuery } = await getQueryRegExps({
    payload,
    query,
    searchableField,
  });
  const collection = payload.db.collections[collectionName];
  let find = dbQuery;
  if (additionalDbQuery) {
    find = {
      ...dbQuery,
      ...additionalDbQuery,
    };
  }
  const data = await collection
    .find(find)
    .sort({
      [sortableField]: sortDirection,
    })
    .limit(limit)
    .select({
      label: true,
      username: true,
    });
  if (!data) {
    return [];
  }

  const options = alwaysArray(JSON.parse(JSON.stringify(data))).map((doc) => ({
    label: doc?.label || doc?.username,
    id: doc?._id?.toString(),
  })) as QueryComboOption[];

  return optionsMapper ? options.map(optionsMapper) : options;
}

interface GetComboOptionByIdParams {
  id: string;
  collectionName: CollectionNames;
}

export const getComboOptionById = odSafeQuery<unknown, GetComboOptionByIdParams>({
  key: 'getComboOptionById',
  action: async ({ params, payload }) => {
    return await payload.findByID({
      collection: params.collectionName,
      id: params.id,
    });
  },
});
