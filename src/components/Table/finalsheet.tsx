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
  const s8hr = designations.map((d) => {
    if (d.gender === "Male")
      return { main: d.designation, sub: "M", id: d.designationid };
    else if (d.gender === "Female")
      return { main: d.designation, sub: "F", id: d.designationid };
    else return { main: d.designation, id: d.designationid };
  });

  const sidebar = designations
    .filter((d) => d.departmentname === department)
    .map((d) => {
      if (d.gender === "Male")
        return { main: d.designation, sub: "M", id: d.designationid };
      else if (d.gender === "Female")
        return { main: d.designation, sub: "F", id: d.designationid };
      else return { main: d.designation, id: d.designationid };
    });

  const side8hr = [
    { main: "8MW", sub: "M", id: "m8" },
    { main: "8MW", sub: "F", id: "f8" },
    { main: "20MW", sub: "M", id: "m20" },
    { main: "20MW", sub: "F", id: "f20" },
    { main: "DM", sub: "M", id: "dm" },
    { main: "QC", sub: "M", id: "qc" },
    { main: "Store", sub: "M", id: "store" },
    { main: "K-7", sub: "M", id: "k7m" },
    { main: "K-7", sub: "F", id: "k7f" },
    { main: "RMHS", sub: "M", id: "rmhs" },
    { main: "PS", sub: "F", id: "ps" },
    { main: "HK", sub: "M", id: "hk" },
    { main: "SVR", sub: "M", id: "svr" },
    { main: "TOTAL", sub: " ", id: "total" },
  ];
  const sideccm = [
    { main: "ELE", id: "ele" },
    { main: "LCO", id: "lco" },
    { main: "TMAN", id: "tman" },
    { main: "FILTER", id: "filter" },
    { main: "PO", id: "po" },
    { main: "BCO", id: "bco" },
    { main: "SRFILTER", id: "srfilter" },
    { main: "INCHARGE", id: "incharge" },
    { main: "MO", id: "mo" },
    { main: "SHIFT INCH", id: "shiftinch" },
    { main: "GC", id: "gc" },
    { main: "SVR", id: "svr" },
    { main: "SBO", id: "sbo" },
    { main: "LMAN", id: "lman" },
    { main: "FORMAN", id: "forman" },
    { main: "TMES SON", id: "tmesson" },
    { main: "LMES", id: "lmes" },
    { main: "JRELE", id: "jrele" },
    { main: "HELPER", id: "helper" },
    { main: "Total", id: "total" },
  ];

  const sidelrf = [
    { main: "ELE", id: "ele" },
    { main: "FILTER", id: "filter" },
    { main: "SRFILTER", id: "srfilter" },
    { main: "SVR", id: "svr" },
    { main: "LMES", id: "lmes" },
    { main: "HELPER", id: "helper" },
    { main: "Total", id: "total" },
  ];

  const sidecolony = [
    { main: "Colony", sub: "Male", id: "m" },
    { main: "Colony", sub: "Female", id: "f" },
    // { main: "Total", sub: " ", id: "total" },
  ];

  if (department === "Colony") {
    sidebar.push(...sidecolony);
  }

  switch (department) {
    case "8HR":
    case "12HR":
    case "Colony":
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
