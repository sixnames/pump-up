import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import React from 'react';

export type OdButtonVariant = VariantProps<typeof buttonVariants>['variant'];

export interface OdButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children?: React.ReactNode;
  testId?: string;
  variant?: OdButtonVariant;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  tabIndex?: number;
  dataTip?: string;
  form?: string;
}

export default function OdButton({
  type = 'button',
  disabled,
  onClick,
  children,
  testId,
  variant = 'default',
  className,
  ariaLabel,
  tabIndex,
  dataTip,
  form,
}: OdButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      className={cn('cursor-pointer', className)}
      tabIndex={tabIndex}
      disabled={disabled}
      data-cy={testId}
      aria-label={ariaLabel}
      data-tip={dataTip}
      onClick={onClick}
      form={form}
    >
      {children}
    </Button>
  );
}
