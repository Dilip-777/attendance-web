import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Contractor, Department, Designations, SeperateSalary, Shifts, TimeKeeper } from '@prisma/client';
import getTotalAmountAndRows from '@/utils/getmonthlycount';
import dayjs from 'dayjs';
import _, { set } from 'lodash';
import getHourlyCount from '@/utils/gethourlycount';
import { IconButton, Tooltip } from '@mui/material';
import handleprint from './printexcel';

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

interface TableProps {
  departments: DepartmentDesignation[];
  contractor: string;
  shifts: Shifts[];
  value: string;
  wrkhrs: number;
  servicecharge?: number;
  timekeepers: TimeKeeper[];
}

const HourlyTable = ({ departments, contractor, shifts, value, wrkhrs, servicecharge, timekeepers }: TableProps) => {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [allcounts, setAllCounts] = React.useState<Record<string, string | number>[]>([]);
  const [colspan, setColspan] = React.useState(0);
  const [multiplier, setMultiplier] = React.useState(0);
  const [netTotal, setNetTotal] = React.useState(0);
  const sgst = Math.ceil(total * 0.09);

  const fetchTimekeepers = async () => {
    setLoading(true);
    const { rows, total, allcounts, netTotal } = getHourlyCount(
      timekeepers,
      dayjs(value, 'MM/YYYY').month() + 1,
      dayjs(value, 'MM/YYYY').year(),
      shifts,
      contractor,
      departments,
      wrkhrs
    );

    setAllCounts(allcounts);
    setRows(rows);
    setTotal(total as number);
    setNetTotal(netTotal);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value, contractor, departments, wrkhrs]);

  React.useEffect(() => {
    updatecolspan();
    updateMultiplier();
  }, [departments]);

  const headcells = [
    { label: '', id: 'date' },
    { label: 'Att Count', id: 'attendancecount' },
    { label: 'Amt', id: 'mandaysamount' },
    { label: 'OT Hrs', id: 'othrs' },
    { label: 'OT Amt', id: 'otamount' },
    { label: 'Total', id: 'totalnetamount' },
  ];
  // const colspan = departments.length > 2 ? 3 : 1;
  const updatecolspan = () => {
    let count = 0;
    departments
      .filter((d) => d.basicsalary_in_duration === 'Hourly')
      .forEach((department) => {
        count += department.designations.length;
      });
    console.log(count, 'count');

    if (count >= 7) {
      setColspan(count - 6);
    } else if (count * 2 >= 7) {
      setColspan(count * 2 - 6);
    } else if (count * 3 >= 7) {
      setColspan(count * 3 - 6);
    } else if (count * 4 >= 7) {
      setColspan(count * 4 - 6);
    } else {
      setColspan(0);
    }
  };

  const updateMultiplier = () => {
    let count = 0;
    departments
      .filter((d) => d.basicsalary_in_duration === 'Hourly')
      .forEach((department) => {
        count += department.designations.length;
      });
    console.log(count, 'count');

    if (count >= 7) {
      setMultiplier(1);
    } else if (count > 2) {
      setMultiplier(7 - count);
    } else if (count <= 2) {
      setMultiplier(4);
    } else {
      setMultiplier(0);
    }
  };

  return (
    <Stack spacing={3} p={3} pt={0}>
      <Tooltip title="Print" sx={{ alignSelf: 'flex-end', mr: 3 }}>
        <IconButton
          onClick={() =>
            handleprint({
              rows,
              departments,
              contractor,
              month: dayjs(value, 'MM/YYYY').month() + 1,
              year: dayjs(value, 'MM/YYYY').year(),
              allcounts,
              total,
              netTotal,
            })
          }
        >
          <LocalPrintshopIcon />
        </IconButton>
      </Tooltip>
      <TableContainer
        sx={{
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            // width: 7,
            height: 9,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: 2,
          },
          border: '1px solid #e0e0e0',
          borderRadius: 2,
        }}
      >
        <Table sx={{}} aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#e0e0e0' }}>
              <TableCell align="center" sx={{ fontWeight: '700', bgcolor: '#e0e0e0' }} colSpan={1}>
                Date
              </TableCell>
              {departments.map((department) => {
                return (
                  <TableCell
                    key={department.id}
                    align="center"
                    sx={{ fontWeight: '700', bgcolor: '#e0e0e0' }}
                    colSpan={department.designations.length * multiplier}
                  >
                    {department.department}
                  </TableCell>
                );
              })}
              <TableCell align="center" sx={{ fontWeight: '700', bgcolor: '#e0e0e0' }} colSpan={1}>
                TOTAL
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: '700' }} colSpan={1}>
                -
              </TableCell>
              {departments
                .filter((d) => d.designations.length !== 0)
                .map((department) =>
                  department.designations.map((designation) => (
                    <TableCell key={designation.id} align="center" sx={{ fontWeight: '700' }} colSpan={multiplier}>
                      {designation.designation}
                    </TableCell>
                  ))
                )}
              <TableCell align="center" sx={{ fontWeight: '700' }} colSpan={1}>
                -
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.f8mw}>
                    {/* {columns.map((column) => {
                      const value = _.get(row, column.id, '-');
                      const value1 = _.get(row, 'date', '-');

                      return (
                        <TableCell key={column.id} align={'center'}>
                          {column.id === 'date' || value1 === 'Total Man days' || value1 === 'Overtime Hrs.'
                            ? value
                            : Math.ceil(value as number)}
                        </TableCell>
                      );
                    })} */}
                    <TableCell key={row.date} align={'center'}>
                      {row.date}
                    </TableCell>
                    {departments.map((department) =>
                      department.designations.map((designation) => (
                        <TableCell key={designation.id} align={'center'} colSpan={multiplier}>
                          {[
                            'Man Days Amount',
                            'OT Amount',
                            'Total Amount',
                            'Service Charge Amount',
                            'Taxable',
                          ].includes(row.date as string)
                            ? Math.ceil(row[designation.id] as number)
                            : row[designation.id]}

                          {/* {_.get(row, designation.id, 0)} */}
                        </TableCell>
                      ))
                    )}
                    <TableCell key={row.total} align={'center'}>
                      {Math.ceil(row.total as number)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
            <TableRow>
              {headcells.map((headcell) => (
                <TableCell align="center" sx={{ fontWeight: '700' }} colSpan={1}>
                  {headcell.label}
                </TableCell>
              ))}
              <TableCell colSpan={colspan}></TableCell>
              <TableCell sx={{ fontWeight: '700' }}>ADD 10%</TableCell>
              <TableCell sx={{ fontWeight: '700' }} align="center">
                {Math.ceil(total * 0.1)}
              </TableCell>
            </TableRow>
            {allcounts.map((a) => (
              <TableRow key={a.date}>
                {headcells.map((headcell) => (
                  <TableCell align="center" colSpan={1}>
                    {!(headcell.id === 'attendancecount' || headcell.id === 'date')
                      ? Math.ceil(a[headcell.id] as number) || 0
                      : a[headcell.id] || 0}
                  </TableCell>
                ))}
                <TableCell colSpan={colspan}></TableCell>
                {/* {getColspan() && <TableCell colSpan={getColspan()}></TableCell>} */}
                <TableCell sx={{ fontWeight: '700' }}>{a.label}</TableCell>
                <TableCell sx={{ fontWeight: '700' }} align="center">
                  {Math.ceil(a.value as number)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default HourlyTable;
