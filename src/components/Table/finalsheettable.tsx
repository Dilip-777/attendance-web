import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import _ from "lodash";
interface Column {
  id:
    | "date"
    | "m8"
    | "f8"
    | "m20"
    | "f20"
    | "dm"
    | "qc"
    | "store"
    | "k7m"
    | "k7f"
    | "rmhs"
    | "ps"
    | "hk"
    | "svr"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

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

interface side {
  main: string;
  sub?: string;
  id: string;
}

export default function FinalSheetTable({
  rows,
  total,
  sides,
  department,
}: {
  rows: Data[];
  total: number;
  sides: side[];
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

  const headers = [
    "Total Man days",
    "Rate",
    "Total Amount",
    "Total Overtime",
    "OT Amount",
    "Total Amount",
    "Service Charge",
    "Service Charge Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];

  const ccmheader = [
    "Total Man days",
    "Rate",
    "Total Amount",
    "Total Overtime",
    "OT Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];

  const colspan = department === "8HR" || department === "12HR" ? 8 : 4;

  return (
    <Paper
      sx={{
        width: "100%",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: 7,
          height: 7,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: 2,
        },
      }}
    >
      <TableContainer
        sx={{
          maxWidth: "100%",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: 7,
            height: 7,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
        }}
      >
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#eeeeee" }}>
              <TableCell align="center" sx={{ fontWeight: "700" }} colSpan={1}>
                Designation
              </TableCell>
              {(department === "8HR" ||
                department === "12HR" ||
                department === "Colony") && (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700" }}
                  colSpan={1}
                >
                  Type
                </TableCell>
              )}
              {(department === "8HR" || department === "12HR"
                ? headers
                : ccmheader
              ).map((header) => (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700" }}
                  colSpan={1}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sides.map((item) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                <TableCell align="center">{item.main}</TableCell>
                {item.sub && <TableCell align="center">{item.sub}</TableCell>}
                {rows.map((row, index) => (
                  <TableCell key={index} align="center">
                    {Math.floor(_.get(row, item.id))}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={colspan + 1}></TableCell>
              <TableCell colSpan={5}>Net Amount Payable</TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5}>GST Hold</TableCell>
              <TableCell align="center">{total > 0 ? "300" : "0"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5}>Safety Voilation's Penality</TableCell>
              <TableCell align="center">{total > 0 ? "40" : "0"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5}>
                Consumables / Rechargeable Items
              </TableCell>
              <TableCell align="center">0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5}>Adjustment Of Advance Amount</TableCell>
              <TableCell align="center">0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5}>Any Other Deductions</TableCell>
              <TableCell align="center">{total > 0 ? "80" : "0"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5}>Final Payable</TableCell>
              <TableCell align="center">
                {total > 0 ? total - 150 - 40 - 80 : 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
