import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Typography from '@mui/material/Typography';
import { Contractor, Department, Designations, Employee, SeperateSalary, Shifts, TimeKeeper } from '@prisma/client';
import getTotalAmountAndRows from '@/utils/getmonthlycount';
import dayjs from 'dayjs';
import _ from 'lodash';
import getEmployeesCalculation from '@/utils/getEmployeeacount';
import { Tooltip, IconButton } from '@mui/material';
import handleprint from './printmonthly';

interface HeadCell {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  ceil?: boolean;
}

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

interface EmployeeDepartmentDesignation extends Employee {
  department: Department;
  designation: Designations;
}

interface TableProps {
  contractor: string;
  shifts: Shifts[];
  value: string;
  wrkhrs: number;
  servicecharge?: number;
  timekeepers: TimeKeeper[];
  employees: EmployeeDepartmentDesignation[];
  departments: DepartmentDesignation[];
}

const MonthlyPlantCommercialTable = ({
  contractor,
  shifts,
  value,
  wrkhrs,
  servicecharge,
  timekeepers,
  employees,
  departments,
}: TableProps) => {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [nettotal, setNettotal] = React.useState(0);
  const sgst = Math.ceil(total * 0.09);

  console.log(employees);

  const headcells: HeadCell[] = [
    { id: 'employeeId', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'designation', label: 'Designation' },
  ];

  const year = dayjs(value, 'MM/YYYY').year();
  const month = dayjs(value, 'MM/YYYY').month() + 1;
  const m = dayjs(month).daysInMonth();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    const date = `${i.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    headcells.push({ id: date, label: i.toString().padStart(2, '0') });
  }

  const extraheadcells = [
    { id: 'total', label: 'Total' },
    { id: 'rate', label: 'Rate' },
    { id: 'amount', label: 'Amount', ceil: true },
    { id: 'othrs', label: 'OT' },
    { id: 'otamount', label: 'OT Amount', ceil: true },
    { id: 'totalamount', label: 'Total Amount', ceil: true },
  ];
  headcells.push(...extraheadcells);
  const fetchTimekeepers = async () => {
    setLoading(true);
    const { rows, total, nettotal } = getEmployeesCalculation(
      timekeepers,
      dayjs(value, 'MM/YYYY').month() + 1,
      dayjs(value, 'MM/YYYY').year(),
      employees
    );
    // const { rows, total1 } = getTotalAmountAndRows(
    //   timekeepers,
    //   dayjs(value, 'MM/YYYY').month() + 1,
    //   dayjs(value, 'MM/YYYY').year(),
    //   shifts,
    //   contractor,
    //   designations.filter((d) => d.departmentname === department.department),
    //   department,
    //   wrkhrs
    // );
    setRows(rows);
    setTotal(total as number);
    setNettotal(nettotal as number);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value, employees, departments]);

  return (
    <Stack spacing={3} p={3}>
      <Tooltip title="Print" sx={{ alignSelf: 'flex-end', mr: 3 }}>
        <IconButton
          onClick={() =>
            handleprint({
              rows,
              departments,
              month,
              contractor,
              year,
              allcounts: [],
              total,
              netTotal: nettotal,
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
              {headcells.map((headCell) => (
                <TableCell align="center" sx={{ fontWeight: '700', bgcolor: '#e0e0e0' }} colSpan={1}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rows.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.f8mw}>
                  {headcells.map((headcell) => (
                    <TableCell key={headcell.id} align={'center'}>
                      {headcell.ceil ? Math.ceil(_.get(row, headcell.id) as number) : _.get(row, headcell.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell colSpan={m + 5}></TableCell>
              <TableCell
                colSpan={3}
                // align="left"
                sx={{ fontWeight: '600' }}
              >
                Add 10%
              </TableCell>
              <TableCell align="center">{Math.ceil(total * 0.1)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={m + 5}></TableCell>
              <TableCell
                colSpan={3}
                // align="left"
                sx={{ fontWeight: '600' }}
              >
                Taxable Amount
              </TableCell>
              <TableCell align="center">{Math.ceil(total * 0.1 + nettotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={m + 5}></TableCell>
              <TableCell
                colSpan={3}
                // align="left"
                sx={{ fontWeight: '600' }}
              >
                IGST 18%
              </TableCell>
              <TableCell align="center">{Math.ceil((total * 0.1 + nettotal) * 0.18)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={m + 5}></TableCell>
              <TableCell
                colSpan={3}
                // align="left"
                sx={{ fontWeight: '600' }}
              >
                Total
              </TableCell>
              <TableCell align="center">
                {Math.ceil((total * 0.1 + nettotal) * 0.18 + (total * 0.1 + nettotal))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default MonthlyPlantCommercialTable;