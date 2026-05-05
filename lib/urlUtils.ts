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
};

export type UrlConfigNoIconItem = Omit<UrlConfigItem, 'icon'>;

export type UrlConfig = {
  app: {
    title: string;
    links: {
      addWorkout: UrlConfigItem;
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
      addWorkout: {
        url: '/add-workout',
        title: getUserActionTitle(fieldLabels.workout.singular).add,
        testId: `${navLikTestIdPrefix}-add-workout`,
        icon: 'plus',
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
