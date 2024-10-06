import FormSelect from '@/ui-component/FormSelect';
import MonthSelect from '@/ui-component/MonthSelect';
import { getContractorWiseReport } from '@/utils/reports/contractorwise';
import { Stack, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { head } from 'lodash';
import React from 'react';
const ExcelJS = require('exceljs');

const headcells = [
  { id: 'contractorCode', label: 'Contractor Code' },
  { id: 'contractorName', label: 'Contractor Name' },
  { id: 'month', label: 'Month' },
  { id: 'billno', label: 'Bill No' },
  { id: 'billdate', label: 'Bill Date' },
  { id: 'nature', label: 'Nature' },
  { id: 'department', label: 'Department' },
  { id: 'designation', label: 'Designation' },
  { id: 'manpower', label: 'Man Power' },
  { id: 'totaldays', label: 'Total Days' },
  { id: 'avgmanpower', label: 'Avg Man Power' },
  { id: 'shifthrs', label: 'Shift Hrs' },
  { id: 'mandays', label: 'Man Days' },
  { id: 'rate', label: 'Rate' },
  { id: 'mandaysamount', label: 'Man Days Amount' },
  { id: 'othrs', label: 'OT Hrs' },
  { id: 'otamount', label: 'OT Amount' },
  { id: 'totalamount', label: 'Total Amount' },
  { id: 'servicecharge', label: 'Service Charge' },
  { id: 'servicechargeamount', label: 'Service Charge Amount' },
  { id: 'taxable', label: 'Taxable' },
  { id: 'gst', label: 'GST' },
  { id: 'billamount', label: 'Bill Amount' },
  { id: 'tds', label: 'TDS' },
  { id: 'netpayable', label: 'Net Payable' },
];

const ContractorwiseReport = () => {
  const [month, setMonth] = React.useState<string>(dayjs().format('MM/YYYY'));
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/report?type=contractorwise&month=${month}`
      );
      const rows = getContractorWiseReport({
        contractors: res.data,
        month: month,
      });
      printrows(rows);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onChange = (value: Dayjs | null) =>
    setMonth(value?.format('MM/YYYY') || '');
  return (
    <Stack spacing={3}>
      <Typography variant='h4'>Man Power Report</Typography>
      <Stack sx={{ maxWidth: '7rem' }} spacing={3}>
        {/* <FormSelect
          value={designation}
          handleChange={(v) => setDesignation(v as string)}
          options={designations.map((item) => ({value: item, label: item}))})}
          label="Select  the Designation"
        /> */}
        <MonthSelect
          label='Select Date'
          value={dayjs(month, 'MM/YYYY')}
          onChange={onChange}
        />
        <Button onClick={handleSubmit} variant='contained' disabled={loading}>
          Print
          {loading && (
            <CircularProgress size={15} sx={{ ml: 1, color: '#364152' }} />
          )}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ContractorwiseReport;

const printrows = (rows: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  const border = {
    top: { style: 'thin', color: { argb: 'black' } },
    left: { style: 'thin', color: { argb: 'black' } },
    bottom: { style: 'thin', color: { argb: 'black' } },
    right: { style: 'thin', color: { argb: 'black' } },
  };

  const tablehead = worksheet.addRow(headcells.map((cell) => cell.label));

  tablehead.eachCell((cell: any) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f5f5f5' },
    };
  });

  rows.forEach((row: any) => {
    const data = headcells.map((cell) => row[cell.id]);
    worksheet.addRow(data);
  });

  worksheet.columns.forEach(function (column: any, i: number) {
    if (i !== 0) {
      var maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell: any) {
        cell.border = border;
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    }
  });

  worksheet.pageSetup.printArea = 'A1:Z100';

  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ContractorWiseReport.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
