'use client';
import { CollectionNames } from '@/@types/common-types';
import { OdInputCommonProps } from '@/@types/form-input-types';
import OdButton from '@/components/buttons/OdButton';
import OdCrossButton from '@/components/buttons/OdCrossButton';
import OdRemoveButton from '@/components/buttons/OdRemoveButton';
import { InfoDialog, useInfoDialog } from '@/components/dialogs/InfoDialog';
import OdLabel from '@/components/forms/OdLabel';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { alwaysArray, alwaysString } from '@/lib/commonUtils';
import { getUserActionTitle } from '@/lib/textUtils';
import { cn } from '@/lib/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Check, ChevronsUpDown, XIcon } from 'lucide-react';
import * as React from 'react';
import { useRef, useState } from 'react';

export interface QueryComboOption extends Record<any, any> {
  id?: string | null;
  label?: string | null;
}

export interface QueryComboCommonProps extends OdInputCommonProps {
  optionsFilter?: (value?: QueryComboOption | null) => boolean;
  allowGrowing?: boolean;
}

export interface QueryComboConsumerProps<T> extends QueryComboCommonProps {
  onChangeAction: (value: T[]) => void | Promise<void>;
  selectedOptions?: T[];
  multiple?: boolean;
}

export interface QueryFilterComboConsumerProps extends Omit<QueryComboCommonProps, 'onClear' | 'skipConfirmOnClear'> {
  multiple?: boolean;
}

interface QueryComboListProps {
  queryOptions: {
    queryKey: unknown[];
    queryFn: (query: string) => Promise<QueryComboOption[] | undefined>;
    enabled?: boolean;
  };
  onChangeAction: (value: string) => void | Promise<void>;
  collectionName: CollectionNames;
  optionsFilter?: QueryComboCommonProps['optionsFilter'];
  selectedOptionIds: string[];
  testId: string;
}

