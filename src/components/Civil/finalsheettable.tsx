import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import _ from "lodash";
import { Divider, Typography } from "@mui/material";
import { Deductions } from "@prisma/client";

export default function FinalsheetTable({
  title,
  rows,
  headcells,
  lastIndex = false,
  deduction,
  safetydeduction,
  storededuction,
  total,
}: {
  rows: any[];
  title: string;
  headcells: any[];
  lastIndex?: boolean;
  storededuction?: number;
  safetydeduction?: number;
  deduction?: Deductions | null;
  total?: number;
}) {
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
        my: 2,
      }}
    >
      <Typography variant="h4" sx={{ my: 2 }}>
        {title}
      </Typography>
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
          maxHeight: "70vh",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#eeeeee" }}>
              {headcells.map((headcell, index) => (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700", bgcolor: "#eeeeee" }}
                  colSpan={1}
                  key={index}
                >
                  {headcell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {headcells.map((headcell) => (
                  <TableCell align="center" sx={{ fontWeight: "500" }}>
                    {headcell.cell(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {lastIndex && (
              <>
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    sx={{ fontWeight: "700" }}
                  >
                    Final Payout Information
                  </TableCell>
                </TableRow>
                {[
                  {
                    label: "NET AMOUNT PAYABLE",
                    value: total,
                  },
                  {
                    label: "GST HOLD (IF ANY)",
                    value:
                      ((deduction?.gstrelease || 0) -
                        (deduction?.gsthold || 0) || 0) * -1,
                  },
                  {
                    label: "SAFETY PENALTY / EXTRA PPE / EXTRA HELMET",
                    value: (safetydeduction || 0) * -1,
                  },
                  {
                    label: "CONSUMABLES / CHARGABLE ITEMS",
                    value: (storededuction || 0) * -1,
                  },
                  {
                    label: "ADJUSTMENT OF ADVANCE AMOUNT",
                    value: (deduction?.advance || 0) * -1,
                  },
                  {
                    label: "ANY OTHER DEDUCTIONS (IF ANY)",
                    value: (deduction?.anyother || 0) * -1,
                    remarks: deduction?.remarks,
                  },
                  {
                    label: "ANY OTHER  ADDITIONS (IF ANY)",
                    value: (deduction?.addition || 0) * -1,
                  },

                  {
                    label: "FINAL PAYABLE",
                    value:
                      (total ?? 0) -
                      (safetydeduction ?? 0) -
                      (storededuction ?? 0) +
                      ((deduction?.gstrelease || 0) -
                        (deduction?.gsthold || 0) || 0) -
                      (deduction?.advance || 0) -
                      (deduction?.anyother || 0) +
                      (deduction?.addition || 0),
                  },
                ].map((d) => (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ fontWeight: "600" }}
                    >
                      {d.remarks || ""}
                    </TableCell>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ fontWeight: "600" }}
                    >
                      {d.label}
                    </TableCell>
                    <TableCell
                      colSpan={1}
                      align="center"
                      sx={{ fontWeight: "600" }}
                    >
                      {Math.round(d.value ?? 0).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 2 }} />
    </Paper>
  );
}
