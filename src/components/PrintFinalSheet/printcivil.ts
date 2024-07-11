import { plantname } from "@/constants";
import { Button } from "@mui/material";
import {
  Contractor,
  Deductions,
  Department,
  Designations,
  HOAuditor,
  Safety,
  Stores,
  Workorder,
  payoutTracker,
} from "@prisma/client";
import _ from "lodash";
const ExcelJS = require("exceljs");

const border = {
  top: { style: "thin", color: { argb: "black" } },
  left: { style: "thin", color: { argb: "black" } },
  bottom: { style: "thin", color: { argb: "black" } },
  right: { style: "thin", color: { argb: "black" } },
};

const getRoundOff = (num: number) => {
  return Math.ceil(num);
};

interface d extends Department {
  designations: Designations[];
}

export const handleCivilPrint = async ({
  total,
  contractor,
  workorder,
  month,
  calRows,
  safetAmount,
  storesAmount,
  deduction,
  headcells1,
  headcells2,
  totals,
  hoCommercial,
}: {
  total: number;
  contractor: Contractor;
  workorder: Workorder | undefined;
  month: string;
  calRows: {
    description: string;
    rows: any[];
  }[];

  safetAmount: number;
  storesAmount: number;
  deduction: Deductions | null;
  headcells1: any[];
  headcells2: any[];
  totals: any[];
  hoCommercial: HOAuditor | null;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const response = await fetch("/logo.png");

  const imageBuffer = await response.arrayBuffer();

  const imageId = workbook.addImage({
    buffer: imageBuffer,
    extension: "jpeg",
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 90, height: 90 },
  });

  const border = {
    top: { style: "thin", color: { argb: "black" } },
    left: { style: "thin", color: { argb: "black" } },
    bottom: { style: "thin", color: { argb: "black" } },
    right: { style: "thin", color: { argb: "black" } },
  };

  const headings = [
    {
      header: [plantname],
      colSpan: 10,
      bgcolor: "a3f2fd",
      font: { size: 16, bold: true },
    },
    {
      header: ["CONTRACTOR'S PAYMENT APPROVAL REQUISITION FORM"],
      colSpan: 10,
      bgcolor: "a3f2fd",
      font: { size: 14, bold: true },
    },
    {
      header: [
        "STRATEGIC BUSINESS UNIT",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        contractor.strategicbusinessunit,
      ],
      colSpan: 5,
      bgcolor: "fafafa",
      font: { size: 13, bold: true },
    },
  ];

  function createHeading(heading: any) {
    const headingTextRow = worksheet.addRow(heading.header);
    headingTextRow.height = heading.height || 40;
    if (heading.colSpan === 5) {
      worksheet.mergeCells(
        `A${headingTextRow.number}:G${headingTextRow.number}`
      );
      worksheet.mergeCells(
        `H${headingTextRow.number}:N${headingTextRow.number}`
      );
    } else {
      worksheet.mergeCells(
        `A${headingTextRow.number}:N${headingTextRow.number}`
      );
    }
    headingTextRow.eachCell((cell: any) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = heading.font;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: heading.bgcolor }, // Replace 'FFFF0000' with the desired color code
      };
      cell.border = border;
    });
  }

  headings.forEach((heading) => {
    createHeading(heading);
  });

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Contractor Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  function createDetails(details: any[]) {
    const textrow = worksheet.addRow(details);
    textrow.height = 45;
    textrow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
    });
    // textrow.border = border;
    textrow.eachCell((cell: any) => {
      cell.border = border;
    });
    [
      { s: "A", e: "B" },
      { s: "C", e: "C" },
      { s: "D", e: "E" },
      { s: "F", e: "F" },
      { s: "G", e: "H" },
      { s: "I", e: "J" },
      { s: "K", e: "L" },
      { s: "M", e: "N" },
    ].forEach((cellnumber) => {
      worksheet.mergeCells(
        `${cellnumber.s}${textrow.number}:${cellnumber.e}${textrow.number}`
      );
    });
    [1, 5, 9, 13].forEach((cellnumber) => {
      textrow.getCell(cellnumber).font = {
        bold: true,
        size: 11,
        wrapText: true,
      };
    });
    [3, 7, 11, 15].forEach((cellnumber) => {
      textrow.getCell(cellnumber).font = {
        bold: false,
        size: 11,
        wrapText: true,
      };
    });
  }

  createDetails([
    "Contractor Code",
    "",
    `${contractor.contractorId}`,
    "",
    "Contractor Name",
    "",
    `${contractor.contractorname}`,
    "",
    "Contact NO:",
    "",
    `${contractor.mobilenumber}`,
    "Type of Contractor",
    "",
    `${contractor.typeofcontractor}`,
  ]);

  createDetails([
    "Contractor Address",
    "",
    `${contractor.officeaddress || "-"}`,
    "",
    "GSTIN",
    "",
    `${contractor.gstin || "-"}`,
    "",
    "PAN",
    "",
    `${contractor.pancardno || "-"}`,
    "Area of Work",
    "",
    `${contractor.areaofwork || "-"}`,
  ]);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Work Order Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  const textrow = worksheet.addRow([workorder?.remarks || "-"]);
  textrow.height = 45;
  textrow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
    };
  });
  textrow.eachCell((cell: any) => {
    cell.border = border;
  });

  worksheet.mergeCells(`A${textrow.number}:N${textrow.number}`);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Invoice Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  createDetails([
    "Invoice No",
    "",
    `${hoCommercial?.invoiceNo || "-"}`,
    "",
    "Invoice Date",
    "",
    `${hoCommercial?.date || "-"}`,
    "",
    "Work Order No",
    "",
    `${workorder?.workorderno || "-"}`,
    "",
    "Nature of Work",
    "",
    `${workorder?.nature || "-"}`,
  ]);
  createDetails([
    "Invoice Month",
    "",
    `${hoCommercial?.monthOfInvoice}`,
    "",
    "Date of Invoice Received",
    "",
    `${hoCommercial?.date}`,
    "",
    "Effective Date of contractor",
    "",
    `${hoCommercial?.fromDate}`,
    "",
    "Ending Date of contractor",
    "",
    `${hoCommercial?.toDate}`,
  ]);

  createDetails([
    "GST Compliance's Status - Month",
    "",
    `${month}`,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Total"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 35,
  });

  table({
    worksheet,
    data: totals,
    headcells: headcells1,
    index: 2,
    totals: true,
  });

  calRows.forEach((h, index) => {
    createHeading({
      header: [""],
      height: 30,
    });

    createHeading({
      header: [h.description],
      colSpan: 10,
      bgcolor: "fafafa",
      font: { size: 14, bold: true },
      height: 35,
    });

    table({
      worksheet,
      data: h.rows,
      headcells: headcells2,
      index,
    });
  });

  //   departments?.forEach((department) => {
  //     table({
  //       worksheet,
  //       data: h.data,
  //         headcells: h.headcells,
  //     });
  //   });

  //   totalstable({
  //     createHeading,
  //     worksheet,
  //     departments,
  //     totals: totals,
  //   });

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["FINAL PAYOUT INFORMATION"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 35,
  });

  const finalinfo = [
    ["NET AMOUNT PAYABLE", `${getRoundOff(total)}`],
    [
      "GST Hold (if any)",
      getRoundOff(
        (deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0
      ),
    ],
    ["SAFETY VIOLATION 'S PENALTY", getRoundOff(safetAmount || 0) * -1],
    ["CONSUMABLES/ CHARGABLE ITEMS", getRoundOff(storesAmount || 0) * -1],
    ["ADJUSTMENT OF ADVANCE AMOUNT", getRoundOff(deduction?.advance || 0) * -1],
    [
      "ANY OTHER DEDUCTIONS (IF ANY)",
      getRoundOff(deduction?.anyother || 0),
      deduction?.remarks,
    ],
    ["ANY OTHER ADDITION (IF ANY)", deduction?.addition || 0],
    [
      "FINAL PAYABLE",
      getRoundOff(
        total -
          (safetAmount || 0) -
          (storesAmount || 0) +
          ((deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0) -
          (deduction?.advance || 0) -
          (deduction?.anyother || 0) +
          (deduction?.addition || 0)
      ),
    ],
  ];

  finalinfo.forEach((f) => {
    const row = worksheet.addRow([
      "",
      "",
      "",
      f[2] ?? "",
      "",
      "",
      "",
      f[0],
      "",
      "",
      "",
      f[1],
      "",
      "",
    ]);
    row.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "left",
      };
      cell.border = border;
      cell.font = { size: 11, wrapText: true, bold: true };
    });
    if (f[2]) {
      worksheet.mergeCells(`A${row.number}:C${row.number}`);
      worksheet.mergeCells(`D${row.number}:G${row.number}`);
    } else worksheet.mergeCells(`A${row.number}:G${row.number}`);
    worksheet.mergeCells(`H${row.number}:K${row.number}`);
    worksheet.mergeCells(`L${row.number}:N${row.number}`);
    row.height = 30;
  });

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: [
      " CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR THE CURRENT FINANCIAL YEAR",
    ],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 35,
  });

  createDetails([
    "Cost for the Previous Month -",
    "",
    0,
    "Cost for the Month ( MTD)",
    "",
    0,
    "",
    "Cost upto this Month (YTD)",
    "",
    0,
    "",
    "Cost for the Previous year",
    "",
    0,
  ]);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["PAYEE BANK A/C INFORMATION"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 35,
  });

  createDetails([
    "Beneficiary  Name:",
    "",
    contractor.beneficialname || "-",
    "",
    "Account Number:",
    "",
    contractor.bankaccountnumber || "-",
    "",
    "IFSC Code:",
    contractor.ifscno || "-",
    "",
    "Date of Payment :",
    "",
    "-",
  ]);

  createDetails([
    "Payment Reference No:",
    "",
    "-",
    "",
    "Paid Amount:",
    "",
    "-",
    "",
  ]);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["APPROVAL'S INFORMATION"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 35,
  });

  const approvalheaders = [
    "Prepared & Checked By :",
    "",
    "",
    "Biomax Checked By: ",
    "",
    "Statutory Compliance  (GST & TDS) Checked By: ",
    "",
    "",
    "Department Leader's Approval",
    "",

    "",
    "Top Management Approval",
    "",
    "",
  ];

  const approvalnames1 = [
    "Intiator",
    "",
    "",
    "HR",
    "",
    "Accounts / Taxation",
    "",
    "",
    "HOD",
    "",

    "",
    "Director",
    "Managing Director",
    "",
  ];

  const approvalheaderrow = worksheet.addRow(approvalheaders);
  approvalheaderrow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    cell.border = border;
    cell.font = { size: 10, wrapText: true, bold: true };
  });
  approvalheaderrow.height = 30;
  worksheet.mergeCells(
    `A${approvalheaderrow.number}:C${approvalheaderrow.number}`
  );
  worksheet.mergeCells(
    `D${approvalheaderrow.number}:E${approvalheaderrow.number}`
  );
  worksheet.mergeCells(
    `F${approvalheaderrow.number}:H${approvalheaderrow.number}`
  );
  worksheet.mergeCells(
    `I${approvalheaderrow.number}:K${approvalheaderrow.number}`
  );
  worksheet.mergeCells(
    `L${approvalheaderrow.number}:N${approvalheaderrow.number}`
  );

  const approvalnamerow = worksheet.addRow(approvalnames1);
  approvalnamerow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: "down",
      horizontal: "center",
    };
    cell.border = border;
    cell.font = { size: 10, wrapText: true, bold: true };
  });
  approvalnamerow.height = 200;
  worksheet.mergeCells(`A${approvalnamerow.number}:C${approvalnamerow.number}`);
  worksheet.mergeCells(`D${approvalnamerow.number}:E${approvalnamerow.number}`);
  worksheet.mergeCells(`F${approvalnamerow.number}:H${approvalnamerow.number}`);
  worksheet.mergeCells(`I${approvalnamerow.number}:K${approvalnamerow.number}`);
  worksheet.mergeCells(`M${approvalnamerow.number}:N${approvalnamerow.number}`);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Requested By  Central Processing Team"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 9, bold: true },
    height: 27,
  });

  worksheet.columns.forEach((column: any, index: number) => {
    column.width = 20;
  });

  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finalsheet.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const table = ({
  worksheet,
  data,
  headcells,
  index,
  totals = false,
}: {
  worksheet: any;
  data: any[];
  headcells: {
    label: string;
    id: string;
  }[];
  index: number;
  totals?: boolean;
}) => {
  let heads: any[] = [];
  headcells.forEach((h) => {
    heads.push(h);
    if (["description"].includes(h.id)) {
      heads.push({ id: "", label: "" });
      heads.push({ id: "", label: "" });
      if (totals) {
        heads.push({ id: "", label: "" });
      }
    } else if (["requiredManDays", "netPayable", "taxable"].includes(h.id)) {
      heads.push({ id: "", label: "" });
    }
    if (totals && h.id === "billamount") {
      heads.push({
        id: "",
        label: "",
      });
    }
  });
  const tableheader = worksheet.addRow(heads.map((h) => h.label));

  tableheader.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = border;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "e0e0e0" }, // Replace 'FFFF0000' with the desired color code
    };
  });

  if (totals) {
    worksheet.mergeCells(`B${tableheader.number}:E${tableheader.number}`);
    worksheet.mergeCells(`F${tableheader.number}:G${tableheader.number}`);
    worksheet.mergeCells(`I${tableheader.number}:J${tableheader.number}`);
    worksheet.mergeCells(`L${tableheader.number}:M${tableheader.number}`);
  } else {
    worksheet.mergeCells(`B${tableheader.number}:D${tableheader.number}`);
    worksheet.mergeCells(`H${tableheader.number}:I${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  //   if (index === 0) {
  //     worksheet.mergeCells(`B${tableheader.number}:D${tableheader.number}`);
  //     worksheet.mergeCells(`H${tableheader.number}:D${tableheader.number}`);
  //   }

  //   if (index === 1 && heads.find((h) => h.id === "requiredManDays")) {
  //     worksheet.mergeCells(`E${tableheader.number}:F${tableheader.number}`);
  //     worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  //   }

  tableheader.height = 36;

  data.forEach((s: any, i: number) => {
    const datarow = worksheet.addRow(
      heads.map((h) => {
        return h.id === "id" ? i : s[h.id] ?? "-";
      })
    );
    datarow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = border;
      cell.font = { size: 12, wrapText: true };
    });
    datarow.height = 36;
    // if (index === 0) {
    //   worksheet.mergeCells(`B${datarow.number}:D${datarow.number}`);
    // }

    // if (index === 1 && heads.find((h) => h.id === "requiredManDays")) {
    //   worksheet.mergeCells(`E${datarow.number}:F${datarow.number}`);
    //   worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
    // }
    if (totals) {
      worksheet.mergeCells(`B${datarow.number}:E${datarow.number}`);
      worksheet.mergeCells(`F${datarow.number}:G${datarow.number}`);
      worksheet.mergeCells(`I${datarow.number}:J${datarow.number}`);
      worksheet.mergeCells(`L${datarow.number}:M${datarow.number}`);
    } else {
      worksheet.mergeCells(`B${datarow.number}:D${datarow.number}`);
      worksheet.mergeCells(`H${datarow.number}:I${datarow.number}`);
      worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
    }
  });
};
