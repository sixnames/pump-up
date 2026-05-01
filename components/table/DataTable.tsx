import OdPagination from '@/components/common/OdPagination';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useLocalStorage from '@/hooks/useLocalStorage';
import { alwaysArray, alwaysNumber } from '@/lib/commonUtils';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { PaginatedDocs } from 'payload';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  paginationData?: PaginatedDocs<T>;
  visibilityKey: string;
  controlsLeftChildren?: React.ReactNode;
  isLoading?: boolean;
}

function getTableVisibleColumnsKey(key: string): string {
  return `${key}-table-visible-columns`;
}

export default function DataTable<T>({
  visibilityKey,
  paginationData,
  columns,
  controlsLeftChildren,
  isLoading,
}: DataTableProps<T>) {
  const [hasMounted, setHasMounted] = useState(false);
  const [columnVisibility, setColumnVisibility, resetColumnVisibility] = useLocalStorage<VisibilityState>(
    getTableVisibleColumnsKey(visibilityKey),
    {},
  );

  const table = useReactTable({
    data: alwaysArray(paginationData?.docs),
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    state: {
      columnVisibility,
    },
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const visibilityColumns = table.getAllColumns().filter((column) => column.getCanHide());

  if (alwaysArray(paginationData?.docs).length === 0 && !isLoading) {
    return <div className={'text-muted-foreground py-2'}>Немає даних</div>;
  }

  if (isLoading) {
    return <div className={'text-muted-foreground'}>Іде загрузка...</div>;
  }

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      {/*TABLE CONTROLS*/}
      <div className='flex flex-wrap items-center pt-0.5 pr-0.5 gap-4'>
        {paginationData?.totalDocs && !isLoading ? (
          <div className={'text-muted-foreground'}>Всього: {paginationData.totalDocs}</div>
        ) : null}

        {controlsLeftChildren}

        {visibilityColumns.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto' type={'button'}>
                Колонки <ChevronDownIcon className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <ScrollArea
                aria-orientation={'vertical'}
                className={cn({
                  'h-65': visibilityColumns.length > 9,
                })}
              >
                {visibilityColumns.map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
                {Object.keys(columnVisibility).length > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={'text-warning'} onClick={() => resetColumnVisibility()}>
                      До початкового вигляду
                    </DropdownMenuItem>
                  </>
                ) : null}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {/*BODY*/}
      <div className={'w-full max-w-full relative'}>
        <ScrollArea
          aria-orientation={'horizontal'}
          className={cn('max-w-full w-full', {
            'pt-6': visibilityColumns.length > 0 || Boolean(controlsLeftChildren),
          })}
        >
          <ScrollBar orientation={'horizontal'} className='sticky top-2 left-0 w-full' forceMount={true} />
          <div className={'rounded-md border'}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {alwaysArray(table.getRowModel().rows).map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className={'align-baseline'} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      {/*PAGINATION*/}
      <OdPagination totalPages={alwaysNumber(paginationData?.totalPages)} />
    </div>
  );
}
