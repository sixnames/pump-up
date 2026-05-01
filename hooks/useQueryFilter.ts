import { useSearchParamsObject } from '@/hooks/useSearchParamsObject';
import { useProgress } from '@bprogress/next';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import qs from 'qs';
import { useTransition } from 'react';

export function useQueryFilter<T>(): [Partial<T>, (params: T) => void] {
  const { start, stop } = useProgress();
  const [, startTransition] = useTransition();
  const router = useRouter();
  const searchParamsObject = useSearchParamsObject<T>();

  const updateQuery = debounce((values: T) => {
    start();
    const queryString = qs.stringify(values, {
      skipNulls: true,
      arrayFormat: 'repeat',
    });
    startTransition(() => {
      router.replace(`?${queryString}`);
    });
    stop();
  }, 100);

  return [searchParamsObject, updateQuery];
}
