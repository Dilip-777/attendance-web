import { printFunctions } from '@/components/print/mt/functions';
import MonthSelect from '@/ui-component/MonthSelect';
import { getDivisionRows } from '@/utils/mtr/divisions';
import { getFunctionRows } from '@/utils/mtr/functionwise';
import {
  Box,
  Button,
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
  Department,
  FixedDepartments,
  FixedValues,
} from '@prisma/client';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const getRoundOff = (value: number) => {
  return parseFloat(value?.toFixed(2) || '0');
};

export default function Functions() {
  const [divisions, setDivisions] = useState<
    (Department & {
      contractors: (Contractor & {
        fixedValues: (FixedValues & {
          departments: FixedDepartments[];
        })[];
      })[];
    })[]
  >([]);

  const [startDate, setStartDate] = useState<string>(dayjs().format('MM/YYYY'));

  const [endDate, setEndDate] = useState<string>(dayjs().format('MM/YYYY'));
  const [headcells, setHeadCells] = useState<any[]>([]);
  const [headcells1, setHeadCells1] = useState<any[]>([]);

  const fetchDivisions = async () => {
    let months: string[] = [];

    let start = dayjs(startDate, 'MM/YYYY');

    while (
      start.isBefore(dayjs(endDate, 'MM/YYYY')) ||
      start.isSame(dayjs(endDate, 'MM/YYYY'))
    ) {
      months.push(start.format('MM/YYYY'));
      start = start.add(1, 'month');
    }

    const res = await axios.get('/api/mtr/functions?months=' + months);

    setDivisions(res.data.functions);
  };

  useEffect(() => {
    fetchDivisions();
  }, [startDate, endDate]);

  useEffect(() => {
    let months: string[] = [];

    let start = dayjs(startDate, 'MM/YYYY');
    while (
      start.isBefore(dayjs(endDate, 'MM/YYYY')) ||
      start.isSame(dayjs(endDate, 'MM/YYYY'))
    ) {
      months.push(start.format('MM/YYYY'));
      start = start.add(1, 'month');
    }
    setHeadCells([
      { id: 'heading', label: '' },
      ...months.map((m) => ({ id: m, label: m, colspan: 3 })),
      { id: 'total', label: 'Total', colspan: 3 },
    ]);

    let h1: any[] = [
      {
        id: 'heading',
        label: 'Contractors',
        getCell: (row: any) => row.heading,
      },
    ];

    months.forEach((m) => {
      h1.push(
        {
          id: m + 'mandays',
          label: 'Mandays',
          getCell: (row: any) => getRoundOff(row[m]?.mandays),
        },
        {
          id: m + 'avgs',
          label: 'Average',
          getCell: (row: any) => getRoundOff(row[m]?.avgs),
        },
        {
          id: m + 'amount',
          label: 'Cost',
          getCell: (row: any) => getRoundOff(row[m]?.amount),
        }
      );
    });

    h1.push(
      {
        id: 'totalmandays',
        label: 'Mandays',
        getCell: (row: any) => getRoundOff(row.total?.mandays),
      },
      {
        id: 'totalavgs',
        label: 'Average',
        getCell: (row: any) => getRoundOff(row.total?.avgs),
      },
      {
        id: 'totalamount',
        label: 'Cost',
        getCell: (row: any) => getRoundOff(row.total?.amount),
      }
    );

    setHeadCells1(h1);
  }, [divisions]);

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
    return getFunctionRows(divisions, months);
  }, [divisions]);

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
            printFunctions({
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
              {headcells.map((headcell) => (
                <TableCell
                  colSpan={headcell.colspan}
                  sx={{ fontWeight: '700', bgcolor: '#e0e0e0' }}
                  key={headcell.id}
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
                    {headcell.getCell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
