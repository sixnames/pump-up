import OdButton, { OdButtonProps } from '@/components/buttons/OdButton';
import { FKErrorsInfobox } from '@/components/formik/FkErrorsList';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { collectYupErrors } from '@/lib/errorUtils';
import { useFormikContext } from 'formik';
import React from 'react';

interface FKButtonProps extends Omit<OdButtonProps, 'type' | 'disabled'> {
  showErrorsList?: boolean;
  errorsListClassName?: string;
  disabled?: boolean;
  withKeyboardShortcut?: boolean;
  errorsTitle?: string;
}

export default function FkButton({
  children,
  showErrorsList,
  withKeyboardShortcut,
  errorsListClassName,
  disabled,
  errorsTitle,
  ...rest
}: FKButtonProps) {
  const { errors, isValid, submitForm } = useFormikContext();
  const errorsList = collectYupErrors(errors);
  useKeyboardShortcut({
    key: 's',
    isWithCtrl: true,
    skipShortcut: !withKeyboardShortcut,
    callbackAction: async () => {
      await submitForm();
    },
  });

  const isWithErrors = errorsList.length > 0;
  return (
    <>
      {isWithErrors && showErrorsList ? (
        <FKErrorsInfobox errorsList={errorsList} className={'mb-6'} title={errorsTitle || 'Заповніть наступні поля:'} />
      ) : null}

      <OdButton {...rest} type={'submit'} disabled={!isValid || disabled}>
        {children}
      </OdButton>
    </>
  );
}
