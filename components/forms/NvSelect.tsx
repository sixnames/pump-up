import { SelectDataItem } from '@/@types/common-types';
import { DeclensionEnum } from '@/@types/enums';
import { FKInputCommonProps } from '@/@types/form-input-types';
import OdRemoveButton from '@/components/buttons/OdRemoveButton';
import OdLabel from '@/components/forms/OdLabel';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { alwaysString } from '@/lib/commonUtils';
import { cn } from '@/lib/utils';
import get from 'lodash/get';
import * as React from 'react';

export interface NvSelectProps extends FKInputCommonProps {
  options: SelectDataItem[];
  parentClassName?: string;
  selectClassName?: string;
  showEmptyFirstOption?: boolean;
  declension?: DeclensionEnum;
  callback?: (value: SelectDataItem) => void;
  setValue: (value?: SelectDataItem) => Promise<void>;
  withError?: boolean;
  value?: string | null;
}

const emptyOptionValue = 'emptyOptionValue';

export default function NvSelect({
  options,
  selectClassName,
  parentClassName,
  showEmptyFirstOption = true,
  label,
  testId,
  name,
  declension = DeclensionEnum.nominative,
  callback,
  removeProps,
  disabled,
  withError,
  value,
  setValue,
}: NvSelectProps) {
  function getOptionName(option?: SelectDataItem) {
    if (!option) {
      return '';
    }
    if (declension !== DeclensionEnum.nominative && alwaysString(option.value) !== '') {
      const nameDeclension = get(option, `name.${declension}`);
      if (nameDeclension) {
        option.label = nameDeclension;
      }
    }
    return option.label;
  }

  const finalOptions = showEmptyFirstOption
    ? [
        {
          value: emptyOptionValue,
          label: 'Не вибрано',
        },
        ...options,
      ]
    : options;

  const finalTestId = testId || name;

  return (
    <div
      className={cn(`w-full relative`, parentClassName, {
        'mb-6': !parentClassName,
      })}
    >
      <OdLabel {...label} htmlFor={name} />

      <div className={'w-full relative flex items-start gap-4'}>
        <div
          className={cn('relative z-10', {
            'w-full': !removeProps,
            'w-[calc(100%-2.75rem)]': removeProps,
          })}
        >
          <NativeSelect
            name={name}
            className={cn('w-full bg-background', selectClassName, {
              'border-red-600': withError,
            })}
            aria-invalid={withError ? 'true' : 'false'}
            value={value || undefined}
            disabled={Boolean(disabled)}
            onChange={async (e) => {
              const target = e.target as unknown as HTMLSelectElement;
              const value = target.value;
              console.log(value);
              const selectedOption = finalOptions.find((option) => option.value === value);

              if (value === emptyOptionValue) {
                await setValue(undefined);
              } else {
                await setValue(selectedOption);
              }

              if (callback && selectedOption) {
                callback(selectedOption);
              }
            }}
          >
            {finalOptions.map((option) => {
              const optionName = getOptionName(option);
              if (!optionName) {
                return null;
              }

              return (
                <NativeSelectOption
                  data-cy={`${finalTestId}-option-${option.value}`}
                  data-option={`${finalTestId}-${option.label}`}
                  key={option.value}
                  value={option.value}
                >
                  {optionName}
                </NativeSelectOption>
              );
            })}
          </NativeSelect>
        </div>

        {removeProps ? (
          <div className={'h-9 flex items-center'}>
            <OdRemoveButton {...removeProps} testId={finalTestId} className={'static'} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
