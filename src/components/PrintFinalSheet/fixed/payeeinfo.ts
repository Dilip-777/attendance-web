import { Contractor, HOAuditor, Payments, Workorder } from '@prisma/client';
import dayjs from 'dayjs';

export const payeeInfo = ({
  contractor,
  payment,
  worksheet,
  border,
}: {
  contractor: Contractor;
  payment: Payments | null;
  worksheet: any;
  border: any;
}) => {
  const row1 = [
    'Beneficiary  Name:',
    '',
    contractor.beneficialname || '-',
    '',
    '',
    'Account Number:',
    '',
    contractor.bankaccountnumber || '-',
    '',
    '',
    'IFSC Code:',
    '',
    contractor.ifscno || '-',
    '',
  ];
  const row2 = [
    'Payment Reference No:',
    '',
    payment?.paymentrefno || '-',
    '',
    '',

    'Paid Amount:',
    '',
    payment?.paidamount || 0,
    '',
    '',
    'Date of Payment :',
    '',
    payment?.paymentdate || '-',
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
    { s: 'A', e: 'B' },
    { s: 'C', e: 'E' },
    { s: 'F', e: 'G' },
    { s: 'H', e: 'J' },
    { s: 'K', e: 'L' },
    { s: 'M', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow1.number}:${cellnumber.e}${textrow1.number}`
    );
  });
  [1, 6, 11].forEach((cellnumber) => {
    textrow1.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [3, 8, 13].forEach((cellnumber) => {
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
    { s: 'A', e: 'B' },
    { s: 'C', e: 'E' },
    { s: 'F', e: 'G' },
    { s: 'H', e: 'J' },
    { s: 'K', e: 'L' },
    { s: 'M', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow2.number}:${cellnumber.e}${textrow2.number}`
    );
  });
  [1, 6, 11].forEach((cellnumber) => {
    textrow2.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [3, 8, 13].forEach((cellnumber) => {
    textrow2.getCell(cellnumber).font = {
      bold: false,
      size: 11,
      wrapText: true,
    };
  });
};
