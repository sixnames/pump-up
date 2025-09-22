'use client';
import OdButton from '@/components/buttons/OdButton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { alwaysArray } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { extractUrlString, UrlConfigItem, UrlConfigNoIconItem } from '@/lib/urlUtils';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface OdBreadcrumbsProps {
  breadcrumbs?: Array<UrlConfigItem>;
}

function OdBreadcrumbs({ breadcrumbs }: OdBreadcrumbsProps) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  const breadcrumbsList: Array<UrlConfigItem> = [
    {
      url: '/',
      title: 'Головна',
      testId: 'breadcrumbs-main-link',
    },
    ...breadcrumbs,
  ];
  return (
    <Breadcrumb className='hidden md:flex mb-2'>
      <BreadcrumbList>
        {breadcrumbsList.map((item, index) => {
          if (!item) {
            return null;
          }
          const { url, title, testId } = item;
          const isLast = index === breadcrumbsList.length - 1;

          if (isLast) {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link data-cy={`breadcrumbs-${testId}`} href={url}>
                    {title}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface TitleProps extends OdBreadcrumbsProps {
  testId: string;
  className?: string;
  titleClassName?: string;
  children: React.ReactNode;
  subNav?: Record<string, UrlConfigNoIconItem | undefined>;
  showCreateButton?: boolean;
}

export default function OdTitle({ children, className, testId, subNav, breadcrumbs, titleClassName, showCreateButton }: TitleProps) {
  const { back, push } = useRouter();
  const pathname = usePathname();

  return (
    <div
      data-cy={testId}
      className={cn(className, {
        'mb-6': !className,
      })}
    >
      <OdBreadcrumbs breadcrumbs={breadcrumbs} />

      <div className={'flex items-center gap-4'}>
        {pathname !== '/' ? (
          <Button variant='outline' size='icon' className='h-7 w-7' type={'button'} onClick={back}>
            <ChevronLeft className='h-4 w-4' />
            <span className='sr-only'>Назад</span>
          </Button>
        ) : null}
        <h1 className={cn(`flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0`, titleClassName)}>
          {children}
        </h1>
        <div className={'ml-auto'}>
          {showCreateButton ? (
            <OdButton
              className={'h-7'}
              variant={'outline'}
              onClick={() => {
                push(`${pathname}/create`);
              }}
            >
              {fieldLabels.create.action}
            </OdButton>
          ) : null}
        </div>
      </div>

      {subNav ? (
        <div className={'mt-4 flex'}>
          <div className='flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-xs'>
            {alwaysArray(Object.values(subNav)).map((item, index) => {
              if (!item) {
                return null;
              }
              const { url, title } = item;
              const cleanHref = extractUrlString(url);
              return (
                <Link
                  key={title}
                  role='tab'
                  className={cn(
                    `flex select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-hidden focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground`,
                    {
                      'bg-accent pointer-events-none': pathname === cleanHref,
                    },
                  )}
                  href={url}
                  data-cy={`${testId}-tab-${index}`}
                >
                  {title}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
