'use client';
import { SelectDataItem } from '@/@types/common-types';
import { CollectionFormField, getCollectionFieldLabel } from '@/collections/collectionFieldUtils';
import FkCheckbox from '@/components/formik/FkCheckbox';
import FkDatePicker from '@/components/formik/FkDatePicker';
import FkInput from '@/components/formik/FkInput';
import FkSelect from '@/components/formik/FkSelect';
import FkTextarea from '@/components/formik/FkTextarea';
import { alwaysArray } from '@/lib/commonUtils';

interface FKCollectionFormFieldsBuilderProps {
  fields?: CollectionFormField[] | null;
}

export default function FkCollectionFormFieldsBuilder({ fields }: FKCollectionFormFieldsBuilderProps) {
  return (
    <>
      {alwaysArray(fields).map((field, index) => {
        const { name, required, type } = field;
        const label = {
          label: getCollectionFieldLabel(field),
          required,
        };

        if (type === 'text' || type === 'number' || type === 'email') {
          return <FkInput name={name} label={label} key={name} />;
        }

        if (type === 'textarea') {
          return <FkTextarea name={name} label={label} key={name} />;
        }

        if (type === 'date') {
          return <FkDatePicker name={name} label={label} key={name} />;
        }

        if (type === 'checkbox') {
          return <FkCheckbox name={name} label={label.label} key={name} className={'mb-6'} />;
        }

        if (type === 'select') {
          return (
            <FkSelect name={name} label={label} options={alwaysArray(field.options) as SelectDataItem[]} key={index} />
          );
        }

        console.log(type, name, 'not implemented');

        return <div key={index} />;
      })}
    </>
  );
}
