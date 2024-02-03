import {
  Contractor,
  Department,
  Designations,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from "@prisma/client";
import dayjs from "dayjs";
import _ from "lodash";

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

const filterByDate = (
  item: TimeKeeper,
  attendance: string,
  department: string,
  date?: string,
  gender?: string
) => {
  //   console.log(item, department, gender, attendance);

  if (department !== item.department) return false;
  if (attendance !== item.attendance) return false;
  if (
    gender &&
    item.gender &&
    item.gender[0].toLowerCase() !== gender[0].toLowerCase()
  )
    return false;
  if (date) {
    return item.attendancedate === date;
  }
  return true;
};

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

const getHourlyCount = (
  timekeeper1: TimeKeeper[],
  month: number,
  year: number,
  shifts: Shifts[],
  contractor: Contractor,
  departments: DepartmentDesignation[] = [],

  wrkhrs?: number,
  calot?: boolean,
  role?: string
) => {
  const m = dayjs(month).daysInMonth();

  const filterByShift = (item: TimeKeeper, workinghrs?: number) => {
    if (!workinghrs) return true;
    const shift = shifts.find(
      (s) => s.shift === (item.manualshift || item.machineshift)
    );
    if (shift?.totalhours === workinghrs) return true;
    else if (!shift) return workinghrs === 8;
    else return false;
  };

  const timekeeper = timekeeper1.filter((f) => filterByShift(f, wrkhrs));
  //   console.log(timekeeper, 'timekeeper');

  const malecount: Record<string, string | number> = {
    date: "Total Male",
  };

  const femalecount: Record<string, string | number> = {
    date: "Total Female",
  };

  const svrcount: Record<string, string | number> = {
    date: "Total SVR",
  };

  const assignCounts = (
    id: string,
    designation: DesignationwithSalary,
    value: number
  ) => {
    if (designation.designation.toLowerCase() === "supervisor") {
      svrcount[id] = ((svrcount[id] as number) || 0) + value;
    } else if (designation.gender.toLowerCase() === "male") {
      malecount[id] = ((malecount[id] as number) || 0) + value;
    } else if (designation.gender.toLowerCase() === "female") {
      femalecount[id] = ((femalecount[id] as number) || 0) + value;
    }
    totalall[id] = ((totalall[id] as number) || 0) + value;
  };

  const totalall: Record<string, string | number> = {
    date: "Total",
  };

  const rate: Record<string, string | number> = {
    date: "Rate",
  };

  const totalovertime: Record<string, string | number> = {
    date: "Overtime Hrs.",
    total: 0,
  };
  const attendancecount: Record<string, string | number> = {
    date: "Total Man days",
    total: 0,
  };
  const totalManDayAmount: Record<string, string | number> = {
    date: "Man Days Amount",
    total: 0,
  };

  const otamount: Record<string, string | number> = {
    date: "OT Amount",
    total: 0,
  };

  const totalnetamount: Record<string, string | number> = {
    date: "Total Amount",
  };

  const cprate: Record<string, string | number> = {
    date: "Service Charge Rate",
    total: 0,
  };

  const cpamount: Record<string, string | number> = {
    date: "Service Charge Amount",
    total: 0,
  };

  const total: Record<string, string | number> = {
    date: "Taxable",
  };

  const gst1: Record<string, string | number> = {
    date: "GST",
  };

  const billAmount1: Record<string, string | number> = {
    date: "Bill Amount",
  };

  const tds1: Record<string, string | number> = {
    date: "TDS",
  };

  const netPayable1: Record<string, string | number> = {
    date: "Net Payable",
  };

  const othrs: Record<string, string | number> = {
    date: "Total",
    total: 0,
  };

  const getDataOfDate = (date: string) => {
    const obj: Record<string, string | number> = {
      date: date,
      total: 0,
    };

    departments.forEach((department) => {
      const f = timekeeper.filter((f) =>
        filterByDate(f, "1", department.department, date)
      );
      const hf = timekeeper.filter((f) =>
        filterByDate(f, "0.5", department.department, date)
      );
      department.designations.forEach((des) => {
        const id = des.id;

        const ff = f.filter((f) => f.gender === des.gender);
        const fhf = hf.filter((f) => f.gender === des.gender);
        // console.log(ff, fhf, 'ff, fhf', des.designation, des.gender[0].toLowerCase());
        const othrs = ff.reduce(
          (acc, curr) => acc + (curr.manualovertime || curr.overtime),
          0
        );
        obj[id] = calot ? othrs : ff.length + fhf.length / 2;
        obj["total"] = (obj.total as number) + (Number(obj[id]) || 0);
      });
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
    const date = `${i.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
    rows.push(getDataOfDate(date));
  }

  departments.forEach((department) => {
    const f = timekeeper.filter((f) =>
      filterByDate(f, "1", department.department)
    );
    const hf = timekeeper.filter((f) =>
      filterByDate(f, "0.5", department.department)
    );
    department.designations.forEach((des) => {
      const gender = des.gender[0].toLowerCase();
      const f8: TimeKeeper[] = f.filter(
        (f) =>
          filterByDate(f, "1", department.department, undefined, gender) &&
          filterByShift(f, 8)
      );
      const f12 = f.filter(
        (f) =>
          filterByDate(f, "1", department.department, undefined, gender) &&
          filterByShift(f, 12)
      );
      const hf8 = hf.filter(
        (f) =>
          filterByDate(f, "0.5", department.department, undefined, gender) &&
          filterByShift(f, 8)
      );
      const hf12 = hf.filter(
        (f) =>
          filterByDate(f, "0.5", department.department, undefined, gender) &&
          filterByShift(f, 12)
      );

      const id = des.id;
      const count = rows.reduce((acc, curr) => acc + Number(curr[id] || 0), 0);
      othrs[id] = count;
      othrs["total"] = (othrs.total as number) + (Number(othrs[id]) || 0);
      if (calot) return;
      attendancecount[id] = count;

      assignCounts("attendancecount", des, count);

      attendancecount["total"] =
        (attendancecount.total as number) +
        (Number(_.get(attendancecount, id, 0)) || 0);
      if (role !== "HR") {
        const s = des.seperateSalary?.find(
          (s) => s.contractorId === contractor.contractorId
        );
        if (s) {
          rate[id] = s.salary;
        } else if (wrkhrs === 8) {
          if (des.gender.toLowerCase() === "female") {
            rate[id] = contractor.salarywomen8hr;
          } else if (des.designation.toLowerCase() === "supervisor") {
            rate[id] = contractor.salarysvr8hr;
          } else {
            rate[id] = contractor.salarymen8hr;
          }
        } else if (wrkhrs === 12) {
          if (des.designation.toLowerCase() === "supervisor")
            rate[id] = contractor.salarysvr12hr;
          else {
            rate[id] = contractor.salarymen12hr;
          }
        } else {
          rate[id] = 0;
        }
      }
      //   totalManDayAmount[id] = getRoundOff((_.get(attendancecount, id, 0) as number) * Number(_.get(rate, id, 0)));
      //   if (!wrkhrs) {
      if (role !== "HR") {
        const a8 = f8.length + hf8.length / 2;
        const a12 = f12.length + hf12.length / 2;
        totalManDayAmount[id] = getRoundOff(
          a8 * (rate[id] as number) + a12 * (rate[id] as number)
        );
        //   }

        assignCounts(
          "mandaysamount",
          des,
          Number(_.get(totalManDayAmount, id, 0))
        );

        totalManDayAmount["total"] = getRoundOff(
          (totalManDayAmount.total as number) +
            Number(_.get(totalManDayAmount, id, 0))
        );

        const o8 = f8.reduce(
          (acc, curr) => acc + (curr.manualovertime || curr.overtime),
          0
        );

        const o12 = f12.reduce(
          (acc, curr) => acc + (curr.manualovertime || curr.overtime),
          0
        );

        totalovertime[id] = getRoundOff(o8 + o12);
        assignCounts("othrs", des, Number(_.get(totalovertime, id, 0)));
        totalovertime["total"] = getRoundOff(
          (totalovertime.total as number) + Number(_.get(totalovertime, id, 0))
        );

        const amount8 = getRoundOff((o8 * (rate[id] as number)) / 8);
        const amount12 = getRoundOff((o12 * (rate[id] as number)) / 12);
        otamount[id] = getRoundOff(amount8 + amount12);

        assignCounts("otamount", des, Number(_.get(otamount, id, 0)));

        otamount["total"] = getRoundOff(
          (otamount.total as number) + Number(_.get(otamount, id, 0))
        );
        totalnetamount[id] = getRoundOff(
          Number(_.get(totalManDayAmount, id, 0)) +
            Number(_.get(otamount, id, 0))
        );
        assignCounts(
          "totalnetamount",
          des,
          Number(_.get(totalnetamount, id, 0))
        );
        cprate[id] = des.servicecharge as number;

        cpamount[id] = getRoundOff(
          (Number(_.get(totalManDayAmount, id, 0)) *
            Number(_.get(cprate, id, 0))) /
            100
        );

        cpamount["total"] = getRoundOff(
          (cpamount.total as number) + Number(_.get(cpamount, id, 0))
        );
        total[id] = getRoundOff(
          Number(_.get(totalnetamount, id, 0)) + Number(_.get(cpamount, id, 0))
        );
        gst1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.18));
        billAmount1[id] = getRoundOff(
          Number(_.get(total, id, 0)) + Number(_.get(gst1, id, 0))
        );
        tds1[id] = getRoundOff(Number((_.get(total, id, 0) as number) * 0.01));
        netPayable1[id] =
          Number(_.get(billAmount1, id, 0)) - Number(_.get(tds1, id, 0));
      }
    });
  });

  // attendancecount["total"] = timekeeper.length
  rate["total"] = 0;
  totalnetamount["total"] =
    parseFloat(totalManDayAmount.total as string) +
    parseFloat(otamount.total as string);
  total["total"] = totalnetamount.total + parseFloat(cpamount.total as string);
  gst1["total"] = getRoundOff(Number(total.total * 0.18));
  billAmount1["total"] = getRoundOff(Number(total.total + gst1.total));
  tds1["total"] = getRoundOff(Number(total.total * 0.01));
  netPayable1["total"] = getRoundOff(Number(billAmount1.total - tds1.total));

  const allcounts = [malecount, femalecount, svrcount, totalall];

  if (role === "HR") {
    if (calot) {
      rows.push(othrs);
      rows2.push(othrs);
    } else rows.push(attendancecount);
    return {
      rows,
      total1: total.total,
      netTotal: totalnetamount.total,
      rows1: rows2,
      totalnetPayable: netPayable1.total,
      allcounts,
      total: totalManDayAmount.total,
    };
  }

  // if (calot) {
  //   if (role === "HR") {
  //     rows.push(attendancecount);
  //   } else {
  //     rows.push(othrs);
  //     rows2.push(othrs);
  //   }
  //   return {
  //     rows,
  //     total1: total.total,
  //     netTotal: totalnetamount.total,
  //     rows1: rows2,
  //     totalnetPayable: netPayable1.total,
  //     allcounts,
  //     total: totalManDayAmount.total,
  //   };
  // }

  rows.push(
    ...[
      attendancecount,
      rate,
      totalManDayAmount,
      totalovertime,
      otamount,
      totalnetamount,
    ]
  );
  rows2.push(
    ...[
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
    ]
  );

  const t = totalnetamount["total"] + totalnetamount["total"] * 0.1;

  malecount["label"] = "Total";
  malecount["value"] = t;
  femalecount["label"] = "SGST @ 9%";
  femalecount["value"] = t * 0.09;
  svrcount["label"] = "CGST @ 9%";
  svrcount["value"] = t * 0.09;
  totalall["label"] = "Total";
  totalall["value"] = t + t * 0.18;

  return {
    rows,
    total1: total.total,
    netTotal: totalnetamount.total,
    rows1: rows2,
    totalnetPayable: netPayable1.total,
    allcounts,
    total: totalManDayAmount.total,
  };
};

export default getHourlyCount;
