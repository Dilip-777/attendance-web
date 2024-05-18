import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import _ from "lodash";
import { Department, Designations, Employee } from "@prisma/client";
import { Divider, Typography } from "@mui/material";

interface DesignationsWithEmployees extends Designations {
  employees: Employee[];
}

export default function MonthlyTable({
  rows,
  department,
  designations,
}: {
  rows: any[];
  department: Department | undefined;
  designations: DesignationsWithEmployees[];
}) {
  const sidebar = designations
    .filter((d) => d.departmentname === department?.department)
    .filter((d) => d.employees.length > 0)
    .map((d) => {
      if (d.basicsalary_in_duration !== "Houly")
        return { main: d.designation, id: d.id };
      if (d.gender === "Male")
        return { main: d.designation, sub: "M", id: d.id };
      else if (d.gender === "Female")
        return { main: d.designation, sub: "F", id: d.id };
      else return { main: d.designation, id: d.id };
    });

  const getRoundOff = (value: number) => {
    return Math.ceil(value);
  };

  if (department?.basicsalary_in_duration?.toLowerCase() === "hourly") {
    sidebar.push({ main: "Total", sub: " ", id: "total" });
  } else {
    sidebar.push({ main: "Total", id: "total" });
  }
  const headers = [
    "Total Man days",
    "Rate",
    "Man Days Amount",
    "Overtime Hrs.",
    "OT Amount",
    "Total Amount",
    "Service Charge Rate",
    "Service Charge Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
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
        my: 2,
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        {department?.department}
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
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#eeeeee" }}
                colSpan={1}
              >
                Designation
              </TableCell>
              {department?.basicsalary_in_duration?.toLowerCase() ===
                "hourly" && (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700", bgcolor: "#eeeeee" }}
                  colSpan={1}
                >
                  Type
                </TableCell>
              )}
              {headers.map((header, index) => (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700", bgcolor: "#eeeeee" }}
                  colSpan={1}
                  key={index}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sidebar
              .filter((item) => {
                if (item.main === "Total") return true;
                if (rows[0]) return rows[0][item.id] !== 0;
                else return true;
              })
              .map((item) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                  <TableCell align="center" sx={{ fontWeight: "600" }}>
                    {item.main}
                  </TableCell>
                  {item.sub && <TableCell align="center">{item.sub}</TableCell>}
                  {rows.map((row, index) => (
                    <TableCell key={index} align="center">
                      {row.date === "Service Charge Rate"
                        ? _.get(row, item.id)
                        : getRoundOff(_.get(row, item.id) || 0)}
                      {/* {getRoundOff(_.get(row, item.id) || 0)} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 2 }} />
    </Paper>
  );
}
