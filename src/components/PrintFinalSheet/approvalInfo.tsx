import {
  AlignmentType,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

const tableCell = (text: string, bold: boolean) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: `${text || "-"}`, bold: bold, size: 17 }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 50,
          before: 50,
        },
      }),
    ],
    width: {
      size: 20,
      type: WidthType.PERCENTAGE,
    },
  });
};

export default function ApprovalInformation() {
  const approvalheader = [
    { id: "id", label: "Prepared & Checked By" },
    { id: "nature", label: "C-DARC V/s Biomax Checked By:" },
    { id: "location", label: "Statutory Complaince" },
    { id: "startDate", label: "Department Leader's Approval" },
    { id: "endDate", label: "Top Management Approval" },
  ];
  const table = new Table({
    rows: [
      new TableRow({
        children: [
          ...approvalheader.map((header) => tableCell(`${header.label}`, true)),
        ],
      }),
      new TableRow({
        children: [
          ...[" ", " ", " ", " ", " "].map((header) =>
            tableCell(`${header}`, false)
          ),
        ],
      }),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
  return table;
}
