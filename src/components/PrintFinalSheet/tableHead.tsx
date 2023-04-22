import {
  AlignmentType,
  Paragraph,
  TableCell,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";

interface Headcell {
  id: string;
  label: string;
  colspan?: number;
}

export default function TableHead({ headcells }: { headcells: Headcell[] }) {
  return headcells.map(
    (headcell) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: `${headcell.label}`, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: {
          size: 50,
          type: WidthType.PERCENTAGE,
        },
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100,
        },

        columnSpan: headcell.colspan || 1,
        verticalAlign: VerticalAlign.CENTER,
      })
  );
}
