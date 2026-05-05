import { Calendar, NetworkIcon, Plus, Settings } from 'lucide-react';

export type NavIconVariant =
  'calendar'
  | 'network'
  | 'settings'
  | 'plus';

interface NavIconProps {
  icon: NavIconVariant;
  className?: string;
  testId?: string;
}

export default function NavIcon({ icon, testId, className }: NavIconProps) {
  if (icon === 'calendar') {
    return <Calendar className={className} data-cy={testId} />;
  }

  if (icon === 'network') {
    return <NetworkIcon className={className} data-cy={testId} />;
  }

  if (icon === 'settings') {
    return <Settings className={className} data-cy={testId} />;
  }

  if (icon === 'plus') {
    return <Plus className={className} data-cy={testId} />;
  }

  return <></>;
}
