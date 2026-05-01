import OdInfoBox from '@/components/common/OdInfoBox';
import { collectYupErrors } from '@/lib/errorUtils';
import { cn } from '@/lib/utils';
import { useFormikContext } from 'formik';
import React from 'react';

interface FKErrorsInfoboxProps {
  errorsList: string[];
  className?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success' | undefined;
  title?: string;
}

export function FKErrorsInfobox({ errorsList, className, title, variant = 'destructive' }: FKErrorsInfoboxProps) {
  const errorsSet = new Set(errorsList);
  return (
    <OdInfoBox variant={variant} className={cn('bg-background', className)}>
      {title ? <div className={'mb-2 font-semibold'}>{title}</div> : null}
      <ol className={'space-y-2 list-decimal pl-4'}>
        {Array.from(errorsSet).map((value, index) => {
          return <li key={index}>{`${value}.`}</li>;
        })}
      </ol>
    </OdInfoBox>
  );
}

interface FKErrorsListProps {
  className?: string;
  variant?: FKErrorsInfoboxProps['variant'];
  title?: string;
}

export default function FkErrorsList({ className, variant, title }: FKErrorsListProps) {
  const { errors } = useFormikContext();
  const errorsList = collectYupErrors(errors);

  if (!errorsList.length) {
    return null;
  }

  return <FKErrorsInfobox errorsList={errorsList} className={className} variant={variant} title={title} />;
}
