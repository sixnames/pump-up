import { OdUrl } from '@/@types/common-types';
import { Button } from '@/components/ui/button';
import { alwaysString } from '@/lib/commonUtils';
import { SORT_ASC_STR, SORT_DESC_STR } from '@/lib/constants';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/table-core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { ReactNode } from 'react';

interface DataTableSortHeaderProps<T> {
  column: Column<T>;
  children?: ReactNode;
  fieldName: string;
}

export default function DataTableSortHeader<T>({ column, children, fieldName }: DataTableSortHeaderProps<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortDir = alwaysString(searchParams.get('sortDir'), SORT_ASC_STR);
  const { replace } = useRouter();

  async function setSortByHandler(fieldName: string) {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', fieldName);

    if (sortDir === SORT_ASC_STR) {
      params.set('sortDir', SORT_DESC_STR);
    } else {
      params.set('sortDir', SORT_ASC_STR);
    }

    params.delete('page');
    replace(`${pathname}?${params.toString()}` as OdUrl);
  }

  return (
    <Button variant='ghost' onClick={() => setSortByHandler(fieldName)} type={'button'}>
      {children || column.id}
      <CaretSortIcon className='ml-2 h-4 w-4' />
    </Button>
  );
}
