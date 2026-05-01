import { docxDocumentDefaultStyle, docxSectionDefaultStyle } from '@/lib/word/docxConstants';
import { Document, FileChild, IDocumentDefaultsOptions } from 'docx';

interface GetDocxReportBaseParams {
  children: FileChild[];
  docxDocumentStyle?: IDocumentDefaultsOptions;
}

export function getDocxReportBase({ children, docxDocumentStyle }: GetDocxReportBaseParams) {
  const sections = [
    {
      properties: docxSectionDefaultStyle,
      children,
    },
  ];

  return new Document({
    styles: {
      default: {
        document: docxDocumentStyle || docxDocumentDefaultStyle,
      },
    },
    sections,
  });
}
