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

const headcells = [
  {
    label: 'Contractor Code',
    getCell: (row: any) => row.contractorcode,
  },
  {
    label: 'Contractor Name',
    getCell: (row: any) => row.contractorname,
  },
  { label: 'Month', getCell: (row: any) => row.month },
  { label: 'Bill No', getCell: (row: any) => row.billno },
  { label: 'Bill Date', getCell: (row: any) => row.billdate },
  { label: 'Nature of Work', getCell: (row: any) => row.natureofwork },
  { label: 'Department', getCell: (row: any) => row.department },
  { label: 'Designation', getCell: (row: any) => row.designation },
  { label: 'No of Manpower', getCell: (row: any) => row.noofmanpower },
  { label: 'Total Days', getCell: (row: any) => row.totaldays },
  { label: 'Total Avg Manpower', getCell: (row: any) => row.totalavgmanpower },
  { label: 'Shift Hrs.', getCell: (row: any) => row.shifthrs },
  { label: 'Man Days', getCell: (row: any) => row.mandays },
  { label: 'Rate', getCell: (row: any) => row.rate },
  { label: 'Man Days Amount', getCell: (row: any) => row.mandaysamount },
  { label: 'Overtime Hrs.', getCell: (row: any) => row.overtimehrs },
  { label: 'OT Amount', getCell: (row: any) => row.otamount },
  { label: 'Total Amount', getCell: (row: any) => row.totalamount },
  {
    label: 'Service Charge Rate',
    getCell: (row: any) => row.servicechargerate,
  },
  {
    label: 'Service Charge Amount',
    getCell: (row: any) => row.servicechargeamount,
  },
  { label: 'Taxable', getCell: (row: any) => row.taxable },
  { label: 'GST', getCell: (row: any) => row.gst },
  { label: 'Bill Amount', getCell: (row: any) => row.billamount },
  { label: 'TDS', getCell: (row: any) => row.tds },
  { label: 'Net Payable', getCell: (row: any) => row.netamount },
];

const handleContractoWiseReport = ({ rows }: { rows: any }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const border = {
    top: { style: 'thin', color: { argb: 'black' } },
    left: { style: 'thin', color: { argb: 'black' } },
    bottom: { style: 'thin', color: { argb: 'black' } },
    right: { style: 'thin', color: { argb: 'black' } },
  };

  worksheet.getColumn(1).width = 6;
  worksheet.getColumn(2).width = 22;
  worksheet.getColumn(3).width = 17.67;

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

export default handleContractoWiseReport;
