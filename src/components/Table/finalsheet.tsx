import * as React from "react";
import FinalSheetTable from "./finalsheettable";
import { Department, Designations } from "@prisma/client";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";

interface d extends Department {
  designations: Designations[];
}

export default function FinalSheetta({
  rows,
  total,
  department,
  storededuction,
  safetydeduction,
  designations,
  departments,
  totals,
}: {
  rows: any;
  total: number;
  department: d | undefined;
  storededuction: number;
  safetydeduction: number;
  designations: Designations[];
  departments: d[];
  totals: any;
}) {
  console.log(departments, "Departments");

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

  const headers = [
    "Total Man days",
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

  const getRoundOff = (num: number) => {
    return Math.ceil(num);
  };

  console.log(rows, "Rows");
  console.log(totals, "totals");

  return (
    <Stack spacing={2}>
      {departments.map((d) => (
        <Box key={d.id}>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", my: 3, mx: 2 }}
          >
            {d.department} :
          </Typography>
          <FinalSheetTable
            rows={rows[d.department] || []}
            total={total || 0}
            department={d}
            designations={d.designations}
            storededuction={storededuction}
            safetydeduction={safetydeduction}
          />
        </Box>
      ))}
      <Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", my: 3, mx: 2 }}
        >
          Total:
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
                  Department
                </TableCell>

                {headers.map((header, index) => (
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
              {/* {sidebar.map((item) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                <TableCell align="center" sx={{ fontWeight: "600" }}>
                  {item.main}
                </TableCell>
                {item.sub && <TableCell align="center">{item.sub}</TableCell>}
                {rows.map((row, index) => (
                  <TableCell key={index} align="center">
                    {_.get(row, item.id) || 0}
                  </TableCell>
                ))}
              </TableRow>
            ))} */}

              {departments?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell align="center" sx={{ fontWeight: "600" }}>
                    {d.department}
                  </TableCell>
                  {headers.map((header, index) => (
                    <TableCell key={index} align="center">
                      {getRoundOff(_.get(totals, [header, d.department]) || 0)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {/* {headers.map((header, index) => (
              <TableRow key={index}>
                {Object.values(totals).find((t: any) => t.date === header)}
              </TableRow>
            ))} */}

              <TableRow>
                <TableCell colSpan={6 + 1}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  Net Amount Payable
                </TableCell>
                <TableCell align="center">
                  {total.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  GST Hold
                </TableCell>
                <TableCell align="center">{0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  Safety Voilation's Penalty
                </TableCell>
                <TableCell align="center">{safetydeduction}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  Consumables / Rechargeable Items
                </TableCell>
                <TableCell align="center">{storededuction}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  Adjustment Of Advance Amount
                </TableCell>
                <TableCell align="center">0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  Any Other Deductions
                </TableCell>
                <TableCell align="center">{0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell colSpan={6}></TableCell>
                <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                  Final Payable
                </TableCell>
                <TableCell align="center">
                  {(total > 0
                    ? total - storededuction - safetydeduction
                    : 0
                  ).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* <TableRow>
        <TableCell colSpan={6 + 1}></TableCell>
        <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
          Net Amount Payable
        </TableCell>
        <TableCell align="center">
          {total.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </TableCell>
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
          Safety Voilation's Penalty
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
          {(total > 0
            ? total - storededuction - safetydeduction
            : 0
          ).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </TableCell>
      </TableRow> */}
    </Stack>
  );
}
