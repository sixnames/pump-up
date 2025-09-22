import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

interface DialogScrollContentProps {
  children: React.ReactNode;
  title: string;
}

export default function DialogScrollContent({ children, title }: DialogScrollContentProps) {
  return (
    <DialogContent aria-describedby={undefined}>
      <DialogTitle>{title}</DialogTitle>
      <ScrollArea className={'max-h-dialog-max-height'}>{children}</ScrollArea>
    </DialogContent>
  );
}
