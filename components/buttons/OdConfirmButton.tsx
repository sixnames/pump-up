import OdButton, { OdButtonProps } from '@/components/buttons/OdButton';
import { InfoDialogContent, InfoDialogContentProps } from '@/components/dialogs/InfoDialog';
import { Dialog } from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';

interface OdConfirmButtonProps {
  button: Omit<OdButtonProps, 'onClick' | 'children'>;
  dialog: Omit<InfoDialogContentProps, 'closeDialog'>;
  children?: ReactNode;
  skipConfirm?: boolean;
}

export default function OdConfirmButton({ button, dialog, children, skipConfirm }: OdConfirmButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <OdButton
        {...button}
        onClick={async () => {
          if (skipConfirm) {
            await dialog?.onConfirm?.();
            return;
          }
          setIsConfirmOpen(true);
        }}
      >
        {children}
      </OdButton>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <InfoDialogContent closeDialog={() => setIsConfirmOpen(false)} {...dialog} />
      </Dialog>
    </>
  );
}
