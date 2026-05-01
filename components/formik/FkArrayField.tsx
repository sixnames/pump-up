import OdButton from '@/components/buttons/OdButton';
import { alwaysArray, alwaysString } from '@/lib/commonUtils';
import { getUserActionTitle } from '@/lib/textUtils';
import { cn } from '@/lib/utils';
import { FieldArray, useFormikContext } from 'formik';
import get from 'lodash/get';
import { ReactNode, useState } from 'react';

export interface FKArrayRenderItemProps<TArrayItem> {
  field: TArrayItem;
  remove: () => void;
  index: number;
  fieldName: string;
}

interface FKArrayFieldProps<TArrayItem> {
  name: string;
  renderItem: (params: FKArrayRenderItemProps<TArrayItem>) => ReactNode;
  additionalControls?: (params: { push: (item: TArrayItem) => void }) => ReactNode;
  title?: string;
  dropDownProps?: {
    label: string;
    initialVisible?: boolean;
  };
  testId?: string;
  addButtonProps?: {
    emptyItem: (newIndex: number) => TArrayItem;
    suffix?: string;
    className?: string;
  };
  containerClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
  keyField?: string;
}

export default function FkArrayField<TArrayItem>({
  name,
  renderItem,
  addButtonProps,
  title,
  dropDownProps,
  testId,
  containerClassName,
  listClassName,
  listItemClassName,
  additionalControls,
  keyField,
}: FKArrayFieldProps<TArrayItem>) {
  const [isVisible, setIsVisible] = useState(dropDownProps?.initialVisible);
  const { values } = useFormikContext();

  const fields = get(values, name, []) as TArrayItem[];
  const finalTestId = testId || name;

  return (
    <div
      data-cy={`${finalTestId}-container`}
      className={cn(containerClassName, {
        'mb-6': !containerClassName,
      })}
    >
      {title || dropDownProps?.label ? (
        <div
          className={cn('mb-2 text-neutral dark:text-warning', {
            'cursor-pointer hover:underline': !!dropDownProps,
          })}
          onClick={() => {
            if (dropDownProps) {
              setIsVisible((prev) => {
                return !prev;
              });
            }
          }}
        >
          {dropDownProps?.label || title}
        </div>
      ) : null}

      <div
        className={cn({
          hidden: !!dropDownProps && !isVisible,
        })}
      >
        <FieldArray name={name}>
          {({ remove, push }) => {
            const fieldsList = alwaysArray(fields);

            return (
              <>
                {/*items*/}
                <div className={cn(listClassName)}>
                  {fieldsList.map((field, index) => {
                    const key = alwaysString(keyField ? get(field, keyField, index) : index);
                    return (
                      <div key={key} className={cn('w-full', listItemClassName)}>
                        {renderItem({ field, remove: () => remove(index), index, fieldName: `${name}[${index}]` })}
                      </div>
                    );
                  })}
                </div>

                {/*add*/}
                <div className={'flex gap-6'}>
                  {addButtonProps ? (
                    <OdButton
                      testId={`${finalTestId}-add`}
                      variant={'outline'}
                      onClick={() => push(addButtonProps?.emptyItem(fieldsList.length))}
                      className={addButtonProps.className}
                    >
                      {getUserActionTitle(addButtonProps?.suffix || '').add}
                    </OdButton>
                  ) : null}

                  {additionalControls ? additionalControls({ push: (item) => push(item) }) : null}
                </div>
              </>
            );
          }}
        </FieldArray>
      </div>
    </div>
  );
}
