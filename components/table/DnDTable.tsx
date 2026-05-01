// needed for table body level scope DnD setup
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { alwaysArray, alwaysString } from '@/lib/commonUtils';
import { cn } from '@/lib/utils';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  MouseSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { ArrowDownUp } from 'lucide-react';
import React, { CSSProperties, useEffect } from 'react';

interface DraggableRowProps<T extends Record<any, any>> {
  row: Row<T>;
  disableDrag?: boolean;
}

function DraggableRow<T extends Record<any, any>>({ row, disableDrag }: DraggableRowProps<T>) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: row.original.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {disableDrag ? null : (
        <TableCell {...attributes} {...listeners} className={'w-7.5'}>
          <button type={'button'} className={'cursor-move'}>
            <ArrowDownUp className={'h-4 w-4'} />
          </button>
        </TableCell>
      )}

      {row.getAllCells().map((cell) => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

type OnDragEndHandler = (event: { activeId: string; overId: string }) => void;

interface DnDTableProps<T extends Record<any, any>> {
  initialColumns: ColumnDef<T>[];
  initialData: T[];
  isLoading?: boolean;
  onDragEnd: OnDragEndHandler;
  disableDrag?: boolean;
}

export default function DnDTable<T extends Record<any, any>>({
  initialColumns,
  initialData,
  onDragEnd,
  isLoading,
  disableDrag,
}: DnDTableProps<T>) {
  const [data, setData] = React.useState<T[]>([]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns = React.useMemo<ColumnDef<T>[]>(() => initialColumns, [initialColumns]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => {
    return data?.map(({ id }) => id);
  }, [data]);

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      onDragEnd({
        activeId: alwaysString(active.id),
        overId: alwaysString(over.id),
      });
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(useSensor(MouseSensor, {}));

  if (alwaysArray(data).length === 0 && !isLoading) {
    return <div className={'text-muted-foreground py-2'}>Немає даних</div>;
  }

  if (isLoading) {
    return <div className={'text-muted-foreground py-2'}>Іде загрузка...</div>;
  }

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      <div className='flex flex-wrap items-center pt-0.5 pr-0.5 gap-4'>
        <div className={'w-full max-w-full relative'}>
          <ScrollArea aria-orientation={'horizontal'} className={cn('max-w-full w-full')}>
            <ScrollBar orientation={'horizontal'} className='sticky top-2 left-0 w-full' forceMount={true} />
            <div className={'rounded-md border'}>
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
              >
                <div className='p-2'>
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {disableDrag ? null : <TableHead />}
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
                      <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                        {table.getRowModel().rows.map((row) => {
                          return <DraggableRow key={row.id} row={row} disableDrag={disableDrag} />;
                        })}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </div>
              </DndContext>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
