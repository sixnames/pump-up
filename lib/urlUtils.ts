import { CollectionNames, OdUrl } from '@/@types/common-types';
import { NavIconVariant } from '@/components/common/NavIcon';
import { alwaysString } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { getUserActionTitle } from '@/lib/textUtils';

export function extractUrlString(href: string | Record<any, any>): string {
  if (typeof href === 'string') {
    return href;
  }

  if (typeof href === 'object' && href !== null && 'pathname' in href) {
    const query = href.query || {};
    const keys = Object.keys(query);
    let cleanHref = alwaysString(href.pathname);
    keys.forEach((key) => {
      cleanHref = cleanHref.replace(`[${key}]`, alwaysString(query[key]));
    });
    return cleanHref;
  }

  return '';
}

export type UrlConfigItem = {
  title: string;
  url: OdUrl;
  icon?: NavIconVariant;
  testId: string;
  hidden?: boolean;
};

export type UrlConfigNoIconItem = Omit<UrlConfigItem, 'icon'>;

export type UrlConfig = {
  app: {
    title: string;
    links: {
      createWorkout: UrlConfigItem;
      updateWorkout: UrlConfigItem;
      calendar: UrlConfigItem;
      migrate: UrlConfigItem;
    };
  };
  console: {
    title: string;
    links: {
      admin: UrlConfigItem;
    };
  };
};

const navLikTestIdPrefix = 'nav-link';

export const urlConfig: UrlConfig = {
  app: {
    title: fieldLabels.main.plural,
    links: {
      createWorkout: {
        url: '/create-workout',
        title: getUserActionTitle(fieldLabels.workout.singular).create,
        testId: `${navLikTestIdPrefix}-create-workout`,
        icon: 'plus',
        hidden: true,
      },
      updateWorkout: {
        url: '/update-workout',
        title: getUserActionTitle(fieldLabels.workout.singular).update,
        testId: `${navLikTestIdPrefix}-update-workout`,
        icon: 'plus',
        hidden: true,
      },
      calendar: {
        url: '/calendar',
        title: fieldLabels.calendar.singular,
        testId: `${navLikTestIdPrefix}-calendar`,
        icon: 'calendar',
      },
      migrate: {
        url: '/migrate',
        title: 'Migrate',
        testId: `${navLikTestIdPrefix}-migrate`,
        icon: 'network',
      },
    },
  },
  console: {
    title: fieldLabels.settings.singular,
    links: {
      admin: {
        title: fieldLabels.console.singular,
        url: '/admin' as OdUrl,
        icon: 'settings',
        testId: `${navLikTestIdPrefix}-admin`,
      },
    },
  },
};

type WorkoutUrlConfigItem = {
  root: UrlConfigItem;
};

export function getWorkoutLink(id: string): WorkoutUrlConfigItem {
  const baseUrl = `${urlConfig.app.links.updateWorkout.url}/${id}`;

  return {
    root: {
      title: fieldLabels.day.singular.nominative,
      url: baseUrl as OdUrl,
      testId: `${navLikTestIdPrefix}-day-item`,
    },
  };
}

// admin
interface GetAdminUrlParams {
  collection: CollectionNames;
  id: string;
}

export function getAdminItemUrl({ collection, id }: GetAdminUrlParams) {
  return `/admin/collections/${collection}/${id}`;
}

export function getAdminCreateItemUrl({ collection }: Omit<GetAdminUrlParams, 'id'>) {
  return `/admin/collections/${collection}/create`;
}
