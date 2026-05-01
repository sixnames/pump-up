import { ADD_FAILURE_MESSAGE, READ_FAILURE_MESSAGE } from '@/lib/constants';
import { fieldLabels } from '@/lib/fieldLabels';
import { noSentenceCase } from '@/lib/stringUtils';

export function getActionErrorMessage(message: string, label: string): string {
  return `${message} ${noSentenceCase(label)}`;
}

export function getReadErrorMessage(label: string): string {
  return getActionErrorMessage(READ_FAILURE_MESSAGE, label);
}

export function getNoDataMessage(label: string): string {
  return `${label} ${READ_FAILURE_MESSAGE.toLowerCase()}`;
}

export function getAddErrorMessage(label: string): string {
  return getActionErrorMessage(ADD_FAILURE_MESSAGE, label);
}

export function getUserActionTitle(suffix: string, variant: 'singular' | 'action' = 'action', additionalText?: string) {
  const leftParentasies = variant === 'singular' ? '(' : '';
  const rightParentasies = variant === 'singular' ? ')' : '';
  const additionalTextString = additionalText ? ` ${additionalText}` : '';
  return {
    create: `${fieldLabels.create[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    read: `${fieldLabels.read[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    update: `${fieldLabels.update[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    delete: `${fieldLabels.delete[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    clear: `${fieldLabels.clear[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    close: `${fieldLabels.close[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    add: `${fieldLabels.add[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    set: `${fieldLabels.set[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    deleteConfirm: `${fieldLabels.deleteConfirm[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}?`,
    upload: `${fieldLabels.upload[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    download: `${fieldLabels.download[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    filter: `${fieldLabels.filter[variant]}${additionalTextString} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
  };
}
