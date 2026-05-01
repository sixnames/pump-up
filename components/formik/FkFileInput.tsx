import OdLabel, { OdLabelProps } from '@/components/forms/OdLabel';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFormikContext } from 'formik';
import React from 'react';

interface FKFileInputProps {
  className?: string;
  name: string;
  testId?: string;
  label?: OdLabelProps;
}

export function FkFileInput({ name, className, testId, label }: FKFileInputProps) {
  const { setFieldValue } = useFormikContext();

  const finalTestId = testId || name;
  return (
    <div
      className={cn('relative', className, {
        'mb-6': !className,
      })}
    >
      {label ? <OdLabel {...label} /> : null}

      <Input
        data-cy={finalTestId}
        type="file"
        name={name}
        className="w-full"
        onChange={async (e) => {
          if (e.currentTarget.files && e.currentTarget.files[0]) {
            await setFieldValue(name, e.currentTarget.files[0]);
          }
        }}
      />
    </div>
  );
}
