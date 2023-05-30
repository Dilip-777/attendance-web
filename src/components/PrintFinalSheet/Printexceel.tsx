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
import React, { useEffect, useState } from "react";
const ExcelJS = require("exceljs");

export default function PrintExcel({
  rows,
  total,
  department,
  contractor,
  workorder,
  date,
  store,
  safety,
  payouttracker,
  prevMonthAmount,
  prevprevMonthAmount,
  prevYearAmount,
  designations,
  month,
}: {
  rows: any[];
  total: number;
  department: Department | undefined;
  contractor: Contractor;
  workorder: Workorder | undefined;
  date: string;
  store: Stores | null;
  safety: Safety | null;
  payouttracker: payoutTracker;
  prevMonthAmount: number;
  prevprevMonthAmount: number;
  prevYearAmount: number;
  designations: Designations[];
  month: string;
}) {
  const handleExport = () => {
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
        header: ["Plant One"],
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
          "RTTTT",
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
          `A${headingTextRow.number}:H${headingTextRow.number}`
        );
        worksheet.mergeCells(
          `I${headingTextRow.number}:P${headingTextRow.number}`
        );
      } else {
        worksheet.mergeCells(
          `A${headingTextRow.number}:P${headingTextRow.number}`
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

    // const textrow = worksheet.addRow([
    //   "test",
    //   "test",
    //   "test",
    //   "tesdfkvjndvjndivndjvndjvndfjnt",
    //   "tesgfbkjrnbvirmvidcvmehucvehcneicnt",
    // ]);
    // textrow.height = 45;
    // worksheet.mergeCells(`A${textrow.number}:C${textrow.number}`);
    // textrow.eachCell((cell: any) => {
    //   cell.alignment = { wrapText: true };
    // });
    // // worksheet.mergeCells(`D${textrow.number}:F${textrow.number}`);

    // // Add the first table to the worksheet
    // table1Data.forEach((row) => {
    //   worksheet.addRow(row);
    //   worksheet.getRow(rownumber).border = border

    //   rownumber = rownumber + 1;
    // });

    // Add a blank row between tables
    // worksheet.addRow([]);
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
        { s: "C", e: "D" },
        { s: "E", e: "F" },
        { s: "G", e: "H" },
        { s: "I", e: "J" },
        { s: "K", e: "L" },
        { s: "M", e: "N" },
        { s: "O", e: "P" },
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
      // textrow.getCell(1).font = { bold: true, size: 14, wrapText: true };
      // textrow.getCell(5).font = { bold: false, size: 14, wrapText: true };
      // textrow.getCell(9).font = { bold: true, size: 14, wrapText: true };
      // textrow.getCell(13).font = { bold: false, size: 14, wrapText: true };
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
      "",
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
      "",
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
      "",
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
      "",
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
      "",
    ]);

    createHeading({
      header: [""],
      height: 30,
    });

    createHeading({
      header: ["Billing Information"],
      colSpan: 10,
      bgcolor: "fafafa",
      font: { size: 14, bold: true },
      height: 40,
    });

    createHeading({
      header: [""],
      height: 30,
    });

    const hourlyheader = [
      "Category",
      "Type",
      "Shift Hours",
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

    const monthlyheader = [
      "Category",
      "",
      "Shift Hours",
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
      "",
    ];

    const tableheader = worksheet.addRow(
      department?.basicsalary_in_duration === "Monthly"
        ? monthlyheader
        : hourlyheader
    );

    if (department?.basicsalary_in_duration === "Monthly") {
      worksheet.mergeCells(`A${tableheader.number}:B${tableheader.number}`);
      //   worksheet.mergeCells(`D${tableheader.number}:E${tableheader.number}`);
      //   worksheet.mergeCells(`H${tableheader.number}:I${tableheader.number}`);
      worksheet.mergeCells(`M${tableheader.number}:P${tableheader.number}`);
    }

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

    sidebar.forEach((s) => {
      const data: any[] = [s.main];
      data.push(s.sub || "-");
      data.push(
        designations.find((d) => d.designationid === s.id)
          ?.allowed_wrking_hr_per_day || "-"
      );
      const restdata = rows.map((r) => {
        return _.get(r, s.id, "-");
      });

      const datarow = worksheet.addRow([...data, ...restdata]);
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
      if (department?.basicsalary_in_duration === "Monthly") {
        worksheet.mergeCells(`A${datarow.number}:B${datarow.number}`);
        //   worksheet.mergeCells(`D${datarow.number}:E${datarow.number}`);
        //   worksheet.mergeCells(`H${datarow.number}:I${datarow.number}`);
        worksheet.mergeCells(`M${datarow.number}:P${datarow.number}`);
      }
    });

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
      ["NET AMOUNT PAYABLE", `${total}`],
      ["GST Hold (if any)", 0],
      ["SAFETY VIOLATION 'S PENALTY", safety?.totalAmount || 0],
      ["CONSUMABLES/ CHARGABLE ITEMS", store?.totalAmount || 0],
      ["ADJUSTMENT OF ADVANCE AMOUNT", 0],
      ["ANY OTHER DEDUCTIONS (IF ANY)", 0],
      [
        "FINAL PAYABLE",
        total - (safety?.totalAmount || 0) - (store?.totalAmount || 0),
      ],
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
        "",
        f[0],
        "",
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
      worksheet.mergeCells(`A${row.number}:H${row.number}`);
      worksheet.mergeCells(`I${row.number}:M${row.number}`);
      worksheet.mergeCells(`N${row.number}:P${row.number}`);
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
      prevMonthAmount || 0,
      "",
      "Cost for the Month ( MTD)",
      "",
      prevprevMonthAmount || 0,
      "",
      "Cost upto this Month (YTD)",
      "",
      total - (safety?.totalAmount || 0) - (store?.totalAmount || 0),
      "",
      "Cost for the Previous year",
      "",
      prevYearAmount || 0,
    ]);

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
      "",
      contractor.ifscno || "-",
      "",
      "Date of Payment :",
      "",
      payouttracker?.month || "-",
    ]);

    createDetails([
      "Payment Refrence No:",
      "",
      payouttracker?.id || "-",
      "",
      "Paid Amount:",
      "",
      payouttracker?.amount || "-",
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
      "",
      "Top Management Approval",
      "",
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
      `I${approvalheaderrow.number}:L${approvalheaderrow.number}`
    );
    worksheet.mergeCells(
      `M${approvalheaderrow.number}:P${approvalheaderrow.number}`
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
      worksheet.mergeCells(`I${row.number}:L${row.number}`);
      worksheet.mergeCells(`M${row.number}:P${row.number}`);
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

    // Add the second table to the worksheet
    // table2Data.forEach((row) => {
    //   worksheet.addRow(row);

    //   worksheet.getRow(rownumber).border = {
    //     top: { style: "thick", color: { argb: "black" } },
    //     left: { style: "thick", color: { argb: "black" } },
    //     bottom: { style: "thick", color: { argb: "black" } },
    //     right: { style: "thick", color: { argb: "black" } },
    //   };
    //   rownumber = rownumber + 1;
    // });

    // worksheet.getRow(6).border = {
    //   top: { style: "thick", color: { argb: "black" } },
    //   left: { style: "thick", color: { argb: "black" } },
    //   bottom: { style: "thick", color: { argb: "black" } },
    //   right: { style: "thick", color: { argb: "black" } },
    // };

    // Save the workbook as an Excel file
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

  return (
    <div>
      {/* <button onClick={handleExport}>Export Excel</button> */}
      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={handleExport}
      >
        Print Excel
      </Button>
    </div>
  );
}
