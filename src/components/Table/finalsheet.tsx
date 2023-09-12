import * as React from "react";
import FinalSheetTable from "./finalsheettable";
import { Department, Designations } from "@prisma/client";

export default function FinalSheetta({
  rows,
  total,
  department,
  storededuction,
  safetydeduction,
  designations,
}: {
  rows: any[];
  total: number;
  department: Department | undefined;
  storededuction: number;
  safetydeduction: number;
  designations: Designations[];
}) {
  console.log(designations, "designations");

  const sidebar = designations
    .filter((d) => d.departmentname === department?.department)
    .map((d) => {
      if (d.basicsalary_in_duration === "Monthly")
        return { main: d.designation, id: d.designationid };
      if (d.gender === "Male")
        return { main: d.designation, sub: "M", id: d.designationid };
      else if (d.gender === "Female")
        return { main: d.designation, sub: "F", id: d.designationid };
      else return { main: d.designation, id: d.designationid };
    });

  if (department?.basicsalary_in_duration?.toLowerCase() === "hourly") {
    sidebar.push({ main: "Total", sub: " ", id: "total" });
  } else {
    sidebar.push({ main: "Total", id: "total" });
  }

  return (
    <FinalSheetTable
      rows={rows}
      total={total || 0}
      department={department}
      sides={sidebar}
      storededuction={storededuction}
      safetydeduction={safetydeduction}
    />
  );
}
