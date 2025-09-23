import { alwaysArray } from '@/lib/commonUtils';
import { STANDARD_ERROR_MESSAGE } from '@/lib/constants';
import { FormikErrors } from 'formik';
import cloneDeepWith from 'lodash/cloneDeepWith';

interface ErrorCauseError {
  message?: string;
  path?: string;
}

interface ErrorCause {
  errors?: ErrorCauseError[];
}

export function getErrorMessage(error: unknown): string {
  let message: string;
  if (error && typeof error === 'object' && 'cause' in error) {
    const cause = error.cause as ErrorCause | undefined;
    const newMessage = alwaysArray(cause?.errors).reduce((acc: string[], item) => {
      const prefix = item.path ? `${item.path}: ` : '';
      return [...acc, `${prefix}${item?.message}`];
    }, []);
    message = newMessage.join(' ');
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = STANDARD_ERROR_MESSAGE;
  }
  return message;
}

export function collectYupErrors<T>(errors: FormikErrors<T>): string[] {
  let errorMessages: string[] = [];

  cloneDeepWith(errors, (value) => {
    if (typeof value === 'string') {
      errorMessages.push(value);
    }
  });
  return errorMessages;
}
