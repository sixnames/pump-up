import { commonFieldConfig } from '@/collections/coomonFieldConfig';
import { alwaysArray, alwaysString } from '@/lib/commonUtils';
import { fieldLabels } from '@/lib/fieldLabels';
import {
  ArrayField,
  CheckboxField,
  DateField,
  Field,
  GroupField,
  NumberField,
  RelationshipField,
  SelectField,
  TextareaField,
  TextField,
} from 'payload';

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

export function EmailsField(params: Omit<BaseFieldParams, 'admin'>): ArrayField {
  return {
    type: 'array',
    defaultValue: [],
    ...params,
    fields: [
      {
        type: 'email',
        name: commonFieldConfig.email,
        label: fieldLabels.email.singular,
        required: true,
      },
    ],
  };
}

export function PhoneField(params: Omit<BaseFieldParams, 'admin'>): ArrayField {
  return {
    type: 'array',
    defaultValue: [],
    ...params,
    fields: [
      {
        type: 'text',
        name: commonFieldConfig.phone,
        label: fieldLabels.phone.singular,
        required: true,
      },
    ],
  };
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
    admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
  },
  {
    name: commonFieldConfig.end,
    label: fieldLabels.end.singular,
    type: 'date',
    admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
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

export const marginTopField: Field = {
  name: commonFieldConfig.marginTop,
  label: fieldLabels.marginTop.singular,
  type: 'number',
  defaultValue: 0,
  max: 3,
  min: 0,
};

export type DayEventFormField =
  | DateField
  | RelationshipField
  | TextField
  | ArrayField
  | NumberField
  | CheckboxField
  | TextareaField
  | SelectField;
