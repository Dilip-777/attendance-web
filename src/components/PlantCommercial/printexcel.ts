import { plantname } from '@/constants';
import { Button } from '@mui/material';
import { Contractor, Department, Designations, Safety, Stores, Workorder, payoutTracker } from '@prisma/client';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
const ExcelJS = require('exceljs');

function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}

interface d extends Department {
  designations: Designations[];
}

const handleprint = ({
  rows,
  departments,
  contractor,
  month,
  allcounts,
  total,
  netTotal,
  year,
}: {
  rows: any;
  departments: d[];
  contractor: string;
  month: number;
  year: number;
  allcounts: any[];
  total: number;
  netTotal: number;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const headcells = [{ id: 'date', label: 'Date', colspan: 1 }];

  let count = 2;

  departments.forEach((department) => {
    department.designations.forEach((d, i) => {
      if (i === 0) {
        headcells.push({
          id: department.department,
          label: department.department,
          colspan: department.designations.length,
        });
      } else {
        headcells.push({ id: '', label: '', colspan: 0 });
      }
      count++;
    });
  });

  headcells.push({ id: 'total', label: 'Total', colspan: 1 });

  const border = {
    top: { style: 'thin', color: { argb: 'black' } },
    left: { style: 'thin', color: { argb: 'black' } },
    bottom: { style: 'thin', color: { argb: 'black' } },
    right: { style: 'thin', color: { argb: 'black' } },
  };

  const headings = [
    {
      header: [plantname],
      colSpan: count,
      bgcolor: 'a3f2fd',
      font: { size: 16, bold: true },
    },
    {
      header: [`Contractor Name - ${contractor}      Month - ${getMonthName(month)}-${year}`],
      colSpan: count,
      font: { size: 14, bold: true },
    },
  ];

  function createHeading(heading: any) {
    let colspan = heading.colSpan || count;
    let start = 1;
    const headingTextRow = worksheet.addRow(heading.header);
    headingTextRow.height = heading.height || 40;

    while (count / colspan > 1) {
      worksheet.mergeCells(`${headingTextRow.getCell(1).address}:${headingTextRow.getCell(colspan).address}`);

      start = start + colspan;
      colspan = count - colspan;
    }

    worksheet.mergeCells(
      `${headingTextRow.getCell(1).address}:${headingTextRow.getCell(heading.colSpan || count).address}`
    );
    // if (heading.colSpan === 5) {
    //   worksheet.mergeCells(`A${headingTextRow.number}:H${headingTextRow.number}`);
    //   worksheet.mergeCells(`I${headingTextRow.number}:P${headingTextRow.number}`);
    // } else {
    //   worksheet.mergeCells(`A${headingTextRow.number}:P${headingTextRow.number}`);
    // }
    headingTextRow.eachCell((cell: any) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = heading.font;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: heading.bgcolor }, // Replace 'FFFF0000' with the desired color code
      };
      cell.border = border;
    });
  }

  headings.forEach((heading) => {
    createHeading(heading);
  });

  createHeading({
    header: [''],
    height: 30,
  });

  function mergeCellsBasedOnColspan(tableheader: any, headcells: any) {
    let i = 1;
    headcells.forEach((headcell: any) => {
      if (headcell.colspan > 1) {
        worksheet.mergeCells(
          `${tableheader.getCell(i).address}:${tableheader.getCell(i + headcell.colspan - 1).address}`
        );
      }
      //   if()

      i = i + headcell.colspan;
    });
  }

  const tableheader = worksheet.addRow(headcells.map((h) => h.label));

  mergeCellsBasedOnColspan(tableheader, headcells);

  tableheader.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = border;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'e0e0e0' }, // Replace 'FFFF0000' with the desired color code
    };
  });

  const headcells2 = [{ id: 'date', label: '', colspan: 1 }];

  departments.forEach((department) => {
    department.designations.forEach((d) => {
      headcells2.push({ id: d.id, label: d.designation, colspan: 1 });
    });
  });
  headcells2.push({ id: 'total', label: '', colspan: 1 });

  const tableheader2 = worksheet.addRow(headcells2.map((h) => h.label));

  tableheader2.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = border;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'e0e0e0' }, // Replace 'FFFF0000' with the desired color code
    };
  });

  const headcells3 = [
    { label: '', id: 'date' },
    { label: 'Att Count', id: 'attendancecount' },
    { label: 'Amt', id: 'mandaysamount' },
    { label: 'OT Hrs', id: 'othrs' },
    { label: 'OT Amt', id: 'otamount' },
    { label: 'Total', id: 'totalnetamount' },
  ];

  rows.forEach((row: any) => {
    const data = headcells2.map((h) => {
      if (h.id === 'date') {
        return row.date;
      } else if (h.id === 'total') {
        return row.total;
      } else {
        return row[h.id];
      }
    });
    const datarow = worksheet.addRow(data);
    datarow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
      cell.border = border;
      cell.font = { size: 9, wrapText: true };
    });
    datarow.height = 36;
  });

  let c = count;
  while (c >= 9) {
    headcells3.push({ label: '', id: '' });
    c--;
  }

  const tableheader3 = worksheet.addRow([...headcells3.map((h) => h.label), 'ADD 10%', total * 0.1]);
  tableheader3.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = border;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'e0e0e0' }, // Replace 'FFFF0000' with the desired color code
    };
  });

  allcounts.forEach((row: any) => {
    const data = headcells3.map((h) => {
      if (h.id === 'date') {
        return row.date;
      } else if (h.id === 'total') {
        return row.total;
      } else if (h.id === '') {
        return '';
      } else {
        return row[h.id] || 0;
      }
    });

    data.push(row.label);
    data.push(row.value);
    const datarow = worksheet.addRow(data);

    datarow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
      cell.font = { bold: true, size: 11, wrapText: true };
      cell.border = border;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e0e0e0' }, // Replace 'FFFF0000' with the desired color code
      };
    });
  });

  createHeading({
    header: [''],
    height: 30,
  });

  const row = worksheet.addRow([
    'Checked By',
    '',
    'Verified By   8HR',
    '',
    'Verified By   COMM',
    '',
    'Passed By    ED',
    '',
    '',
  ]);
  row.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.font = { bold: true, size: 11, wrapText: true };
    cell.border = border;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'e0e0e0' }, // Replace 'FFFF0000' with the desired color code
    };
  });

  worksheet.mergeCells(`A${row.number}:B${row.number}`);
  worksheet.mergeCells(`C${row.number}:D${row.number}`);
  worksheet.mergeCells(`E${row.number}:F${row.number}`);
  worksheet.mergeCells(`G${row.number}:H${row.number}`);

  //   createHeading({
  //     header: ['FINAL PAYOUT INFORMATION'],
  //     colSpan: 10,
  //     bgcolor: 'fafafa',
  //     font: { size: 14, bold: true },
  //     height: 35,
  //   });

  //   const finalinfo = [
  //     ['NET AMOUNT PAYABLE', `${getRoundOff(total)}`],
  //     ['GST Hold (if any)', 0],
  //     ["SAFETY VIOLATION 'S PENALTY", getRoundOff(safety?.totalAmount || 0)],
  //     ['CONSUMABLES/ CHARGABLE ITEMS', getRoundOff(store?.totalAmount || 0)],
  //     ['ADJUSTMENT OF ADVANCE AMOUNT', 0],
  //     ['ANY OTHER DEDUCTIONS (IF ANY)', 0],
  //     ['FINAL PAYABLE', getRoundOff(total - (safety?.totalAmount || 0) - (store?.totalAmount || 0))],
  //   ];

  //   finalinfo.forEach((f) => {
  //     const row = worksheet.addRow(['', '', '', '', '', '', '', '', f[0], '', '', '', '', f[1], '', '']);
  //     row.eachCell((cell: any) => {
  //       cell.alignment = {
  //         wrapText: true,
  //         vertical: 'middle',
  //         horizontal: 'left',
  //       };
  //       cell.border = border;
  //       cell.font = { size: 11, wrapText: true, bold: true };
  //     });
  //     worksheet.mergeCells(`A${row.number}:H${row.number}`);
  //     worksheet.mergeCells(`I${row.number}:M${row.number}`);
  //     worksheet.mergeCells(`N${row.number}:P${row.number}`);
  //     row.height = 30;
  //   });

  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantcommercialhourly.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

export default handleprint;
