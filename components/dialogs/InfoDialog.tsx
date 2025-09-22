import OdButton from '@/components/buttons/OdButton';
import { KebabDialogBaseProps } from '@/components/buttons/OdKebab';
import DialogScrollContent from '@/components/dialogs/DialogScrollContent';
import { Dialog } from '@/components/ui/dialog';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { fieldLabels } from '@/lib/fieldLabels';
import React, { ReactNode } from 'react';

export interface InfoDialogContentProps extends KebabDialogBaseProps {
  title: string;
  onConfirm?: () => void | Promise<void>;
  children?: ReactNode;
  showCancelButton?: boolean;
}

export function InfoDialogContent({ children, onConfirm, title, showCancelButton = true, closeDialog }: InfoDialogContentProps) {
  useKeyboardShortcut({
    key: 'Enter',
    callbackAction: () => {
      if (onConfirm) {
        onConfirm();
        closeDialog();
      }
    },
  });

  return (
    <DialogScrollContent title={title}>
      {children}

      <div className={'flex justify-between'}>
        {onConfirm ? (
          <OdButton
            testId={'info-modal-confirm'}
            onClick={() => {
              onConfirm();
              closeDialog();
            }}
          >
            {fieldLabels.confirm.action}
          </OdButton>
        ) : null}

        {showCancelButton ? (
          <OdButton testId={'info-modal-cancel'} variant={'destructive'} onClick={closeDialog}>
            {fieldLabels.cancel.action}
          </OdButton>
        ) : null}
      </div>
    </DialogScrollContent>
  );
}

export interface InfoDialogProps extends InfoDialogContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface InfoDialogComponentProps {
  dialog?: InfoDialogProps;
}

export function InfoDialog({ dialog }: InfoDialogComponentProps) {
  if (!dialog) {
    return null;
  }
  const { open, onOpenChange, ...props } = dialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <InfoDialogContent {...props} />
    </Dialog>
  );
}

type UseInfoDialogSetStateParams = Omit<InfoDialogProps, 'open' | 'onOpenChange' | 'closeDialog'>;
type UseInfoDialogPayload = [InfoDialogProps | undefined, (params: UseInfoDialogSetStateParams) => void];

export function useInfoDialog(): UseInfoDialogPayload {
  const [state, setState] = React.useState<InfoDialogProps>();
  return [
    state,
    (newState: UseInfoDialogSetStateParams) => {
      setState({
        ...newState,
        open: true,
        onOpenChange: () => false,
        closeDialog: () => {
          setState(undefined);
        },
      });
    },
  ];
}
