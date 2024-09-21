import _ from "lodash";
const ExcelJS = require("exceljs");

export const printContractorwise = async ({
  headcells,
  rows,
}: {
  headcells: any[];
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

  worksheet.addRow("");
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

  rows.forEach((row) => {
    const datarow = worksheet.addRow([
      "",
      ...headcells.map((headcell) => row[headcell.id] ?? ""),
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
