import { SelectDataItem } from '@/@types/common-types';
import { DeclensionEnum } from '@/@types/enums';
import { FKInputCommonProps } from '@/@types/form-input-types';
import OdSelect from '@/components/forms/OdSelect';
import useFieldError from '@/hooks/useFieldError';
import { useField } from 'formik';
import * as React from 'react';

export interface FKSelectProps extends FKInputCommonProps {
  options: SelectDataItem[];
  parentClassName?: string;
  selectClassName?: string;
  showEmptyFirstOption?: boolean;
  declension?: DeclensionEnum;
  callback?: (value: SelectDataItem) => void;
}

export default function FkSelect({ name, declension = DeclensionEnum.nominative, ...props }: FKSelectProps) {
  const [{ value }, _meta, { setValue }] = useField(name);
  const withError = useFieldError(name);

  return (
    <OdSelect
      value={value}
      name={name}
      setValue={async (value) => {
        await setValue(value);
      }}
      withError={withError}
      {...props}
    />
  );
}
