'use server';

import { roleRuleActions, ruleCollectionSlugs } from '@/collections/Roles';
import { userFieldConfig } from '@/collections/Users/fieldConfig';
import { getComboOptions } from '@/components/combobox/comboActions';
import { QueryComboOption } from '@/components/combobox/QueryCombo';
import { usersSlug } from '@/lib/collectionNames';
import { FORBIDDEN_PERMISSION, PERMISSION_ALLOW } from '@/lib/constants';
import { getToday } from '@/lib/dateUtils';
import { infoLogger } from '@/lib/logger';
import { odSafeQuery } from '@/lib/safeAction';
import { User } from '@/payload-types';
import get from 'lodash/get';
import { headers } from 'next/headers';

export const getUserOptions = odSafeQuery<QueryComboOption[], string | undefined>({
  key: 'getUserOptions',
  action: async ({ payload, params }) => {
    return await getComboOptions({
      payload,
      collectionName: usersSlug,
      query: params,
      searchableField: userFieldConfig.username,
      sortableField: userFieldConfig.username,
    });
  },
});

export const getUserById = odSafeQuery<User, string>({
  key: 'getUserById',
  action: async ({ payload, params }) => {
    return payload.findByID({
      collection: usersSlug,
      id: params,
    });
  },
});

export const getSessionUser = odSafeQuery({
  key: 'getSessionUser',
  action: async ({ payload }) => {
    const nextHeaders = await headers();
    return payload.auth({ headers: nextHeaders });
  },
});

function getActionReadableDate() {
  const now = getToday();
  return `${now.toLocaleDateString('uk-UA')} ${now.toLocaleTimeString('uk-UA')}`;
}

export type InitialPermissionPaths =
  `${(typeof ruleCollectionSlugs)[number]}.${(typeof roleRuleActions)[number]['name']}`;
export type PermissionPath = 'allow' | InitialPermissionPaths;

interface CheckActionPermissionParams {
  permissionPath: PermissionPath;
  key: string;
  user?: User | undefined | null;
}

export async function checkActionPermission({ permissionPath, key, user }: CheckActionPermissionParams) {
  if (permissionPath === PERMISSION_ALLOW) {
    return;
  }

  const loggerOptions = {
    key,
    username: user?.username,
    createdAt: getActionReadableDate(),
  };

  let localAccount = user;
  if (!localAccount) {
    const session = await getSessionUser(undefined);
    localAccount = session?.user;
  }

  if (!localAccount) {
    infoLogger.error(FORBIDDEN_PERMISSION, loggerOptions);
    throw new Error(FORBIDDEN_PERMISSION);
  }
  const allowed = get(localAccount.role, permissionPath, localAccount?.isAdmin);
  if (!allowed) {
    infoLogger.error(FORBIDDEN_PERMISSION, loggerOptions);
    throw new Error(FORBIDDEN_PERMISSION);
  }
  return localAccount;
}

export async function checkApiRequestPermission(permissionPath: PermissionPath) {
  try {
    await checkActionPermission({
      permissionPath,
      key: 'checkApiRequestPermission',
      user: undefined,
    });
    return true;
  } catch (error: unknown) {
    console.error('checkApiRequestPermission', error);
    return false;
  }
}
