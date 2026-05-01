import { docxFirsLineNoIndent, docxNoBordersTableStyle } from '@/lib/word/docxConstants';
import {
  AlignmentType,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} from 'docx';
import fs from 'fs';
import path from 'path';

export interface GetDocxSignerParams {
  signerName: string;
  signerRank: string;
  signerPosition: string;
  signerDate: string;
  signerSign?: string | null;
}

export function getDocxSignerRows({
  signerPosition,
  signerRank,
  signerName,
  signerDate,
  signerSign,
}: GetDocxSignerParams): TableRow[] {
  const rankChildren: (TextRun | ImageRun)[] = [new TextRun(signerRank)];
  if (signerSign) {
    rankChildren.push(
      new ImageRun({
        type: 'gif',
        data: fs.readFileSync(path.join(process.cwd(), signerSign.replace('/api/media/file', '/assets/uploads'))),
        transformation: {
          width: 130,
          height: 100,
        },
        floating: {
          zIndex: 5,
          horizontalPosition: {
            relative: HorizontalPositionRelativeFrom.COLUMN,
            align: HorizontalPositionAlign.RIGHT,
            offset: 1000,
          },
          verticalPosition: {
            relative: VerticalPositionRelativeFrom.PARAGRAPH,
            align: VerticalPositionAlign.BOTTOM,
          },
        },
        altText: {
          title: signerName,
          name: signerName,
        },
      }),
    );
  }

  return [
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 100,
            type: 'pct',
          },
          columnSpan: 2,
          children: [
            new Paragraph({
              indent: docxFirsLineNoIndent,
              alignment: AlignmentType.LEFT,
              text: signerPosition,
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: '50%',
          },
          children: [
            new Paragraph({
              indent: docxFirsLineNoIndent,
              alignment: AlignmentType.LEFT,
              children: rankChildren,
            }),
          ],
        }),
        new TableCell({
          width: {
            size: '50%',
          },
          children: [
            new Paragraph({
              indent: docxFirsLineNoIndent,
              alignment: AlignmentType.END,
              text: signerName,
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 100,
            type: 'pct',
          },
          columnSpan: 2,
          children: [
            new Paragraph({
              indent: docxFirsLineNoIndent,
              alignment: AlignmentType.LEFT,
              text: signerDate,
            }),
          ],
        }),
      ],
    }),
  ];
}

export function getDocxSigner(params: GetDocxSignerParams) {
  return new Table({
    width: {
      size: 100,
      type: 'pct',
    },
    borders: docxNoBordersTableStyle,
    rows: getDocxSignerRows(params),
  });
}
