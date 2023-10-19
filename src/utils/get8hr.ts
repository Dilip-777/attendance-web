import { Department, Designations, SeperateSalary, Shifts, TimeKeeper } from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

// Filter By Designation and Attendance
const filter = (
  item: TimeKeeper,
  designation: DesignationwithSalary,
  attendance: string,
  wrkhrs?: number,
  shifts?: Shifts[]
) => {
  const s = shifts?.find((s) => s.shift === (item.manualshift || item.machineshift));

  if (wrkhrs && s?.totalhours !== wrkhrs) return false;
  if (item.attendance === attendance) return false;
  if (designation.gender === 'Male' || designation.gender === 'M') {
    return (
      item.designation.toLowerCase() === designation.designation.toLowerCase() &&
      item.gender &&
      item.gender[0] === designation.gender[0]
    );
  } else if (designation.gender === 'Female' || designation.gender === 'F') {
    return (
      item.designation.toLowerCase() === designation.designation.toLowerCase() &&
      item.gender &&
      item.gender[0] === designation.gender[0]
    );
  } else {
    return item.designation.toLowerCase() === designation.designation.toLowerCase();
  }
};

// Get Count of 8HR and 12HR Shifts
const getCountofShifts = (
  timekeeper: TimeKeeper[],
  shifts: Shifts[],
  designation: DesignationwithSalary,
  wrkhrs: number
) => {
  const fullpresentcount = timekeeper.filter((item) => filter(item, designation, '0.5')).length;
  const halfpresentcount = timekeeper.filter((item) => filter(item, designation, '1')).length;

  return fullpresentcount + halfpresentcount / 2;
};

