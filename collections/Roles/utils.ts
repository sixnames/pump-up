import { RolePermissionOperation, RolePermissionSlug } from '@/collections/Roles/index';
import { User } from '@/payload-types';
import get from 'lodash/get';
import { AccessArgs } from 'payload';

export const getAccess =
  (slug: RolePermissionSlug, operation: RolePermissionOperation) =>
  ({ req }: AccessArgs<User>) => {
    if (req.user?.isAdmin) {
      return true;
    }
    return Boolean(get(req.user?.role, `${slug}.${operation}`));
  };

export const getCreateAccess = (slug: RolePermissionSlug) => getAccess(slug, 'create');
export const getReadAccess = (slug: RolePermissionSlug) => getAccess(slug, 'read');
export const getUpdateAccess = (slug: RolePermissionSlug) => getAccess(slug, 'update');
export const getDeleteAccess = (slug: RolePermissionSlug) => getAccess(slug, 'delete');

export const getAdminAccess =
  () =>
  ({ req }: AccessArgs<User>) => {
    return Boolean(req.user?.isAdmin);
  };
