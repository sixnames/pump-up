import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import React from 'react';

export interface OdCrossButtonProps {
  onClick: () => void | Promise<void>;
  className?: string;
  hidden?: boolean;
  testId?: string;
}

export default function OdCrossButton({ onClick, className, hidden, testId }: OdCrossButtonProps) {
  if (hidden) {
    return null;
  }

  return (
    <Button
      className={cn('w-6 h-6 p-0 flex items-center justify-center cursor-pointer', className)}
      variant={'ghost'}
      onClick={onClick}
      type={'button'}
      data-cy={`${testId}-cross-button`}
    >
      <XIcon className='h-4 w-4 shrink-0 opacity-50' />
    </Button>
  );
}
