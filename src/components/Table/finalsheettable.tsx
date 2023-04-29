import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import _ from "lodash";

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
  storededuction,
  safetydeduction,
}: {
  rows: Data[];
  total: number;
  sides: side[];
  department: string;
  storededuction: number;
  safetydeduction: number;
}) {
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

  const colspan =
    department === "8HR" || department === "12HR" || department === "Colony"
      ? 8
      : 4;

  return (
    <Paper
      sx={{
        width: "100%",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          width: 9,
          height: 10,
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
            width: 9,
            height: 10,
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
              {(department === "8HR" ||
              department === "12HR" ||
              department === "Colony"
                ? headers
                : ccmheader
              ).map((header, index) => (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700" }}
                  colSpan={1}
                  key={index}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sides.map((item) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                <TableCell align="center" sx={{ fontWeight: "600" }}>
                  {item.main}
                </TableCell>
                {item.sub && <TableCell align="center">{item.sub}</TableCell>}
                {rows.map((row, index) => (
                  <TableCell key={index} align="center">
                    {Math.floor(_.get(row, item.id)) || 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={colspan + 1}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                Net Amount Payable
              </TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                GST Hold
              </TableCell>
              <TableCell align="center">{0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                Safety Voilation's Penality
              </TableCell>
              <TableCell align="center">{safetydeduction}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                Consumables / Rechargeable Items
              </TableCell>
              <TableCell align="center">{storededuction}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                Adjustment Of Advance Amount
              </TableCell>
              <TableCell align="center">0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                Any Other Deductions
              </TableCell>
              <TableCell align="center">{0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell colSpan={colspan}></TableCell>
              <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                Final Payable
              </TableCell>
              <TableCell align="center">
                {total > 0 ? total - storededuction - safetydeduction : 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
