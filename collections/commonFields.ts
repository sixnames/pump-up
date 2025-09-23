import { commonFieldConfig } from '@/collections/coomonFieldConfig';
import { alwaysArray, alwaysNumber, alwaysString } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import { ArrayField, CheckboxField, Field, GroupField, TextareaField, TextField } from 'payload';

export const subDocumentIdFields: Field[] = [
  {
    name: commonFieldConfig.id,
    type: 'text',
    admin: {
      hidden: true,
    },
    hooks: {
      afterRead: [
        async ({ siblingData }) => {
          return alwaysString(siblingData?.value);
        },
      ],
    },
  },
  {
    name: commonFieldConfig.value,
    type: 'text',
    admin: {
      hidden: true,
    },
  },
];

export const idField: TextField = {
  name: commonFieldConfig.id,
  type: 'text',
};

export const sortOrderField: Field = {
  name: commonFieldConfig.sortOrder,
  type: 'number',
  label: fieldLabels.sortOrder.singular,
  defaultValue: 1,
  min: 1,
  admin: {
    position: 'sidebar',
  },
};

export const uiSortOrderField: Field = {
  name: commonFieldConfig.uiSortOrder,
  type: 'number',
  label: fieldLabels.uiSortOrder.singular,
  defaultValue: 1,
  min: 1,
  admin: {
    position: 'sidebar',
  },
};

export interface BaseFieldParams {
  label?: string;
  name: string;
  required?: boolean;
  defaultValue?: boolean;
  saveToJWT?: boolean;
  interfaceName?: string;
  admin?: Field['admin'];
}

export interface GroupFieldParams extends Omit<BaseFieldParams, 'admin'> {
  admin?: GroupField['admin'];
}

export interface ArrayFieldParams extends Omit<BaseFieldParams, 'admin'> {
  admin?: ArrayField['admin'];
  labels?: {
    singular: string;
    plural: string;
  };
}

export interface CheckboxFieldParams extends Omit<BaseFieldParams, 'admin'> {
  admin?: CheckboxField['admin'];
  label?: string;
}

export function BooleanField(params: CheckboxFieldParams): CheckboxField {
  return {
    type: 'checkbox',
    ...params,
  };
}

export const DeclensionFields = (required?: boolean): Field[] => [
  {
    type: 'text',
    name: commonFieldConfig.nominative,
    label: fieldLabels.nominative,
    required,
  },
  {
    type: 'text',
    name: commonFieldConfig.genitive,
    label: fieldLabels.genitive,
  },
  {
    type: 'text',
    name: commonFieldConfig.dative,
    label: fieldLabels.dative,
  },
  {
    type: 'text',
    name: commonFieldConfig.accusative,
    label: fieldLabels.accusative,
  },
  {
    type: 'text',
    name: commonFieldConfig.ablative,
    label: fieldLabels.ablative,
  },
];

export function DeclensionNameField(params: GroupFieldParams, required: boolean | undefined = true): [GroupField, Field] {
  return [
    {
      type: 'group',
      ...params,
      interfaceName: 'DeclensionName',
      hooks: {
        beforeChange: [
          async ({ data }) => {
            if (data) {
              const nameString = alwaysString(data.name?.nominative);
              if (data.sortOrder) {
                data.previewName = `${nameString} (${alwaysNumber(data.sortOrder, 0)})`;
                return;
              }
              data.previewName = nameString;
            }
          },
        ],
      },
      fields: DeclensionFields(required),
    },
    {
      name: commonFieldConfig.previewName,
      label: fieldLabels.previewName.singular,
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ];
}

const dateRangeFields: Field[] = [
  {
    name: commonFieldConfig.id,
    type: 'text',
    admin: {
      readOnly: true,
      hidden: true,
    },
  },
  {
    name: commonFieldConfig.start,
    label: fieldLabels.start.singular,
    type: 'date',
  },
  {
    name: commonFieldConfig.end,
    label: fieldLabels.end.singular,
    type: 'date',
  },
];

export function DateRangeField(params: GroupFieldParams): GroupField {
  return {
    type: 'group',
    ...params,
    interfaceName: 'DateRange',
    fields: dateRangeFields,
  };
}

export function DateRangesListField(params: ArrayFieldParams, additionalFields?: Field[]): ArrayField {
  return {
    type: 'array',
    defaultValue: [],
    interfaceName: 'DateRangesList',
    ...params,
    fields: [
      {
        name: commonFieldConfig.id,
        type: 'text',
        required: true,
        admin: {
          readOnly: true,
          hidden: true,
        },
      },
      ...dateRangeFields,
      ...alwaysArray(additionalFields),
    ],
  };
}

export const noteField: TextareaField = {
  name: commonFieldConfig.note,
  type: 'textarea',
  label: fieldLabels.note.singular,
};
