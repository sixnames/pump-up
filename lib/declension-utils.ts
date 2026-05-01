import { DeclensionEnum } from '@/@types/enums';

export const declensionNames: Record<DeclensionEnum, string> = {
  nominative: 'у Називному відмінку (Хто? / Що?)',
  genitive: 'у Родовий відмінку (Кого? / Чого?)',
  dative: 'у Давальному відмінку (Кому? / Чому?)',
  accusative: 'у Знахідному відмінку (Кого? / Що?)',
  ablative: 'у Орудному відмінку (Ким? / Чим?)',
};
