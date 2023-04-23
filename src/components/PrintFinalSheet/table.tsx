import {
  AlignmentType,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import _ from "lodash";
import TableHead from "./tableHead";

interface side {
  main: string;
  sub?: string;
  id: string;
}

const tableCell = (text: string) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: `${text}`, size: 11 })],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 50,
          before: 50,
        },
      }),
    ],
    width: {
      size: 10,
      type: WidthType.PERCENTAGE,
    },
  });
};

const tableRow = (
  text: string,
  colspan: number,
  length: number,
  value: number
) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "  ", size: 11 })],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 50,
              before: 50,
            },
          }),
        ],
        width: {
          size: 10,
          type: WidthType.PERCENTAGE,
        },
        columnSpan: length,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: `${text}`, size: 13, bold: true })],
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 50,
              before: 50,
            },
          }),
        ],
        width: {
          size: 10,
          type: WidthType.PERCENTAGE,
        },
        columnSpan: colspan,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: `${value}`, size: 11 })],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 50,
              before: 50,
            },
          }),
        ],
        width: {
          size: 10,
          type: WidthType.PERCENTAGE,
        },
      }),
    ],
  });
};

export default function DocTable({
  rows,
  total,
  department,
  safetypenality,
  deduction,
}: {
  rows: any[];
  total: number;
  department: string;
  safetypenality: number;
  deduction: number;
}) {
  const side8hr: side[] = [
    { main: "8MW", sub: "M", id: "m8" },
    { main: "8MW", sub: "F", id: "f8" },
    { main: "20MW", sub: "M", id: "m20" },
    { main: "20MW", sub: "F", id: "f20" },
    { main: "DM", sub: "M", id: "dm" },
    { main: "QC", sub: "M", id: "qc" },
    { main: "Store", sub: "M", id: "store" },
    { main: "K-7", sub: "M", id: "k7m" },
    { main: "K-7", sub: "F", id: "k7f" },
    { main: "RMHS", sub: "M", id: "rmhs" },
    { main: "PS", sub: "F", id: "ps" },
    { main: "HK", sub: "M", id: "hk" },
    { main: "SVR", sub: "M", id: "svr" },
    { main: "TOTAL", sub: " ", id: "total" },
  ];
  const sideccm: side[] = [
    { main: "ELE", id: "ele" },
    { main: "LCO", id: "lco" },
    { main: "TMAN", id: "tman" },
    { main: "FILTER", id: "filter" },
    { main: "PO", id: "po" },
    { main: "BCO", id: "bco" },
    { main: "SRFILTER", id: "srfilter" },
    { main: "INCHARGE", id: "incharge" },
    { main: "MO", id: "mo" },
    { main: "SHIFT INCH", id: "shiftinch" },
    { main: "GC", id: "gc" },
    { main: "SVR", id: "svr" },
    { main: "SBO", id: "sbo" },
    { main: "LMAN", id: "lman" },
    { main: "FORMAN", id: "forman" },
    { main: "TMES SON", id: "tmesson" },
    { main: "LMES", id: "lmes" },
    { main: "JRELE", id: "jrele" },
    { main: "HELPER", id: "helper" },
    { main: "Total", id: "total" },
  ];

  const sidelrf: side[] = [
    { main: "ELE", id: "ele" },
    { main: "FILTER", id: "filter" },
    { main: "SRFILTER", id: "srfilter" },
    { main: "INCHARGE", id: "incharge" },
    { main: "SVR", id: "svr" },
    { main: "LMES", id: "lmes" },
    { main: "HELPER", id: "helper" },
    { main: "Total", id: "total" },
  ];

  const sidecolony: side[] = [
    { main: "Colony", sub: "Male", id: "m" },
    { main: "Colony", sub: "Female", id: "f" },
    { main: "Total", sub: " ", id: "total" },
  ];

  const getHeader = () => {
    switch (department) {
      case "8HR":
        return side8hr;
      case "CCM":
        return sideccm;
      case "LRF":
        return sidelrf;
      case "COLONY":
        return sidecolony;
      default:
        return side8hr;
    }
  };

  const colspan =
    department === "CCM" || department === "LRF" || department === "Colony"
      ? 6
      : 8;

  const table = new Table({
    rows: [
      new TableRow({
        children: TableHead({ department: department }),
      }),
      ...getHeader().map(
        (header) =>
          new TableRow({
            children: header.sub
              ? [
                  tableCell(`${header.main}`),
                  tableCell(`${header.sub}`),
                  ...rows.map((row) =>
                    tableCell(`${Math.floor(_.get(row, header.id))}`)
                  ),
                ]
              : [
                  tableCell(`${header.main}`),
                  ...rows.map((row) =>
                    tableCell(`${Math.floor(_.get(row, header.id))}`)
                  ),
                ],
          })
      ),
      tableRow("Net Amount Payable", 6, colspan, total),
      tableRow("GST Hold", 6, colspan, 0),
      tableRow("Safety Violation Penality", 6, colspan, safetypenality),
      tableRow("Adjustment of Advance Amount", 6, colspan, 0),
      tableRow("Any Other Deductions", 6, colspan, deduction),
      tableRow("Final Payable", 6, colspan, total - safetypenality - deduction),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
  return table;
}
