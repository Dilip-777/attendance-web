import {
  Contractor,
  Department,
  Designations,
  Employee,
  HiredFixedWork,
  SeperateSalary,
  TimeKeeper,
} from "@prisma/client";
import dayjs from "dayjs";

interface d extends Department {
  designations: DesignationwithSalary[];
}

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
  employees: Employee[];
}

export const getWorksCalculations = (
  works: HiredFixedWork[],
  contractor: Contractor
) => {
  const totals = {
    totalAmount: 0,
    taxable: 0,
    servicecharge: 0,
    gst: 0,
    billamount: 0,
    tds: 0,
    netPayable: 0,
  };
  const rows = works.map((work, index) => {
    const { id, description, rate, quantity, totalAmount } = work;

    const servicechargeRate = contractor.servicecharge ?? 0;

    const servicecharge = (totalAmount * servicechargeRate) / 100;
    const taxable = totalAmount + servicecharge;

    const gst = parseFloat(
      ((taxable * (contractor?.gst || 0)) / 100).toFixed(2)
    );
    totals.totalAmount += totalAmount;
    totals.taxable += taxable;

    totals.gst += gst;

    const billamount = parseFloat((taxable + gst).toFixed(2));
    totals.billamount += billamount;

    const tds = parseFloat(
      ((taxable * (Number(contractor.tds) || 0)) / 100).toFixed(2)
    );
    totals.servicecharge += servicecharge;
    totals.tds += tds;
    const netPayable = parseFloat((billamount - tds).toFixed(2));
    totals.netPayable += netPayable;
    return {
      id: (index + 1) as number | string,
      description,
      rate: rate as number | string,
      quantity: quantity as number | string,
      totalAmount,
      taxable,
      servicechargeRate,
      servicecharge,
      gst,
      billamount,
      tds,
      netPayable,
    };
  });
  rows.push({
    id: "Total",
    description: "",
    rate: "",
    quantity: "",

    totalAmount: totals.totalAmount,
    taxable: totals.taxable,
    servicechargeRate: 0,
    servicecharge: totals.servicecharge,
    gst: totals.gst,
    billamount: totals.billamount,
    tds: totals.tds,
    netPayable: totals.netPayable,
  });
  return { rows, totals };
};

