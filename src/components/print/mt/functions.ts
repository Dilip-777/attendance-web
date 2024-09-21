import _ from "lodash";
const ExcelJS = require("exceljs");

export const printFunctions = async ({
  headcells,
  headcells1,
  rows,
}: {
  headcells: any[];
  headcells1: any[];

  rows: any[];
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  headcells.forEach((c, index) => {
    if (index === 0) {
      worksheet.getColumn(2).width = 25;
    } else {
      worksheet.getColumn(index + 2).width = 20;
    }
  });

  const border = {
    top: { style: "thin", color: { argb: "black" } },
    left: { style: "thin", color: { argb: "black" } },
    bottom: { style: "thin", color: { argb: "black" } },
    right: { style: "thin", color: { argb: "black" } },
  };

  let heads: string[] = [];
  headcells1.forEach((head, index) => {
    heads.push(head.label);
    if (index !== 0) {
      heads.push("");
      heads.push("");
    }
  });

  worksheet.addRow("");
  const tableheader1 = worksheet.addRow(["", ...heads]);

  tableheader1.eachCell((cell: any, index: number) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = index !== 1 ? border : {};
    if (index !== 0 && index % 3 === 0) {
      worksheet.mergeCells(
        `${cell.address}:${worksheet.getColumn(index + 2).letter}${cell.row}`
      );
    }
  });

  const tableheader = worksheet.addRow(["", ...headcells.map((h) => h.label)]);

  tableheader.eachCell((cell: any, index: number) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };

    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = index !== 1 ? border : {};
  });

  console.log(headcells, headcells1, rows);

  rows.forEach((row) => {
    const datarow = worksheet.addRow([
      "",
      ...headcells.map((headcell) => headcell.getCell(row) ?? ""),
    ]);
    datarow.eachCell((cell: any, index: number) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: index === 2 ? "left" : "center",
      };
      cell.border = index !== 1 ? border : {};

      cell.font = {
        size: 11,
        wrapText: true,
        bold: row.fontWeight ? true : false,
      };
    });
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
