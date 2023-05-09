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

export default function TableHead({ department }: { department: string }) {
  const headers = [
    "Designation",
    "Type",
    "Total Man days",
    "Rate",
    "Total Amount",
    "Total Overtime",
    "OT Amount",
    "Total Amount",
    "Service Charge",
    "Service Charge Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];

  const ccmheader = [
    "Designation",
    "Total Man days",
    "Rate",
    "Total Amount",
    "Total Overtime",
    "OT Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];
  const headcells =
    department === "8HR" || department === "12HR" || department === "COLONY"
      ? headers
      : ccmheader;
  return headcells.map(
    (headcell) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${headcell}`,
                bold: true,
                size: 13,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 10,
              before: 10,
            },
          }),
        ],
        width: {
          size: 10,
          type: WidthType.PERCENTAGE,
        },
        margins: {
          top: 100,
          bottom: 100,
          left: 30,
          right: 30,
        },

        columnSpan: 1,
        verticalAlign: VerticalAlign.CENTER,
      })
  );
}
