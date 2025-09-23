'use server';

import { getToday } from '@/lib/dateUtils';
import { odSafeQuery } from '@/lib/safeAction';
import { headers } from 'next/headers';

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
