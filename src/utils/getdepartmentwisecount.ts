import {
  Contractor,
  Department,
  Designations,
  FixedValues,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from '@prisma/client';
import _ from 'lodash';

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

const filter = (
  item: TimeKeeper,
  designation: DesignationwithSalary,
  attendance: string,
  wrkhrs?: number,
  shifts?: Shifts[]
) => {
  const s = shifts?.find(
    (s) => s.shift === (item.manualshift || item.machineshift)
  );

  if (wrkhrs && s?.totalhours !== wrkhrs) return false;
  if (item.attendance === attendance) return false;
  if (designation.gender === 'Male' || designation.gender === 'M') {
    return (
      item.designation.toLowerCase() ===
        designation.designation.toLowerCase() &&
      item.gender &&
      item.gender[0] === designation.gender[0]
    );
  } else if (designation.gender === 'Female' || designation.gender === 'F') {
    return (
      item.designation.toLowerCase() ===
        designation.designation.toLowerCase() &&
      item.gender &&
      item.gender[0] === designation.gender[0]
    );
  } else {
    return (
      item.designation.toLowerCase() === designation.designation.toLowerCase()
    );
  }
};

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

interface Props {
  timekeeper: TimeKeeper[];
  month: string;
  shifts: Shifts[];
  contractor: Contractor;
  fixedValues: FixedValues | null;
  departments: DepartmentDesignation[];
  departmentWiseOtDays: any;
}

export const getDepartmentwiseCount = ({
  timekeeper,
  month,
  shifts,
  contractor,
  fixedValues,
  departments,
  departmentWiseOtDays,
}: Props) => {
  const getRoundOff = (num: number) => {
    return num;
  };

  const filterByShift = (item: TimeKeeper, workinghrs?: number) => {
    if (!workinghrs) return true;

    const shift = shifts.find(
      (s) => s.shift === (item.manualshift || item.machineshift)
    );
    if (shift?.totalhours === workinghrs) return true;
    else if (!shift) return workinghrs === 8;
    else return false;
  };

  const rate: Record<string, string | number> = {
    date: 'Rate',
  };

  const totalovertime: Record<string, string | number> = {
    date: 'Overtime Hrs.',
    total: 0,
  };
  const attendancecount: Record<string, string | number> = {
    date: 'Total Man days',
    total: 0,
  };
  const totalManDayAmount: Record<string, string | number> = {
    date: 'Man Days Amount',
    total: 0,
  };

  const otamount: Record<string, string | number> = {
    date: 'OT Amount',
    total: 0,
  };

  const totalnetamount: Record<string, string | number> = {
    date: 'Total Amount',
  };

  const cprate: Record<string, string | number> = {
    date: 'Service Charge Rate',
    total: 0,
  };

  const cpamount: Record<string, string | number> = {
    date: 'Service Charge Amount',
    total: 0,
  };

  const total: Record<string, string | number> = {
    date: 'Taxable',
  };

  const gst1: Record<string, string | number> = {
    date: 'GST',
  };

  const billAmount1: Record<string, string | number> = {
    date: 'Bill Amount',
  };

  const tds1: Record<string, string | number> = {
    date: 'TDS',
  };

  const netPayable1: Record<string, string | number> = {
    date: 'Net Payable',
  };

  console.log(departments, 'departments');

  let departmentwise: {
    departmentId: string;
    mandays: number;
    otdays: number;
    amount: number;
    servicecharges: number;
    mandaysamount: number;
  }[] = [];
  departments?.forEach((department) => {
    const name = department.department;
    const f1 = timekeeper.filter(
      (item) => item?.department?.toLowerCase() === name.toLowerCase()
    );

    let mandays = 0;
    let amount = 0;
    let mandaysamount = 0;
    let servicecharges = 0;

    department.designations.forEach((designation) => {
      const id = designation.id;
      const fulltime = f1.filter((item) => filter(item, designation, '0.5'));
      const halftime = f1.filter((item) => filter(item, designation, '1'));

      const f8 = fulltime.filter((item) => filterByShift(item, 8));
      const f12 = fulltime.filter((item) => filterByShift(item, 12));
      const h8 = halftime.filter((item) => filterByShift(item, 8));
      const h12 = halftime.filter((item) => filterByShift(item, 12));

      const count = fulltime.length + halftime.length / 2;

      attendancecount[id] = count;
      // assignCounts(
      //   "attendancecount",
      //   designation,
      //   fulltime.length + halftime.length / 2
      // );

      mandays += count;

      attendancecount['total'] =
        (attendancecount.total as number) +
        (Number(_.get(attendancecount, id, 0)) || 0);

      const s = designation.seperateSalary?.find(
        (s) => s.contractorId === contractor.contractorId
      );

      let rate8 = 0,
        rate12 = 0;

      if (s) {
        rate8 = s.salary;
        rate12 = s.salary;
      } else {
        if (designation.designation.toLowerCase() === 'supervisor') {
          rate8 = contractor.salarysvr8hr;
          rate12 = contractor.salarysvr12hr;
        } else if (designation.gender === 'Female') {
          rate8 = contractor.salarywomen8hr;
        } else {
          rate8 = contractor.salarymen8hr;
          rate12 = contractor.salarymen12hr;
        }
      }

      // if (s) {
      //   rate[id] = s.salary;
      // } else if (wrkhrs === 8) {
      //   if (designation.designation.toLowerCase() === "supervisor")
      //     rate[id] =
      //       fixedValues?.salarysvr8hr ?? (contractor.salarysvr8hr as number);
      //   else if (designation.gender === "Female")
      //     rate[id] =
      //       fixedValues?.salarywomen8hr ??
      //       (contractor.salarywomen8hr as number);
      //   else
      //     rate[id] =
      //       fixedValues?.salarymen8hr ?? (contractor.salarymen8hr as number);
      // } else if (wrkhrs === 12) {
      //   if (designation.designation.toLowerCase() === "supervisor")
      //     rate[id] =
      //       fixedValues?.salarysvr12hr ??
      //       (contractor.salarysvr12hr as number);
      //   else
      //     rate[id] =
      //       fixedValues?.salarymen12hr ??
      //       (contractor.salarymen12hr as number);
      // } else {
      //   rate[id] = 0;
      // }

      const a8 = f8.length + h8.length / 2;
      const a12 = f12.length + h12.length / 2;
      totalManDayAmount[id] = getRoundOff(
        a8 * (rate8 as number) + a12 * (rate12 as number)
      );

      // assignCounts(
      //   "mandaysamount",
      //   designation,
      //   Number(_.get(totalManDayAmount, id, 0))
      // );

      totalManDayAmount['total'] = getRoundOff(
        (totalManDayAmount.total as number) +
          Number(_.get(totalManDayAmount, id, 0))
      );

      const o8 = f8.reduce((acc, curr) => {
        return acc + (curr.manualovertime ?? curr.overtime);
      }, 0);

      const o12 = f12.reduce(
        (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
        0
      );
      mandays += o8 / 8 + o12 / 12;
      attendancecount[id] = getRoundOff(o8 + o12);
      attendancecount['date'] = 'Total OverTime Hrs.';

      totalovertime[id] = getRoundOff(o8 + o12);
      // assignCounts("othrs", designation, Number(_.get(totalovertime, id, 0)));
      totalovertime['total'] = getRoundOff(
        (totalovertime.total as number) + Number(_.get(totalovertime, id, 0))
      );
      const amount8 = getRoundOff((o8 * (rate8 as number)) / 8);
      const amount12 = getRoundOff((o12 * (rate12 as number)) / 12);
      otamount[id] = getRoundOff(amount8 + amount12);
      // assignCounts("otamount", designation, Number(_.get(otamount, id, 0)));
      otamount['total'] = getRoundOff(
        (otamount.total as number) + Number(_.get(otamount, id, 0))
      );
      mandaysamount +=
        (otamount[id] as number) + (totalManDayAmount[id] as number);
      totalnetamount[id] = getRoundOff(
        Number(_.get(totalManDayAmount, id, 0)) + Number(_.get(otamount, id, 0))
      );
      cprate[id] = contractor.servicecharge as number;

      cpamount[id] = getRoundOff(
        (Number(_.get(totalManDayAmount, id, 0)) *
          Number(_.get(cprate, id, 0))) /
          100
      );

      cpamount['total'] = getRoundOff(
        (cpamount.total as number) + Number(_.get(cpamount, id, 0))
      );
      total[id] = getRoundOff(
        Number(_.get(totalnetamount, id, 0)) + Number(_.get(cpamount, id, 0))
      );
      amount += total[id] as number;
      gst1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.18));
      billAmount1[id] = getRoundOff(
        Number(_.get(total, id, 0)) + Number(_.get(gst1, id, 0))
      );
      tds1[id] = getRoundOff(
        Number(((_.get(total, id, 0) as number) * (contractor.tds ?? 0)) / 100)
      );
      netPayable1[id] =
        Number(_.get(billAmount1, id, 0)) - Number(_.get(tds1, id, 0));

      // assignCounts(
      //   "totalnetamount",
      //   designation,
      //   Number(_.get(totalnetamount, id, 0))
      // );
    });
    departmentwise.push({
      departmentId: department.id,
      otdays: departmentWiseOtDays[department.department] || 0,
      mandays: Math.round(mandays),
      amount: Math.round(amount),
      mandaysamount: Math.round(amount),
      servicecharges: Math.round(servicecharges),
    });
  });
  return departmentwise;
};
