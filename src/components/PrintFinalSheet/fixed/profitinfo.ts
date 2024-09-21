import { Contractor, HOAuditor, Workorder } from '@prisma/client';
import dayjs from 'dayjs';

export const profitInfor = ({
  row,
  worksheet,
  border,
}: {
  row: any[];
  worksheet: any;
  border: any;
}) => {
  const textrow1 = worksheet.addRow(row);
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
    { s: 'C', e: 'C' },
    { s: 'D', e: 'E' },
    { s: 'F', e: 'G' },
    { s: 'H', e: 'I' },
    { s: 'J', e: 'K' },
    { s: 'L', e: 'M' },
    { s: 'N', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow1.number}:${cellnumber.e}${textrow1.number}`
    );
  });
  [1, 4, 8, 12].forEach((cellnumber) => {
    textrow1.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [3, 6, 10, 14].forEach((cellnumber) => {
    textrow1.getCell(cellnumber).font = {
      bold: false,
      size: 11,
      wrapText: true,
    };
  });
};
