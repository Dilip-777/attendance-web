import salary from '@/pages/api/salary';
import {
  Contractor,
  Department,
  Designations,
  FixedDesignations,
  FixedValues,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from '@prisma/client';
import dayjs from 'dayjs';
import _ from 'lodash';

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

// Filter By Designation and Attendance
const filter = (
  item: TimeKeeper,
  designation: DesignationwithSalary | FixedDesignations,
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

const getTotalAmountAndRows = (
  timekeeper: TimeKeeper[],
  month: number,
  year: number,
  contractorId: string,
  contractor: Contractor,
  designations?: DesignationwithSalary[],
  fixedDesignations?: FixedDesignations[] | null,
  department?: Department
) => {
  const m = dayjs(`${year}-${month}`).daysInMonth();

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

  const getDataOfDate = (date: string) => {
    const obj: Record<string, string | number> = {
      date: date,
      total: 0,
    };
    (fixedDesignations || designations)?.forEach((designation) => {
      const id = designation.id;
      const f = timekeeper.filter(
        (item) =>
          filter(item, designation, '0.5') && item.attendancedate === date
      );

      filtered.push(...f);

      const hf = timekeeper.filter(
        (item) => filter(item, designation, '1') && item.attendancedate === date
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
    const date = `${i.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`;

    rows.push(getDataOfDate(date));
  }

  let otdays = 0;
  let otHrs = 0;

  const monthlyFixedDesignations: any[] = [];

  if (fixedDesignations) {
    fixedDesignations
      .filter((v) => v.department === department?.department)
      .forEach((designation) => {
        const id = designation.designationId;
        const fulltime = timekeeper.filter((item) =>
          filter(item, designation, '0.5')
        );
        const halftime = timekeeper.filter((item) =>
          filter(item, designation, '1')
        );

        attendancecount[id] = fulltime.length + halftime.length / 2;

        attendancecount['total'] =
          (attendancecount.total as number) +
          (Number(_.get(attendancecount, id, 0)) || 0);

        console.log(attendancecount['total'], attendancecount[id]);

        rate[id] = designation.salary;

        if (designation.basicsalary_in_duration === 'Monthly') {
          totalManDayAmount[id] = getRoundOff(
            ((_.get(attendancecount, id, 0) as number) *
              Number(_.get(rate, id, 0))) /
              m
          );
        } else {
          totalManDayAmount[id] = getRoundOff(
            (_.get(attendancecount, id, 0) as number) *
              Number(_.get(rate, id, 0))
          );
        }

        totalManDayAmount['total'] = getRoundOff(
          (totalManDayAmount.total as number) +
            Number(_.get(totalManDayAmount, id, 0))
        );

        totalovertime[id] = fulltime.reduce(
          (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
          0
        );
        totalovertime['total'] = getRoundOff(
          (totalovertime.total as number) + Number(_.get(totalovertime, id, 0))
        );
        let otRate = 0;
        if (designation.basicsalary_in_duration === 'Monthly') {
          otRate = getRoundOff(
            Number(_.get(rate, id, 0)) /
              (designation.allowed_wrking_hr_per_day || 1) /
              m
          );
        } else {
          otRate = getRoundOff(
            Number(_.get(rate, id, 0)) / designation.allowed_wrking_hr_per_day
          );
        }
        otamount[id] = getRoundOff(
          Number(_.get(totalovertime, id, 0) || 0) * otRate
        );
        otamount['total'] = getRoundOff(
          (otamount.total as number) + Number(_.get(otamount, id, 0))
        );
        totalnetamount[id] = getRoundOff(
          Number(_.get(totalManDayAmount, id, 0)) +
            Number(_.get(otamount, id, 0))
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
        gst1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.18));
        billAmount1[id] = getRoundOff(
          Number(_.get(total, id, 0)) + Number(_.get(gst1, id, 0))
        );
        tds1[id] = getRoundOff(
          Number(
            ((_.get(total, id, 0) as number) * (contractor.tds ?? 0)) / 100
          )
        );
        netPayable1[id] =
          Number(_.get(billAmount1, id, 0)) - Number(_.get(tds1, id, 0));
      });
  } else if (designations) {
    designations.forEach((designation) => {
      const id = designation.id;
      const fulltime = timekeeper.filter((item) =>
        filter(item, designation, '0.5')
      );
      const halftime = timekeeper.filter((item) =>
        filter(item, designation, '1')
      );

      attendancecount[id] = fulltime.length + halftime.length / 2;

      attendancecount['total'] =
        (attendancecount.total as number) +
        (Number(_.get(attendancecount, id, 0)) || 0);

      const s = designation.seperateSalary?.find(
        (s) => s.contractorId === contractorId
      );
      if (s) {
        rate[id] = s.salary;
      } else {
        rate[id] = designation.basicsalary || 0;
      }

      if (designation.basicsalary_in_duration === 'Monthly') {
        totalManDayAmount[id] = getRoundOff(
          ((_.get(attendancecount, id, 0) as number) *
            Number(_.get(rate, id, 0))) /
            m
        );
      } else {
        totalManDayAmount[id] = getRoundOff(
          (_.get(attendancecount, id, 0) as number) * Number(_.get(rate, id, 0))
        );
      }

      totalManDayAmount['total'] = getRoundOff(
        (totalManDayAmount.total as number) +
          Number(_.get(totalManDayAmount, id, 0))
      );

      totalovertime[id] = fulltime.reduce(
        (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
        0
      );

      const otDays =
        (totalovertime[id] as number) /
        (designation.allowed_wrking_hr_per_day || 1);
      otdays += otDays;

      otHrs += totalovertime[id] as number;

      totalovertime['total'] = getRoundOff(
        (totalovertime.total as number) + Number(_.get(totalovertime, id, 0))
      );
      let otRate = 0;
      if (designation.basicsalary_in_duration === 'Monthly') {
        otRate = getRoundOff(
          Number(_.get(rate, id, 0)) /
            (designation.allowed_wrking_hr_per_day || 1) /
            m
        );
      } else {
        otRate = getRoundOff(
          Number(_.get(rate, id, 0)) / designation.allowed_wrking_hr_per_day
        );
      }
      otamount[id] = getRoundOff(
        Number(_.get(totalovertime, id, 0) || 0) * otRate
      );
      otamount['total'] = getRoundOff(
        (otamount.total as number) + Number(_.get(otamount, id, 0))
      );
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
      gst1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.18));
      billAmount1[id] = getRoundOff(
        Number(_.get(total, id, 0)) + Number(_.get(gst1, id, 0))
      );
      tds1[id] = getRoundOff(
        Number(((_.get(total, id, 0) as number) * (contractor.tds ?? 0)) / 100)
      );
      netPayable1[id] =
        Number(_.get(billAmount1, id, 0)) - Number(_.get(tds1, id, 0));
      monthlyFixedDesignations.push({
        salary: rate[id],
        designation: designation.designation,
        department: department?.department,
        designationId: designation.id,
        mandays: attendancecount[id],
        mandaysamount: totalManDayAmount[id],
        othrs: totalovertime[id],
        otamount: otamount[id],
        gender: designation.gender,
        allowed_wrking_hr_per_day: designation.allowed_wrking_hr_per_day,
        basicsalary_in_duration: designation.basicsalary_in_duration,
      });
    });
  }

  // attendancecount["total"] = timekeeper.length
  rate['total'] = 0;
  totalnetamount['total'] =
    parseFloat(totalManDayAmount.total as string) +
    parseFloat(otamount.total as string);
  total['total'] = totalnetamount.total + parseFloat(cpamount.total as string);
  gst1['total'] = getRoundOff(Number(total.total * 0.18));
  billAmount1['total'] = getRoundOff(Number(total.total + gst1.total));
  cprate['total'] = contractor.servicecharge as number;
  tds1['total'] = getRoundOff(
    Number((total.total * (contractor.tds ?? 0)) / 100)
  );
  netPayable1['total'] = getRoundOff(Number(billAmount1.total - tds1.total));

  const r = [
    attendancecount,
    rate,
    totalManDayAmount,
    totalovertime,
    otamount,
    totalnetamount,
    cprate,
    cpamount,
    total,
    gst1,
    billAmount1,
    tds1,
    netPayable1,
  ];
  rows2.push(...r);
  rows.push(attendancecount);

  rows.push(rate);

  rows.push(totalManDayAmount);
  rows.push(totalovertime);
  rows.push(otamount);
  rows.push(totalnetamount);
  // if(department?.basicsalary_in_duration?.toLowerCase() === "hourly") {
  // rows2.push(cprate);
  rows.push(cprate);
  // rows2.push(cpamount);
  rows.push(cpamount);
  // rows2.push(total);
  rows.push(total);
  // }
  // rows2.push(gst1);

  // rows2.push(billAmount1);
  // rows2.push(tds1);
  // rows2.push(netPayable1);

  return {
    rows,
    total1: total.total,
    rows1: rows2,
    totalnetPayable: netPayable1.total,
    otdays,
    otHrs,
    monthlyFixedDesignations,
  };
};

export default getTotalAmountAndRows;
