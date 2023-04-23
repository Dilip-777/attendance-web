import department from "@/pages/department";
import { Contractor, Workorder } from "@prisma/client";
import {
  TableCell,
  Paragraph,
  TextRun,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
} from "docx";
import _ from "lodash";
import TableHead from "./tableHead";

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

export function ContractorDetails({ contractor }: { contractor: Contractor }) {
  const contractorheaders = [
    { id: "contractorId", label: "Contractor ID" },
    { id: "contractorname", label: "Contractor Name" },
    { id: "mobilenumber", label: "Mobile Number" },
    { id: "officeaddress", label: "Office Address" },
  ];
  const table = new Table({
    rows: [
      new TableRow({
        children: contractorheaders.map((header) =>
          tableCell(`${header.label}`, true)
        ),
      }),
      new TableRow({
        children: contractorheaders.map((header) =>
          tableCell(`${_.get(contractor, header.id)}`, false)
        ),
      }),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
  return table;
}

export function ServiceDetails({
  workorder,
  date,
}: {
  workorder: Workorder;
  date: string;
}) {
  const serviceheaders = [
    { id: "id", label: "Work Order Id" },
    { id: "nature", label: "Nature of Work" },
    { id: "location", label: "Location" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
  ];
  const table = new Table({
    rows: [
      new TableRow({
        children: [
          ...serviceheaders.map((header) => tableCell(`${header.label}`, true)),
          tableCell("Invoice Date", true),
        ],
      }),
      new TableRow({
        children: [
          ...serviceheaders.map((header) =>
            tableCell(`${_.get(workorder, header.id) || "-"}`, false)
          ),
          tableCell(date, false),
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
