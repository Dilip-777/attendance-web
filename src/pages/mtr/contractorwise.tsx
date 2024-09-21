import { printContractorwise } from '@/components/print/mt/contractorwise';
import { printFunctions } from '@/components/print/mt/functions';
import prisma from '@/lib/prisma';
import MonthSelect from '@/ui-component/MonthSelect';
import { getContractorWiseFixedValues } from '@/utils/mtr/contractorWise';
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
import { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';

export default function Functions({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [fixedValues, setFixedValues] = useState<FixedValues[]>([]);

  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(1, 'year').format('MM/YYYY')
  );

  const [endDate, setEndDate] = useState<string>(dayjs().format('MM/YYYY'));
  const [headcells, setHeadCells] = useState<any[]>([]);
  const [headcells1, setHeadCells1] = useState<any[]>([]);

  const fetchFixedValues = async () => {
    let months: string[] = [];

    let start = dayjs(startDate, 'MM/YYYY');

    while (
      start.isBefore(dayjs(endDate, 'MM/YYYY')) ||
      start.isSame(dayjs(endDate, 'MM/YYYY'))
    ) {
      months.push(start.format('MM/YYYY'));
      start = start.add(1, 'month');
    }

    const res = await axios.get('/api/fixedvalues?months=' + months);

    setFixedValues(res.data);
  };

  useEffect(() => {
    fetchFixedValues();
  }, [startDate, endDate]);

  useEffect(() => {
    setHeadCells([
      { id: 'heading', label: 'Heading', colspan: 1 },
      ...contractors.map((contractor) => ({
        id: contractor.contractorId,
        label: contractor.contractorname,
      })),
    ]);
  }, []);

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
    return getContractorWiseFixedValues({ fixedValues, months, contractors });
  }, [fixedValues]);

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
            printContractorwise({
              headcells,
              rows,
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

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {headcells.map((headcell) => (
                  <TableCell
                    sx={{
                      fontWeight: row.fontWeight || '500',
                    }}
                    key={headcell.id}
                  >
                    {row[headcell.id] ?? ''}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const contractors = await prisma.contractor.findMany({
    where: {
      contractorname: {
        not: 'testcontractor',
      },
      servicedetail: {
        notIn: ['Civil', 'Fixed', 'Equipment / Vehicle Hiring'],
      },
    },
  });

  return {
    props: {
      contractors: JSON.parse(JSON.stringify(contractors)),
    },
  };
};
