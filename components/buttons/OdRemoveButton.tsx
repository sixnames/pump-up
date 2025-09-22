import OdConfirmButton from '@/components/buttons/OdConfirmButton';
import { getUserActionTitle } from '@/lib/textUtils';
import { cn } from '@/lib/utils';
import { MinusIcon } from '@radix-ui/react-icons';
import React from 'react';

export interface OdRemoveButtonProps {
  remove: () => void | Promise<void>;
  nameInMessage?: string | null;
  className?: string;
  hidden?: boolean;
  testId?: string;
  skipConfirm?: boolean;
}

export default function OdRemoveButton({ remove, nameInMessage, className, hidden, testId, skipConfirm }: OdRemoveButtonProps) {
  if (hidden) {
    return null;
  }

  return (
    <div
      className={cn(className, {
        'absolute top-2 right-0 z-50': !className,
      })}
    >
      <OdConfirmButton
        skipConfirm={skipConfirm}
        button={{
          className: 'w-6 h-6 p-0 hover:bg-error-hover flex shrink-0',
          variant: 'destructive',
          testId: `${testId}-remove`,
        }}
        dialog={{
          title: getUserActionTitle(nameInMessage || 'елемент').deleteConfirm,
          onConfirm: () => remove(),
        }}
      >
        <MinusIcon className={`w-4 h-4`} />
      </OdConfirmButton>
    </div>
  );
}
