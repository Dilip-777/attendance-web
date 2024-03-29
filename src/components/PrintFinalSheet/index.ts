import {
  Document,
  HeadingLevel,
  Paragraph,
  Packer,
  TextRun,
  AlignmentType,
} from "docx";
import _ from "lodash";
import DocTable from "./table";
import { ContractorDetails, ServiceDetails } from "./contractordetails";
import {
  Contractor,
  Department,
  Designations,
  Safety,
  Stores,
  Workorder,
  payoutTracker,
} from "@prisma/client";
import { BankDetails, CostDetails } from "./otherDetails";
import dayjs from "dayjs";
import ApprovalInformation from "./approvalInfo";
import { plantname } from "@/constants";
// import { saveAs } from "file-saver";

const getPreviousMonth = (month: string) => {
  const date = dayjs(month, "MM/YYYY");
  const prevMonth = date.subtract(1, "month");
  const prevMonthString = prevMonth.format("MM/YYYY");
  return prevMonthString;
};

export function print(
  rows: any,
  totals: any,
  total: number,
  department: Department | undefined,
  contractor: Contractor,
  workorder: Workorder,
  date: string,
  store: Stores | null,
  safety: Safety | null,
  payouttracker: payoutTracker,
  prevMonthAmount: number,
  prevprevMonthAmount: number,
  prevYearAmount: number,
  designations: Designations[]
) {
  const previousMonth = getPreviousMonth(date);
  const beforemonth = getPreviousMonth(previousMonth);

  let doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: plantname,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 0,
            },
          }),
          new Paragraph({
            text: "Contractor's Payment Approval Sheet",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 250,
            },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Contractor Details", size: 15, bold: true }),
            ],
            spacing: {
              after: 100,
              before: 250,
            },
          }),
          ContractorDetails({ contractor }),
          new Paragraph({
            children: [
              new TextRun({ text: "Service Details", size: 15, bold: true }),
            ],
            spacing: {
              after: 100,
              before: 250,
            },
          }),
          ServiceDetails({ workorder, date }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Department - ${department?.department}`,
                size: 15,
                bold: true,
              }),
            ],
            spacing: {
              after: 100,
              before: 250,
            },
          }),

          DocTable({
            department: department,
            rows: rows,
            total: total,
            safetypenality: safety?.totalAmount || 0,
            deduction: store?.totalAmount || 0,
            designations,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR CURRENT FINANCIAL YEAR",
                size: 15,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100,
              before: 300,
            },
          }),

          CostDetails({
            month: date,
            previousMonth: previousMonth,
            beforemonth: beforemonth,
            monthvalue: total,
            previousMonthValue: prevMonthAmount || 0,
            beforeMonthValue: prevprevMonthAmount || 0,
            previousyearvalue: prevYearAmount || 0,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "BANK ACCOUNT A/C INFORMATION",
                bold: true,
                size: 15,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100,
              before: 300,
            },
          }),

          BankDetails({ date: date, contractor, payouttracker }),

          new Paragraph({
            children: [
              new TextRun({
                text: "APPROVAL'S INFORMATION",
                bold: true,
                size: 15,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 100,
              before: 300,
            },
          }),

          ApprovalInformation(),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "finalsheet.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
