import { OdRemoveButtonProps } from '@/components/buttons/OdRemoveButton';
import { OdLabelProps } from '@/components/forms/OdLabel';

export interface OdInputCommonProps {
  label?: OdLabelProps;
  disabled?: boolean | null;
  testId: string;
  withError?: boolean;
  className?: string;
  onClear?: () => void | Promise<void>;
  skipConfirmOnClear?: boolean;
  removeProps?: Omit<OdRemoveButtonProps, 'className' | 'testId'>;
}

export interface FKInputCommonProps extends Omit<OdInputCommonProps, 'testId' | 'skipConfirmOnClear'> {
  testId?: string;
  name: string;
}
