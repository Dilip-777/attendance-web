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
const ExcelJS = require('exceljs');

const border = {
  top: { style: 'thin', color: { argb: 'black' } },
  left: { style: 'thin', color: { argb: 'black' } },
  bottom: { style: 'thin', color: { argb: 'black' } },
  right: { style: 'thin', color: { argb: 'black' } },
};

const getRoundOff = (num: number) => {
  return Math.ceil(num);
};

interface d extends Department {
  designations: Designations[];
}

export const handleAutomobileprint = async ({
  total,
  contractor,
  workorder,
  month,
  calRows,
  cost,
  hoCommercial,
  deduction,
  hsdcost,
  payment,
  totalsdata,
}: {
  total: number;
  contractor: Contractor;
  workorder: Workorder | null;
  month: string;
  calRows: {
    heading: string;
    headcells: any[];
    data: any[];
  }[];
  cost: {
    ytdHiringCost: number;
    ytdHsdCost: number;
    ytdHsdConsumed: number;
    ytdHsdRate: number;
    ytdCost: number;
    prevHiringCost: number;
    monthHiringCost: number;
    prevHsdCost: number;
    monthHsdCost: number;
    prevHsdConsumed: number;
    monthHsdConsumed: number;
    prevHsdRate: number;
    monthHsdRate: number;
    prevCost: number;
    monthCost: number;
  };
  hoCommercial: HOAuditor | null;
  deduction: Deductions | null;
  hsdcost: number;
  payment: Payments | null;
  totalsdata: any[];
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
        `A${headingTextRow.number}:G${headingTextRow.number}`
      );
      worksheet.mergeCells(
        `H${headingTextRow.number}:N${headingTextRow.number}`
      );
    } else {
      worksheet.mergeCells(
        `A${headingTextRow.number}:N${headingTextRow.number}`
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

  function createDetails(
    details: any[],
    mergeCells?: any[],
    boldNumbers?: number[],
    nonBoldNumbers?: number[]
  ) {
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
    (
      mergeCells || [
        { s: 'A', e: 'A' },
        { s: 'B', e: 'E' },
        { s: 'F', e: 'F' },
        { s: 'G', e: 'H' },
        { s: 'I', e: 'I' },
        { s: 'J', e: 'K' },
        { s: 'L', e: 'L' },
        { s: 'M', e: 'N' },
      ]
    ).forEach((cellnumber) => {
      worksheet.mergeCells(
        `${cellnumber.s}${textrow.number}:${cellnumber.e}${textrow.number}`
      );
    });
    (boldNumbers || [1, 6, 9, 12]).forEach((cellnumber) => {
      textrow.getCell(cellnumber).font = {
        bold: true,
        size: 11,
        wrapText: true,
      };
    });
    // (nonBoldNumbers || [3, 7, 11, 15]).forEach((cellnumber) => {
    //   textrow.getCell(cellnumber).font = {
    //     bold: false,
    //     size: 11,
    //     wrapText: true,
    //   };
    // });
  }

  createDetails([
    'Contractor Code',
    `${contractor.contractorId}`,
    '',
    '',
    '',
    'Contractor Name',
    `${contractor.contractorname}`,
    '',
    'Contact NO:',
    `${contractor.mobilenumber}`,
    '',
    'Type of Contractor',
    `${contractor.typeofcontractor}`,
    '',
  ]);

  createDetails([
    'Contractor Address',
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

  worksheet.mergeCells(`A${textrow.number}:N${textrow.number}`);

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

  createDetails(
    [
      'Invoice No',
      hoCommercial?.invoiceNo || '-',
      'Invoice Date',
      '',
      '',
      `${hoCommercial?.date}`,
      'Work Order No',
      '',
      `${workorder?.workorderno || '-'}`,
      '',
      '',
      'Nature of Work',
      `${contractor?.areaofwork || '-'}`,
      '',
    ],
    [
      { s: 'C', e: 'E' },
      { s: 'G', e: 'H' },
      { s: 'I', e: 'K' },
      { s: 'M', e: 'N' },
    ],
    [1, 3, 7, 12]
  );

  createDetails(
    [
      'Invoice Month',
      `${hoCommercial?.monthOfInvoice || '-'}`,
      'Effective Date of contractor',
      '',
      '',
      workorder?.startDate || '-',
      'Ending Date of contractor',
      '',
      `${workorder?.endDate || '-'}`,
      '',
      '',
      "GST Compliance's Status - Month",
      `${hoCommercial?.monthOfInvoice || '-'} `,
      '',
    ],
    [
      { s: 'C', e: 'E' },
      { s: 'G', e: 'H' },
      { s: 'I', e: 'K' },
      { s: 'M', e: 'N' },
    ],
    [1, 3, 7, 12]
  );

  // createDetails([
  //   "GST Compliance's Status - Month",
  //   "",
  //   `${month}`,
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  // ]);

  createHeading({
    header: [''],
    height: 10,
  });

  calRows.forEach((h, index) => {
    createHeading({
      header: [''],
      height: 30,
    });
    createHeading({
      header: [h.heading],
      colSpan: 10,
      bgcolor: 'fafafa',
      font: { size: 14, bold: true },
      height: 35,
    });
    table({
      worksheet,
      data: h.data,
      headcells: h.headcells,
      index,
      totalsdata,
    });
  });

  //   departments?.forEach((department) => {
  //     table({
  //       worksheet,
  //       data: h.data,
  //         headcells: h.headcells,
  //     });
  //   });

  //   totalstable({
  //     createHeading,
  //     worksheet,
  //     departments,
  //     totals: totals,
  //   });

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

  const finalinfo = [
    ['NET AMOUNT PAYABLE', `${getRoundOff(total)}`],
    ['GST Hold (if any)', 0],
    // ["SAFETY VIOLATION 'S PENALTY", getRoundOff(safetyAmount || 0) * -1],
    ['CONSUMABLES/ CHARGABLE ITEMS', getRoundOff(hsdcost || 0)],
    ['ADJUSTMENT OF ADVANCE AMOUNT', getRoundOff(deduction?.advance || 0) * -1],
    [
      'ANY OTHER DEDUCTIONS (IF ANY)',
      getRoundOff(deduction?.anyother || 0),
      deduction?.remarks,
    ],
    ['ANY OTHER ADDITION (IF ANY)', deduction?.addition || 0],
    [
      'FINAL PAYABLE',
      getRoundOff(
        total +
          hsdcost +
          ((deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0) -
          (deduction?.advance || 0) -
          (deduction?.anyother || 0) +
          (deduction?.addition || 0)
      ),
    ],
  ];

  let numbers: number[] = [];

  finalinfo.forEach((f) => {
    const row = worksheet.addRow([
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
    //   worksheet.mergeCells(`A${row.number}:C${row.number}`);
    //   worksheet.mergeCells(`D${row.number}:G${row.number}`);
    // } else worksheet.mergeCells(`A${row.number}:G${row.number}`);
    worksheet.mergeCells(`H${row.number}:K${row.number}`);
    worksheet.mergeCells(`L${row.number}:N${row.number}`);
    row.height = 30;
  });

  worksheet.mergeCells(`A${numbers[0]}:G${numbers[numbers.length - 1]}`);

  createHeading({
    header: [''],
    height: 10,
  });

  const monthlyCostHeadcells = [
    { id: 'description', label: 'Description' },
    { id: '', label: '' },
    { id: '', label: '' },
    { id: '', label: '' },
    { id: '', label: '' },
    { id: 'costprev', label: 'Cost for the previous Month' },
    { id: '', label: '' },
    { id: '', label: '' },
    { id: 'costmonth', label: 'Cost for the Month ( MTD)' },
    { id: '', label: '' },
    { id: '', label: '' },
    { id: 'costupto', label: 'Cost upto this Month (YTD)' },
    { id: '', label: '' },
    { id: '', label: '' },
  ];

  const data = [
    {
      description: '• Hiring Cost Charged In P & L',
      costprev: cost.prevHiringCost,
      costmonth: cost.monthHiringCost,
      costupto: cost.ytdHiringCost,
    },
    {
      description: '• HSD consumed (in Ltr.)',
      costprev: cost.prevHsdConsumed,
      costmonth: cost.monthHsdConsumed,
      costupto: cost.ytdHsdConsumed,
    },
    {
      description: '• HSD Rate charged (per Ltr.)',
      costprev: cost.prevHsdRate,
      costmonth: cost.monthHsdRate,
      costupto: cost.ytdHsdRate,
    },
    {
      description: '• Cost of HSD',
      costprev: cost.prevHsdCost,
      costmonth: cost.monthHsdCost,
      costupto: cost.ytdHsdCost,
    },
    {
      description: '• Cost borned (Hiring + HSD) by the Compnay',
      costprev: cost.prevCost,
      costmonth: cost.monthCost,
      costupto: cost.ytdCost,
    },
  ];

  createHeading({
    header: [
      'CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR THE CURRENT FINANCIAL YEAR',
    ],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 14, bold: true },
    height: 35,
  });
  table({
    worksheet,
    data,
    headcells: monthlyCostHeadcells,
    index: -1,
  });

  createHeading({
    header: [''],
    height: 10,
  });

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

  createDetails(
    [
      'Beneficiary  Name:',
      '',
      contractor.beneficialname || '-',
      '',
      'Account Number:',
      '',
      contractor.bankaccountnumber || '-',
      '',
      'IFSC Code:',
      contractor.ifscno || '-',
      '',
      'Date of Payment :',
      '',
      payment?.paymentdate || '-',
    ],
    [
      { s: 'A', e: 'B' },
      { s: 'C', e: 'D' },
      { s: 'E', e: 'F' },
      { s: 'G', e: 'H' },
      { s: 'J', e: 'K' },
      { s: 'L', e: 'M' },
    ]
  );

  createDetails(
    [
      'Payment Reference No:',
      '',
      payment?.paymentrefno || '-',
      '',
      'Paid Amount:',
      '',
      payment?.paidamount || '-',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    [
      { s: 'A', e: 'B' },
      { s: 'C', e: 'D' },
      { s: 'E', e: 'F' },
      { s: 'G', e: 'H' },
    ]
  );

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
    cell.font = { size: 10, wrapText: true, bold: true };
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
    `L${approvalheaderrow.number}:N${approvalheaderrow.number}`
  );

  const approvalnamerow = worksheet.addRow(approvalnames1);
  approvalnamerow.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: 'down',
      horizontal: 'center',
    };
    cell.border = border;
    cell.font = { size: 10, wrapText: true, bold: true };
  });
  approvalnamerow.height = 200;
  worksheet.mergeCells(`A${approvalnamerow.number}:C${approvalnamerow.number}`);
  worksheet.mergeCells(`D${approvalnamerow.number}:E${approvalnamerow.number}`);
  worksheet.mergeCells(`F${approvalnamerow.number}:H${approvalnamerow.number}`);
  worksheet.mergeCells(`I${approvalnamerow.number}:K${approvalnamerow.number}`);
  worksheet.mergeCells(`M${approvalnamerow.number}:N${approvalnamerow.number}`);

  // const approvalnames = [
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  // ];
  // [...Array(5)].forEach((_, i) => {
  //   const row = worksheet.addRow(approvalnames);
  //   row.eachCell((cell: any) => {
  //     cell.alignment = {
  //       wrapText: true,
  //       vertical: "middle",
  //       horizontal: "center",
  //     };
  //     cell.border = border;
  //     cell.font = { size: 10, wrapText: true, bold: true };
  //   });
  //   row.height = 30;
  //   worksheet.mergeCells(`A${row.number}:C${row.number}`);
  //   worksheet.mergeCells(`D${row.number}:E${row.number}`);
  //   worksheet.mergeCells(`F${row.number}:H${row.number}`);
  //   worksheet.mergeCells(`I${row.number}:K${row.number}`);
  //   worksheet.mergeCells(`L${row.number}:N${row.number}`);
  // });

  createHeading({
    header: [''],
    height: 10,
  });

  createHeading({
    header: ['Requested By  Central Processing Team'],
    colSpan: 10,
    bgcolor: 'fafafa',
    font: { size: 9, bold: true },
    height: 27,
  });

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
    // link.setAttribute('download', 'finalsheet.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const table = ({
  worksheet,
  data,
  headcells,
  index,
  totalsdata,
}: {
  worksheet: any;
  data: any[];
  headcells: {
    label: string;
    id: string;
  }[];
  index: number;
  totalsdata?: any[];
}) => {
  let heads: any[] = [];
  headcells.forEach((h) => {
    heads.push(h);
    if (index === 0 || index === 1) {
      if (['running', 'billamount', 'netamount'].includes(h.id))
        heads.push({ id: '', label: '' });
    }
    if (index === 2) {
      if (
        ['avgMileage', 'mileagefortheMonth', 'breakDownDaysCounted'].includes(
          h.id
        )
      )
        heads.push({ id: '', label: '' });
    }
    if (index === 3) {
      if (['vehicleType', 'netamount'].includes(h.id))
        heads.push({ id: '', label: '' });
    }
  });
  const tableheader = worksheet.addRow(heads.map((h) => h.label));

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

  if (index === 0 || index === 1) {
    worksheet.mergeCells(`F${tableheader.number}:G${tableheader.number}`);
    worksheet.mergeCells(`J${tableheader.number}:K${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  if (index === 2) {
    worksheet.mergeCells(`C${tableheader.number}:D${tableheader.number}`);
    worksheet.mergeCells(`K${tableheader.number}:L${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  if (index === 3) {
    worksheet.mergeCells(`B${tableheader.number}:C${tableheader.number}`);
    worksheet.mergeCells(`M${tableheader.number}:N${tableheader.number}`);
  }

  if (index === -1) {
    worksheet.mergeCells(`A${tableheader.number}:E${tableheader.number}`);
    worksheet.mergeCells(`F${tableheader.number}:H${tableheader.number}`);
    worksheet.mergeCells(`I${tableheader.number}:K${tableheader.number}`);
    worksheet.mergeCells(`L${tableheader.number}:N${tableheader.number}`);
  }

  tableheader.height = 36;

  data.forEach((s: any) => {
    if (index === 0 || index === 1) {
      const datarow1 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === 'running') {
            return 'HRS';
          } else if (i !== 0 && heads[i - 1].id === 'running') {
            return s.running.hrs || 0;
          } else {
            return '';
          }
        })
      );
      const datarow2 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === 'running') {
            return 'Days';
          } else if (i !== 0 && heads[i - 1].id === 'running') {
            return s.running.days || 0;
          } else {
            return s[h.id] ?? '-';
          }
        })
      );
      const datarow3 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === 'running') {
            return 'KMS';
          } else if (i !== 0 && heads[i - 1].id === 'running') {
            return s.running.kms || 0;
          } else {
            return '';
          }
        })
      );

      const datarow4 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === 'running') {
            return 'Trips';
          } else if (i !== 0 && heads[i - 1].id === 'running') {
            return s.running.trips || 0;
          } else {
            return '';
          }
        })
      );

      datarow1.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'black' } },
          left: { style: 'thin', color: { argb: 'black' } },
          right: { style: 'thin', color: { argb: 'black' } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      datarow2.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        };
        cell.border = {
          left: { style: 'thin', color: { argb: 'black' } },
          right: { style: 'thin', color: { argb: 'black' } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      datarow3.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        };
        cell.border = {
          left: { style: 'thin', color: { argb: 'black' } },
          right: { style: 'thin', color: { argb: 'black' } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      datarow4.eachCell((cell: any) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        };
        cell.border = {
          left: { style: 'thin', color: { argb: 'black' } },
          right: { style: 'thin', color: { argb: 'black' } },
          bottom: { style: 'thin', color: { argb: 'black' } },
        };
        cell.font = { size: 12, wrapText: true };
      });
      [datarow1, datarow2, datarow3, datarow4].forEach((r) => {
        if (index === 0 || index === 1) {
          // worksheet.mergeCells(`F${r.number}:G${r.number}`);
          worksheet.mergeCells(`J${r.number}:K${r.number}`);
          worksheet.mergeCells(`M${r.number}:N${r.number}`);
        }
      });
    } else if (index === 2) {
      const datarow1 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === 'mileagefortheMonth') {
            return 'In Km per Ltr.';
          } else if (i !== 0 && heads[i - 1].id === 'mileagefortheMonth') {
            return s.mileagefortheMonth.kmperltr || `0 km/ltr`;
          } else {
            return '';
          }
        })
      );
      const datarow2 = worksheet.addRow(
        heads.map((h, i) => {
          if (h.id === 'mileagefortheMonth') {
            return 'In Ltr. Per Hr.';
          } else if (i !== 0 && heads[i - 1].id === 'mileagefortheMonth') {
            return s.mileagefortheMonth.ltperhr || `0 ltr/hr`;
          } else {
            return s[h.id] ?? '-';
          }
        })
      );

      [datarow1, datarow2].forEach((c, index) => {
        c.eachCell((cell: any) => {
          cell.alignment = {
            wrapText: true,
            vertical: 'middle',
            horizontal: 'center',
          };

          if (index === 0) {
            cell.border = {
              top: { style: 'thin', color: { argb: 'black' } },
              left: { style: 'thin', color: { argb: 'black' } },
              right: { style: 'thin', color: { argb: 'black' } },
              bottom: {},
            };
          } else {
            cell.border = {
              top: {},
              bottom: { style: 'thin', color: { argb: 'black' } },
              left: { style: 'thin', color: { argb: 'black' } },
              right: { style: 'thin', color: { argb: 'black' } },
            };
          }
          cell.font = { size: 12, wrapText: true };
        });
      });
      [datarow1, datarow2].forEach((datarow) => {
        worksheet.mergeCells(`K${datarow.number}:L${datarow.number}`);
        worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
      });
    } else {
      const datarow = worksheet.addRow(
        heads.map((h) => {
          return s[h.id] ?? '-';
        })
      );
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
      if (index === 3) {
        worksheet.mergeCells(`B${datarow.number}:C${datarow.number}`);
        worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
      }
      if (index === -1) {
        worksheet.mergeCells(`A${datarow.number}:E${datarow.number}`);
        worksheet.mergeCells(`F${datarow.number}:H${datarow.number}`);
        worksheet.mergeCells(`I${datarow.number}:K${datarow.number}`);
        worksheet.mergeCells(`L${datarow.number}:N${datarow.number}`);
      }
    }
    // datarow1.height = 30;
    // datarow2.height = 30;
  });
  if (totalsdata && index === 0 && totalsdata.length > 0) {
    totalsdata.forEach((s: any) => {
      const datarow = worksheet.addRow([
        s.vehicleNo,
        '',
        '',
        '',
        '',
        '',
        '',
        s.taxable,
        s.gst,
        s.billamount,
        '',
        s.tds,
        s.netamount,
      ]);
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
      worksheet.mergeCells(`A${datarow.number}:G${datarow.number}`);
      worksheet.mergeCells(`J${datarow.number}:K${datarow.number}`);
      worksheet.mergeCells(`M${datarow.number}:N${datarow.number}`);
    });
  }
};
