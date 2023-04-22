import * as React from "react";
import FinalSheetTable from "./finalsheettable";

const type8hr = {
  date: "Date",
  m8: "M8",
  f8: "F8",
  m20: "M20",
  f20: "F20",
  dm: "DM",
  qc: "QC",
  store: "STORE",
  k7m: "K7M",
  k7f: "K7F",
  rmhs: "RMHS",
  ps: "PS",
  hk: "HK",
  svr: "SVR",
  total: "Total",
};

interface Data {
  date: string;
  m8: number;
  f8: number;
  m20: number;
  f20: number;
  dm: number;
  qc: number;
  store: number;
  k7m: number;
  k7f: number;
  rmhs: number;
  ps: number;
  hk: number;
  svr: number;
  total: number;
}

function getType(department: string) {
  if (department === "8HR" || department === "12HR") {
    return type8hr;
  }
}

export default function Table8hr({
  rows,
  total,
  department,
}: {
  rows: any[];
  total: number;
  department: string;
}) {
  const downloadTxtFile = () => {
    // Convert JSON data to formatted string
    const jsonRows = JSON.stringify(rows, null, 2);
    const tableRows = [
      ["Name".padEnd(30), "Age".padEnd(30), "Email".padEnd(10)],
    ];
    rows.forEach((item) => {
      tableRows.push([
        item.date.padEnd(30),
        String(item.m8).toString().padEnd(3),
        item.f8.toString().padEnd(25),
      ]);
    });
    const tableRowsString = tableRows.map((row) => row.join("\t")).join("\n");
    const txtContent = `JSON data:\n${jsonRows}\n\nTable data:\n${tableRowsString}`;

    // Download text file
    const blob = new Blob([txtContent], {
      type: "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data.txt");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  return (
    <FinalSheetTable
      sides={side8hr}
      rows={rows}
      total={total}
      department={department}
    />
  );
}
