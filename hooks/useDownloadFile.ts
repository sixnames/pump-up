import { useLoaderContext } from '@/components/context/LoaderContext';
import { useToast } from '@/hooks/use-toast';
import { alwaysResponseBody, ErrorResponseBody } from '@/lib/apiUtils';
import { TOAST_ERROR, TOAST_WARNING } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorUtils';
import { useMutation } from '@tanstack/react-query';
import contentDisposition from 'content-disposition';
import { saveAs } from 'file-saver';

interface UseDownloadFileParams {
  apiUrl: string;
}

export function useDownloadFile<TBody extends Record<any, any>>({ apiUrl }: UseDownloadFileParams) {
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoaderContext();
  const { mutateAsync } = useMutation<void, void, TBody>({
    onError: () => {
      hideLoader();
    },
    onSuccess: () => {
      hideLoader();
    },
    onMutate: () => {
      showLoader();
    },
    mutationFn: async (body) => {
      try {
        showLoader();
        const res = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify(body),
          cache: `no-store`,
        });
        hideLoader();

        const metaHeader = res.headers.get('Content-Disposition');

        if (!metaHeader) {
          const resBody = await alwaysResponseBody<ErrorResponseBody>(res);
          if (resBody.warningMessage) {
            toast({
              description: resBody.warningMessage,
              variant: TOAST_ERROR,
            });
            return;
          }
          if (resBody.errorMessage) {
            toast({
              description: resBody.errorMessage,
              variant: TOAST_ERROR,
            });
            return;
          }

          toast({
            description: 'Помилка при створенні файлу',
            variant: TOAST_ERROR,
          });
          return;
        }

        const blob = await res.blob();
        const meta = contentDisposition.parse(metaHeader);
        const outputFileName = meta.parameters.filename;
        saveAs(blob, outputFileName);
        toast({
          description: `Файл ${outputFileName} завантажено`,
          variant: TOAST_WARNING,
        });
      } catch (error) {
        toast({
          description: getErrorMessage(error),
          variant: TOAST_ERROR,
        });
      }
    },
  });
  return mutateAsync;
}
