import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FinalSheetTable from "./finalsheettable";
import { Stores } from "@prisma/client";

interface Column {
  id:
    | "date"
    | "ele"
    | "lco"
    | "tman"
    | "filter"
    | "po"
    | "bco"
    | "srfilter"
    | "incharge"
    | "mo"
    | "shiftinch"
    | "gc"
    | "svr"
    | "sbo"
    | "lman"
    | "forman"
    | "tmesson"
    | "lmes"
    | "jrele"
    | "helper"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Data {
  date: string;
  ele: number;
  lco: number;
  tman: number;
  filter: number;
  po: number;
  bco: number;
  srfilter: number;
  incharge: number;
  mo: number;
  shiftinch: number;
  gc: number;
  tmesson: number;
  svr: number;
  sbo: number;
  lmes: number;
  lman: number;
  forman: number;
  jrele: number;
  helper: number;
  total: number;
}

export default function FinalSheetta({
  rows,
  total,
  department,
  storededuction,
  safetydeduction,
}: {
  rows: any[];
  total: number;
  department: string;
  storededuction: number;
  safetydeduction: number;
}) {
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
    { main: "Total", sub: " ", id: "total" },
  ];

  switch (department) {
    case "CCM":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={sideccm}
          storededuction={storededuction}
          safetydeduction={safetydeduction}
        />
      );
      break;
    case "LRF":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={sidelrf}
          storededuction={storededuction}
          safetydeduction={safetydeduction}
        />
      );
      break;
    case "Colony":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={sidecolony}
          storededuction={storededuction}
          safetydeduction={safetydeduction}
        />
      );
      break;
    case "8HR":
    case "12HR":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={side8hr}
          storededuction={storededuction}
          safetydeduction={safetydeduction}
        />
      );
    default:
      return <></>;
  }
}
