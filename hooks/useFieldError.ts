import { useFormikContext } from 'formik';
import get from 'lodash/get';

export default function useFieldError(name: string): boolean {
  const { errors } = useFormikContext();
  const error = get(errors, name);
  return !!error;
}
