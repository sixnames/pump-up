'use client';

import { OdUrl } from '@/@types/common-types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { alwaysNumber } from '@/lib/commonUtils';
import { DEFAULT_PAGINATION_PAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

function PaginationNumber({
                            page,
                            href,
                            isActive,
                            position,
                          }: {
  page: number | string;
  href: OdUrl;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  return position === 'middle' ? (
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
  ) : (
    <PaginationItem>
      <PaginationLink href={href} isActive={isActive}>
        {page}
      </PaginationLink>
    </PaginationItem>
  );
}

function PaginationArrow({ href, direction, isDisabled }: {
  href: OdUrl;
  direction: 'left' | 'right';
  isDisabled?: boolean
}) {
  if (direction === 'left') {
    return (
      <PaginationItem>
        <PaginationPrevious
          href={href}
          isActive={true}
          className={cn({
            'pointer-events-none opacity-60': isDisabled,
          })}
        />
      </PaginationItem>
    );
  }

  return (
    <PaginationItem>
      <PaginationNext
        href={href}
        isActive={true}
        className={cn({
          'pointer-events-none opacity-60': isDisabled,
        })}
      />
    </PaginationItem>
  );
}

export default function OdPagination(props: {
  totalPages?: number
}) {
  const totalPages = alwaysNumber(props.totalPages);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = alwaysNumber(searchParams.get('page'), DEFAULT_PAGINATION_PAGE);
  const allPages = generatePagination(currentPage, totalPages);

  function createPageURL(pageNumber: number | string): OdUrl {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}` as OdUrl;
  }

  if (totalPages < 2) {
    return null;
  }

  return (
    <Pagination className={'mt-6'}>
      <PaginationContent>
        <PaginationArrow direction="left" href={createPageURL(currentPage - 1) as OdUrl}
                         isDisabled={currentPage <= 1} />

        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;

          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}

        <PaginationArrow direction="right" href={createPageURL(currentPage + 1)}
                         isDisabled={currentPage >= totalPages} />
      </PaginationContent>
    </Pagination>
  );
}
