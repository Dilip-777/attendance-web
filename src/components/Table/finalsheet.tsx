import * as React from "react";
import FinalSheetTable from "./finalsheettable";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import {
  Contractor,
  Deductions,
  Department,
  Designations,
  Employee,
  TimeKeeper,
} from "@prisma/client";
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import _ from "lodash";
import MonthlyTable from "./MonthlyTable";

interface d extends Department {
  designations: DesignationsWithEmployees[];
}

interface DesignationsWithEmployees extends Designations {
  employees: Employee[];
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
  hourlyrows,
  hourlytotals,
  handleHourlyPrint,
  handleMonthlyPrint,
  deduction,
}: {
  rows: any;
  total: number;
  department: d | undefined;
  storededuction: number;
  safetydeduction: number;
  designations: Designations[];
  departments: d[];
  totals?: any;
  hourlyrows: any[];
  hourlytotals: any;
  handleHourlyPrint: () => void;
  handleMonthlyPrint: () => void;
  deduction: Deductions | null;
}) {
  const sidebar = designations
    .filter((d) => d.departmentname === department?.department)
    .map((d) => {
      if (d.basicsalary_in_duration !== "Hourly")
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

  const getRoundOff = (num: number) => {
    return Math.ceil(num);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", my: 3, mx: 2 }}
        >
          Hourly :
        </Typography>
        <FinalSheetTable
          hourlyrows={hourlyrows}
          hourlytotals={hourlytotals}
          storededuction={storededuction}
          safetydeduction={safetydeduction}
          handleHourlyPrint={handleHourlyPrint}
          deduction={deduction}
        />
      </Box>
      {departments.filter((d) => d.basicsalary_in_duration === "Daily").length >
        0 && (
        <Box>
          <Tooltip title="Print" sx={{ float: "right", m: 1 }}>
            <IconButton onClick={() => handleMonthlyPrint()}>
              <LocalPrintshopIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", my: 3 }}
          >
            Daily :
          </Typography>
          {departments
            .filter((d) => d.basicsalary_in_duration === "Daily")
            .map((d) => (
              <MonthlyTable
                rows={rows[d.department] || []}
                department={d}
                designations={d.designations}
              />
            ))}
          <Typography variant="h4" sx={{ my: 2 }}>
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
              maxHeight: "70vh",
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
                {departments.map((d, index) => (
                  <TableRow key={d.id}>
                    <TableCell align="center" sx={{ fontWeight: "600" }}>
                      {d.department}
                    </TableCell>
                    {headers.map((header, index) => (
                      <TableCell key={index + header} align="center">
                        {getRoundOff(
                          _.get(totals, [header, d.department]) || 0
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "600" }}>
                    Total
                  </TableCell>
                  {headers.map((header, index) => (
                    <TableCell key={index + header} align="center">
                      {getRoundOff(_.get(totals, [header, "total"]) || 0)}
                    </TableCell>
                  ))}
                </TableRow>
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
                    {Math.ceil(total).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    GST Hold
                  </TableCell>
                  <TableCell align="center">
                    {(deduction?.gstrelease || 0) - (deduction?.gsthold || 0) ||
                      0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Safety Violation's Penalty
                  </TableCell>
                  <TableCell align="center">-{safetydeduction}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Consumables / Rechargeable Items
                  </TableCell>
                  <TableCell align="center">-{storededuction}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Adjustment Of Advance Amount
                  </TableCell>
                  <TableCell align="center">
                    -{deduction?.advance || 0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Any Other Deductions
                  </TableCell>
                  <TableCell align="center">-{deduction?.anyother}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Any Other Addition
                  </TableCell>
                  <TableCell align="center">{deduction?.addition}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Final Payable
                  </TableCell>
                  <TableCell align="center">
                    {Math.ceil(
                      total > 0
                        ? total -
                            storededuction -
                            safetydeduction +
                            ((deduction?.gstrelease || 0) -
                              (deduction?.gsthold || 0) || 0) -
                            (deduction?.advance || 0) -
                            (deduction?.anyother || 0) +
                            (deduction?.addition || 0)
                        : 0
                    ).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {departments.filter((d) => d.basicsalary_in_duration === "Monthly")
        .length > 0 && (
        <Box>
          <Tooltip title="Print" sx={{ float: "right", m: 1 }}>
            <IconButton onClick={() => handleMonthlyPrint()}>
              <LocalPrintshopIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", my: 3 }}
          >
            Monthly :
          </Typography>
          {departments
            .filter((d) => d.basicsalary_in_duration === "Monthly")
            .map((d) => (
              <MonthlyTable
                rows={rows[d.department] || []}
                department={d}
                designations={d.designations}
              />
            ))}
          <Typography variant="h4" sx={{ my: 2 }}>
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
                      key={index + header.toString()}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {departments
                  ?.filter((d) => {
                    return _.get(totals, [headers[0], d.department]) > 0;
                  })
                  .map((d) => (
                    <TableRow key={d.id}>
                      <TableCell align="center" sx={{ fontWeight: "600" }}>
                        {d.department}
                      </TableCell>
                      {headers.map((header, index) => (
                        <TableCell key={index} align="center">
                          {getRoundOff(
                            _.get(totals, [header, d.department]) || 0
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "600" }}>
                    Total
                  </TableCell>
                  {headers.map((header, index) => (
                    <TableCell key={index + header} align="center">
                      {getRoundOff(_.get(totals, [header, "total"]) || 0)}
                    </TableCell>
                  ))}
                </TableRow>
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
                    {Math.ceil(total).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    GST Hold
                  </TableCell>
                  <TableCell align="center">
                    {(deduction?.gstrelease || 0) - (deduction?.gsthold || 0) ||
                      0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Safety Violation's Penalty
                  </TableCell>
                  <TableCell align="center">-{safetydeduction}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Consumables / Rechargeable Items
                  </TableCell>
                  <TableCell align="center">-{storededuction}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Adjustment Of Advance Amount
                  </TableCell>
                  <TableCell align="center">
                    -{deduction?.advance || 0}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Any Other Deductions
                  </TableCell>
                  <TableCell align="center">-{deduction?.anyother}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Any Other Addition
                  </TableCell>
                  <TableCell align="center">{deduction?.addition}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={6}></TableCell>
                  <TableCell colSpan={5} sx={{ fontWeight: "600" }}>
                    Final Payable
                  </TableCell>
                  <TableCell align="center">
                    {Math.ceil(
                      total > 0
                        ? total -
                            storededuction -
                            safetydeduction +
                            ((deduction?.gstrelease || 0) -
                              (deduction?.gsthold || 0) || 0) -
                            (deduction?.advance || 0) -
                            (deduction?.anyother || 0) +
                            (deduction?.addition || 0)
                        : 0
                    ).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

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
