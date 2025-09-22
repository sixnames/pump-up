'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface OdDropdownProps {
  initialVisible?: boolean | null;
  className?: string;
  labelClassName?: string;
  label: string;
  children: React.ReactNode;
  testId?: string;
}

export default function OdDropdown({ initialVisible, className, labelClassName, label, children, testId }: OdDropdownProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);

  return (
    <div className={className}>
      <div
        className={cn({
          'mb-2': isVisible,
        })}
      >
        <span
          data-cy={`${testId}-label`}
          className={cn('text-subtitle cursor-pointer hover:underline', labelClassName)}
          onClick={() => {
            setIsVisible((prev) => {
              return !prev;
            });
          }}
        >
          {label}
        </span>
      </div>

      {isVisible ? <div>{children}</div> : null}
    </div>
  );
}
