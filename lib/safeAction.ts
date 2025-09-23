import {
  CREATE_FAILURE_MESSAGE,
  CREATE_SUCCESS_MESSAGE,
  DELETE_FAILURE_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  READ_FAILURE_MESSAGE,
  READ_SUCCESS_MESSAGE,
  TOAST_ERROR,
  UPDATE_FAILURE_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
} from '@/lib/constants';
import { getToday } from '@/lib/dateUtils';
import { getErrorMessage } from '@/lib/errorUtils';
import { errorLogger, infoLogger } from '@/lib/logger';
import { getPD, protectedRoute } from '@/lib/payloadUtils';
import { User } from '@/payload-types';
import { unstable_noStore } from 'next/cache';
import { BasePayload } from 'payload';

function getHelpersSuccessMessage(message: string) {
  return (suffix?: string | null) => {
    const suffixString = suffix ? ` ${suffix}` : '';
    return `${message}${suffixString}`;
  };
}

function getHelpersErrorMessage(message: string) {
  return (suffix?: string | null) => {
    const suffixString = suffix ? ` ${suffix}` : '';
    return new Error(`${message}${suffixString}`);
  };
}

const messages = {
  create: {
    success: getHelpersSuccessMessage(CREATE_SUCCESS_MESSAGE),
    error: getHelpersErrorMessage(CREATE_FAILURE_MESSAGE),
  },
  read: {
    success: getHelpersSuccessMessage(READ_SUCCESS_MESSAGE),
    error: getHelpersErrorMessage(READ_FAILURE_MESSAGE),
  },
  update: {
    success: getHelpersSuccessMessage(UPDATE_SUCCESS_MESSAGE),
    error: getHelpersErrorMessage(UPDATE_FAILURE_MESSAGE),
  },
  delete: {
    success: getHelpersSuccessMessage(DELETE_SUCCESS_MESSAGE),
    error: getHelpersErrorMessage(DELETE_FAILURE_MESSAGE),
  },
};

function getActionReadableDate() {
  const now = getToday();
  return `${now.toLocaleDateString('uk-UA')} ${now.toLocaleTimeString('uk-UA')}`;
}

interface OdSafeQueryContext<TInput> {
  user: User | null | undefined;
  payload: BasePayload;
  key: string;
  params: TInput extends undefined ? undefined : TInput;
  messages: OdSafeMutationContextHelpersMessages;
}

interface OdSafeQueryParams<TResult, TInput> {
  key: string;
  action: (context: OdSafeQueryContext<TInput>) => Promise<TResult>;
}

export function odSafeQuery<TResult, TInput>({ action, key }: OdSafeQueryParams<TResult, TInput>) {
  return async (input: TInput extends undefined ? undefined : TInput): Promise<TResult | undefined> => {
    unstable_noStore();
    const { user } = await protectedRoute();
    const payload = await getPD();
    const loggerOptions = {
      key,
      username: user?.username,
      createdAt: getActionReadableDate(),
    };

    try {
      return await action({
        user,
        key,
        payload,
        params: input,
        messages,
      });
    } catch (error) {
      errorLogger.error(getErrorMessage(error), loggerOptions);
      return;
    }
  };
}

interface OdSafeMutationContextHelpersMessage {
  success: (suffix?: string | null) => string;
  error: (suffix?: string | null) => Error;
}

interface OdSafeMutationContextHelpersMessages {
  create: OdSafeMutationContextHelpersMessage;
  read: OdSafeMutationContextHelpersMessage;
  update: OdSafeMutationContextHelpersMessage;
  delete: OdSafeMutationContextHelpersMessage;
}

interface OdSafeMutationContext {
  user?: User | undefined | null;
  key: string;
  messages: OdSafeMutationContextHelpersMessages;
  payload: BasePayload;
}

export type MutationResult<T = undefined> = MutationSuccessResult<T> | MutationErrorResult;
export type MutationSuccessResult<T> = {
  status: 'default';
  message: string;
  data: T;
};
export type MutationErrorResult = {
  status: 'destructive';
  message: string;
  errorVariant?: 'eventVariant' | 'replaceUser';
};

interface OdSafeMutationParams<TResult, TInput> {
  key: string;
  customErrorMessage?: string;
  action: (input: TInput extends undefined ? undefined : TInput, context: OdSafeMutationContext) => Promise<MutationResult<TResult>>;
  afterMutation?: (data: TResult, context: OdSafeMutationContext) => Promise<void>;
  beforeMutation?: (data: TInput extends undefined ? undefined : TInput, context: OdSafeMutationContext) => Promise<void>;
}

export function odSafeMutation<TResult, TInput>({
  action,
  key,
  customErrorMessage,
  afterMutation,
  beforeMutation,
}: OdSafeMutationParams<TResult, TInput>) {
  return async (input: TInput extends undefined ? undefined : TInput): Promise<MutationResult<TResult>> => {
    unstable_noStore();
    const { user } = await protectedRoute();
    const payload = await getPD();
    const loggerOptions = {
      key,
      username: user?.username,
      createdAt: getActionReadableDate(),
    };

    try {
      const context = {
        user,
        key,
        payload,
        messages,
      } satisfies OdSafeMutationContext;

      let values = input;
      if (input && beforeMutation) {
        await beforeMutation(input, context);
      }

      const result = await action(values, context);

      infoLogger.info(result.message, loggerOptions);

      if (result.status === 'default') {
        if (result.data && afterMutation) {
          await afterMutation(result.data, context);
        }
      }

      return result;
    } catch (error) {
      const errorMessage = customErrorMessage || getErrorMessage(error);
      console.error(error);
      if (error && typeof error === 'object' && 'cause' in error) {
        console.error(error.cause);
      }
      errorLogger.error(errorMessage, loggerOptions);
      return {
        status: TOAST_ERROR,
        message: errorMessage,
      };
    }
  };
}
