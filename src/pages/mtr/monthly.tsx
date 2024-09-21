import { printFunctions } from '@/components/print/mt/functions';
import { printMonthWise } from '@/components/print/mt/monthly';
import MonthSelect from '@/ui-component/MonthSelect';
import { getFunctionRows } from '@/utils/mtr/functionwise';
import { getMonthlyData } from '@/utils/mtr/monthly';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Contractor,
  Deductions,
  Department,
  FixedDepartments,
  FixedValues,
  Safety,
  Stores,
} from '@prisma/client';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const headcells = [
  {
    colspan: 7,
    label: '',
  },
  {
    colspan: 7,
    label: 'Manpower Calculation',
  },
  {
    colspan: 9,
    label: 'Billing Details',
  },
  {
    colspan: 8,
    label: 'Deductions',
  },
  {
    colspan: 1,
    label: 'Final Payable',
  },
  {
    colspan: 4,
    label: 'Release Amount',
  },
  {
    label: '',
  },
  {
    label: '',
  },
];

const headcells1 = [
  {
    id: 'sno',
    label: 'S.No',
    colspan: 1,
  },
  {
    id: 'contractor',
    label: 'Contractor',
  },
  { id: 'month', label: 'Month' },
  { id: 'billno', label: 'Bill No' },
  { id: 'billdate', label: 'Bill Date' },
  { id: 'nature', label: 'Nature of Work' },
  { id: 'place', label: 'Place of Work' },
  { id: 'days', label: 'Days' },
  { id: 'noofmanpower', label: 'No of Manpower' },
  { id: 'mandays', label: 'Man Days' },
  { id: 'othrs', label: 'OT Hrs' },
  { id: 'otmandays', label: 'OT Man Days' },
  { id: 'totaldays', label: 'Total Days' },
  { id: 'totalavgmanpower', label: 'Total Avg Manpower' },
  { id: 'mandaysamt', label: 'Man Days Amt' },
  { id: 'othramt', label: 'OT Amt' },
  { id: 'basicamount', label: 'Total Amt' },
  { id: 'servicecharges', label: 'Service Charges' },
  { id: 'total', label: 'Taxable Amt ' },
  { id: 'gst', label: 'GST' },
  { id: 'billamount', label: 'Bill Amount' },
  { id: 'tds', label: 'TDS' },
  { id: 'netamount1', label: 'Net Amount' },
  { id: 'gsthold', label: 'GST Hold' },
  { id: 'safety', label: 'Safety / Penalty' },
  { id: 'consumablecharges', label: 'CONSUMABLES / CHARGABLE ITEMS' },
  { id: 'advance', label: 'ADJUSTMENT OF ADVANCE AMOUNT' },
  { id: 'deduction', label: 'ANY OTHER DEDUCTIONS' },
  { id: 'addition', label: 'ANY OTHER ADDITIONS' },
  { id: 'retention', label: 'Retention' },
  { id: 'totaldeductions', label: 'Total Deductions' },
  { id: 'finalpayable', label: 'Final Payable' },
  { id: 'holdamountrelease', label: 'Hold Amount Release' },
  { id: 'gstrelease', label: 'GST Release' },
  { id: 'totalrelease', label: 'Total Release' },
  // { id: 'netamount', label: 'Net Amount' },
  { id: 'remarks', label: 'Remarks' },
];

export default function Functions() {
  const [contractors, setContractors] = useState<
    (Contractor & {
      fixedValues: FixedValues[];
      deductions: Deductions[];
      safety: Safety[];
      stores: Stores[];
    })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>(dayjs().format('MM/YYYY'));

  const [endDate, setEndDate] = useState<string>(dayjs().format('MM/YYYY'));

  const fetchContractors = async () => {
    setLoading(true);
    let months: string[] = [];

    let start = dayjs(startDate, 'MM/YYYY');

    while (
      start.isBefore(dayjs(endDate, 'MM/YYYY')) ||
      start.isSame(dayjs(endDate, 'MM/YYYY'))
    ) {
      months.push(start.format('MM/YYYY'));
      start = start.add(1, 'month');
    }

    const res = await axios.get('/api/mtr/monthly?months=' + months);

    setContractors(res.data.contractors);
    setLoading(false);
  };

  useEffect(() => {
    fetchContractors();
  }, [startDate, endDate]);

  const rows = useMemo(() => {
    let months: string[] = [];
    let start = dayjs(startDate, 'MM/YYYY');

    while (
      start.isBefore(dayjs(endDate, 'MM/YYYY')) ||
      start.isSame(dayjs(endDate, 'MM/YYYY'))
    ) {
      months.push(start.format('MM/YYYY'));
      start = start.add(1, 'month');
    }
    return getMonthlyData({ contractors, months });
  }, [contractors]);

  return (
    <Paper
      sx={{
        overflow: 'auto',
        p: 3,
        maxHeight: 'calc(100vh - 6rem)',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          height: 10,
          width: 9,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#bdbdbd',
          borderRadius: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack
          direction='row'
          flexWrap='wrap'
          alignItems='center'
          spacing={2}
          sx={{ width: '100%' }}
        >
          <MonthSelect
            label='Select Start Date'
            value={dayjs(startDate, 'MM/YYYY')}
            onChange={(value: Dayjs | null) =>
              setStartDate(value?.format('MM/YYYY') || '')
            }
          />
          <MonthSelect
            label='Select End Date'
            value={dayjs(endDate, 'MM/YYYY')}
            onChange={(value: Dayjs | null) =>
              setEndDate(value?.format('MM/YYYY') || '')
            }
          />
        </Stack>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            printMonthWise({
              headcells: headcells1,
              rows,
              headcells1: headcells,
            });
          }}
        >
          Print
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <Box
          sx={{
            width: '100%',
            height: '64vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={20} sx={{ ml: 1 }} color='secondary' />
        </Box>
      ) : (
        <TableContainer
          sx={{
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: 9,
              height: 9,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bdbdbd',
              borderRadius: 2,
            },
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            maxHeight: '64vh',
          }}
        >
          <Table stickyHeader sx={{}} aria-label='sticky table'>
            <TableHead>
              <TableRow sx={{ bgcolor: '#e0e0e0' }}>
                {headcells.map((headcell, index) => (
                  <TableCell
                    colSpan={headcell.colspan}
                    sx={{ fontWeight: '700', bgcolor: '#e0e0e0' }}
                    key={index}
                    align='center'
                  >
                    {headcell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow sx={{ bgcolor: '#e0e0e0' }}>
                {headcells1.map((headcell) => (
                  <TableCell sx={{ fontWeight: '700' }} key={headcell.id}>
                    {headcell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {headcells1.map((headcell) => (
                    <TableCell
                      sx={{
                        fontWeight: row.fontWeight || '500',
                      }}
                      key={headcell.id}
                    >
                      {row[headcell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
