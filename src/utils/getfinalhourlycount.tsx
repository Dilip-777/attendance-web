import {
  Contractor,
  Department,
  Designations,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from "@prisma/client";
import _ from "lodash";

interface DepartmentDesignation extends Department {
  designations: Designations[];
}

interface filterProps {
  item: TimeKeeper;
  designation?: string;
  attendance: string;
  gender?: string;
}

export const gethourlycount = (
  timekeeper1: TimeKeeper[],
  contractor: Contractor,
  departments: DepartmentDesignation[],
  shifts?: Shifts[]
) => {
  const timekeeper = timekeeper1.filter((t) =>
    departments.find((d) => d.department === t.department)
  );
  const getMandaysOtAmount = (
    mandays8hr: number,
    mandays12hr: number,
    othrs8hr: number,
    othrs12hr: number,
    designation: Designations,
    obj: Record<string, string | number>
  ) => {
    if (designation.designation.toLowerCase() === "supervisor") {
      const mandaysamount =
        mandays8hr * contractor.salarysvr8hr +
        mandays12hr * contractor.salarysvr12hr;
      const otamount =
        (othrs8hr * contractor.salarysvr8hr) / 8 +
        (othrs12hr * contractor.salarysvr12hr) / 12;
      return { mandaysamount, otamount };
    } else if (designation.gender.toLowerCase() === "male") {
      const mandaysamount =
        mandays8hr * contractor.salarymen8hr +
        mandays12hr * contractor.salarymen12hr;
      const otamount =
        (othrs8hr * contractor.salarymen8hr) / 8 +
        (othrs12hr * contractor.salarymen12hr) / 12;
      return { mandaysamount, otamount };
    } else if (designation.gender.toLowerCase() === "female") {
      const mandaysamount =
        mandays8hr * contractor.salarywomen8hr + mandays12hr * 0;
      const otamount =
        (othrs8hr * contractor.salarywomen8hr) / 8 + (othrs12hr * 0) / 12;
      return { mandaysamount, otamount };
    } else {
      const mandaysamount = 0;
      const otamount = 0;
      return { mandaysamount, otamount };
    }
  };

  const filterByShifts = (item: TimeKeeper, wrkhrs: number) => {
    const s = shifts?.find(
      (s) => s.shift === (item.manualshift || item.machineshift)
    );

    if (!s && wrkhrs === 8) return true;
    if (s?.totalhours !== wrkhrs) return false;
    return true;
  };

  const filter = ({ item, designation, attendance, gender }: filterProps) => {
    if (item.attendance === attendance) return false;
    if (designation) {
      if (designation.toLowerCase() !== item.designation.toLowerCase())
        return false;
    }
    if (gender) {
      if (item.designation.toLowerCase() === "supervisor") return false;
      return gender.toLowerCase() === item.gender?.toLowerCase();
    } else return true;
  };

  const rows1: Record<string, string | number>[] = [];
  const rows2: Record<string, string | number>[] = [];
  const rows3: Record<string, string | number>[] = [];

  const arr = [
    {
      wrkhrs: 8,
      g: [
        { gender: "male", salary: contractor.salarymen8hr },
        { gender: "female", salary: contractor.salarywomen8hr },
        { gender: "supervisor", salary: contractor.salarysvr8hr },
      ],
    },
    {
      wrkhrs: 12,
      g: [
        { gender: "male", salary: contractor.salarymen12hr },
        { gender: "supervisor", salary: contractor.salarysvr12hr },
      ],
    },
  ];

  arr.forEach((i) => {
    const data = timekeeper.filter((t) => filterByShifts(t, i.wrkhrs));
    i.g.forEach((a) => {
      const fulltime = data.filter((d) =>
        filter({
          item: d,
          attendance: "0.5",
          designation: a.gender === "supervisor" ? a.gender : undefined,
          gender: a.gender === "supervisor" ? undefined : a.gender,
        })
      );

      const halftime = data.filter((d) =>
        filter({
          item: d,
          attendance: "1",
          designation: a.gender === "supervisor" ? a.gender : undefined,
          gender: a.gender === "supervisor" ? undefined : a.gender,
        })
      );
      const obj: Record<string, string | number> = {
        date: `${a.gender.toUpperCase()}`,
        total: 0,
      };
      obj["shifthrs"] = i.wrkhrs;
      obj["mandays"] = fulltime.length + halftime.length / 2;
      obj["totalmandays"] = fulltime.length + halftime.length / 2;

      obj["rate"] = a.salary;
      obj["mandaysamount"] = obj["mandays"] * a.salary;
      obj["othrs"] = fulltime.reduce(
        (a, b) => a + (b.manualovertime ?? b.overtime),
        0
      );
      obj["otamount"] = (obj["othrs"] * a.salary) / i.wrkhrs;
      obj["servicechargerate"] = contractor.servicecharge ?? 0;
      obj["servicechargeamount"] =
        obj["mandaysamount"] * 0.01 * obj["servicechargerate"];
      obj["taxable"] =
        obj["mandaysamount"] + obj["otamount"] + obj["servicechargeamount"];
      obj["gst"] = obj["taxable"] * 0.18;
      obj["billamount"] = obj["taxable"] + obj["gst"];
      obj["tds"] = (obj["taxable"] * (contractor.tds || 0)) / 100;
      obj["netpayable"] = obj["billamount"] - obj["tds"];
      if (i.wrkhrs === 8) {
        rows1.push(obj);
      } else {
        rows2.push(obj);
      }
    });
    const obj: Record<string, string | number> = {
      date: `Total`,
    };
    const rows = i.wrkhrs === 8 ? rows1 : rows2;
    obj["mandays"] = rows.reduce(
      (a, b) => a + ((b["mandays"] as number) || 0),
      0
    );
    obj["totalmandays"] = rows.reduce(
      (a, b) => a + ((b["totalmandays"] as number) || 0),
      0
    );
    obj["mandaysamount"] = rows.reduce(
      (a, b) => a + ((b["mandaysamount"] as number) || 0),
      0
    );
    obj["othrs"] = rows.reduce((a, b) => a + ((b["othrs"] as number) || 0), 0);
    obj["otamount"] = rows.reduce(
      (a, b) => a + ((b["otamount"] as number) || 0),
      0
    );
    obj["servicechargeamount"] = rows.reduce(
      (a, b) => a + ((b["servicechargeamount"] as number) || 0),
      0
    );
    obj["taxable"] = rows.reduce(
      (a, b) => a + ((b["taxable"] as number) || 0),
      0
    );
    obj["gst"] = rows.reduce((a, b) => a + ((b["gst"] as number) || 0), 0);
    obj["billamount"] = rows.reduce(
      (a, b) => a + ((b["billamount"] as number) || 0),
      0
    );
    obj["tds"] = rows.reduce((a, b) => a + ((b["tds"] as number) || 0), 0);
    obj["netpayable"] = rows.reduce(
      (a, b) => a + ((b["netpayable"] as number) || 0),
      0
    );
    if (i.wrkhrs === 8) {
      rows1.push(obj);
    } else {
      rows2.push(obj);
    }
  });

  [8, 12].map((wrkhrs) => {
    departments.forEach((d) => {
      const data = timekeeper.filter((t) => t.department === d.department);
      d.designations.forEach((des) => {
        const fulltime = data.filter(
          (d) =>
            filterByShifts(d, wrkhrs) &&
            filter({
              item: d,
              attendance: "0.5",
              designation:
                des.designation.toLowerCase() === "supervisor"
                  ? "supervisor"
                  : undefined,
              gender:
                des.designation.toLowerCase() === "supervisor"
                  ? undefined
                  : des.gender,
            })
        );

        const halftime = data.filter(
          (d) =>
            filterByShifts(d, wrkhrs) &&
            filter({
              item: d,
              attendance: "1",
              designation:
                des.designation.toLowerCase() === "supervisor"
                  ? "supervisor"
                  : undefined,
              gender:
                des.designation.toLowerCase() === "supervisor"
                  ? undefined
                  : des.gender,
            })
        );

        const obj: Record<string, string | number> = {
          department: d.department,
          date: des.designation,
        };
        obj["shifthrs"] = wrkhrs;
        obj["mandays"] = fulltime.length + halftime.length / 2;

        if (obj["mandays"] > 0) {
          if (wrkhrs === 8) {
            if (des.designation.toLowerCase() === "supervisor") {
              obj["rate"] = contractor.salarysvr8hr;
            } else if (des.gender.toLowerCase() === "female") {
              obj["rate"] = contractor.salarywomen8hr;
            } else {
              obj["rate"] = contractor.salarymen8hr;
            }
          } else {
            if (des.designation.toLowerCase() === "supervisor") {
              obj["rate"] = contractor.salarysvr12hr;
            } else if (des.gender.toLowerCase() === "male") {
              obj["rate"] = contractor.salarymen12hr;
            } else {
              obj["rate"] = 0;
            }
          }

          // obj["rate"] =
          //   des.designation === "supervisor"
          //     ? contractor.salarysvr8hr
          //     : des.gender.toLowerCase() === "male"
          //     ? contractor.salarymen8hr
          //     : contractor.salarywomen8hr;

          // const ot8hr = fulltime8hr.reduce(
          //   (a, b) => a + (b.manualovertime ?? b.overtime),
          //   0
          // );

          // const ot12hr = fulltime12hr.reduce(
          //   (a, b) => a + (b.manualovertime ?? b.overtime),
          //   0
          // );

          const othrs = fulltime.reduce(
            (a, b) => a + (b.manualovertime ?? b.overtime),
            0
          );

          // const { mandaysamount, otamount } = getMandaysOtAmount(
          //   fulltime8hr.length + halftime8hr.length / 2,
          //   fulltime12hr.length + halftime12hr.length / 2,
          //   ot8hr,
          //   ot12hr,
          //   des,
          //   obj
          // );
          obj["mandaysamount"] = obj["mandays"] * obj["rate"];
          obj["othrs"] = othrs;
          obj["otamount"] = (othrs * obj["rate"]) / wrkhrs;
          obj["servicechargerate"] = contractor.servicecharge ?? 0;
          obj["servicechargeamount"] =
            obj["mandaysamount"] * (obj["servicechargerate"] as number) * 0.01;
          obj["taxable"] =
            obj["mandaysamount"] + obj["otamount"] + obj["servicechargeamount"];
          obj["gst"] = obj["taxable"] * 0.18;
          obj["billamount"] = obj["taxable"] + obj["gst"];
          obj["tds"] = obj["taxable"] * (contractor.tds ?? 0) * 0.01;
          obj["netpayable"] = obj["billamount"] - obj["tds"];
          rows3.push(obj);
        }
      });
    });
  });
  const obj: Record<string, string | number> = {
    department: "",
    date: "Total",
  };
  obj["shifthrs"] = "";
  obj["rate"] = "";
  obj["mandays"] = rows3.reduce(
    (a, b) => a + ((b["mandays"] as number) || 0),
    0
  );
  obj["mandaysamount"] = rows3.reduce(
    (a, b) => a + ((b["mandaysamount"] as number) || 0),
    0
  );
  obj["othrs"] = rows3.reduce((a, b) => a + ((b["othrs"] as number) || 0), 0);
  obj["otamount"] = rows3.reduce(
    (a, b) => a + ((b["otamount"] as number) || 0),
    0
  );
  obj["servicechargeamount"] = rows3.reduce(
    (a, b) => a + ((b["servicechargeamount"] as number) || 0),
    0
  );
  obj["taxable"] = rows3.reduce(
    (a, b) => a + ((b["taxable"] as number) || 0),
    0
  );
  obj["gst"] = rows3.reduce((a, b) => a + ((b["gst"] as number) || 0), 0);
  obj["billamount"] = rows3.reduce(
    (a, b) => a + ((b["billamount"] as number) || 0),
    0
  );
  obj["tds"] = rows3.reduce((a, b) => a + ((b["tds"] as number) || 0), 0);
  obj["netpayable"] = rows3.reduce(
    (a, b) => a + ((b["netpayable"] as number) || 0),
    0
  );
  rows3.push(obj);
  return { rows: [rows1, rows2, rows3], total: obj };
};
