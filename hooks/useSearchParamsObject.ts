import { useSearchParams } from 'next/navigation';
import qs from 'qs';

export function useSearchParamsObject<T>() {
  const searchParams = useSearchParams();
  return qs.parse(searchParams.toString(), {
    parseArrays: true,
  }) as Partial<T>;
}
