import * as React from "react";
import FinalSheetTable from "./finalsheettable";
import { Designations } from "@prisma/client";

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
  department: string;
  storededuction: number;
  safetydeduction: number;
  designations: Designations[];
}) {
  const sidebar = designations
    .filter((d) => d.departmentname === department)
    .map((d) => {
      if (d.gender === "Male")
        return { main: d.designation, sub: "M", id: d.designationid };
      else if (d.gender === "Female")
        return { main: d.designation, sub: "F", id: d.designationid };
      else return { main: d.designation, id: d.designationid };
    });

  switch (department) {
    case "8HR":
    case "12HR":
    case "COLONY":
      sidebar.push({ main: "Total", sub: " ", id: "total" });
      break;
    case "CCM":
    case "LRF":
      sidebar.push({ main: "Total", id: "total" });
      break;
    default:
      break;
  }

  // switch (department) {
  //   case "CCM":
  //     return (
  //       <FinalSheetTable
  //         rows={rows}
  //         total={Math.floor(total || 0)}
  //         department={department}
  //         sides={sideccm}
  //         storededuction={storededuction}
  //         safetydeduction={safetydeduction}
  //       />
  //     );
  //     break;
  //   case "LRF":
  //     return (
  //       <FinalSheetTable
  //         rows={rows}
  //         total={Math.floor(total || 0)}
  //         department={department}
  //         sides={sidelrf}
  //         storededuction={storededuction}
  //         safetydeduction={safetydeduction}
  //       />
  //     );
  //     break;
  //   case "Colony":
  //     return (
  //       <FinalSheetTable
  //         rows={rows}
  //         total={Math.floor(total || 0)}
  //         department={department}
  //         sides={sidecolony}
  //         storededuction={storededuction}
  //         safetydeduction={safetydeduction}
  //       />
  //     );
  //     break;
  //   case "8HR":
  //   case "12HR":
  //     return (
  //       <FinalSheetTable
  //         rows={rows}
  //         total={Math.floor(total || 0)}
  //         department={department}
  //         sides={s8hr}
  //         storededuction={storededuction}
  //         safetydeduction={safetydeduction}
  //       />
  //     );
  //   default:
  //     return <></>;
  // }
  return (
    <FinalSheetTable
      rows={rows}
      total={Math.floor(total || 0)}
      department={department}
      sides={sidebar}
      storededuction={storededuction}
      safetydeduction={safetydeduction}
    />
  );
}
