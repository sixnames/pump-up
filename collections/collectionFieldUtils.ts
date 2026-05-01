import { alwaysString } from '@/lib/commonUtils';
import {
  ArrayField,
  BlocksField,
  CheckboxField,
  DateField,
  EmailField,
  NamedGroupField,
  NumberField,
  PointField,
  RelationshipField,
  RichTextField,
  SelectField,
  TextareaField,
  TextField,
  UploadField,
} from 'payload';

export type CollectionFormField =
  | TextField
  | NumberField
  | TextareaField
  | EmailField
  | CheckboxField
  | DateField
  | SelectField
  | RelationshipField;

export type NamedFieldType =
  RichTextField
  | UploadField
  | PointField
  | NamedGroupField
  | ArrayField
  | BlocksField
  | CollectionFormField;

export function getCollectionFieldByName(fields: NamedFieldType[], name: string) {
  return fields.find((field) => {
    return field.hasOwnProperty('name') && field.name === name;
  });
}

export function getCollectionFieldLabel(field: NamedFieldType) {
  return alwaysString(field?.label) || `Label not found on ${field.name}`;
}

export function getCollectionFieldLabelByName(fields: NamedFieldType[], name: string) {
  const field = getCollectionFieldByName(fields, name);
  return alwaysString(field?.label) || name;
}
