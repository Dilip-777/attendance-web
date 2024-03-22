import { plantname } from "@/constants";
import { Button } from "@mui/material";
import {
  Contractor,
  Department,
  Designations,
  Safety,
  Stores,
  Workorder,
  payoutTracker,
} from "@prisma/client";
import _ from "lodash";
const ExcelJS = require("exceljs");

const border = {
  top: { style: "thick", color: { argb: "black" } },
  left: { style: "thick", color: { argb: "black" } },
  bottom: { style: "thick", color: { argb: "black" } },
  right: { style: "thick", color: { argb: "black" } },
};

const getRoundOff = (num: number) => {
  return Math.ceil(num);
};

interface d extends Department {
  designations: Designations[];
}

export const handleAutomobileprint = ({
  total,
  contractor,
  workorder,
  month,
  calRows,
}: {
  total: number;
  contractor: Contractor;
  workorder: Workorder | undefined;
  month: string;
  calRows: {
    heading: string;
    headcells: any[];
    data: any[];
  }[];
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const border = {
    top: { style: "thick", color: { argb: "black" } },
    left: { style: "thick", color: { argb: "black" } },
    bottom: { style: "thick", color: { argb: "black" } },
    right: { style: "thick", color: { argb: "black" } },
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
    header: ["Invoice Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  createDetails([
    "Invoice No",
    "",
    `-`,
    "",
    "Invoice Date",
    "",
    `${new Date().toLocaleDateString()}`,
    "",
    "Work Order No",
    "",
    `${workorder?.id || "-"}`,
    "Nature of Work",
    "",
    `${workorder?.nature || "-"}`,
  ]);

  createDetails([
    "Invoice Month",
    "",
    `${month}`,
    "",
    "Date of Invoice Received",
    "",
    "-",
    "",
    "Effective Date of contractor",
    "",
    "-",
    "Ending Date of contractor",
    "",
    `${contractor.expirationDate || "-"}`,
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

  calRows.forEach((h, index) => {
    createHeading({
      header: [""],
      height: 30,
    });
    createHeading({
      header: [h.heading],
      colSpan: 10,
      bgcolor: "fafafa",
      font: { size: 14, bold: true },
      height: 35,
    });
    table({
      worksheet,
      data: h.data,
      headcells: h.headcells,
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
    ["GST Hold (if any)", 0],
    ["SAFETY VIOLATION 'S PENALTY", getRoundOff(0)],
    ["CONSUMABLES/ CHARGABLE ITEMS", getRoundOff(0)],
    ["ADJUSTMENT OF ADVANCE AMOUNT", 0],
    ["ANY OTHER DEDUCTIONS (IF ANY)", 0],
    ["FINAL PAYABLE", getRoundOff(total - 0 - 0)],
  ];

  finalinfo.forEach((f) => {
    const row = worksheet.addRow([
      "",
      "",
      "",
      "",
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
    worksheet.mergeCells(`A${row.number}:G${row.number}`);
    worksheet.mergeCells(`H${row.number}:K${row.number}`);
    worksheet.mergeCells(`L${row.number}:N${row.number}`);
    row.height = 30;
  });

  createHeading({
    header: [""],
    height: 30,
  });

  const monthlyCostHeadcells = [
    { id: "description", label: "Description" },
    { id: "", label: "" },
    { id: "", label: "" },
    { id: "", label: "" },
    { id: "", label: "" },
    { id: "costprev", label: "Cost for the previous Month" },
    { id: "", label: "" },
    { id: "", label: "" },
    { id: "costmonth", label: "Cost for the Month ( MTD)" },
    { id: "", label: "" },
    { id: "", label: "" },
    { id: "costupto", label: "Cost upto this Month (YTD)" },
    { id: "", label: "" },
    { id: "", label: "" },
  ];

  const data = [
    {
      description: "• Hiring Cost Charged In P & L",
      costprev: 0,
      costmonth: 0,
      costupto: total - 0 - 0,
    },
    {
      description: "• HSD consumed (in Ltr.)",
      costprev: 0,
      costmonth: 0,
      costupto: total - 0 - 0,
    },
    {
      description: "• HSD Rate charged (per Ltr.)",
      costprev: 0,
      costmonth: 0,
      costupto: total - 0 - 0,
    },
    {
      description: "• Cost of HSD",
      costprev: 0,
      costmonth: 0,
      costupto: total - 0 - 0,
    },
    {
      description: "• Cost borned (Hiring + HSD) by the Compnay",
      costprev: 0,
      costmonth: 0,
      costupto: total - 0 - 0,
    },
  ];

  createHeading({
    header: [
      "CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR THE CURRENT FINANCIAL YEAR",
    ],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 35,
  });
  table({
    worksheet,
    data,
    headcells: monthlyCostHeadcells,
    index: -1,
  });

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
    "C-DARC V/s Biomax Checked By:",
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

  const approvalnames = [
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
    "",
    "",
    "",
  ];
  [...Array(5)].forEach((_, i) => {
    const row = worksheet.addRow(approvalnames);
    row.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = border;
      cell.font = { size: 10, wrapText: true, bold: true };
    });
    row.height = 30;
    worksheet.mergeCells(`A${row.number}:C${row.number}`);
    worksheet.mergeCells(`D${row.number}:E${row.number}`);
    worksheet.mergeCells(`F${row.number}:H${row.number}`);
    worksheet.mergeCells(`I${row.number}:K${row.number}`);
    worksheet.mergeCells(`L${row.number}:N${row.number}`);
  });

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: [
      "Key Comments Sheet as enclosed (For any comments please use attached sheet only)",
    ],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 9, bold: false },
    height: 27,
  });

  createHeading({
    header: ["Requested By  Central Processing Team"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 9, bold: true },
    height: 27,
  });

  worksheet.columns.forEach((column: any, index: number) => {
    column.width = 20; // Set the width of the first column to 20
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
}: {
  worksheet: any;
  data: any[];
  headcells: {
    label: string;
    id: string;
  }[];
  index: number;
}) => {
  let heads: any[] = [];
  headcells.forEach((h) => {
    heads.push(h);
    if (index === 0 || index === 1) {
      if (["running", "billamount", "netamount"].includes(h.id))
        heads.push({ id: "", label: "" });
    }
    if (index === 2) {
      if (
        ["avgMileage", "mileagefortheMonth", "breakDownDaysCounted"].includes(
          h.id
        )
      )
        heads.push({ id: "", label: "" });
    }
    if (index === 3) {
      if (["vehicleType", "netamount"].includes(h.id))
        heads.push({ id: "", label: "" });
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

  if (index === 0 || index === 1) {
    worksheet.mergeCells(`F${tableheader.number}:G${tableheader.number}`);
    worksheet.mergeCells(`J${tableheader.number}:K${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  if (index === 2) {
    worksheet.mergeCells(`C${tableheader.number}:D${tableheader.number}`);
    worksheet.mergeCells(`K${tableheader.number}:L${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  if (index === 3) {
    worksheet.mergeCells(`B${tableheader.number}:C${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  if (index === -1) {
    worksheet.mergeCells(`A${tableheader.number}:E${tableheader.number}`);
    worksheet.mergeCells(`F${tableheader.number}:H${tableheader.number}`);
    worksheet.mergeCells(`I${tableheader.number}:K${tableheader.number}`);
    worksheet.mergeCells(`L${tableheader.number}:N${tableheader.number}`);
  }

  tableheader.height = 36;

  data.forEach((s: any) => {
    if (index === 0 || index === 1) {
      const datarow1 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === "running") {
            return "HRS";
          } else if (i !== 0 && heads[i - 1].id === "running") {
            return s.running.hrs || 0;
          } else {
            return "";
          }
        })
      );
      const datarow2 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === "running") {
            return "Days";
          } else if (i !== 0 && heads[i - 1].id === "running") {
            return s.running.days || 0;
          } else {
            return s[h.id] ?? "-";
          }
        })
      );
      const datarow3 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === "running") {
            return "KMS";
          } else if (i !== 0 && heads[i - 1].id === "running") {
            return s.running.kms || 0;
          } else {
            return "";
          }
        })
      );

      const datarow4 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === "running") {
            return "Trips";
          } else if (i !== 0 && heads[i - 1].id === "running") {
            return s.running.trips || 0;
          } else {
            return "";
          }
        })
      );

      datarow1.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thick", color: { argb: "black" } },
          left: { style: "thick", color: { argb: "black" } },
          right: { style: "thick", color: { argb: "black" } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      datarow2.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          left: { style: "thick", color: { argb: "black" } },
          right: { style: "thick", color: { argb: "black" } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      datarow3.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          left: { style: "thick", color: { argb: "black" } },
          right: { style: "thick", color: { argb: "black" } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      datarow4.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          left: { style: "thick", color: { argb: "black" } },
          right: { style: "thick", color: { argb: "black" } },
          bottom: { style: "thick", color: { argb: "black" } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      [datarow1, datarow2, datarow3, datarow4].forEach((r) => {
        if (index === 0 || index === 1) {
          // worksheet.mergeCells(`F${r.number}:G${r.number}`);
          worksheet.mergeCells(`J${r.number}:K${r.number}`);
          worksheet.mergeCells(`M${r.number}:N${r.number}`);
        }
      });
    } else {
      const datarow = worksheet.addRow(
        heads.map((h) => {
          return s[h.id] ?? "-";
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
      if (index === 2) {
        worksheet.mergeCells(`C${datarow.number}:D${datarow.number}`);
        worksheet.mergeCells(`K${datarow.number}:L${datarow.number}`);
        worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
      }
      if (index === 3) {
        worksheet.mergeCells(`B${datarow.number}:C${datarow.number}`);
        worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
      }
      if (index === -1) {
        worksheet.mergeCells(`A${datarow.number}:E${datarow.number}`);
        worksheet.mergeCells(`F${datarow.number}:H${datarow.number}`);
        worksheet.mergeCells(`I${datarow.number}:K${datarow.number}`);
        worksheet.mergeCells(`L${datarow.number}:N${datarow.number}`);
      }
    }
    // datarow1.height = 30;
    // datarow2.height = 30;
  });
};

const totalstable = ({
  createHeading,
  worksheet,
  totals,
  departments,
}: {
  createHeading: ({
    header,
    colSpan,
    bgcolor,
    font,
    height,
  }: {
    header: string[];
    colSpan?: number;
    bgcolor?: string;
    font?: any;
    height: number;
  }) => void;
  worksheet: any;
  totals: any;
  departments: d[];
}) => {
  createHeading({
    header: [""],
    height: 30,
  });
  createHeading({
    header: ["Total"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  const headers = [
    "Total Man days",
    "Man Days Amount",
    "Overtime Hrs.",
    "OT Amount",
    "Total Amount",
    "Service Charge Rate",
    "Service Charge Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];

  const tableheader = worksheet.addRow(["Department", "", "", "", ...headers]);

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

  // worksheet.mergeCells(`A${tableheader.number}:B${tableheader.number}`);

  departments.forEach((s) => {
    const data: any[] = [s.department, "", "", ""];
    // const data: any[] = [s.main];
    // data.push(s.sub || "-");
    headers.forEach((h) => {
      data.push(getRoundOff(_.get(totals, [h, s.department]) || 0));
    });

    // data.push(
    //   department.designations.find((d: any) => d.designationid === s.id)
    //     ?.allowed_wrking_hr_per_day || "-"
    // );
    // const restdata = totals.map((r: any) => {
    //   return getRoundOff(_.get(r, s.id, "-"));
    // });

    const datarow = worksheet.addRow(data);
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
    worksheet.mergeCells(`A${datarow.number}:D${datarow.number}`);
    // if (department?.basicsalary_in_duration === "Monthly") {
    //   worksheet.mergeCells(`A${datarow.number}:B${datarow.number}`);
    //   //   worksheet.mergeCells(`D${datarow.number}:E${datarow.number}`);
    //   //   worksheet.mergeCells(`H${datarow.number}:I${datarow.number}`);
    //   worksheet.mergeCells(`M${datarow.number}:P${datarow.number}`);
    // }
  });
  worksheet.mergeCells(`A${tableheader.number}:D${tableheader.number}`);
};
