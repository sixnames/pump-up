import { OdUrl } from '@/@types/common-types';
import { useLoaderContext } from '@/components/context/LoaderContext';
import { useToast } from '@/hooks/use-toast';
import { STANDARD_ERROR_MESSAGE, TOAST_ERROR, TOAST_SUCCESS } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorUtils';
import { MutationErrorResult, MutationResult, MutationSuccessResult } from '@/lib/safeAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface UseMutationParams<Params, PayloadData> {
  action: (values: Params) => Promise<MutationResult<PayloadData>>;
  onErrorMessage?: string;
  onSuccessCallback?: (payload: MutationSuccessResult<PayloadData>) => void | Promise<void>;
  onErrorCallback?: (payload: MutationErrorResult) => void | Promise<void>;
  scrollToPageTop?: boolean;
  redirectTo?: (payload: MutationSuccessResult<PayloadData>) => OdUrl;
  refetchQueryKeys?: (payload: MutationSuccessResult<PayloadData>) => ReadonlyArray<unknown>;
}

export function useOdMutation<Params, PayloadData>({
  action,
  onErrorMessage,
  onSuccessCallback,
  onErrorCallback,
  scrollToPageTop,
  redirectTo,
  refetchQueryKeys,
}: UseMutationParams<Params, PayloadData>) {
  const client = useQueryClient();
  const { toast, dismiss } = useToast();
  const { showLoader, hideLoader } = useLoaderContext();
  const router = useRouter();
  return useMutation({
    mutationFn: action,
    onMutate: () => {
      showLoader();
    },
    onSuccess: async (data) => {
      hideLoader();
      if (!data || data.status === TOAST_ERROR) {
        toast({
          description: data?.message || onErrorMessage || STANDARD_ERROR_MESSAGE,
          variant: TOAST_ERROR,
          onClick: () => dismiss(),
        });
        if (onErrorCallback) {
          await onErrorCallback(data);
        }
        return;
      }

      if (refetchQueryKeys) {
        await client.refetchQueries({
          queryKey: refetchQueryKeys(data),
        });
      }

      toast({
        variant: data.status,
        description: data.message,
        onClick: () => dismiss(),
      });
      if (onSuccessCallback) {
        await onSuccessCallback(data as MutationSuccessResult<PayloadData>);
      }

      if (scrollToPageTop) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }

      if (redirectTo && data.status === TOAST_SUCCESS) {
        router.push(redirectTo(data));
      }
    },
    onError: async (error) => {
      hideLoader();
      toast({
        description: getErrorMessage(error),
        variant: TOAST_ERROR,
        onClick: () => dismiss(),
      });
    },
    onSettled: () => {
      hideLoader();
    },
  });
}
