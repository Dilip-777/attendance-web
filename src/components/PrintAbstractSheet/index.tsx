import { plantname } from "@/constants";
import { Button } from "@mui/material";
import {
  Department,
  Designations,
  MeasurementItem,
  Measurement,
} from "@prisma/client";
import _ from "lodash";
import React, { useEffect, useState } from "react";
// const ExcelJS = require("exceljs");
import ExcelJS from "exceljs";

interface worktype extends Measurement {
  workItems: MeasurementItem[];
}

export default function PrintExcel({
  // rows,
  works,
  headcells,
  info,
}: {
  // rows: any[];
  works: worktype[];
  headcells: any[];
  info: { value: string | undefined; label: string }[];
}) {
  const handleExport = () => {
    console.log("exporting");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const border = {
      top: { style: "thin", color: { argb: "black" } },
      left: { style: "thin", color: { argb: "black" } },
      bottom: { style: "thin", color: { argb: "black" } },
      right: { style: "thin", color: { argb: "black" } },
    };

    const headings = [
      {
        header: [plantname],
        colSpan: 5,
        font: { size: 16, bold: true },
      },
    ];

    function createHeading(heading: any) {
      const headingTextRow = worksheet.addRow(heading.header);
      headingTextRow.height = heading.height || 40;
      // if (heading.colSpan === 5) {
      worksheet.mergeCells(
        `A${headingTextRow.number}:K${headingTextRow.number}`
      );
      //   worksheet.mergeCells(
      //     `I${headingTextRow.number}:P${headingTextRow.number}`
      //   );
      // } else {
      //   worksheet.mergeCells(
      //     `A${headingTextRow.number}:P${headingTextRow.number}`
      //   );
      // }
      headingTextRow.eachCell((cell: any) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.font = heading.font;
        cell.border = border;
      });
    }

    headings.forEach((heading) => {
      createHeading(heading);
    });

    // const tableheader = worksheet.addRow(
    //   department?.basicsalary_in_duration === "Monthly"
    //     ? monthlyheader
    //     : hourlyheader
    // );

    info.forEach((i) => {
      const headingTextRow = worksheet.addRow([
        `${i.label} : ${i.value}`,
        " ",
        " ",
      ]);
      worksheet.mergeCells(
        `A${headingTextRow.number}:C${headingTextRow.number}`
      );
      headingTextRow.eachCell((cell: any) => {
        cell.alignment = { vertical: "middle" };
        cell.font = { size: 12, bold: true };
        // cell.border = border;
      });
    });

    createHeading({
      header: ["ABSTRACT SHEET"],
      colSpan: 5,
      font: { size: 14, bold: true },
      height: 35,
    });

    const tableheader = worksheet.addRow(headcells.map((h) => h.label));

    //   let tableheader = worksheet.addRow()

    // headcells.forEach((h) => {

    // })

    // tableheader.eachCell()

    headcells.forEach((cell, index) => {
      // Set the desired width for the column containing the current cell.
      if (cell.width) {
        worksheet.getColumn(index + 1).width = cell.width;
      }
    });

    tableheader.eachCell((cell: any, index) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      cell.font = { bold: true, size: 13, wrapText: true };
      cell.height = 40;
      cell.border = border;
    });

    works.forEach((w, index) => {
      const tablerow = worksheet.addRow(
        headcells.map((h) => _.get(w, h.id, " "))
      );
      tablerow.eachCell((cell: any) => {
        cell.font = { size: 12, wrapText: true, bold: true };
        cell.width = 20;
        cell.border = border;
        cell.height = 40;
      });
      tablerow.height = 30;
      w.workItems.forEach((wi) => {
        const tablerow = worksheet.addRow(
          headcells.map((h) => _.get(wi, h.id, " "))
        );
        tablerow.height = 30;
        tablerow.eachCell((cell: any) => {
          cell.font = { size: 12, wrapText: true };
          // cell.width = 20;
          cell.border = border;
        });
      });
    });

    let totalPrev = 0;
    let totalCurr = 0;
    let totalAmount = 0;

    // Iterate through each item in the works2 array.
    works.forEach((item) => {
      // Iterate through the workItems array of each item and add up the 'prev' values.
      item.workItems.forEach((workItem) => {
        totalPrev += workItem.valueofpreviousBill;
        totalCurr += workItem.valueofcurrentBill;
        totalAmount += workItem.valueofTotalBill;
      });
    });

    const footer = worksheet.addRow([
      "Total Amount",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      totalPrev,
      totalCurr,
      totalAmount,
      " ",
    ]);

    footer.height = 40;

    worksheet.mergeCells(`A${footer.number}:G${footer.number}`);

    footer.eachCell((cell: any) => {
      cell.font = { size: 13, wrapText: true, bold: true };
      cell.border = border;
    });

    createHeading({
      header: [""],
      height: 30,
    });

    createHeading({
      header: [""],
      height: 30,
    });

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
        color="secondary"
        onClick={handleExport}
      >
        Print Excel
      </Button>
    </div>
  );
}