export const getAttendanceCalculations = (
  contractor: Contractor & {
    employee: (Employee & {
      designation: Designations | null;
    })[];
    departments: d[];
    hiredFixedWork: HiredFixedWork[];
  },
  timekeeper: TimeKeeper[],
  month: string
) => {
  const noofdays = dayjs(month, "MM/YYYY").daysInMonth();
  const totals = {
    servicechargeRate: 0,
    servicechargeAmount: 0,
    taxable: 0,
    gst: 0,
    billAmount: 0,
    tds: 0,
    netPayable: 0,
  };
  const data = contractor.employee.map((employee, index) => {
    const fullTime = timekeeper.filter(
      (time) =>
        time.employeeid === employee.employeeId && time.attendance === "1"
    );
    const halfTime = timekeeper.filter(
      (time) =>
        time.employeeid === employee.employeeId && time.attendance === "0.5"
    );
    const count = fullTime.length + halfTime.length / 2;

    const totalManDayAmount =
      (count * (employee.designation?.basicsalary ?? 0)) / 31;

    const overtime = fullTime.reduce(
      (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
      0
    );
    const otRate =
      (employee.designation?.basicsalary ?? 0) /
      (employee.designation?.allowed_wrking_hr_per_day ?? 1) /
      noofdays;

    const otamount = overtime * otRate;

    const servicechargeRate = contractor.servicecharge ?? 0;
    const servicechargeAmount = (totalManDayAmount * servicechargeRate) / 100;

    const taxable = totalManDayAmount + otamount + servicechargeAmount;
    const gst = (taxable * (contractor?.gst || 0)) / 100;

    const billAmount = taxable + gst;
    const tds = (taxable * (contractor.tds ?? 0)) / 100;
    const netPayable = billAmount - tds;

    totals.servicechargeRate += servicechargeRate;
    totals.servicechargeAmount += servicechargeAmount;

    totals.taxable += taxable;
    totals.gst += gst;
    totals.billAmount += billAmount;
    totals.tds += tds;
    totals.netPayable += netPayable;

    return {
      id: (index + 1) as number | string,
      name: employee.employeename + "-" + employee.designation?.designation,
      totalManDay: count as number | string,
      rate: employee.designation?.basicsalary as number | string,
      totalManDayAmount: totalManDayAmount.toFixed(2),
      overtime: overtime as number | string,
      otRate: otRate.toFixed(2),
      otamount: otamount.toFixed(2),
      servicechargeRate: servicechargeRate as number | string,
      servicechargeAmount: servicechargeAmount.toFixed(2),
      taxable: parseFloat(taxable.toFixed(2)),
      gst: parseFloat(gst.toFixed(2)),
      billAmount: parseFloat(billAmount.toFixed(2)),
      tds: parseFloat(tds.toFixed(2)),
      netPayable: parseFloat(netPayable.toFixed(2)),
    };
  });
  data.push({
    id: "Total",
    name: "",
    totalManDay: "",
    rate: "",
    totalManDayAmount: "",
    overtime: "",
    otRate: "",
    otamount: "",
    servicechargeRate: "",
    servicechargeAmount: totals.servicechargeAmount.toFixed(2),
    taxable: data.reduce((acc, curr) => acc + curr.taxable, 0),
    gst: data.reduce((acc, curr) => acc + curr.gst, 0),
    billAmount: data.reduce((acc, curr) => acc + curr.billAmount, 0),
    tds: data.reduce((acc, curr) => acc + curr.tds, 0),
    netPayable: data.reduce((acc, curr) => acc + curr.netPayable, 0),
  });

  return data;
};

export const getHourlyCalculation = (
  contractor: Contractor & {
    employee: (Employee & {
      designation: Designations | null;
    })[];
    departments: d[];
    hiredFixedWork: HiredFixedWork[];
  },
  timekeeper: TimeKeeper[],
  month: string
) => {
  const noofdays = dayjs(month, "MM/YYYY").daysInMonth();

  let shifthrs = 0;
  contractor.departments.forEach((department) => {
    department.designations.forEach((designation) => {
      if (designation.designation.toLowerCase().trim() === "fixed") {
        shifthrs = designation.allowed_wrking_hr_per_day;
      }
    });
  });

  const fullTime = timekeeper.filter((time) => time.attendance === "1");
  const halfTime = timekeeper.filter((time) => time.attendance === "0.5");
  const count = fullTime.length + halfTime.length / 2;

  const overtime =
    fullTime.reduce(
      (acc, curr) => acc + (curr.manualovertime ?? curr.overtime),
      0
    ) / (shifthrs || 1);

  const totalManDays = count + overtime || 0;
  const noofEmployees = Math.round(totalManDays / noofdays);
  const requiredManDays = Math.round(contractor.minHeadcount * noofdays);
  const shortage = Math.min(0, totalManDays - requiredManDays);
  let t = contractor.hiredFixedWork[0]?.totalAmount || 0;
  t = t + (t * (contractor.servicecharge || 0)) / 100;
  const rate = Math.round(t / ((contractor.minHeadcount || 1) * noofdays));

  const taxable = shortage * rate;
  const gst = Math.round((taxable * (contractor?.gst || 0)) / 100);
  const billAmount = taxable + gst;

  const tds = Math.round((taxable * (contractor.tds ?? 0)) / 100);

  const netPayable = billAmount - tds;

  return {
    manDays: count as number | string,
    rate: rate as number | string,
    overtime: parseFloat(overtime.toFixed(2)),
    totalManDays: parseFloat(totalManDays.toFixed(2)),
    noofEmployees: noofEmployees as number | string,
    requiredManDays: parseFloat(requiredManDays.toFixed(2)),
    shortage: parseFloat(shortage.toFixed(2)),
    taxable: parseFloat(taxable.toFixed(2)),
    gst: parseFloat(gst.toFixed(2)),
    billAmount: parseFloat(billAmount.toFixed(2)),
    tds: parseFloat(tds.toFixed(2)),
    netPayable: parseFloat(netPayable.toFixed(2)),
  };
};
