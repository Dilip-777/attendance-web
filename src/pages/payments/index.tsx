import * as React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import {
  Contractor,
  Department,
  Designations,
  Employee,
  Payments,
} from '@prisma/client';
import _ from 'lodash';
import CustomTable from '@/components/Table/Table';
import ImportData from '@/components/employeeImport';
import {
  Button,
  Checkbox,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import dayjs, { Dayjs } from 'dayjs';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TablePagination,
  Tooltip,
} from '@mui/material';
import EnhancedTableHead from '@/components/Table/EnhancedTableHead';
import Edit from '@mui/icons-material/Edit';
import AutoComplete from '@/ui-component/Autocomplete';
import MonthSelect from '@/ui-component/MonthSelect';
import { useRouter } from 'next/router';

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
  };
};

const headCells1 = [
  createHeadCells('contractorName', 'Contractor Name', false, false),
  createHeadCells('contractorId', 'Contractor ID', false, false),
  createHeadCells('month', 'Month', false, false),
  createHeadCells('netpayable', 'Net Payable', false, false),
  createHeadCells('paymentdate', 'Payment Date', false, false),
  createHeadCells('paymentrefno', 'Payment Ref No', false, false),
  createHeadCells('paidamount', 'Paid Amount', false, false),
];

export default function Payments1({
  payments,
  contractors,
  contractorId,
  month,
}: {
  payments: Payments[];
  contractors: Contractor[];
  contractorId: string;
  month: string;
}) {
  const [filterName, setFilterName] = React.useState('');
  const [orderby, setOrderby] = React.useState('contractorName');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [selectedContractor, setSelectedContractor] =
  //   React.useState<string>('all');

  // const [month, setMonth] = React.useState<string>('');
  const router = useRouter();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = payments.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    contractorname: string
  ) => {
    const selectedIndex = selected.indexOf(contractorname);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, contractorname);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickReport = () => {
    const tableRows = [
      [
        'Contractor ID',
        'Contractor Name',
        'Month',
        'Payment Date',
        'Payment Ref No',
        'Paid Amount',
      ],
    ];
    payments.forEach((p) => {
      tableRows.push([
        p.contractorId,
        p.contractorName,
        p.month,
        p.paymentdate,
        p.paymentrefno,
        p.paidamount.toString(),
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(',')).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Payments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{ p: 2 }}
        >
          <Stack direction='row' alignItems='center' spacing={4}>
            <AutoComplete
              options={[
                { label: 'All', value: 'all' },
                ...contractors.map((contractor) => ({
                  label: contractor.contractorname,
                  value: contractor.contractorId,
                })),
              ]}
              setValue={(e) =>
                router.push(`/payments?contractorId=${e}&month=${month}`)
              }
              value={contractorId || 'all'}
              label=''
            />
            <MonthSelect
              value={month ? dayjs(month, 'MM/YYYY') : null}
              onChange={(value: Dayjs | null) =>
                router.push(
                  `/payments?contractorId=${contractorId}&month=${
                    value?.format('MM/YYYY') || ''
                  }`
                )
              }
            />
          </Stack>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Tooltip title='Print'>
              <IconButton onClick={handleClickReport}>
                <LocalPrintshopIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant='contained'
              onClick={() => router.push('/payments/add')}
              sx={{ justifySelf: 'flex-end' }}
              color='secondary'
            >
              Add Payments
            </Button>
          </Stack>
        </Stack>
        <TableContainer
          sx={{
            maxHeight: 'calc(100vh - 16rem)',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              height: 10,
              width: 10,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bdbdbd',
              borderRadius: 2,
            },
          }}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size='medium'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={payments.length}
              headCells={headCells1}
            />
            <TableBody>
              {payments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id as string);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='secondary'
                          checked={isItemSelected}
                          onClick={(event) =>
                            handleClick(event, row.id as string)
                          }
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {headCells1
                        .filter((h) => !h.included)
                        .map((headCell) => (
                          <TableCell sx={{ minWidth: '10rem' }}>
                            {_.get(row, headCell.id)}
                          </TableCell>
                        ))}
                      <TableCell size='small' align='center'>
                        <IconButton
                          onClick={() => {
                            router.push(`/payments/${row.id}`);
                          }}
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize='small' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={payments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
    // <CustomTable
    //   headcells={headCells1}
    //   rows={payments.filter((employee) =>
    //     _.get(employee, orderby, 'contractorName')
    //       .toString()
    //       .toLowerCase()
    //       .includes(filterName.toLowerCase())
    //   )}
    //   filterName={filterName}
    //   setFilterName={setFilterName}
    //   orderby={orderby}
    //   setOrderby={setOrderby}
    //   editLink='/payments'
    //   handleClickReport={handleClickReport}
    // />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.user?.role === 'Admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const { contractorId, month } = context.query;

  let where: any = {};

  if (contractorId !== 'all') {
    where.contractorId = contractorId;
  }

  if (month) {
    where.month = month;
  }

  const payments = await prisma.payments.findMany({
    where,
  });

  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      payments,
      contractors,
      contractorId: contractorId || 'all',
      month: month || '',
    },
  };
};
