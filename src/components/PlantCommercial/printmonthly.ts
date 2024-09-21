import { plantname } from '@/constants';
import {
  Contractor,
  Department,
  Designations,
  Safety,
  Stores,
  Workorder,
  payoutTracker,
} from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';
const ExcelJS = require('exceljs');

function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}

const getRoundOff = (num: number) => {
  return Math.ceil(num);
};

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
  ot,
  servicecharge,
}: {
  rows: any;
  departments: d[];
  contractor: string;
  month: number;
  allcounts: any[];
  total: number;
  netTotal: number;
  year: number;
  ot: boolean;
  servicecharge: number;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  let count = ot ? 4 : 9;

  const headcells = [
    { id: 'employeeId', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'designation', label: 'Designation', ceil: false },
  ];

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    const date = `${i.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`;
    headcells.push({ id: date, label: i.toString().padStart(2, '0') });
    count++;
  }

  const extraheadcells = [
    { id: 'rate', label: 'Rate' },
    { id: 'amount', label: 'Amount', ceil: true },
    { id: 'othrs', label: 'OT' },
    { id: 'otamount', label: 'OT Amount', ceil: true },
    { id: 'totalamount', label: 'Total Amount', ceil: true },
  ];
  headcells.push({ id: 'total', label: 'Total' });
  if (!ot) headcells.push(...extraheadcells);

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
      header: [
        `Contractor Name - ${contractor}      Month - ${getMonthName(
          month
        )}-${year}`,
      ],
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
      worksheet.mergeCells(
        `${headingTextRow.getCell(1).address}:${
          headingTextRow.getCell(colspan).address
        }`
      );

      start = start + colspan;
      colspan = count - colspan;
    }

    worksheet.mergeCells(
      `${headingTextRow.getCell(1).address}:${
        headingTextRow.getCell(heading.colSpan || count).address
      }`
    );
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

  const tableheader = worksheet.addRow(headcells.map((h) => h.label));

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

  rows.forEach((row: any) => {
    const data = headcells.map((h) => {
      return typeof row[h.id] === 'number' ? getRoundOff(row[h.id]) : row[h.id];
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

  if (!ot) {
    const txamount = total * 0.1 + netTotal;

    const finaldata = [
      {
        label: `Add ${servicecharge || 0}%`,
        value: getRoundOff((total * (servicecharge || 0)) / 100),
      },
      { label: 'Taxable Amount', value: getRoundOff(txamount) },
      { label: 'IGST 18%', value: getRoundOff(txamount * 0.18) },
      { label: 'Total Amount', value: getRoundOff(txamount * 1.18) },
    ];

    finaldata.forEach((row: any) => {
      let data = [];
      while (data.length < count - 5) {
        data.push('');
      }
      // data.push(row.label);
      data.push(...[row.label, '', '', '', row.value]);
      // data.push(row.value);
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
      worksheet.mergeCells(
        `${datarow.getCell(count - 4).address}:${
          datarow.getCell(count - 1).address
        }`
      );
    });
  }
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

  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantcommericalmonthly.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

export default handleprint;
