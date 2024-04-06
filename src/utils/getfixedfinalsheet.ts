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
    gst: 0,
    billamount: 0,
    tds: 0,
    netPayable: 0,
  };
  const rows = works.map((work, index) => {
    const { id, description, rate, quantity, totalAmount } = work;

    const gst = parseFloat((totalAmount * 0.18).toFixed(2));
    totals.totalAmount += totalAmount;
    totals.gst += gst;
    const billamount = parseFloat((totalAmount + gst).toFixed(2));
    totals.billamount += billamount;

    const tds = parseFloat(
      ((billamount * (Number(contractor.tds) || 0)) / 100).toFixed(2)
    );
    totals.tds += tds;
    const netPayable = billamount - tds;
    totals.netPayable += netPayable;
    return {
      id: (index + 1) as number | string,
      description,
      rate: rate as number | string,
      quantity: quantity as number | string,
      totalAmount,
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
    gst: totals.gst,
    billamount: totals.billamount,
    tds: totals.tds,
    netPayable: totals.netPayable,
  });
  return { rows, totals };
};

interface EmployeeDepartmentDesignation extends Employee {
  designation: Designations | null;
}

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
    const gst = (taxable * (employee.gst ?? 0)) / 100;

    const billAmount = taxable + gst;
    const tds = (taxable * (employee.tds ?? 0)) / 100;
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

  let salary = 0;
  let shifthrs = 0;
  contractor.departments.forEach((department) => {
    department.designations.forEach((designation) => {
      if (designation.designation.toLowerCase().trim() === "fixed") {
        salary = designation.basicsalary ?? 0;
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
    ) / shifthrs || 0;

  const totalManDays = count + overtime || 0;
  const noofEmployees = contractor.employee.length;
  const requiredManDays = noofdays * noofEmployees;
  const shortage = requiredManDays - totalManDays;
  const rate = salary;
  const taxable = totalManDays * salary;
  const gst = (taxable * 18) / 100;
  const billAmount = taxable + gst;

  const tds = (taxable * (contractor.tds ?? 0)) / 100;

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
