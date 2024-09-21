import Head from 'next/head';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Stack, styled } from '@mui/material/';

import FilterListIcon from '@mui/icons-material/FilterList';
import Edit from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import Search from '@mui/icons-material/Search';

import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { HOAuditor } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import EnhancedTableHead from '@/components/Table/EnhancedTableHead';
import MonthSelect from '@/ui-component/MonthSelect';
import _ from 'lodash';

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: '100%',
  marginRight: 20,

  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));
interface Data1 {
  contractorname: string;
  employeeid: string;
  employeename: string;
  designation: string;
  department: string;
  gender: string;
  phone: number;
  emailid: string;
  basicsalaryinduration: string;
  basicsalary: string;
  gst: number;
  tds: number;
  allowedWorkinghoursperday: string;
  servicecharge: string;
}

type Order = 'asc' | 'desc';

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean,
  align?: 'center' | 'left' | 'right'
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
    align: align || 'center',
  };
};

const headCells = [
  createHeadCells('contractorname', 'Contractor Name', false, false),
  createHeadCells('workdescription', 'Work Description', false, true),
  createHeadCells('invoiceNo', 'Invoice No', false, false),
  createHeadCells('invoiceDate', 'Invoice Date', false, false),
  createHeadCells('startdate', 'Start Date', false, false),
  createHeadCells('enddate', 'End Date', false, false),
  createHeadCells('monthofInvoice', 'Month of Invoice', false, false),
  createHeadCells('receivingDate', 'Receiving Date', false, false),
  createHeadCells('basicbillamount', 'Basic Bill Amount', false, false),
  createHeadCells('serviceCharges', 'Services Charge', false, false),
  createHeadCells('taxableAmount', 'Taxable Amount', false, false),
  createHeadCells('gst', 'GST', true, false),
  createHeadCells('totalbillAmount', 'Total Bill Amount', false, false),
  createHeadCells('tds', 'TDS', false, false),

  createHeadCells('netbillAmount', 'Net Bill Amount', true, false),
  createHeadCells('sapstatus', 'SAP Status', false, false),
  createHeadCells('gststatus', 'GST Status', false, false),
  createHeadCells('tdsstatus', 'TDS Status', false, false),
  createHeadCells('gstr1', 'GSTR-1', false, false),
  createHeadCells('gstr3b', 'GSTR-3B', false, false),
  createHeadCells('wostatus', 'WO Status', false, false),
  createHeadCells('remarks', 'Remarks', false, false),
  createHeadCells('bankDetails', 'Bank Details', false, false),
  createHeadCells('onetimeInvoice', 'One Time Invoice', false, false),
  createHeadCells(
    'verifiedComplainces',
    'Verified the Complainces',
    false,
    false
  ),
  createHeadCells('workOrderAvailable', 'Work Order Available', false, false),
  createHeadCells('licensesInPlace', 'Licenses In Place', false, false),
  createHeadCells(
    'previousPayVerified',
    'Previous Month Pay verified',
    false,
    false
  ),
  createHeadCells(
    'detailssSentToAuditAndHo',
    'Details sent to Audit and HO',
    false,
    false
  ),
  createHeadCells('gstChallanAttached', 'GST Challan Attached', false, false),
  createHeadCells('deductions', 'Deductions', false, false),
  createHeadCells(
    'variationsInManPower',
    'Variations In Manpower',
    false,
    false
  ),
  createHeadCells(
    'machineOrRegisterMode',
    'Machine Or Register Mode',
    false,
    false
  ),
];

