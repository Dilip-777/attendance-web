import { Contractor } from '@prisma/client';

export const contractorinfo = ({
  contractor,
  worksheet,
  border,
}: {
  contractor: Contractor;
  worksheet: any;
  border: any;
}) => {
  const row1 = [
    'Contractor Code',
    '',
    `${contractor.contractorId}`,
    'Contractor Name',
    '',
    `${contractor.contractorname}`,
    '',
    '',
    'Contact NO:',
    `${contractor.mobilenumber}`,
    '',
    'Type of Contractor',
    `${contractor.typeofcontractor || '-'}`,
    '',
  ];
  const row2 = [
    'Address',
    `${contractor.officeaddress || '-'}`,
    '',
    '',
    '',
    'GSTIN',
    `${contractor.gstin || '-'}`,
    '',

    'PAN',
    `${contractor.pancardno || '-'}`,
    '',
    'Area of Work',
    `${contractor.areaofwork || '-'}`,
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
    { s: 'C', e: 'C' },
    { s: 'D', e: 'E' },
    { s: 'F', e: 'H' },
    { s: 'I', e: 'I' },
    { s: 'J', e: 'K' },
    { s: 'L', e: 'L' },
    { s: 'M', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow1.number}:${cellnumber.e}${textrow1.number}`
    );
  });
  [1, 4, 9, 12].forEach((cellnumber) => {
    textrow1.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [3, 6, 10, 13].forEach((cellnumber) => {
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
    { s: 'B', e: 'E' },
    { s: 'F', e: 'F' },
    { s: 'G', e: 'H' },
    { s: 'I', e: 'I' },
    { s: 'J', e: 'K' },
    { s: 'L', e: 'L' },
    { s: 'M', e: 'N' },
  ].forEach((cellnumber) => {
    worksheet.mergeCells(
      `${cellnumber.s}${textrow2.number}:${cellnumber.e}${textrow2.number}`
    );
  });
  [1, 6, 9, 12].forEach((cellnumber) => {
    textrow2.getCell(cellnumber).font = {
      bold: true,
      size: 11,
      wrapText: true,
    };
  });
  [2, 7, 10, 13].forEach((cellnumber) => {
    textrow2.getCell(cellnumber).font = {
      bold: false,
      size: 11,
      wrapText: true,
    };
  });
};
