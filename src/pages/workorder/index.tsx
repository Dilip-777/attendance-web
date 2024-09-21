import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Edit from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircularProgress from '@mui/material/CircularProgress';
import Search from '@mui/icons-material/Search';
import {
  Autocomplete,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  //   Button,
  //   Dialog,
  //   DialogActions,
  //   DialogContent,
  //   DialogTitle,
  //   InputAdornment,
  //   OutlinedInput,
  styled,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Contractor, Workorder } from '@prisma/client';
import EnhancedTableHead from '@/components/Table/EnhancedTableHead';
import axios from 'axios';
import Close from '@mui/icons-material/Close';
import MonthSelect from '@/ui-component/MonthSelect';
import dayjs, { Dayjs } from 'dayjs';
import Done from '@mui/icons-material/Done';

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 40,
  marginRight: 30,

  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

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

const headCells = [
  createHeadCells('id', 'Work Order Id', false, false),
  createHeadCells('contractorname', 'Contractor Name', false, false),
  createHeadCells('nature', 'Nature', false, true),
  createHeadCells('startdate', 'Start Date', false, false),
  createHeadCells('enddate', 'End Date', false, false),
  createHeadCells('location', 'Location', false, false),
  createHeadCells('workdescription', 'Work Descrition', false, false),
  createHeadCells('repeatedOronetime', 'Repeated Or one time', false, false),
  createHeadCells('schedule', 'Schedule', false, false),
  createHeadCells('paymentTerms', 'Payment Terms', false, false),
  createHeadCells('remarks', 'Remarks', false, false),
  createHeadCells('status', 'Status', false, false),
  createHeadCells('amendmentdocument', 'Amendment Document', true, false),
  createHeadCells('addendumDocument', 'Addendum Document', false, false),
  createHeadCells('document', 'Document', false, false),
  createHeadCells('actions', 'Action', false, false),
];

