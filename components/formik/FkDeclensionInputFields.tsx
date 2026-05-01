import FkInput from '@/components/formik/FkInput';
import { declensionNames } from '@/lib/declension-utils';
import { cn } from '@/lib/utils';
import React from 'react';

interface FkDeclensionInputFieldsProps {
  name: string;
  className?: string;
}

export function FkDeclensionInputFields({ name, className }: FkDeclensionInputFieldsProps) {
  return (
    <div className={cn(className)}>
      {Object.entries(declensionNames).map(([declension, declensionName]) => {
        return <FkInput name={`${name}.${declension}`} label={{ label: declensionName }} className={'mb-6'}
                        key={declension} />;
      })}
    </div>
  );
}
