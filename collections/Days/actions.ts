'use server';

import { daysSlug } from '@/lib/collectionNames';
import { getToday } from '@/lib/dateUtils';
import { odSafeQuery } from '@/lib/safeAction';
import { Day } from '@/payload-types';

export const getTodayDay = odSafeQuery<Day | null, void>({
  key: 'getTodayDay',
  action: async ({ payload, user }) => {
    if (!user) {
      return null;
    }

    const days = await payload.find({
      collection: daysSlug,
      pagination: false,
      where: {
        date: {
          equals: getToday().toISOString(),
        },
        userId: {
          equals: user.id,
        },
      },
    });

    if (days.totalDocs > 1) {
      return null;
    }

    return days.docs[0] || null;
  },
});

export const getUserDays = odSafeQuery<Day[], void>({
  key: 'getUserDays',
  action: async ({ payload, user }) => {
    if (!user) {
      return [];
    }

    const days = await payload.find({
      collection: daysSlug,
      pagination: false,
      depth: 0,
      where: {
        userId: {
          equals: user.id,
        },
      },
    });

    return days.docs;
  },
});
