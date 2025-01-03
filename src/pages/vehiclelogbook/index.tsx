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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  OutlinedInput,
  Stack,
  TextField,
  styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { Automobile, Contractor, Vehicle, Workorder } from '@prisma/client';
import EnhancedTableHead from '@/components/Table/EnhancedTableHead';
import axios from 'axios';
import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import FormSelect from '@/ui-component/FormSelect';
import dayjs, { Dayjs } from 'dayjs';
import MonthSelect from '@/ui-component/MonthSelect';
import getAutomobile from '@/utils/getAutomobile';
import _, { set } from 'lodash';
import TextEditor from '@/ui-component/TextEditor';
import AutoComplete from '@/ui-component/Autocomplete';

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
  createHeadCells('date', 'Date', false, false),
  createHeadCells('startTime', 'Start Time', false, false),
  createHeadCells('endTime', 'End Time', false, false),
  createHeadCells('totalRunningTime', 'Total Running Time', false, false),
  createHeadCells('openingMeterReading', 'Opening Meter Reading', false, false),
  createHeadCells('closingMeterReading', 'Close Meter Reading', false, false),
  createHeadCells('totalRunning', 'Total Running', false, false),
  createHeadCells(
    'hsdIssuedOrConsumed',
    'HSD Issued Or Consumed',
    false,
    false
  ),
  createHeadCells('maintenanceDays', 'Maintenance Time', false, false),
  createHeadCells('breakdownTime', 'Break Down Time', false, false),
  createHeadCells(
    'breakDownDaysCounted',
    'Breakdown Days Counted',
    false,
    false
  ),
  createHeadCells('idealStandingDays', 'Ideal Standing Days', true, false),
  createHeadCells('trips', 'Trips', true, false),
  createHeadCells('remarks', 'Remarks', false, false),
  createHeadCells('status', 'Status', false, false),
];