const getTotalAmountAndRows = (
  timekeeper: TimeKeeper[],
  month: number,
  year: number,
  shifts: Shifts[],
  contractorId: string,
  designations?: DesignationwithSalary[],
  department?: Department | undefined,
  wrkhrs?: number
) => {
  const m = dayjs(month).daysInMonth();

  console.log(m, 'days in month');

  let filtered: TimeKeeper[] = [];

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

  const filterByShift = (item: TimeKeeper, workinghrs?: number) => {
    if (!workinghrs) return true;
    const shift = shifts.find((s) => s.shift === (item.manualshift || item.machineshift));
    if (shift?.totalhours === workinghrs) return true;
    else if (!shift) return workinghrs === 8;
    else return false;
  };

  const getDataOfDate = (date: string) => {
    const obj: Record<string, string | number> = {
      date: date,
      total: 0,
    };
    designations?.forEach((designation) => {
      const id = designation.designationid;
      const f = timekeeper.filter(
        (item) =>
          filter(item, designation, '0.5') &&
          item.attendancedate === date &&
          (designation.basicsalary_in_duration === 'Monthly' || filterByShift(item, wrkhrs as number))
      );

      filtered.push(...f);

      const hf = timekeeper.filter(
        (item) =>
          filter(item, designation, '1') &&
          item.attendancedate === date &&
          (designation.basicsalary_in_duration === 'Monthly' || filterByShift(item, wrkhrs as number))
      );
      const count = f.length + hf.length / 2;
      obj[id] = count;
      obj['total'] = (obj.total as number) + count;
    });
    return obj;
  };

  const getRoundOff = (num: number) => {
    return num;
  };

  const rows2: any[] = [];

  const rows: any[] = [];

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    const date = `${i.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    rows.push(getDataOfDate(date));
  }

  if (designations) {
    designations.forEach((designation) => {
      const id = designation.designationid;
      // attendancecount[id] = filtered.length + filtered1.length / 2;
      // attendancecount['total'] = (attendancecount.total as number) + (Number(_.get(attendancecount, id, 0)) || 0);
      rows.forEach((r) => {
        attendancecount[id] = ((attendancecount[id] as number) || 0) + (Number(_.get(r, id, 0)) || 0);
      });
      attendancecount['total'] = (attendancecount.total as number) + (Number(_.get(attendancecount, id, 0)) || 0);
      console.log(designation, 'designation');

      const s = designation.seperateSalary?.find((s) => s.contractorId === contractorId);
      if (s) {
        rate[id] = s.salary;
      } else if (designation.basicsalary_in_duration === 'Monthly' || !wrkhrs) {
        rate[id] = designation.basicsalary || 0;
      } else {
        rate[id] = wrkhrs === 8 ? designation.basicsalary : designation.basicsalaryfor12hr;
      }

      if (designation.basicsalary_in_duration === 'Monthly') {
        totalManDayAmount[id] = getRoundOff(
          ((_.get(attendancecount, id, 0) as number) * Number(_.get(rate, id, 0))) / m
        );
      } else {
        totalManDayAmount[id] = getRoundOff((_.get(attendancecount, id, 0) as number) * Number(_.get(rate, id, 0)));
      }
      // else {
      //   const count8hr = getCountofShifts(timekeeper, shifts, designation, 8);
      //   const count12hr = getCountofShifts(timekeeper, shifts, designation, 12);
      //   const rate8hr = designation.basicsalary;
      //   const rate12hr = designation.basicsalaryfor12hr;
      //   console.log(count8hr, count12hr, rate8hr, rate12hr);

      //   totalManDayAmount[id] = getRoundOff(count8hr * rate8hr + count12hr * rate12hr);
      // }
      //   totalManDayAmount[id] = getRoundOff((_.get(attendancecount, id, 0) as number) * Number(_.get(rate, id, 0)));

      totalManDayAmount['total'] = getRoundOff(
        (totalManDayAmount.total as number) + Number(_.get(totalManDayAmount, id, 0))
      );

      totalovertime[id] = filtered
        .filter((f) => filter(f, designation, '0.5'))
        .reduce(
          (acc, curr) =>
            acc + parseInt(parseInt(curr.manualovertime as string) === 0 ? '0' : curr.manualovertime || curr.overtime),
          0
        );
      totalovertime['total'] = getRoundOff((totalovertime.total as number) + Number(_.get(totalovertime, id, 0)));
      let otRate = 0;
      if (designation.basicsalary_in_duration === 'Monthly') {
        otRate = getRoundOff(designation.basicsalary / designation.allowed_wrking_hr_per_day / m);
      } else {
        otRate = getRoundOff(
          wrkhrs === 8
            ? designation.basicsalary / (wrkhrs || designation.allowed_wrking_hr_per_day)
            : designation.basicsalaryfor12hr / (wrkhrs || designation.allowed_wrking_hr_per_day)
        );
      }
      otamount[id] = getRoundOff(Number(_.get(totalovertime, id, 0)) * otRate);
      otamount['total'] = getRoundOff((otamount.total as number) + Number(_.get(otamount, id, 0)));
      totalnetamount[id] = getRoundOff(Number(_.get(totalManDayAmount, id, 0)) + Number(_.get(otamount, id, 0)));
      cprate[id] = designation.servicecharge as number;

      cpamount[id] = getRoundOff((Number(_.get(totalManDayAmount, id, 0)) * Number(_.get(cprate, id, 0))) / 100);

      cpamount['total'] = getRoundOff((cpamount.total as number) + Number(_.get(cpamount, id, 0)));
      total[id] = getRoundOff(Number(_.get(totalnetamount, id, 0)) + Number(_.get(cpamount, id, 0)));
      gst1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.18));
      billAmount1[id] = getRoundOff(Number(_.get(total, id, 0)) + Number(_.get(gst1, id, 0)));
      tds1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.01));
      netPayable1[id] = Number(_.get(billAmount1, id, 0)) - Number(_.get(tds1, id, 0));
    });
  }

  // attendancecount["total"] = timekeeper.length
  rate['total'] = 0;
  totalnetamount['total'] = parseFloat(totalManDayAmount.total as string) + parseFloat(otamount.total as string);
  total['total'] = totalnetamount.total + parseFloat(cpamount.total as string);
  gst1['total'] = getRoundOff(Number(total.total * 0.18));
  billAmount1['total'] = getRoundOff(Number(total.total + gst1.total));
  tds1['total'] = getRoundOff(Number(total.total * 0.01));
  netPayable1['total'] = getRoundOff(Number(billAmount1.total - tds1.total));
  rows2.push(attendancecount);
  rows.push(attendancecount);

  rows2.push(rate);
  rows.push(rate);

  rows2.push(totalManDayAmount);
  rows.push(totalManDayAmount);
  rows2.push(totalovertime);
  rows.push(totalovertime);
  rows2.push(otamount);
  rows.push(otamount);
  rows2.push(totalnetamount);
  rows.push(totalnetamount);
  // if(department?.basicsalary_in_duration?.toLowerCase() === "hourly") {
  rows2.push(cprate);
  rows.push(cprate);
  rows2.push(cpamount);
  rows.push(cpamount);
  rows2.push(total);
  rows.push(total);
  // }
  rows2.push(gst1);

  rows2.push(billAmount1);
  rows2.push(tds1);
  rows2.push(netPayable1);

  return { rows, total1: total.total, rows1: rows2, totalnetPayable: netPayable1.total };
};

export default getTotalAmountAndRows;
