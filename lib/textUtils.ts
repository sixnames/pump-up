import { ADD_FAILURE_MESSAGE, READ_FAILURE_MESSAGE } from '@/lib/constants';
import { fieldLabels } from '@/lib/fieldLabels';
import { noSentenceCase } from '@/lib/stringUtils';

export function getActionErrorMessage(message: string, label: string): string {
  return `${label} ${noSentenceCase(message)}`;
}

export function getReadErrorMessage(label: string): string {
  return getActionErrorMessage(READ_FAILURE_MESSAGE, label);
}

export function getAddErrorMessage(label: string): string {
  return getActionErrorMessage(ADD_FAILURE_MESSAGE, label);
}

export function getUserActionTitle(suffix: string, variant: 'singular' | 'action' = 'action') {
  const leftParentasies = variant === 'singular' ? '(' : '';
  const rightParentasies = variant === 'singular' ? ')' : '';
  return {
    create: `${fieldLabels.create[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    read: `${fieldLabels.read[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    update: `${fieldLabels.update[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    delete: `${fieldLabels.delete[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    clear: `${fieldLabels.clear[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    close: `${fieldLabels.close[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    add: `${fieldLabels.add[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    set: `${fieldLabels.set[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}`,
    deleteConfirm: `${fieldLabels.deleteConfirm[variant]} ${leftParentasies}${noSentenceCase(suffix)}${rightParentasies}?`,
  };
}
