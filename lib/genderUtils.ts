import { GenderEnum } from '@/@types/enums';
import { genderOptions } from '@/lib/options/genderOptions';

export function getDefaultGender(): GenderEnum {
  const option = genderOptions[0];
  return option.value;
}
