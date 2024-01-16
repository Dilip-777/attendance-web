import {
  Department,
  Designations,
  Employee,
  SeperateSalary,
  TimeKeeper,
} from "@prisma/client";
import dayjs from "dayjs";
import _ from "lodash";

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
  employees: EmployeeDepartmentDesignation[],
  ot: boolean,
  seperateSalaries: SeperateSalary[]
) => {
  const m = dayjs(`${year}-${month}`).daysInMonth();

  const getRoundOff = (num: number) => {
    return num;
  };

  const rows = [] as any[];

  const totalobj: Record<string, string | number> = {
    employeeId: "Total",
    name: "",
    designation: "",
  };

  employees.forEach((employee) => {
    const id = employee.employeeId;
    const f = timekeeper.filter((f) =>
      filterByDate({ item: f, attendance: "1", employeeId: id })
    );
    const hf = timekeeper.filter((f) =>
      filterByDate({ item: f, attendance: "0.5", employeeId: id })
    );

    const obj: Record<string, string | number> = {
      employeeId: id,
      name: employee.employeename,
      designation: employee.designation.designation,
    };

    const count = f.length + hf.length / 2;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
      const f = timekeeper.filter((f) =>
        filterByDate({ item: f, attendance: "1", employeeId: id, date })
      );
      const hf = timekeeper.filter((f) =>
        filterByDate({ item: f, attendance: "0.5", employeeId: id, date })
      );
      if (ot) {
        const othrs = f.reduce(
          (acc, curr) => acc + (curr.manualovertime || curr.overtime),
          0
        );
        obj[date] = othrs;

        totalobj[date] = ((totalobj[date] as number) || 0) + othrs;
        continue;
      }
      obj[date] = f.length + hf.length / 2;
      totalobj[date] =
        ((totalobj[date] as number) || 0) + (f.length + hf.length / 2);
    }

    obj["total"] = count;
    if (ot) {
      const othrs = f.reduce(
        (acc, curr) => acc + (curr.manualovertime || curr.overtime),
        0
      );
      obj["total"] = othrs;
    }

    totalobj["total"] = ((totalobj["total"] as number) || 0) + obj["total"];
    const seperateSalary = seperateSalaries.find(
      (f) =>
        f.contractorId === employee.contractorId &&
        f.designationId === employee.designationId
    );

    if (seperateSalary) {
      obj["rate"] = seperateSalary.salary;
    } else {
      obj["rate"] = employee.designation.basicsalary;
    }
    totalobj["rate"] = "";

    obj["amount"] = getRoundOff((count * employee.designation.basicsalary) / m);
    totalobj["amount"] = (((totalobj["amount"] as number) || 0) +
      obj["amount"]) as number;

    obj["othrs"] = f.reduce(
      (acc, curr) => acc + (curr.manualovertime || curr.overtime),
      0
    );
    totalobj["othrs"] = (((totalobj["othrs"] as number) || 0) +
      obj["othrs"]) as number;

    obj["otamount"] = getRoundOff(
      (obj["othrs"] * employee.designation.basicsalary) /
        (m * employee.designation.allowed_wrking_hr_per_day)
    );
    totalobj["otamount"] = (((totalobj["otamount"] as number) || 0) +
      obj["otamount"]) as number;

    obj["totalamount"] = getRoundOff(obj["amount"] + obj["otamount"]);
    totalobj["totalamount"] = (((totalobj["totalamount"] as number) || 0) +
      obj["totalamount"]) as number;
    rows.push(obj);
  });

  rows.push(totalobj);

  return {
    rows,
    total: totalobj.amount || 0,
    nettotal: totalobj.totalamount || 0,
  };
};

export default getEmployeesCalculation;
