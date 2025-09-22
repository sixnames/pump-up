import { OdUrl } from '@/@types/common-types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { HTMLAttributeAnchorTarget, MouseEvent } from 'react';

interface OdLinkProps {
  shallow?: boolean;
  id?: string;
  children?: React.ReactNode;
  href: OdUrl;
  className?: string;
  testId?: string;
  role?: string;
  prefetch?: boolean;
  target?: HTMLAttributeAnchorTarget | undefined;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void | Promise<void>;
  ariaLabel?: string;
}

export default function OdLink({
  role,
  children,
  href,
  className,
  testId,
  shallow,
  id,
  target,
  ariaLabel,
  prefetch = false,
  ...props
}: OdLinkProps) {
  return (
    <Link
      target={target}
      role={role}
      id={id}
      shallow={shallow}
      href={href}
      data-cy={testId}
      prefetch={prefetch}
      aria-label={ariaLabel}
      className={cn('inline-block ease-in duration-75 hover:text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
