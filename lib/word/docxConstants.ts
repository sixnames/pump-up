import {
  AlignmentType,
  IBorderOptions,
  IDocumentDefaultsOptions,
  IIndentAttributesProperties,
  ISectionPropertiesOptions,
  ITableBordersOptions,
  Paragraph,
  TextRun,
} from 'docx';

export const docxEmptyParagraph = new Paragraph('');

export const paragraphIndent: IIndentAttributesProperties = {
  firstLine: `12.5mm`,
};

export const docxDocumentDefaultStyle: IDocumentDefaultsOptions = {
  paragraph: {
    alignment: AlignmentType.JUSTIFIED,
    indent: paragraphIndent,
  },
  run: {
    font: 'Times New Roman',
    size: 28,
    language: {
      value: 'uk-UA',
    },
  },
};

export const docxSectionDefaultStyle: ISectionPropertiesOptions = {
  page: {
    margin: {
      top: '20mm',
      right: '10mm',
      bottom: '20mm',
      left: '35mm',
    },
  },
};

export const docxFirsLineNoIndent: IIndentAttributesProperties = {
  firstLine: 0,
};
const noBorderStyle: IBorderOptions = {
  size: 0,
  style: 'none',
};
export const docxNoBordersTableStyle: ITableBordersOptions = {
  top: noBorderStyle,
  bottom: noBorderStyle,
  left: noBorderStyle,
  right: noBorderStyle,
  insideHorizontal: noBorderStyle,
  insideVertical: noBorderStyle,
};

interface GetDocxStringWithLineBreaksParams {
  line: string;
  underline?: boolean | null;
  fontSize: number;
}

export function getDocxStringWithLineBreaks({ line, underline, fontSize }: GetDocxStringWithLineBreaksParams) {
  return line.split('\n').map((text, index) => {
    const isFirst = index === 0;
    const isLast = index === line.length;
    return new TextRun({
      text,
      break: isFirst || isLast ? 0 : 1,
      underline: underline ? {} : undefined,
      size: fontSize * 2,
    });
  });
}
