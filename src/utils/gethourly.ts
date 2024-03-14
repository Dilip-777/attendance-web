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
  if (designation.gender === "Male" || designation.gender === "M") {
    return (
      item.designation.toLowerCase() ===
        designation.designation.toLowerCase() &&
      item.gender &&
      item.gender[0] === designation.gender[0]
    );
  } else if (designation.gender === "Female" || designation.gender === "F") {
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

const getTotalAmountAndRows = (
  timekeeper1: TimeKeeper[],
  month: number,
  year: number,
  shifts: Shifts[],
  contractorId: string,
  contractor: Contractor,
  designations?: DesignationwithSalary[],
  departments?: DepartmentDesignation[],
  wrkhrs?: number,
  role?: string,
  calot?: boolean
) => {
  const filterByShift = (item: TimeKeeper, workinghrs?: number) => {
    if (!workinghrs) return true;

    const shift = shifts.find(
      (s) => s.shift === (item.manualshift || item.machineshift)
    );
    if (shift) console.log(shift.totalhours, workinghrs, "shift");
    if (shift?.totalhours === workinghrs) return true;
    else if (!shift) return workinghrs === 8;
    else return false;
  };

  console.log(wrkhrs, shifts, "wrkhrs");

  const timekeeper = timekeeper1.filter((f) => filterByShift(f, wrkhrs));

  const m = dayjs(`${year}-${month}`).daysInMonth();

  console.log(designations, "designations");

  let filtered: TimeKeeper[] = [];

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

  const getDataOfDate = (date: string) => {
    const obj: Record<string, string | number> = {
      date: date,
      total: 0,
    };
    departments?.forEach((department) => {
      const name = department.department;
      const f1 = timekeeper.filter(
        (item) =>
          item?.department?.toLowerCase() === name.toLowerCase() &&
          item.attendancedate === date
      );

      department.designations?.forEach((designation) => {
        const id = designation.id;
        const f = f1.filter((item) => filter(item, designation, "0.5"));

        filtered.push(...f);
        if (calot) {
          const othrs = f.reduce(
            (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
            0
          );
          obj[id] = othrs;
          obj["total"] = (obj.total as number) + othrs;
        } else {
          const hf = f1.filter((item) => filter(item, designation, "1"));

          const count = f.length + hf.length / 2;
          obj[id] = count;
          obj["total"] = (obj.total as number) + count;
        }
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

  departments?.forEach((department) => {
    const name = department.department;
    const f1 = timekeeper.filter(
      (item) => item?.department?.toLowerCase() === name.toLowerCase()
    );

    department.designations.forEach((designation) => {
      const id = designation.id;
      // attendancecount[id] = filtered.length + filtered1.length / 2;
      // attendancecount['total'] = (attendancecount.total as number) + (Number(_.get(attendancecount, id, 0)) || 0);
      const fulltime = f1.filter((item) => filter(item, designation, "0.5"));
      const halftime = f1.filter((item) => filter(item, designation, "1"));

      const f8 = fulltime.filter((item) => filterByShift(item, 8));
      const f12 = fulltime.filter((item) => filterByShift(item, 12));
      const h8 = halftime.filter((item) => filterByShift(item, 8));
      const h12 = halftime.filter((item) => filterByShift(item, 12));
      // rows.forEach((r) => {
      //   attendancecount[id] =
      //     ((attendancecount[id] as number) || 0) +
      //     (Number(_.get(r, id, 0)) || 0);
      // });
      const count = rows.reduce((acc, curr) => acc + Number(curr[id] || 0), 0);

      attendancecount[id] = count;
      assignCounts(
        "attendancecount",
        designation,
        fulltime.length + halftime.length / 2
      );

      attendancecount["total"] =
        (attendancecount.total as number) +
        (Number(_.get(attendancecount, id, 0)) || 0);

      const s = designation.seperateSalary?.find(
        (s) => s.contractorId === contractorId
      );
      if (s) {
        rate[id] = s.salary;
      } else if (wrkhrs === 8) {
        if (designation.designation.toLowerCase() === "supervisor")
          rate[id] = contractor.salarysvr8hr as number;
        else if (designation.gender === "Female")
          rate[id] = contractor.salarywomen8hr as number;
        else rate[id] = contractor.salarymen12hr as number;
      } else if (wrkhrs === 12) {
        if (designation.designation.toLowerCase() === "supervisor")
          rate[id] = contractor.salarysvr12hr as number;
        else rate[id] = contractor.salarymen12hr as number;
      } else {
        rate[id] = 0;
      }

      const a8 = f8.length + h8.length / 2;
      const a12 = f12.length + h12.length / 2;
      totalManDayAmount[id] = getRoundOff(
        a8 * (rate[id] as number) + a12 * (rate[id] as number)
      );

      assignCounts(
        "mandaysamount",
        designation,
        Number(_.get(totalManDayAmount, id, 0))
      );

      totalManDayAmount["total"] = getRoundOff(
        (totalManDayAmount.total as number) +
          Number(_.get(totalManDayAmount, id, 0))
      );

      const o8 = f8.reduce((acc, curr) => {
        return acc + (curr.manualovertime ?? curr.overtime);
      }, 0);

      let c = 0;
      let d = 12;

      const o12 = f12.reduce(
        (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
        0
      );
      if (calot) {
        attendancecount[id] = getRoundOff(o8 + o12);
        attendancecount["date"] = "Total OverTime Hrs.";
      }

      totalovertime[id] = getRoundOff(o8 + o12);
      assignCounts("othrs", designation, Number(_.get(totalovertime, id, 0)));
      totalovertime["total"] = getRoundOff(
        (totalovertime.total as number) + Number(_.get(totalovertime, id, 0))
      );
      const amount8 = getRoundOff((o8 * (rate[id] as number)) / 8);
      const amount12 = getRoundOff((o12 * (rate[id] as number)) / 12);
      otamount[id] = getRoundOff(amount8 + amount12);
      assignCounts("otamount", designation, Number(_.get(otamount, id, 0)));
      otamount["total"] = getRoundOff(
        (otamount.total as number) + Number(_.get(otamount, id, 0))
      );
      totalnetamount[id] = getRoundOff(
        Number(_.get(totalManDayAmount, id, 0)) + Number(_.get(otamount, id, 0))
      );
      assignCounts(
        "totalnetamount",
        designation,
        Number(_.get(totalnetamount, id, 0))
      );
    });
  });

  rate["total"] = 0;
  totalnetamount["total"] =
    parseFloat(totalManDayAmount.total as string) +
    parseFloat(otamount.total as string);

  rows.push(attendancecount);

  const allcounts = [malecount, femalecount, svrcount, totalall];
  if (role !== "HR") {
    const r = [
      rate,
      totalManDayAmount,
      totalovertime,
      otamount,
      totalnetamount,
    ];
    rows.push(...r);
  }

  const t =
    totalnetamount["total"] + (totalManDayAmount["total"] as number) * 0.1;

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
    totalnetPayable: netPayable1.total,
    allcounts,
    total: totalManDayAmount.total,
    netTotal: totalnetamount.total,
  };
};

export default getTotalAmountAndRows;
