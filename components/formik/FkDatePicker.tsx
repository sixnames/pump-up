'use client';

import OdDatePicker, { OdDatePickerProps } from '@/components/forms/OdDatePicker';
import { useField } from 'formik';
import * as React from 'react';

interface FKDatePickerProps extends Omit<OdDatePickerProps, 'onChangeAction' | 'value' | 'withError'> {
  name: string;
}

export default function FkDatePicker({ name, testId, ...props }: FKDatePickerProps) {
  const finalTestId = testId || name;
  const [field, { error }, { setValue }] = useField<string | Date | undefined>(name);

  return (
    <OdDatePicker
      {...props}
      testId={finalTestId}
      value={field.value}
      withError={Boolean(error)}
      onChangeAction={async (date) => {
        await setValue(date);
      }}
    />
  );
}
