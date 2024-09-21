import { Contractor, HOAuditor, Workorder } from '@prisma/client';
import dayjs from 'dayjs';

export const invoiceInfo = ({
  hoCommercial,
  workorder,
  worksheet,
  border,
}: {
  hoCommercial: HOAuditor | null;
  workorder?: Workorder;
  worksheet: any;
  border: any;
}) => {
  const row1 = [
    'Invoice No',
    `${hoCommercial?.invoiceNo || '-'}`,

    'Invoice Date',
    '',
    '',
    `${hoCommercial?.date || '-'}`,
    'Work Order No',
    '',
    `${workorder?.workorderno || '-'}`,
    '',
    '',
    'Nature of Work',
    `${workorder?.nature || '-'}`,
    '',
  ];
  const row2 = [
    'Invoice Month',
    `${dayjs(hoCommercial?.monthOfInvoice, 'DD/MM/YYYY').format('MMM-YYYY')}`,
    'Date of Invoice Received',
    '',
    '',
    `${hoCommercial?.date}`,
    'Effective Date of contractor',
    '',
    `${hoCommercial?.fromDate}`,
    '',

    '',
    'Ending Date of contractor',
    `${hoCommercial?.toDate}`,
    '',
  ];

  // Rows1

  const textrow1 = worksheet.addRow(row1);
  textrow1.height = 45;
  textrow1.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
  });
  textrow1.eachCell((cell: any) => {
    cell.border = border;
  });
  [
    { s: 'A', e: 'A' },
    { s: 'B', e: 'B' },
    { s: 'C', e: 'E' },
    { s: 'F', e: 'F' },
    { s: 'G', e: 'H' },
    { s: 'I', e: 'K' },
    { s: 'L', e: 'L' },
    { s: 'M', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow1.number}:${cellnumber.e}${textrow1.number}`
    );
  });
  [1, 3, 7, 12].forEach((cellnumber) => {
    textrow1.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [2, 6, 9, 13].forEach((cellnumber) => {
    textrow1.getCell(cellnumber).font = {
      bold: false,
      size: 11,
      wrapText: true,
    };
  });
  // Rows2

  const textrow2 = worksheet.addRow(row2);
  textrow2.height = 45;
  textrow2.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
  });
  textrow2.eachCell((cell: any) => {
    cell.border = border;
  });
  [
    { s: 'A', e: 'A' },
    { s: 'B', e: 'B' },
    { s: 'C', e: 'E' },
    { s: 'F', e: 'F' },
    { s: 'G', e: 'H' },
    { s: 'I', e: 'K' },
    { s: 'L', e: 'L' },
    { s: 'M', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow2.number}:${cellnumber.e}${textrow2.number}`
    );
  });
  [1, 3, 7, 12].forEach((cellnumber) => {
    textrow2.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [2, 6, 9, 13].forEach((cellnumber) => {
    textrow2.getCell(cellnumber).font = {
      bold: false,
      size: 11,
      wrapText: true,
    };
  });
};
