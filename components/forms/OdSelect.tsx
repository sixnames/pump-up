import { SelectDataItem } from '@/@types/common-types';
import { DeclensionEnum } from '@/@types/enums';
import { FKInputCommonProps } from '@/@types/form-input-types';
import OdRemoveButton from '@/components/buttons/OdRemoveButton';
import OdLabel from '@/components/forms/OdLabel';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import { alwaysString } from '@/lib/commonUtils';
import { cn } from '@/lib/utils';
import get from 'lodash/get';
import * as React from 'react';

export interface OdSelectProps extends FKInputCommonProps {
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

export default function OdSelect({
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
}: OdSelectProps) {
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

  const selectedOption = finalOptions.find((option) => {
    return option.value === value;
  });

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
          <Select
            name={name}
            defaultValue={value || undefined}
            disabled={Boolean(disabled)}
            onValueChange={async (value?: string) => {
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
            <SelectTrigger
              data-cy={finalTestId}
              className={cn('w-full bg-background', selectClassName, {
                'border-red-600': withError,
              })}
            >
              <span>{getOptionName(selectedOption)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {finalOptions.map((option) => {
                  const optionName = getOptionName(option);
                  if (!optionName) {
                    return null;
                  }

                  return (
                    <SelectItem
                      data-cy={`${finalTestId}-option-${option.value}`}
                      data-option={`${finalTestId}-${option.label}`}
                      key={option.value}
                      value={option.value}
                    >
                      {optionName}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
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