export default function Vehiclelogbook({
  workorders,
  contractors,
  vehicles,
}: {
  workorders: Workorder[];
  contractors: Contractor[];
  vehicles: Vehicle[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [approvalLoading, setApprovalLoading] = React.useState(false);
  const [selectedWorkorder, setSelectedWorkorder] = React.useState<
    string | undefined
  >(undefined);
  const [month, setMonth] = React.useState<string>(dayjs().format('MM/YYYY'));
  const [automobiles, setAutomobiles] = React.useState<Automobile[]>([]);
  const [changes, setChanges] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<any[]>([]);
  const [discard, setDiscard] = React.useState(false);
  const { data: session } = useSession();
  const [totalRunning, setTotalRunning] = React.useState<number>(0);
  const [totalRunningTime, setTotalRunningTime] = React.useState(0);
  const [hsdIssuedOrConsumed, setHsdIssuedOrConsumed] =
    React.useState<number>(0);
  const [subTotals, setSubTotals] = React.useState({
    totalRunning: 0,
    totalRunningTime: 0,
    hsdIssuedOrConsumed: 0,
    maintainenceDays: 0,
    breakdownDays: 0,
    idealStandingDays: 0,
    trips: 0,
  });
  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0]?.contractorId : undefined
  );

  const [vehicle, setVehicle] = React.useState<string | undefined>(
    vehicles.filter((v) => v.contractorId === contractor)[0]?.id as
      | string
      | undefined
  );

  console.log("Rows:", rows);
  

  React.useEffect(() => {
    if (session?.user?.role === 'PlantCommercial') {
      if (!headCells.find((headCell) => headCell.id === 'action'))
        headCells.push(createHeadCells('action', 'Action', false, true));
    }
  }, [session]);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post('/api/vehiclelogbook', {
        changes,
        contractorId: parseInt(contractor as string),
        month: month,
      });
    } catch (error) {
      console.log(error);
    }
    await fetchAutomobiles();
    // setLoading(false);
    setChanges([]);
  };

  const handleApprove = async (data: any) => {
    setApprovalLoading(true);
    try {
      await axios.put('/api/vehiclelogbook', {
        ...data,
        status: 'Approved',
      });
    } catch (error) {
      console.log(error);
    }
    await fetchAutomobiles();

    setApprovalLoading(false);
  };

  const handleReject = async (data: any) => {
    setApprovalLoading(true);

    try {
      await axios.put('/api/vehiclelogbook', {
        id: data.id,
        contractorId: data.contractorId,

        workorderId: data.workorderId,
        status: 'Rejected',
      });
    } catch (error) {
      console.log(error);
    }
    await fetchAutomobiles();
    setApprovalLoading(false);
  };

  const handleDiscard = () => {
    setChanges([]);
    fetchAutomobiles();
    setDiscard(true);
  };

  const onChanges = () => {
    let totalhsdconsumed = 0;
    let totalrunning = 0;
    let totalrunningtime = 0;
    let totalmaintainencedays = 0;
    let totalbreakdowndays = 0;
    let totalidealstandingdays = 0;
    let totaltrips = 0;

    rows.map((change) => {
      if (change.hsdIssuedOrConsumed) {
        totalhsdconsumed += change.hsdIssuedOrConsumed;
      }
      if (change.totalRunning) {
        totalrunning += change.totalRunning;
      }
      if (change.totalRunningTime) {
        const time = change.totalRunningTime.split(':');
        totalrunningtime += parseInt(time[0]) + parseInt(time[1]) / 60;
      }
      if (change.maintenanceDays) {
        totalmaintainencedays += change.maintenanceDays;
      }
      if (change.breakDownDaysCounted) {
        totalbreakdowndays += change.breakDownDaysCounted;
      }
      if (change.idealStandingDays) {
        totalidealstandingdays += change.idealStandingDays;
      }
      if (change.trips) {
        totaltrips += change.trips;
      }
    });

    // setTotalRunning(parseFloat(totalrunning.toFixed(2)));
    // setTotalRunningTime(parseFloat(totalrunningtime.toFixed(2)));
    // setHsdIssuedOrConsumed(parseFloat(totalhsdconsumed.toFixed(2)));
    setSubTotals({
      totalRunning: parseFloat(totalrunning.toFixed(2)),
      totalRunningTime: totalrunningtime,
      hsdIssuedOrConsumed: totalhsdconsumed,
      maintainenceDays: totalmaintainencedays,
      breakdownDays: totalbreakdowndays,
      idealStandingDays: totalidealstandingdays,
      trips: totaltrips,
    });
  };

  React.useEffect(() => {
    onChanges();
  }, [rows]);

  const handleChange = (
    value: string,
    date: string,
    field: string,
    nextdate: string
  ) => {
    if (discard) {
      setDiscard(false);
    }
    let v: string | number = value;
    if (
      [
        'openingMeterReading',
        'closingMeterReading',
        'breakDownDaysCounted',
        'totalRunning',
        'hsdIssuedOrConsumed',
        'idealStandingDays',
        'maintenanceDays',
        'trips',
      ].includes(field)
    ) {
      v = value ? Number(value) : '';
    }

    let flag1 = false;
    let flag2 = false;

    const updatedChanges = changes.map((e) => {
      if (e.date === date) {
        if (e.closingMeterReading && field === 'openingMeterReading') {
          e.totalRunning = e.closingMeterReading - (v as number);
        }
        if (e.openingMeterReading && field === 'closingMeterReading') {
          e.totalRunning = (v as number) - e.openingMeterReading;
        }
        if (e.startTime && field === 'endTime') {
          const start = dayjs(e.startTime, 'HH:mm');
          const end = dayjs(v, 'HH:mm');
          const diff = end.diff(start, 'minute');
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;

          const formattedHours = String(hours).padStart(2, '0');
          const formattedMinutes = String(minutes).padStart(2, '0');

          e.totalRunningTime = `${formattedHours}:${formattedMinutes}`;
        }
        if (e.endTime && field === 'startTime') {
          const end = dayjs(e.endTime, 'HH:mm');
          const start = dayjs(v, 'HH:mm');
          const diff = end.diff(start, 'minute');
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;

          const formattedHours = String(hours).padStart(2, '0');
          const formattedMinutes = String(minutes).padStart(2, '0');

          e.totalRunningTime = `${formattedHours}:${formattedMinutes}`;
        }
        if (e.openingMeterReading && field === 'closingMeterReading')
          e.totalRunning = parseFloat(
            ((v as number) - e.openingMeterReading).toFixed(2)
          );
        if (e[field] || v) e[field] = v;
        flag1 = true;
      }
      if (e.date === nextdate && field === 'closingMeterReading') {
        if (e.openingMeterReading) {
          e.totalRunning = parseFloat(
            (e.closingMeterReading - (v as number)).toFixed(2)
          );
        }
        if (field === 'closingMeterReading') e.openingMeterReading = v;
        flag2 = true;
      }
      return e;
    });

    if (!flag1) {
      let ch = rows.find((e) => e.date === date);
      if (v || v === 0) {
        if (ch.startTime && field === 'endTime') {
          const start = dayjs(ch.startTime, 'HH:mm');
          const end = dayjs(v, 'HH:mm');
          const diff = end.diff(start, 'minute');
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;

          const formattedHours = String(hours).padStart(2, '0');
          const formattedMinutes = String(minutes).padStart(2, '0');

          ch.totalRunningTime = `${formattedHours}:${formattedMinutes}`;
        }
        updatedChanges.push({
          date: date,
          ...ch,
          [field]: v,
          contractorId: contractor as string,
          vehicleId: vehicle as string,
        });
      }
    }

    if (!flag2 && field === 'closingMeterReading' && value) {
      updatedChanges.push({
        date: nextdate,
        ...rows.find((e) => e.date === nextdate),
        openingMeterReading: v,
        contractorId: contractor as string,
        vehicleId: vehicle as string,
      });
    }

    setChanges(updatedChanges);

    // if (field === "closingMeterReading" || field === "endTime") {
    //   const nextIndex = changes.findIndex((e) => e.date === nextdate);
    //   if (nextIndex !== -1) {
    //     const newEditedValues = [...changes];
    //     if (field === "closingMeterReading")
    //       newEditedValues[nextIndex]["openingMeterReading"] = v;
    //     if (field === "endTime") newEditedValues[nextIndex]["startTime"] = v;

    //     setChanges(newEditedValues);
    //   } else {
    //     setChanges((c) =>
    //       c.map((e) => {
    //         if (e.date === nextdate) {
    //           if (e.closingMeterReading) {
    //             e.totalRunning = e.closingMeterReading - (v as number);
    //           }
    //           if (field === "endTime") e.startTime = v;
    //           if (field === "closingMeterReading") e.openingMeterReading = v;
    //         }
    //         return e;
    //       })
    //     );
    //     // setChanges((c) => [
    //     //   ...c,
    //     //   {
    //     //     date: nextdate,
    //     //     ...rows.find((e) => e.date === nextdate),
    //     //     [field === "closingMeterReading"
    //     //       ? "openingMeterReading"
    //     //       : "startTime"]: v,
    //     //     contractorId: contractor as string,
    //     //   },
    //     // ]);
    //   }
    // }
    // const index = changes.findIndex((e) => e.date === date);

    // if (index === -1) {
    //   setChanges((c) => [
    //     ...c,
    //     {
    //       date: date,
    //       ...rows.find((e) => e.date === date),
    //       [field]: v,
    //       contractorId: contractor as string,
    //     },
    //   ]);
    // } else {
    //   const newEditedValues = [...changes];
    //   newEditedValues[index][field] = v;

    //   setChanges(newEditedValues);
    // }
  };

  const handleClickReport = () => {
    const tableRows = [
      [
        'Date',
        'Contractor Name',
        'Month',
        'Start Time',
        'End Time',
        'Total Running Time',
        'Opening Meter Reading',
        'Closing Meter Reading',
        'Total Running',
        'HSD Issued Or Consumed',
        'Maintenance Days',
        'Breakdown Time',
        'Breakdown Days Counted',
        'Ideal Standing Days',
        'Trips',
        'Remarks',
        'Status',
      ],
    ];

    const escapeCsvValue = (value: string) => {
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`; // Wrap in double quotes if value contains a comma
      }
      return value;
    };

    const c = contractors.find((c) => c.contractorId === contractor);

    rows.forEach((item) => {
      tableRows.push([
        escapeCsvValue(item.date),
        escapeCsvValue(c?.contractorname || '-'),
        escapeCsvValue(month),
        escapeCsvValue(item.startTime),
        escapeCsvValue(item.endTime),
        escapeCsvValue(item.totalRunningTime),
        escapeCsvValue(item.openingMeterReading),
        escapeCsvValue(item.closingMeterReading),
        escapeCsvValue(item.totalRunning || '-'),
        escapeCsvValue(item.hsdIssuedOrConsumed || '-'),
        escapeCsvValue(item.maintenanceDays || '-'),
        escapeCsvValue(item.breakdownTime || '-'),
        escapeCsvValue(item.breakDownDaysCounted || '-'),
        escapeCsvValue(item.idealStandingDays || '-'),
        escapeCsvValue(item.trips || '-'),
        escapeCsvValue(item.remarks || '-'),
        escapeCsvValue(item.status || '-'),
      ]);
    });

    const csvContent = `${tableRows.map((row) => row.join(',')).join('\n')}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Vehiclelogbook.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const generateDatesForMonth = (year: number, month: number): { date: string }[] => {
    const today = dayjs(); // Get today's date
  const isCurrentMonth = today.month() + 1 === month && today.year() === year; // Check if it's the current month

  // Determine the last day for the month
  const lastDay = isCurrentMonth
    ? today.date() // If it's the current month, limit to today's date
    : dayjs(`${year}-${month}-01`, 'YYYY-MM').daysInMonth(); // Otherwise, get the full month days

  // Generate dates from the 1st to the last calculated day
  const dates: { date: string }[] = [];
  for (let day = 1; day <= lastDay; day++) {
    dates.push({
      date: dayjs(new Date(year, month - 1, day)).format('DD/MM/YYYY'),
    });
  }
    return dates;
  };


  const fetchAutomobiles = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/vehiclelogbook?month=${month}&contractor=${contractor}`
    );
    // setAutomobiles(
    //   res.data.filter((auto: Automobile) => auto.vehicleId === vehicle)
    // );
    // const r = getAutomobile(
    //   res.data.filter((auto: Automobile) => auto.vehicleId === vehicle),
    //   dayjs(month, 'MM/YYYY').month() + 1,
    //   dayjs(month, 'MM/YYYY').year()
    // );

    const r = (() => {
      const allDatesForMonth = generateDatesForMonth(
        dayjs(month, 'MM/YYYY').year(),
        dayjs(month, 'MM/YYYY').month() + 1
      );
    
      const filteredData = res.data.filter(
        (auto: Automobile) => auto.vehicleId === vehicle
      );
    
      // Merge filtered data with all dates for the month
      return allDatesForMonth.map((dateObj) => {
        const matchingRecord = filteredData.find(
          (record: Automobile) => record.date === dateObj.date
        );
        return {
          ...dateObj,
          ...matchingRecord, // Merge the data from filteredData if it exists
        };
      });
    })();

    setRows(r);
    console.log("r:", r);
    
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAutomobiles();
    setChanges([]);
  }, [contractor, month, vehicle]);

  React.useEffect(() => {
    if (contractor) {
      setVehicle(vehicles.filter((v) => v.contractorId === contractor)[0]?.id);
    }
  }, [contractor]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredVehicles = vehicles.filter(
    (vehicle) => vehicle.contractorId === contractor
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', pb: 2, overflow: 'auto' }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Stack sx={{ width: '100%' }} justifyContent='center' spacing={2}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Stack direction='row' alignItems='center' spacing={2}>
                <AutoComplete
                  label='Select Contractor'
                  value={contractor as string}
                  setValue={setContractor}
                  options={contractors.map((c) => ({
                    value: c.contractorId || '',
                    label: c.contractorname,
                  }))}
                />
                <MonthSelect
                  label='Select Month'
                  value={dayjs(month, 'MM/YYYY')}
                  onChange={(value: Dayjs | null) =>
                    setMonth(value?.format('MM/YYYY') || '')
                  }
                />
                <AutoComplete
                  label='Vehicle'
                  value={vehicle as string}
                  setValue={setVehicle}
                  options={filteredVehicles.map((vehicle) => ({
                    label: vehicle.vehicleNo + ' ' + vehicle.vehicleType,
                    value: vehicle.id,
                  }))}
                />
              </Stack>
              <Box>
                <IconButton
                  sx={{
                    height: 'fit',
                  }}
                  onClick={handleClickReport}
                >
                  <LocalPrintshopIcon />
                </IconButton>
              </Box>
            </Stack>
            {changes.length > 0 && (
              <Stack
                direction='row'
                spacing='1rem'
                sx={{ alignSelf: 'flex-end' }}
              >
                <Button
                  variant='contained'
                  onClick={() => handleSave()}
                  disabled={loading}
                  color='secondary'
                >
                  Save
                  {loading && (
                    <CircularProgress
                      size={15}
                      sx={{ ml: 1, color: '#364152' }}
                    />
                  )}
                </Button>
                <Button
                  variant='outlined'
                  disabled={loading}
                  onClick={handleDiscard}
                  color='secondary'
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
        {vehicle ? (
          <TableContainer
            sx={{
              maxHeight: '55vh',
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
              sx={{ minWidth: 750 }}
              aria-labelledby='tableTitle'
              size='medium'
              stickyHeader
            >
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}
                headCells={headCells}
                nocheckbox={true}
                align='center'
              />
              {(!loading || approvalLoading) && (
                <TableBody>
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.id as string);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding='checkbox'></TableCell>

                        {headCells.map(
                          (cell, index) =>
                            !cell.included && (
                              <TableCell
                                id={labelId}
                                scope='row'
                                padding='none'
                                align='center'
                                sx={{ minWidth: 150 }}
                              >
                                <TextEditor
                                  handleChange={handleChange}
                                  field={cell.id}
                                  date={row.date}
                                  value={_.get(row, cell.id, '')}
                                  type={
                                    cell.id === 'openingMeterReading' ||
                                    cell.id === 'closingMeterReading' ||
                                    cell.id === 'totalRunning' ||
                                    cell.id === 'breakDownDaysCounted' ||
                                    cell.id === 'maintenanceDays' ||
                                    cell.id === 'idealStandingDays' ||
                                    cell.id === 'hsdIssuedOrConsumed'
                                      ? 'number'
                                      : 'text'
                                  }
                                  discard={discard}
                                  setDiscard={setDiscard}
                                  changes={changes}
                                />
                              </TableCell>
                            )
                        )}
                        {session?.user?.role === 'PlantCommercial' &&
                          row.status === 'Pending' && (
                            <TableCell size='small' align='center'>
                              <Box
                                display='flex'
                                alignItems='center'
                                sx={{ color: '#673AB7' }}
                              >
                                {approvalLoading ? (
                                  <CircularProgress
                                    size={15}
                                    sx={{ ml: 1, color: '#364152' }}
                                  />
                                ) : (
                                  <>
                                    <Button onClick={() => handleApprove(row)}>
                                      <Done sx={{ color: '#673AB7' }} />
                                    </Button>
                                    <Button onClick={() => handleReject(row)}>
                                      <Close sx={{ color: '#673AB7' }} />
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          )}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        ) : (
          <Typography
            sx={{ textAlign: 'center', fontSize: '1.5rem', my: '3rem' }}
          >
            No Vehicle Found
          </Typography>
        )}
        <Stack direction='row' spacing={5} sx={{ pt: 2, px: 2 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            Total Running:{' '}
            <span style={{ fontWeight: '500' }}> {subTotals.totalRunning}</span>
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            Total Running Time:{' '}
            <span style={{ fontWeight: '500' }}>
              {subTotals.totalRunningTime.toFixed(2)} Hours
            </span>
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            HSD Issued Or Consumed:{' '}
            <span style={{ fontWeight: '500' }}>
              {subTotals.hsdIssuedOrConsumed}
            </span>
          </Typography>
        </Stack>
        <Stack direction='row' spacing={5} sx={{ p: 2 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            Total Maintenance Days:{' '}
            <span style={{ fontWeight: '500' }}>
              {subTotals.maintainenceDays}
            </span>
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            Total Breakdown Days:{' '}
            <span style={{ fontWeight: '500' }}>{subTotals.breakdownDays}</span>
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            Total Ideal Standing Days:{' '}
            <span style={{ fontWeight: '500' }}>
              {subTotals.idealStandingDays}
            </span>
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: '700' }}>
            Total Trips:{' '}
            <span style={{ fontWeight: '500' }}>{subTotals.trips}</span>
          </Typography>
        </Stack>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
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

  if (session.user?.role === 'Admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }
  const workorders = await prisma.workorder.findMany();
  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: 'Equipment / Vehicle Hiring',
    },
  });
  const vehicles = await prisma.vehicle.findMany();
  return {
    props: {
      workorders,
      contractors,
      vehicles,
    },
  };
};