const handleClickReport = async (data: HOAuditor[]) => {
  const tableRows: string[][] = [headCells.map((headCell) => headCell.label)];

  try {
    data.forEach((item: HOAuditor) => {
      tableRows.push([
        item.contractorname,
        item.workDescription,
        item.invoiceNo,
        item.date,
        item.fromDate,
        item.toDate,
        dayjs(item.monthOfInvoice, 'MM-DD-YYYY').format('MMMM').toString() ||
          '-',
        item.dateOfReceiving || '-',
        item.basicbillamount.toString(),
        item.serviceCharges.toString(),
        item.taxableAmount.toString(),
        item.gst.toString(),
        item.totalbillAmount.toString(),
        item.tds.toString(),

        item.netbillAmount.toString(),
        item.bankDetails,
        item.onetimeInvoice ? 'Yes' : 'No',
        item.verifiedComplainces ? 'Yes' : 'No',
        item.workOrderAvailable ? 'Yes' : 'No',
        item.licensesInPlace ? 'Yes' : 'No',
        item.previousPayVerified ? 'Yes' : 'No',
        item.detailsSentToAuditAndHo ? 'Yes' : 'No',
        item.gstChallanAttached ? 'Yes' : 'No',
        item.deductions?.toString() || '-',
        item.variationsInManpower?.toString() || '-',
        item.manchineOrRegisterMode,
      ]);
    });

    const csvContent = `${tableRows.map((row) => row.join(',')).join('\n')}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'HoAuditor.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};

export default function HOAuditorPage({
  hocommercial,
}: {
  hocommercial: HOAuditor[];
}) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data1>('contractorname');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState('');
  const router = useRouter();
  const { month } = router.query;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = hocommercial.map((n) => n.contractorname);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (contractorname: string) =>
    selected.indexOf(contractorname) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - hocommercial.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction='row'>
            <StyledSearch
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder='Search Contactor...'
              startAdornment={
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              }
            />
            <MonthSelect
              value={month ? dayjs(month as string, 'MM/YYYY') : null}
              onChange={(e) => {
                console.log(e, 'month');

                if (e?.format('MM/YYYY') !== 'Invalid Date')
                  if (e)
                    router.push({
                      query: { month: e?.format('MM/YYYY') },
                    });
                  else router.push('/hoauditor');
              }}
              maxDate={null}
            />
          </Stack>

          <Tooltip title='Print'>
            <IconButton onClick={() => handleClickReport(hocommercial)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
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
              rowCount={hocommercial.length}
              headCells={headCells}
            />
            <TableBody>
              {hocommercial
                .filter((ho) =>
                  ho.contractorname
                    .toLowerCase()
                    .includes(filterName.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(
                    row.contractorname as string
                  );
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
                      <TableCell
                        onClick={(event) =>
                          handleClick(event, row.contractorname as string)
                        }
                        padding='checkbox'
                      >
                        <Checkbox
                          color='secondary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        id={labelId}
                        scope='row'
                        padding='none'
                        align='center'
                        sx={{ minWidth: 150 }}
                      >
                        {row.contractorname}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.workDescription}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.invoiceNo}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.date}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.fromDate}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.toDate}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {dayjs(
                          row.monthOfInvoice,
                          row.monthOfInvoice.length === 10
                            ? 'DD/MM/YYYY'
                            : 'MM/YYYY'
                        )
                          .format('MMMM')
                          .toString() || '-'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.dateOfReceiving || '-'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.basicbillamount}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.serviceCharges}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.taxableAmount}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.gst}
                      </TableCell>

                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.totalbillAmount}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.tds}
                      </TableCell>

                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.netbillAmount}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.sapstatus}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.gststatus}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.tdsstatus}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.gstr1}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.gstr3b}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.wostatus}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.remarks}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.bankDetails}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.onetimeInvoice ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.verifiedComplainces ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.workOrderAvailable ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.licensesInPlace ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.previousPayVerified ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.detailsSentToAuditAndHo ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.gstChallanAttached ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.deductions}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.variationsInManpower}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.manchineOrRegisterMode}
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton
                          onClick={() => {
                            router.push(
                              `/hoauditor/${row.contractorId}?hoId=${row.id}`
                            );
                          }}
                        >
                          <Edit
                            sx={{
                              fontSize: '16px',
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
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
          count={hocommercial.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
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

  const { month } = context.query;

  const hocommercial = await prisma.hOAuditor.findMany({
    where: {
      monthOfInvoice: {
        // // contains: month as string,
        // startsWith: m[0],
        // endsWith: m[1],
        endsWith: month as string,
      },
    },
  });

  return {
    props: {
      hocommercial,
    },
  };
};
