import Edit from '@mui/icons-material/Edit';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import _ from 'lodash';
import React, { useState } from 'react';
import EnhancedTableHead from '@/components/Table/EnhancedTableHead';
import { useSession } from 'next-auth/react';
import { Contractor, Deductions, GstRelease } from '@prisma/client';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { Button, Stack, Tooltip } from '@mui/material';
import FormSelect from '@/ui-component/FormSelect';
import MonthSelect from '@/ui-component/MonthSelect';
import dayjs, { Dayjs } from 'dayjs';
import AutoComplete from '@/ui-component/Autocomplete';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import AddDeductions from '@/components/Deductions/addGSTRelease';

const headCells = [
  {
    id: 'contractorId',
    label: 'Contractor ID',
    numeric: false,
    included: false,
  },
  {
    id: 'contractorName',
    label: 'Contractor Name',
    numeric: false,
    included: false,
  },
  { id: 'month', label: 'Month', numeric: false, included: false },
  { id: 'invoiceDate', label: 'Invoice Date', numeric: false, included: false },
  { id: 'invoiceNo', label: 'Invoice No', numeric: false, included: false },
  { id: 'gstin', label: 'GST In', numeric: true, included: false },
  { id: 'gsthold', label: 'GST Hold', numeric: true, included: false },

  {
    id: 'gstHoldDate',
    label: 'GST Hold Date',
    numeric: false,
    included: false,
  },

  { id: 'gstrelease', label: 'Misc. Payment', numeric: true, included: false },
  {
    id: 'gstReleaseDate',
    label: 'GST Release Date',
    numeric: false,
    included: false,
  },
  { id: 'advance', label: 'Advance', numeric: true, included: false },
  {
    id: 'anyother',
    label: 'Any Other Deduction',
    numeric: true,
    included: false,
  },
  {
    id: 'addition',
    label: 'Any Other Addition',
    numeric: true,
    included: false,
  },
  { id: 'paidIn', label: 'Paid In', numeric: false, included: false },
  { id: 'remarks', label: 'Remarks', numeric: false, included: false },
  { id: 'action', label: 'Action', numeric: false, included: true },
];

export default function Deduction({
  //   deductions,
  contractors,
}: {
  //   deductions: Deductions[];
  contractors: Contractor[];
}) {
  const [open, setOpen] = useState(false);
  const [deduction, setDeduction] = useState<GstRelease | undefined>(undefined);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: session } = useSession();
  const [filterName, setFilterName] = useState('');
  const [deductions, setDeductions] = useState<GstRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractorId, setContractorId] = useState<string>('all');
  const [month, setMonth] = useState<string | null>(null);

  const handleClickReport = () => {
    const tableRows = [
      [
        'Contractor ID',
        'Contractor Name',
        'Month',
        'Invoice Date',
        'Invoice No',
        'GST In',
        'GST Hold',
        'GST Hold Date',
        'Misc. Payment',
        'GST Release Date',

        'Advance',
        'Any Other Deduction',
        'Any Other Addition',
        'Paid In',
        'Remarks',
      ],
    ];
    deductions.forEach((item) => {
      tableRows.push([
        item.contractorId,
        item.contractorName || '',
        item.month,
        item.invoiceDate || '',
        item.invoiceNo || '',
        item.gstin || '',
        item.gsthold.toString(),
        item.gstHoldDate || '',
        item.gstrelease.toString(),
        item.gstReleaseDate || '',
        item.advance.toString(),
        item.anyother.toString(),
        item.addition.toString(),
        item.paidIn || '',
        item.remarks || '',
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(',')).join('\n')}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'GST-Deductions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchDeducations = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`/api/deductions/release`);
      setDeductions(data.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDeduction(undefined);
    fetchDeducations();
  };

  React.useEffect(() => {
    fetchDeducations();
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = deductions.map((n) => n.id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deductions.length) : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              setValue={(e) => setContractorId(e as string)}
              value={contractorId}
              label=''
            />
            <MonthSelect
              value={month ? dayjs(month, 'MM/YYYY') : null}
              onChange={(value: Dayjs | null) =>
                setMonth(value?.format('MM/YYYY') || '')
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
              onClick={() => setOpen(true)}
              sx={{ justifySelf: 'flex-end' }}
              color='secondary'
            >
              Add GST Release
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
              rowCount={deductions.length}
              headCells={headCells}
            />
            <TableBody>
              {deductions
                .filter(
                  (d) =>
                    (contractorId === 'all' ||
                      d.contractorId === contractorId) &&
                    (month === null || d.month === month)
                )
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
                      {headCells
                        .filter((h) => !h.included)
                        .map((headCell) => (
                          <TableCell sx={{ minWidth: '10rem' }}>
                            {_.get(row, headCell.id)}
                          </TableCell>
                        ))}
                      <TableCell size='small' align='center'>
                        <IconButton
                          onClick={() => {
                            setOpen(true);
                            setDeduction(row);
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
          count={deductions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <AddDeductions
          open={open}
          handleClose={handleClose}
          deduction={deduction}
          contractors={contractors}
        />
      </Paper>
    </Box>
  );
}

export async function getServerSideProps() {
  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      contractors,
    },
  };
}