function QueryComboList({
  queryOptions,
  collectionName,
  testId,
  onChangeAction,
  optionsFilter,
  selectedOptionIds,
}: QueryComboListProps) {
  const [value, setValue] = useState<string>('');
  const query = useQuery({
    queryKey: [...queryOptions.queryKey, value],
    queryFn: () => queryOptions.queryFn(value),
    placeholderData: keepPreviousData,
    enabled: queryOptions.enabled,
  });
  const initialOptions = alwaysArray(query.data);
  const filteredOptions = optionsFilter ? initialOptions.filter(optionsFilter) : initialOptions;

  const debouncedUpdate = debounce(async (val) => {
    setValue(val);
  }, 500);

  return (
    <Command
      loop
      filter={() => {
        return 1;
      }}
    >
      <CommandInput data-cy={`${testId}-combo-input`} onValueChange={(inputValue) => debouncedUpdate(inputValue)} />

      <CommandList className={'w-full'}>
        {alwaysArray(query.data)?.length < 1 ? (
          <div className={'p-4 text-center'}>
            <div className={'mb-4'}>Немає результатів</div>

            <OdButton
              type={'button'}
              onClick={() => {
                window.open(`/admin/collections/${collectionName}/create`, '_blank');
              }}
              className={'mt-2'}
              variant={'secondary'}
              testId={`${testId}-combo-create`}
            >
              Створити
            </OdButton>
          </div>
        ) : null}

        {filteredOptions.map((option) => {
          if (!option) {
            return null;
          }

          return (
            <CommandItem
              data-cy={`${testId}-combo-option`}
              key={option?.id}
              value={alwaysString(option?.id)}
              onSelect={onChangeAction}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  selectedOptionIds.includes(alwaysString(option?.id)) ? 'opacity-100' : 'opacity-0',
                )}
              />
              {option?.label}
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
}

export interface QueryComboProps extends QueryComboCommonProps {
  onChangeAction: QueryComboListProps['onChangeAction'];
  selectedOptions?: QueryComboOption[];
  queryOptions: QueryComboListProps['queryOptions'];
  collectionName: CollectionNames;
}

export function QueryCombo({
  onChangeAction,
  disabled,
  label,
  onClear,
  skipConfirmOnClear,
  testId,
  collectionName,
  withError,
  className,
  removeProps,
  optionsFilter,
  allowGrowing,
  queryOptions,
  ...props
}: QueryComboProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [confirmDialogState, setConfirmDialogState] = useInfoDialog();
  const [open, setOpen] = React.useState(false);
  const selectedOptions = alwaysArray(props.selectedOptions);

  async function clearHandler() {
    if (!onClear || selectedOptions.length < 1) {
      return;
    }
    if (skipConfirmOnClear) {
      await onClear();
      return;
    }
    setConfirmDialogState({
      title: getUserActionTitle('заповнені данні').deleteConfirm,
      onConfirm: onClear,
      isDialogOpen: false,
    });
  }

  const selectedOptionIdsArray = alwaysArray(selectedOptions).map((option) => alwaysString(option.id));
  const lastSelectedItem = selectedOptions[selectedOptions.length - 1];

  return (
    <div className={cn('mb-6 max-w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        {label ? <OdLabel {...label} /> : null}

        <div className={'w-full max-w-full relative flex items-start gap-4'}>
          <div
            className={cn('relative flex-1 max-w-full', {
              'max-w-[calc(100%-2.5rem)]': removeProps && !removeProps.hidden,
            })}
          >
            <PopoverTrigger
              asChild
              disabled={Boolean(disabled)}
              className={cn({
                'pointer-events-none': disabled,
              })}
            >
              <div className={'relative z-10'}>
                <Button
                  ref={triggerRef}
                  type={'button'}
                  data-cy={`${testId}-trigger`}
                  disabled={Boolean(disabled)}
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setOpen(true);
                    }
                  }}
                  className={cn('w-full justify-between flex pr-10 bg-error dark:bg-background', {
                    'border-error dark:border-error': withError,
                    'h-auto min-h-9': allowGrowing && selectedOptions.length > 0,
                  })}
                >
                  {allowGrowing ? (
                    <span className={'flex flex-wrap gap-1 w-full'}>
                      {selectedOptions.map((option) => {
                        if (!option) {
                          return null;
                        }
                        const id = option?.id;
                        if (!id) {
                          return null;
                        }
                        return (
                          <span
                            key={id}
                            className={
                              'pl-2 pr-1 bg-secondary rounded flex gap-2 items-center text-xs truncate max-w-full'
                            }
                          >
                            <span className={'truncate grow flex-1'}>{option?.label}</span>

                            <span
                              className={'w-4 h-4 p-0 flex items-center justify-center cursor-pointer'}
                              aria-label={'button'}
                              data-cy={`${testId}-cross-button`}
                              onClick={async () => {
                                await onChangeAction(id);
                              }}
                            >
                              <XIcon className='h-3 w-3 shrink-0 opacity-50' />
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    <span className={'truncate'}>{alwaysString(lastSelectedItem?.label)}</span>
                  )}
                </Button>
              </div>
            </PopoverTrigger>

            <div className={'absolute top-0 right-2 z-20 flex items-center justify-center h-full'}>
              {selectedOptionIdsArray.length > 0 && onClear ? (
                <OdCrossButton onClick={clearHandler} />
              ) : (
                <div className={'w-6 h-6 flex items-center justify-center'}>
                  <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                </div>
              )}
            </div>
          </div>

          {removeProps && !removeProps.hidden ? (
            <div className={'h-9 flex items-center'}>
              <OdRemoveButton {...removeProps} testId={testId} className={'static'} />
            </div>
          ) : null}
        </div>
        <PopoverContent className='w-full p-0'>
          {open ? (
            <QueryComboList
              testId={testId}
              queryOptions={queryOptions}
              selectedOptionIds={selectedOptionIdsArray}
              collectionName={collectionName}
              optionsFilter={optionsFilter}
              onChangeAction={async (currentValue) => {
                await onChangeAction(currentValue);
                setOpen(false);
                if (triggerRef.current) {
                  triggerRef.current.focus();
                }
              }}
            />
          ) : null}
        </PopoverContent>
      </Popover>

      <InfoDialog dialog={confirmDialogState} />
    </div>
  );
}
