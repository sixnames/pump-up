import { BellIcon, Calendar, ComponentIcon, FileTextIcon, NetworkIcon, Settings, TreesIcon, UsersIcon } from 'lucide-react';

export type NavIconVariant = 'calendar' | 'users' | 'network' | 'settings' | 'component' | 'notifications' | 'documents' | 'trees';

interface NavIconProps {
  icon: NavIconVariant;
  className?: string;
  testId?: string;
}

export default function NavIcon({ icon, testId, className }: NavIconProps) {
  if (icon === 'calendar') {
    return <Calendar className={className} data-cy={testId} />;
  }

  if (icon === 'users') {
    return <UsersIcon className={className} data-cy={testId} />;
  }

  if (icon === 'network') {
    return <NetworkIcon className={className} data-cy={testId} />;
  }

  if (icon === 'settings') {
    return <Settings className={className} data-cy={testId} />;
  }

  if (icon === 'component') {
    return <ComponentIcon className={className} data-cy={testId} />;
  }

  if (icon === 'notifications') {
    return <BellIcon className={className} data-cy={testId} />;
  }

  if (icon === 'documents') {
    return <FileTextIcon className={className} data-cy={testId} />;
  }

  if (icon === 'trees') {
    return <TreesIcon className={className} data-cy={testId} />;
  }

  return <></>;
}
