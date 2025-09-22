import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

interface OdInfoBoxProps {
  children?: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
  title?: string;
  testId?: string;
}

export default function OdInfoBox({ children, variant = 'default', className, title, testId }: OdInfoBoxProps) {
  const infoIconVariants = ['default', 'success', 'warning'];
  return (
    <Alert variant={variant} className={cn(className)}>
      {!infoIconVariants.includes(variant) ? <ExclamationTriangleIcon className='h-4 w-4' /> : null}
      {infoIconVariants.includes(variant) ? <InfoCircledIcon className='h-4 w-4' /> : null}
      <div className={'pt-2'} data-cy={testId}>
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {children ? <AlertDescription>{children}</AlertDescription> : null}
      </div>
    </Alert>
  );
}
