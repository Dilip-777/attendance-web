import { plantname } from '@/constants';
import { Button } from '@mui/material';
import {
  Contractor,
  Deductions,
  Department,
  Designations,
  HOAuditor,
  Payments,
  Safety,
  Stores,
  Workorder,
  payoutTracker,
} from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
const ExcelJS = require('exceljs');

const border = {
  top: { style: 'thin', color: { argb: 'black' } },
  left: { style: 'thin', color: { argb: 'black' } },
  bottom: { style: 'thin', color: { argb: 'black' } },
  right: { style: 'thin', color: { argb: 'black' } },
};

const getRoundOff = (num: number) => {
  return parseFloat(num.toFixed(2));
};

interface d extends Department {
  designations: Designations[];
}

export const printMonthly = async ({
  rows,
  total,
  departments,
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
  totals,
  deduction,
  hoCommercial,
  payment,
}: {
  rows: any;
  total: number;
  departments: d[];
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
  totals: any;
  deduction: Deductions | null;
  hoCommercial: HOAuditor | null;
  payment: Payments | null;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const response = await fetch('/logo.png');

  const imageBuffer = await response.arrayBuffer();

  const imageId = workbook.addImage({
    buffer: imageBuffer,
    extension: 'jpeg',
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 90, height: 90 },
  });

  const border = {
    top: { style: 'thin', color: { argb: 'black' } },
    left: { style: 'thin', color: { argb: 'black' } },
    bottom: { style: 'thin', color: { argb: 'black' } },
    right: { style: 'thin', color: { argb: 'black' } },
  };

  const headings = [
    {
      header: [plantname],
      colSpan: 10,
      bgcolor: 'a3f2fd',
      font: { size: 16, bold: true },
    },
    {
      header: ["CONTRACTOR'S PAYMENT APPROVAL REQUISITION FORM"],
      colSpan: 10,
      bgcolor: 'a3f2fd',
      font: { size: 14, bold: true },
    },
    {
      header: [
        'STRATEGIC BUSINESS UNIT',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        contractor.strategicbusinessunit,
      ],
      colSpan: 5,
      bgcolor: 'fafafa',
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
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['Contractor Information'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 40,
  });

  function createDetails(details: any[]) {
    const textrow = worksheet.addRow(details);
    textrow.height = 45;
    textrow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
    });
    // textrow.border = border;
    textrow.eachCell((cell: any) => {
      cell.border = border;
    });
    [
      { s: 'A', e: 'B' },
      { s: 'C', e: 'D' },
      { s: 'E', e: 'F' },
      { s: 'G', e: 'H' },
      { s: 'I', e: 'J' },
      { s: 'K', e: 'L' },
      { s: 'M', e: 'N' },
      { s: 'O', e: 'P' },
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
    'Contractor Code',
    '',
    `${contractor.contractorId}`,
    '',
    'Contractor Name',
    '',
    `${contractor.contractorname}`,
    '',
    'Contact NO:',
    '',
    `${contractor.mobilenumber}`,
    '',
    'Type of Contractor',
    '',
    `${contractor.typeofcontractor}`,
  ]);

  createDetails([
    'Contractor Address',
    '',
    `${contractor.officeaddress || '-'}`,
    '',
    'GSTIN',
    '',
    `${contractor.gstin || '-'}`,
    '',
    'PAN',
    '',
    `${contractor.pancardno || '-'}`,
    '',
    'Area of Work',
    '',
    `${contractor.areaofwork || '-'}`,
  ]);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['Work Order Information'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 40,
  });

  const textrow = worksheet.addRow([workorder?.remarks || '-']);
  textrow.height = 45;
  textrow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
    };
  });
  textrow.eachCell((cell: any) => {
    cell.border = border;
  });

  worksheet.mergeCells(`A${textrow.number}:P${textrow.number}`);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['Invoice Information'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 40,
  });

  createDetails([
    'Invoice No',
    '',
    `${hoCommercial?.invoiceNo || '-'}`,
    '',
    'Invoice Date',
    '',
    `${hoCommercial?.date || '-'}`,
    '',
    'Work Order No',
    '',
    `${workorder?.workorderno || '-'}`,
    '',
    'Nature of Work',
    '',
    `${workorder?.nature || '-'}`,
  ]);
  createDetails([
    'Invoice Month',
    '',
    `${hoCommercial?.monthOfInvoice || '-'}`,
    '',
    'Date of Invoice Received',
    '',
    `${hoCommercial?.date || '-'}`,
    '',
    'Effective Date of contractor',
    '',
    `${hoCommercial?.fromDate || '-'}`,
    '',
    'Ending Date of contractor',
    '',
    `${hoCommercial?.toDate || '-'}`,
  ]);

  createDetails([
    "GST Compliance's Status - Month",
    '',
    `${hoCommercial?.monthOfInvoice || '-'}`,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['Billing Information'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 40,
  });

  departments?.forEach((department) => {
    table({
      createHeading,
      worksheet,
      department,
      rows: rows[department.department],
    });
  });

  totalstable({
    createHeading,
    worksheet,
    departments,
    totals: totals,
  });

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['FINAL PAYOUT INFORMATION'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 35,
  });

  let numbers: number[] = [];

  const finalinfo = [
    ['NET AMOUNT PAYABLE', `${getRoundOff(total)}`],
    [
      'GST Hold (if any)',
      getRoundOff(
        (deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0
      ),
    ],
    ["SAFETY VIOLATION 'S PENALTY", getRoundOff(safety?.totalAmount || 0)],
    ['CONSUMABLES/ CHARGABLE ITEMS', getRoundOff(store?.totalAmount || 0)],
    ['ADJUSTMENT OF ADVANCE AMOUNT', getRoundOff(deduction?.advance || 0)],
    [
      'ANY OTHER DEDUCTIONS (IF ANY)',
      getRoundOff(deduction?.anyother || 0),
      deduction?.remarks,
    ],
    ['ANY OTHER ADDITION (IF ANY)', deduction?.addition || 0],
    [
      'FINAL PAYABLE',
      getRoundOff(
        total -
          (safety?.totalAmount || 0) -
          (store?.totalAmount || 0) +
          ((deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0) -
          (deduction?.advance || 0) -
          (deduction?.anyother || 0)
      ),
    ],
  ];

  finalinfo.forEach((f) => {
    const row = worksheet.addRow([
      '',
      '',
      '',
      '',
      f[2] ?? '',
      '',
      '',
      '',
      f[0],
      '',
      '',
      '',
      '',
      f[1],
      '',
      '',
    ]);
    row.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'left',
      };
      cell.border = border;
      cell.font = { size: 11, wrapText: true, bold: true };
    });
    numbers.push(row.number);
    // if (f[2]) {
    //   worksheet.mergeCells(`A${row.number}:D${row.number}`);
    //   worksheet.mergeCells(`E${row.number}:H${row.number}`);
    // } else worksheet.mergeCells(`A${row.number}:H${row.number}`);
    worksheet.mergeCells(`I${row.number}:M${row.number}`);
    worksheet.mergeCells(`N${row.number}:P${row.number}`);
    row.height = 30;
  });

  worksheet.mergeCells(`A${numbers[0]}:H${numbers[numbers.length - 1]}`);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: [
      ' CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR THE CURRENT FINANCIAL YEAR',
    ],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 35,
  });

  createDetails([
    'Cost for the Previous Month -',
    '',
    prevMonthAmount || 0,
    '',
    'Cost for the Month ( MTD)',
    '',
    prevprevMonthAmount || 0,
    '',
    'Cost upto this Month (YTD)',
    '',
    total - (safety?.totalAmount || 0) - (store?.totalAmount || 0),
    '',
    'Cost for the Previous year',
    '',
    prevYearAmount || 0,
  ]);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['PAYEE BANK A/C INFORMATION'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 35,
  });

  createDetails([
    'Beneficiary  Name:',
    '',
    contractor.beneficialname || '-',
    '',
    'Account Number:',
    '',
    contractor.bankaccountnumber || '-',
    '',
    'IFSC Code:',
    '',
    contractor.ifscno || '-',
    '',
    'Date of Payment :',
    '',
    payment?.paymentdate || '-',
  ]);

  createDetails([
    'Payment Reference No:',
    '',
    payment?.paymentrefno || '-',
    '',
    'Paid Amount:',
    '',
    payment?.paidamount || '-',
    '',
  ]);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ["APPROVAL'S INFORMATION"],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 35,
  });

  const approvalheaders = [
    'Prepared & Checked By :',
    '',
    '',
    'Biomax Checked By: ',
    '',
    'Statutory Compliance  (GST & TDS) Checked By: ',
    '',
    '',
    "HOD Recommendation",
    '',

    '',
    'Top Management Approval',
    '',
    '',
    '',
    '',
  ];

  const approvalnames1 = [
    'Initiator',
    '',
    '',
    'HR',
    '',
    'Accounts / Taxation',
    '',
    '',
    'HOD',
    '',

    '',
    'Director',
    '',
    '',
    'Managing Director',
    '',
  ];

  const approvalheaderrow = worksheet.addRow(approvalheaders);
  approvalheaderrow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = border;
    cell.font = { size: 11, wrapText: true, bold: true };
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
    `I${approvalheaderrow.number}:K${approvalheaderrow.number}`
  );
  worksheet.mergeCells(
    `L${approvalheaderrow.number}:P${approvalheaderrow.number}`
  );

  const approvalnamerow = worksheet.addRow(approvalnames1);
  approvalnamerow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'down',
      horizontal: 'center',
    };
    cell.border = border;
    cell.font = { size: 11, wrapText: true, bold: true };
  });
  approvalnamerow.height = 200;
  worksheet.mergeCells(`A${approvalnamerow.number}:C${approvalnamerow.number}`);
  worksheet.mergeCells(`D${approvalnamerow.number}:E${approvalnamerow.number}`);
  worksheet.mergeCells(`F${approvalnamerow.number}:H${approvalnamerow.number}`);
  worksheet.mergeCells(`I${approvalnamerow.number}:K${approvalnamerow.number}`);
  worksheet.mergeCells(`L${approvalnamerow.number}:N${approvalnamerow.number}`);
  worksheet.mergeCells(`O${approvalnamerow.number}:P${approvalnamerow.number}`);

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['Requested By  Central Processing Team'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 10, bold: true },
    height: 27,
  });

  // Add the second table to the worksheet
  // table2Data.forEach((row) => {
  //   worksheet.addRow(row);

  //   worksheet.getRow(rownumber).border = {
  //     top: { style: "thin", color: { argb: "black" } },
  //     left: { style: "thin", color: { argb: "black" } },
  //     bottom: { style: "thin", color: { argb: "black" } },
  //     right: { style: "thin", color: { argb: "black" } },
  //   };
  //   rownumber = rownumber + 1;
  // });

  // worksheet.getRow(6).border = {
  //   top: { style: "thin", color: { argb: "black" } },
  //   left: { style: "thin", color: { argb: "black" } },
  //   bottom: { style: "thin", color: { argb: "black" } },
  //   right: { style: "thin", color: { argb: "black" } },
  // };

  // Save the workbook as an Excel file
  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = `${contractor.contractorname}_${dayjs(month, 'MM/YYYY').format(
      'MMM-YYYY'
    )}.xlsx`;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const table = ({
  createHeading,
  worksheet,
  department,
  rows,
}: {
  createHeading: ({
    header,
    colSpan,
    bgcolor,
    font,
    height,
  }: {
    header: string[];
    colSpan?: number;
    bgcolor?: string;
    font?: any;
    height: number;
  }) => void;
  worksheet: any;
  department: any;
  rows: any;
}) => {
  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: [department.department],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 40,
  });

  const hourlyheader = [
    'Category',
    'Type',
    'Shift Hours',
    'Total Man days',
    'Rate',
    'Man Days Amount',
    'Overtime Hrs.',
    'OT Amount',
    'Total Amount',
    'Service Charge Rate',
    'Service Charge Amount',
    'Taxable',
    'GST',
    'Bill Amount',
    'TDS',
    'Net Payable',
  ];

  const monthlyheader = [
    'Category',
    '',
    'Shift Hours',
    'Total Man days',

    'Rate',
    'Total Amount',
    'Total Overtime',

    'OT Amount',
    'Taxable',
    'GST',
    'Bill Amount',
    'TDS',
    'Net Payable',
    '',
  ];

  const tableheader = worksheet.addRow(hourlyheader);

  // if (department?.basicsalary_in_duration === "Monthly") {
  //   worksheet.mergeCells(`A${tableheader.number}:B${tableheader.number}`);
  //   //   worksheet.mergeCells(`D${tableheader.number}:E${tableheader.number}`);
  //   //   worksheet.mergeCells(`H${tableheader.number}:I${tableheader.number}`);
  //   worksheet.mergeCells(`M${tableheader.number}:P${tableheader.number}`);
  // }

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

  worksheet.mergeCells(`A${tableheader.number}:B${tableheader.number}`);

  const sidebar = department.designations
    .filter((d: any) => d.departmentname === department?.department)
    .map((d: any) => {
      if (d.basicsalary_in_duration !== 'Hourly')
        return { main: d.designation, id: d.id };
      if (d.gender === 'Male')
        return { main: d.designation, sub: 'M', id: d.id };
      else if (d.gender === 'Female')
        return { main: d.designation, sub: 'F', id: d.id };
      else return { main: d.designation, id: d.id };
    });

  if (department?.basicsalary_in_duration?.toLowerCase() === 'hourly') {
    sidebar.push({ main: 'Total', sub: ' ', id: 'total' });
  } else {
    sidebar.push({ main: 'Total', id: 'total' });
  }

  console.log(rows, sidebar, 'rows');

  sidebar.forEach((s: any, index: number) => {
    const data: any[] = [s.main];
    data.push(s.sub || '-');
    data.push(
      department.designations.find((d: any) => d.id === s.id)
        ?.allowed_wrking_hr_per_day || '-'
    );
    const restdata = rows.map((r: any) => {
      if (index === 2) return _.get(r, s.id, '-');
      // console.log(r, "rows");

      return getRoundOff(_.get(r, s.id, 0)) || '0';
    });

    const datarow = worksheet.addRow([...data, ...restdata]);
    datarow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
      cell.border = border;
      cell.font = { size: 12, wrapText: true };
    });
    datarow.height = 36;
    worksheet.mergeCells(`A${datarow.number}:B${datarow.number}`);
    // if (department?.basicsalary_in_duration === "Monthly") {
    //   worksheet.mergeCells(`A${datarow.number}:B${datarow.number}`);
    //   //   worksheet.mergeCells(`D${datarow.number}:E${datarow.number}`);
    //   //   worksheet.mergeCells(`H${datarow.number}:I${datarow.number}`);
    //   worksheet.mergeCells(`M${datarow.number}:P${datarow.number}`);
    // }
  });
};

