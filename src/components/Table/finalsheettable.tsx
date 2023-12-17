import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import _ from "lodash";
import { IconButton, Tooltip } from "@mui/material";
import { Deductions } from "@prisma/client";

export default function FinalSheetTable({
  storededuction,
  safetydeduction,
  hourlyrows,
  hourlytotals,
  handleHourlyPrint,
  deduction,
}: {
  storededuction: number;
  safetydeduction: number;
  hourlyrows: any[];
  hourlytotals: any;
  handleHourlyPrint: () => void;
  deduction: Deductions | null;
}) {
  const headers = [
    { id: "date", label: "Type" },
    { id: "shifthrs", label: "Shift Hrs." },
    { id: "mandays", label: "Man Days" },
    { id: "rate", label: "Rate" },
    { id: "mandaysamount", label: "Man Days Amount" },
    { id: "othrs", label: "OT Hrs." },
    { id: "otamount", label: "OT Amount" },
    { id: "servicechargerate", label: "Service Charge Rate" },
    { id: "servicechargeamount", label: "Service Charge Amount" },
    { id: "taxable", label: "Taxable" },
    { id: "gst", label: "GST" },
    { id: "billamount", label: "Bill Amount" },
    { id: "tds", label: "TDS" },
    { id: "netpayable", label: "Net Payable" },
  ];

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
      <Tooltip title="Print" sx={{ float: "right", m: 1 }}>
        <IconButton onClick={() => handleHourlyPrint()}>
          <LocalPrintshopIcon />
        </IconButton>
      </Tooltip>
      {hourlyrows.map((row, index) => (
        <TableContainer
          key={index}
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
            my: 2,
          }}
        >
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ bgcolor: "#eeeeee" }}>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700" }}
                  colSpan={1}
                >
                  S No
                </TableCell>
                {index === 2 && (
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "700" }}
                    colSpan={1}
                  >
                    Department
                  </TableCell>
                )}
                {headers.map((header, index) => (
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "700" }}
                    colSpan={1}
                    key={index}
                  >
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {row.map((d: any, i: number) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ fontWeight: "600" }}>
                    {i + 1}
                  </TableCell>
                  {index === 2 && (
                    <TableCell align="center" sx={{ fontWeight: "600" }}>
                      {d.department}
                    </TableCell>
                  )}
                  {headers.map((header, index) => (
                    <TableCell
                      key={`${i} ${index} ${header} ${d.department}`}
                      align="center"
                      sx={{
                        fontWeight: i === row.length - 1 ? "600" : "500",
                      }}
                    >
                      {header.id === "mandays" ||
                      header.id === "othrs" ||
                      header.id === "shifthrs" ||
                      header.id === "rate" ||
                      header.id === "date" ||
                      header.id === "servicechargerate"
                        ? d[header.id]
                        : Math.round(d[header.id])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {index === 1 && (
                <TableRow sx={{ fontWeight: "700" }}>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ fontWeight: "600" }}
                  >
                    Total (8hr + 12HR)
                  </TableCell>
                  {headers.slice(2).map((header, i) => (
                    <TableCell
                      key={`${i} ${index} ${header}`}
                      align="center"
                      sx={{ fontWeight: "600" }}
                    >
                      {header.id === "mandays" ||
                      header.id === "othrs" ||
                      header.id === "servicechargerate"
                        ? hourlytotals[header.id]
                        : Math.round(hourlytotals[header.id])}
                    </TableCell>
                  ))}
                </TableRow>
              )}
              {index === 2 && (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={16}
                      align="center"
                      sx={{ fontWeight: "700" }}
                    >
                      Final Payout Information
                    </TableCell>
                  </TableRow>
                  {[
                    {
                      label: "NET AMOUNT PAYABLE",
                      value: hourlytotals.netpayable,
                    },
                    {
                      label: "GST HOLD (IF ANY)",
                      value:
                        (deduction?.gstrelease || 0) -
                          (deduction?.gsthold || 0) || 0,
                    },
                    {
                      label: "SAFETY PENALTY / EXTRA PPE / EXTRA HELMET",
                      value: safetydeduction,
                    },
                    {
                      label: "CONSUMABLES / CHARGABLE ITEMS",
                      value: storededuction,
                    },
                    {
                      label: "ADJUSTMENT OF ADVANCE AMOUNT",
                      value: deduction?.advance || 0,
                    },
                    {
                      label: "ANY OTHER DEDUCTIONS (IF ANY)",
                      value: deduction?.anyother || 0,
                    },
                    {
                      label: "FINAL PAYABLE",
                      value:
                        hourlytotals.netpayable -
                        safetydeduction -
                        storededuction +
                        ((deduction?.gstrelease || 0) -
                          (deduction?.gsthold || 0) || 0) -
                        (deduction?.advance || 0) -
                        (deduction?.anyother || 0),
                    },
                  ].map((d) => (
                    <TableRow>
                      <TableCell colSpan={9} align="center"></TableCell>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ fontWeight: "600" }}
                      >
                        {d.label}
                      </TableCell>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{ fontWeight: "600" }}
                      >
                        {Math.round(d.value).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Paper>
  );
}
