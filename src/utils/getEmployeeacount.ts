import { Department, Designations, Employee, TimeKeeper } from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';

const filterByDate = ({
  item,
  attendance,
  date,
  employeeId,
}: {
  item: TimeKeeper;
  attendance: string;
  date?: string;
  employeeId: string;
}) => {
  //   console.log(item, department, gender, attendance);
  if (employeeId !== item.employeeid) return false;
  if (attendance !== item.attendance) return false;
  if (date) {
    return item.attendancedate === date;
  }
  return true;
};

interface EmployeeDepartmentDesignation extends Employee {
  department: Department;
  designation: Designations;
}

const getEmployeesCalculation = (
  timekeeper: TimeKeeper[],
  month: number,
  year: number,
  employees: EmployeeDepartmentDesignation[]
) => {
  const m = dayjs(month).daysInMonth();

  const getRoundOff = (num: number) => {
    return num;
  };

  const rows = [] as any[];

  const totalobj: Record<string, string | number> = {
    employeeId: 'Total',
    name: '',
    designation: '',
  };

  employees.forEach((employee) => {
    const id = employee.employeeId;
    const f = timekeeper.filter((f) => filterByDate({ item: f, attendance: '1', employeeId: id }));
    const hf = timekeeper.filter((f) => filterByDate({ item: f, attendance: '0.5', employeeId: id }));

    const obj: Record<string, string | number> = {
      employeeId: id,
      name: employee.employeename,
      designation: employee.designation.designation,
    };

    const count = f.length + hf.length / 2;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
      const f = timekeeper.filter((f) => filterByDate({ item: f, attendance: '1', employeeId: id, date }));
      const hf = timekeeper.filter((f) => filterByDate({ item: f, attendance: '0.5', employeeId: id, date }));
      obj[date] = f.length + hf.length / 2;
      totalobj[date] = ((totalobj[date] as number) || 0) + (f.length + hf.length / 2);
    }

    obj['total'] = count;
    totalobj['total'] = ((totalobj['total'] as number) || 0) + count;
    obj['rate'] = employee.basicsalary;
    totalobj['rate'] = '';

    obj['amount'] = getRoundOff((count * employee.basicsalary) / m);
    totalobj['amount'] = (((totalobj['amount'] as number) || 0) + obj['amount']) as number;

    obj['othrs'] = f.reduce(
      (acc, curr) =>
        acc + parseInt(parseInt(curr.manualovertime as string) === 0 ? '0' : curr.manualovertime || curr.overtime),
      0
    );
    totalobj['othrs'] = (((totalobj['othrs'] as number) || 0) + obj['othrs']) as number;

    obj['otamount'] = getRoundOff((obj['othrs'] * employee.basicsalary) / (m * employee.allowed_wrking_hr_per_day));
    totalobj['otamount'] = (((totalobj['otamount'] as number) || 0) + obj['otamount']) as number;

    obj['totalamount'] = getRoundOff(obj['amount'] + obj['othrs']);
    totalobj['totalamount'] = (((totalobj['totalamount'] as number) || 0) + obj['totalamount']) as number;
    rows.push(obj);
  });

  rows.push(totalobj);

  return { rows, total: totalobj.total || 0, nettotal: totalobj.totalamount || 0 };
};

export default getEmployeesCalculation;
