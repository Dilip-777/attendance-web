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
import { Department, Designations } from "@prisma/client";

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
  designations,
}: {
  rows: any[];
  total: number;
  department: Department | undefined;
  safetypenality: number;
  deduction: number;
  designations: Designations[];
}) {
  const sidebar = designations
    .filter((d) => d.departmentname === department?.department)
    .map((d) => {
      if (d.gender === "Male")
        return { main: d.designation, sub: "M", id: d.designationid };
      else if (d.gender === "Female")
        return { main: d.designation, sub: "F", id: d.designationid };
      else return { main: d.designation, id: d.designationid };
    });

  if (department?.basicsalary_in_duration?.toLowerCase() === "hourly") {
    sidebar.push({ main: "Total", sub: " ", id: "total" });
  } else {
    sidebar.push({ main: "Total", id: "total" });
  }

  const colspan =
    department?.basicsalary_in_duration?.toLowerCase() === "monthly" ? 5 : 9;

  const rowspan = 6;

  const table = new Table({
    rows: [
      new TableRow({
        children: TableHead({ department: department }),
      }),
      ...sidebar.map(
        (header) =>
          new TableRow({
            children: header.sub
              ? [
                  tableCell(`${header.main}`),
                  tableCell(`${header.sub}`),
                  ...rows.map((row) =>
                    tableCell(
                      `${Math.round(_.get(row, header.id) * 100) / 100}`
                    )
                  ),
                ]
              : [
                  tableCell(`${header.main}`),
                  ...rows.map((row) =>
                    tableCell(
                      `${Math.round(_.get(row, header.id) * 100) / 100}`
                    )
                  ),
                ],
          })
      ),
      tableRow("Net Amount Payable", 5, colspan, total),
      tableRow("GST Hold", 5, colspan, 0),
      tableRow("Safety Violation Penality", 5, colspan, safetypenality),
      tableRow("Adjustment of Advance Amount", 5, colspan, 0),
      tableRow("Any Other Deductions", 5, colspan, deduction),
      tableRow("Final Payable", 5, colspan, total - safetypenality - deduction),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
  return table;
}
