import department from "@/pages/department";
import { Contractor, Workorder, payoutTracker } from "@prisma/client";
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

export function CostDetails({
  month,
  previousMonth,
  beforemonth,
  monthvalue,
  previousMonthValue,
  beforeMonthValue,
  previousyearvalue,
}: {
  month: string;
  previousMonth: string;
  beforemonth: string;
  monthvalue: number;
  previousMonthValue: number;
  beforeMonthValue: number;
  previousyearvalue: number;
}) {
  const contractorheaders = [
    { id: "costprevious", label: `Cost of Previous Month - ${previousMonth}` },
    { id: "costofmonth", label: `Cost of the Month - ${beforemonth}` },
    { id: "thismonth", label: `Cost Upto This Month - ${month}` },
    { id: "previousyear", label: "Cost Of the Previous Year" },
  ];
  const table = new Table({
    rows: [
      new TableRow({
        children: contractorheaders.map((header) =>
          tableCell(`${header.label}`, true)
        ),
      }),
      new TableRow({
        children: [
          previousMonthValue,
          beforeMonthValue,
          monthvalue,
          previousyearvalue,
        ].map((value) => tableCell(`${value}`, false)),
      }),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
  return table;
}

export function BankDetails({
  date,
  contractor,
  payouttracker,
}: {
  date: string;
  contractor: Contractor;
  payouttracker: payoutTracker;
}) {
  console.log("payouttracker", payouttracker);

  const bankheaders = [
    { id: "contractorname", label: "Beneficial Name" },
    { id: "bankaccountnumber", label: "Account Number" },
    { id: "ifscno", label: "IFSC Code" },
    { id: "paymentdate", label: "Date of Payment" },
    { id: "referenceno", label: "Payment Refrence No:" },
    { id: "paid", label: "Paid Amount" },
  ];
  const table = new Table({
    rows: [
      new TableRow({
        children: [
          ...bankheaders.map((header) => tableCell(`${header.label}`, true)),
        ],
      }),
      new TableRow({
        children: [
          ...[
            contractor.contractorname,
            contractor.bankaccountnumber,
            contractor.ifscno,
            payouttracker?.month || "-",
            payouttracker?.id || "-",
            payouttracker?.actualpaidoutmoney || 0,
          ].map((header) => tableCell(`${header}`, false)),
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
