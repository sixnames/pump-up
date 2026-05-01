import { Separator } from '@/components/ui/separator';
import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
}

export default function FormGroup({ children, title }: FormGroupProps) {
  return (
    <div>
      <Separator className={`mb-6 pt-1`} />
      {title ? <div className={'text-success font-semibold mb-2'}>{title}</div> : null}
      {children}
    </div>
  );
}