export default function WorkOrder({
  contractors,
  workorders,
  pendingWorkorders,
}: {
  contractors: Contractor[];
  workorders: Workorder[];
  pendingWorkorders: Workorder[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState('');
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedWorkorder, setSelectedWorkorder] = React.useState<
    string | undefined
  >(undefined);
  const theme = useTheme();
  const { data: session } = useSession();
  const { contractorId } = router.query;

  const handleClose = () => {
    setOpen(false);
    setSelectedWorkorder(undefined);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = workorders.map((n) => n.contractorName);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClickReport = () => {
    const tableRows = [
      [
        'WorkOrder Id',
        'Contractor Name',
        'Nature',
        'Start Date',
        'End Date',
        'Location',
        'Work Description',
        'Repeated Or one time',
        'Schedule',
        'Payment Terms',
        'Remarks',
      ],
    ];

    const escapeCsvValue = (value: string) => {
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`; // Wrap in double quotes if value contains a comma
      }
      return value;
    };

    workorders.forEach((item) => {
      tableRows.push([
        escapeCsvValue(item.id),
        escapeCsvValue(item.contractorName),
        escapeCsvValue(item.nature),
        escapeCsvValue(item.startDate),
        escapeCsvValue(item.endDate),
        escapeCsvValue(item.location),
        escapeCsvValue(item.workDescription),
        escapeCsvValue(item.repeatOrOneTime),
        escapeCsvValue(item.schedule || '-'),
        escapeCsvValue(item.paymentTerms || '-'),
        escapeCsvValue(item.remarks || '-'),
      ]);
    });

    const csvContent = `${tableRows.map((row) => row.join(',')).join('\n')}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'WorkOrder.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    contractorName: string
  ) => {
    const selectedIndex = selected.indexOf(contractorName);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, contractorName);
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

  const isSelected = (contractorName: string) =>
    selected.indexOf(contractorName) !== -1;

  const deleteWorkorder = async (id: string) => {
    setLoading(true);
    const res = await axios
      .delete('/api/workorder', { data: { id: id } })
      .then((res) => {
        router.replace(router.asPath);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleUpdate = async (workorder: Workorder, status: string) => {
    setLoading(true);
    const res = await axios
      .put('/api/workorder', {
        ...workorder,
        status: status,
      })
      .then((res) => {
        router.replace(router.asPath);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - workorders.length) : 0;

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
          <Stack
            direction='row'
            justifyContent='space-between'
            flexWrap='wrap'
            alignItems='center'
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Box sx={{ minWidth: 240 }}>
              <FormLabel sx={{ fontWeight: '700' }}>
                Select Contractor
              </FormLabel>
              <Autocomplete
                placeholder='Select Contractor'
                options={contractors.map((c) => ({
                  value: c.contractorId || '',
                  label: c.contractorname,
                }))}
                value={contractors
                  .map((c) => ({
                    value: c.contractorId || '',
                    label: c.contractorname,
                  }))
                  .find((c) => c.value === contractorId)}
                onChange={(e, value) => {
                  if (!value?.value) router.push(`/workorder`);
                  else router.push(`/workorder?contractorId=${value?.value}`);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Tooltip title='Print'>
              <IconButton onClick={handleClickReport}>
                <LocalPrintshopIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
        <TableContainer
          sx={{
            maxHeight: 440,
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
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size='medium'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={workorders.length}
              headCells={headCells}
            />
            <TableBody>
              {workorders
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
                          onClick={(event) =>
                            handleClick(event, row.id as string)
                          }
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
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.contractorName}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>{row.nature}</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.startDate}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.endDate}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.location}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.workDescription}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.repeatOrOneTime}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.schedule || '-'}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.paymentTerms || '-'}
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        {row.remarks || '-'}
                      </TableCell>

                      <TableCell sx={{ minWidth: 150 }}>{row.status}</TableCell>

                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.amendmentDocument ? (
                          <Typography
                            component='a'
                            href={`/api/upload?fileName=${row.amendmentDocument}`}
                            target='_blank'
                            sx={{
                              textDecoration: 'none',
                              color: theme.palette.secondary.dark,
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            View Document
                          </Typography>
                        ) : (
                          <Typography>No Document</Typography>
                        )}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.addendumDocument ? (
                          <Typography
                            component='a'
                            href={`/api/upload?fileName=${row.addendumDocument}`}
                            target='_blank'
                            sx={{
                              textDecoration: 'none',
                              color: theme.palette.secondary.dark,
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            View Document
                          </Typography>
                        ) : (
                          <Typography>No Document</Typography>
                        )}
                      </TableCell>
                      <TableCell align='center' sx={{ minWidth: 150 }}>
                        {row.uploadDocument ? (
                          <Typography
                            component='a'
                            href={`/api/upload?fileName=${row.uploadDocument}`}
                            target='_blank'
                            sx={{
                              textDecoration: 'none',
                              color: theme.palette.secondary.dark,
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            View Document
                          </Typography>
                        ) : (
                          <Typography>No Document</Typography>
                        )}
                      </TableCell>
                      {session?.user?.role === 'Corporate' && (
                        <>
                          <TableCell size='small' align='center'>
                            <IconButton
                              onClick={() =>
                                router.push(`/workorder/${row.id}`)
                              }
                              sx={{ m: 0 }}
                            >
                              <Edit fontSize='small' />
                            </IconButton>
                          </TableCell>
                          <TableCell size='small' align='center'>
                            <IconButton
                              onClick={() => {
                                setOpen(true);
                                setSelectedWorkorder(row.id);
                              }}
                              sx={{ m: 0 }}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                      {session?.user?.role === 'Civil' &&
                        row.status === 'Pending' && (
                          <>
                            <TableCell size='small' align='center'>
                              <Stack direction='row' spacing={1}>
                                <IconButton
                                  color='success'
                                  onClick={() => handleUpdate(row, 'Approved')}
                                  sx={{ m: 0 }}
                                >
                                  <Done fontSize='small' color='success' />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleUpdate(row, 'Rejected')}
                                  sx={{ m: 0 }}
                                  color='error'
                                >
                                  <Close fontSize='small' color='error' />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </>
                        )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {workorders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No Data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={workorders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ m: 1, fontSize: '1rem' }}>
          Confirm the action
        </DialogTitle>
        <Box position='absolute' top={0} right={0}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>
            Are you sure, you want to delete selected Work Order
          </Typography>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button color='secondary' variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color='secondary'
            onClick={() => deleteWorkorder(selectedWorkorder as string)}
            variant='contained'
            disabled={loading}
          >
            Confirm
            {loading && (
              <CircularProgress size={15} sx={{ ml: 1, color: '#364152' }} />
            )}
          </Button>
        </DialogActions>
      </Dialog>
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
  if (session.user?.role === 'TimeKeeper') {
    return {
      redirect: {
        destination: '/timekeeper',
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

  const { contractorId } = context.query;

  let where: any = {};
  if (contractorId) {
    where = {
      contractorId: contractorId as string,
    };
  }

  let pendingWorkorders: Workorder[] = [];

  // if (session.user?.role === 'Civil') {
  pendingWorkorders = await prisma.workorder.findMany({
    where: {
      ...where,
      status: 'Pending',
    },
  });
  // }

  const workorders = await prisma.workorder.findMany({
    where: {
      ...where,
      status: {
        not: 'Pending',
      },
    },
    orderBy: {
      status: 'asc',
    },
  });

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      workorders: [...pendingWorkorders, ...workorders],
      contractors,
    },
  };
};