const totalstable = ({
  createHeading,
  worksheet,
  totals,
  departments,
}: {
  createHeading: ({
    header,
    colSpan,
    bgcolor,
    font,
    height,
  }: {
    header: string[];
    colSpan?: number;
    bgcolor?: string;
    font?: any;
    height: number;
  }) => void;
  worksheet: any;
  totals: any;
  departments: d[];
}) => {
  createHeading({
    header: [''],
    height: 10,
  });
  createHeading({
    header: ['Total'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 40,
  });

  const headers = [
    'Total Man days',
    'Man Days Amount',
    'Overtime Hrs.',
    'OT Amount',
    'Total Amount',
    'Service Charge Rate',
    'Service Charge Amount',
    'Taxable',
    'GST',
    'Bill Amount',
    'TDS',
    'Net Payable',
  ];

  const tableheader = worksheet.addRow(['Department', '', '', '', ...headers]);

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

  // worksheet.mergeCells(`A${tableheader.number}:B${tableheader.number}`);

  departments.forEach((s) => {
    const data: any[] = [s.department, '', '', ''];

    headers.forEach((h) => {
      data.push(getRoundOff(_.get(totals, [h, s.department]) || 0));
    });

    const datarow = worksheet.addRow(data);
    datarow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center',
      };
      cell.border = border;
      cell.font = { size: 12, wrapText: true };
    });
    datarow.height = 36;
    worksheet.mergeCells(`A${datarow.number}:D${datarow.number}`);
  });

  // sdlfkjs

  const data: any[] = ['Total', '', '', ''];

  headers.forEach((h) => {
    data.push(getRoundOff(_.get(totals, [h, 'total']) || 0));
  });

  const datarow = worksheet.addRow(data);
  datarow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = border;
    cell.font = { size: 12, wrapText: true };
  });
  datarow.height = 36;
  worksheet.mergeCells(`A${datarow.number}:D${datarow.number}`);

  //skldjflskj

  worksheet.mergeCells(`A${tableheader.number}:D${tableheader.number}`);
};
