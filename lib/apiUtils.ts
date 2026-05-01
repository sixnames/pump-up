import { FORBIDDEN_PERMISSION } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorUtils';
import contentDisposition from 'content-disposition';
import ExcelJS from 'exceljs';

export async function alwaysResponseBody<T>(res: Response) {
  try {
    return (await res.json()) as T;
  } catch (err) {
    return {} as T;
  }
}

export function getSuccessResponse(successMessage: string, responseBody?: Record<string, unknown>) {
  const body = JSON.stringify({
    successMessage,
    responseBody,
  });
  return new Response(body, { status: 200 });
}

export interface ErrorResponseBody {
  errorMessage?: string;
  warningMessage?: string;
  successMessage?: string;
}

export function getBadRequestResponse(errorMessage: string) {
  const body = JSON.stringify({
    errorMessage,
  });
  return new Response(body, { status: 400 });
}

export function getForbiddenResponse() {
  const body = JSON.stringify({
    errorMessage: FORBIDDEN_PERMISSION,
  });
  return new Response(body, { status: 403 });
}

export function getInternalServerErrorResponse(error: unknown) {
  const body = JSON.stringify({
    errorMessage: getErrorMessage(error),
  });
  return new Response(body, { status: 403 });
}

interface GetDocxResponseParams {
  buffer: Buffer;
  outputFileName: string;
}

export function getDocxResponse({ buffer, outputFileName }: GetDocxResponseParams) {
  return new Response(buffer as BodyInit, {
    headers: {
      'Cache-Control': 'no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': contentDisposition(`${outputFileName}.docx`, {
        fallback: false,
      }),
      'Content-Length': buffer.byteLength.toString(),
    },
  });
}

interface GetXlsxResponseParams {
  buffer: ExcelJS.Buffer;
  outputFileName: string;
}

export function getXlsxResponse({ buffer, outputFileName }: GetXlsxResponseParams) {
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Cache-Control': 'no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0',
      'Content-Disposition': contentDisposition(`${outputFileName}.xlsx`),
      'Content-Length': buffer.byteLength.toString(),
    },
  });
}
