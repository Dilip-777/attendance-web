import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Contractor,
  Department,
  Designations,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from "@prisma/client";
import dayjs from "dayjs";
import _ from "lodash";
import getHourlyCount from "@/utils/gethourlycount";
import { IconButton, Tooltip } from "@mui/material";
import handleprint from "./printexcel";
import { useSession } from "next-auth/react";

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

interface TableProps {
  departments: DepartmentDesignation[];
  contractor: Contractor;
  shifts: Shifts[];
  value: string;
  wrkhrs: number;
  servicecharge?: number;
  timekeepers: TimeKeeper[];
  ot: boolean;
}

const HourlyTable = ({
  departments,
  contractor,
  shifts,
  value,
  wrkhrs,
  servicecharge,
  timekeepers,
  ot,
}: TableProps) => {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [allcounts, setAllCounts] = React.useState<
    Record<string, string | number>[]
  >([]);
  const [colspan, setColspan] = React.useState(0);
  const [colspan1, setColspan1] = React.useState(0);
  const [netTotal, setNetTotal] = React.useState(0);
  const { data: session } = useSession();
  const sgst = Math.ceil(total * 0.09);

  const fetchTimekeepers = async () => {
    setLoading(true);
    const { rows, total, allcounts, netTotal } = getHourlyCount(
      timekeepers,
      dayjs(value, "MM/YYYY").month() + 1,
      dayjs(value, "MM/YYYY").year(),
      shifts,
      contractor,
      departments,
      wrkhrs,
      ot,
      session?.user?.role
    );

    setAllCounts(allcounts);
    setRows(rows);
    setTotal(total as number);
    setNetTotal(netTotal);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value, contractor, departments, wrkhrs]);

  React.useEffect(() => {
    updateColspans();
  }, [departments]);

  const updateColspans = () => {
    let count = 0;
    departments
      .filter((d) => d.basicsalary_in_duration === "Hourly")
      .forEach((department) => {
        count += department.designations.length;
      });

    if (count < 7) {
      setColspan1(7 - count);
    } else {
      setColspan1(0);
    }

    if (count >= 6) {
      setColspan(count - 6);
    } else setColspan(0);
  };

  const headcells = [
    { label: "", id: "date" },
    { label: "Att Count", id: "attendancecount" },
    { label: "Amt", id: "mandaysamount" },
    { label: "OT Hrs", id: "othrs" },
    { label: "OT Amt", id: "otamount" },
    { label: "Total", id: "totalnetamount" },
  ];

  return (
    <Stack spacing={3} p={3} pt={0}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          {ot ? "OT Hrs" : "Attendance"} of {contractor.contractorname} (
          {wrkhrs}HR)
          <span style={{ marginLeft: "2rem" }}>
            Month - {dayjs(value, "MM/YYYY").format("MMMM YYYY")}
          </span>
        </Typography>
        <Tooltip title="Print" sx={{ alignSelf: "flex-end", mr: 3 }}>
          <IconButton
            onClick={() =>
              handleprint({
                rows,
                departments,
                contractor: contractor.contractorname,
                month: dayjs(value, "MM/YYYY").month() + 1,
                year: dayjs(value, "MM/YYYY").year(),
                allcounts,
                total,
                netTotal,
                ot,
              })
            }
          >
            <LocalPrintshopIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <TableContainer
        sx={{
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            // width: 7,
            height: 9,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        <Table sx={{}} aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#e0e0e0" }}>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                Date
              </TableCell>
              {departments.map((department) => {
                return (
                  <TableCell
                    key={department.id}
                    align="center"
                    sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                    colSpan={department.designations.length * 1}
                  >
                    {department.department}
                  </TableCell>
                );
              })}
              {colspan1 !== 0 && (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                  colSpan={colspan1}
                ></TableCell>
              )}
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                TOTAL
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "700" }} colSpan={1}>
                -
              </TableCell>
              {departments
                .filter((d) => d.designations.length !== 0)
                .map((department) =>
                  department.designations.map((designation) => (
                    <TableCell
                      key={designation.id}
                      align="center"
                      sx={{ fontWeight: "700" }}
                      colSpan={1}
                    >
                      {designation.designation}
                    </TableCell>
                  ))
                )}
              {colspan1 !== 0 && <TableCell colSpan={colspan1}></TableCell>}
              <TableCell align="center" sx={{ fontWeight: "700" }} colSpan={1}>
                -
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.f8mw}>
                    {/* {columns.map((column) => {
                      const value = _.get(row, column.id, '-');
                      const value1 = _.get(row, 'date', '-');

                      return (
                        <TableCell key={column.id} align={'center'}>
                          {column.id === 'date' || value1 === 'Total Man days' || value1 === 'Overtime Hrs.'
                            ? value
                            : Math.ceil(value as number)}
                        </TableCell>
                      );
                    })} */}
                    <TableCell key={row.date} align={"center"}>
                      {row.date}
                    </TableCell>
                    {departments.map((department) =>
                      department.designations.map((designation) => (
                        <TableCell
                          key={designation.id}
                          align={"center"}
                          colSpan={1}
                        >
                          {[
                            "Man Days Amount",
                            "OT Amount",
                            "Total Amount",
                            "Service Charge Amount",
                            "Taxable",
                          ].includes(row.date as string)
                            ? Math.ceil(row[designation.id] as number)
                            : row[designation.id]}

                          {/* {_.get(row, designation.id, 0)} */}
                        </TableCell>
                      ))
                    )}
                    {colspan1 !== 0 && (
                      <TableCell colSpan={colspan1}></TableCell>
                    )}
                    <TableCell key={row.total} align={"center"} colSpan={1}>
                      {Math.ceil(row.total as number)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
            {!ot && session?.user?.role !== "HR" && (
              <TableRow>
                {headcells.map((headcell) => (
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "700" }}
                    colSpan={1}
                  >
                    {headcell.label}
                  </TableCell>
                ))}
                <TableCell colSpan={colspan}></TableCell>
                <TableCell sx={{ fontWeight: "700" }}>ADD 10%</TableCell>
                <TableCell sx={{ fontWeight: "700" }} align="center">
                  {Math.ceil(total * 0.1)}
                </TableCell>
              </TableRow>
            )}

            {!ot &&
              session?.user?.role !== "HR" &&
              allcounts.map((a) => (
                <TableRow key={a.date}>
                  {headcells.map((headcell) => (
                    <TableCell align="center" colSpan={1}>
                      {!(
                        headcell.id === "attendancecount" ||
                        headcell.id === "date"
                      )
                        ? Math.ceil(a[headcell.id] as number) || 0
                        : a[headcell.id] || 0}
                    </TableCell>
                  ))}
                  <TableCell colSpan={colspan}></TableCell>
                  {/* {getColspan() && <TableCell colSpan={getColspan()}></TableCell>} */}
                  <TableCell sx={{ fontWeight: "700" }}>{a.label}</TableCell>
                  <TableCell sx={{ fontWeight: "700" }} align="center">
                    {Math.ceil(a.value as number)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="space-between" pt="4rem">
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          Checked By
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          Verified By <br></br>{" "}
          <span
            style={{
              fontWeight: "500",
              marginLeft: "auto",
              textAlign: "right",
            }}
          >
            HR
          </span>
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          Verified By <br></br>{" "}
          <span
            style={{
              fontWeight: "500",
              marginLeft: "auto",
              textAlign: "right",
            }}
          >
            (Comm .)
          </span>
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          Passed By <br></br>{" "}
          <span
            style={{
              fontWeight: "500",
              marginLeft: "auto",
              textAlign: "right",
            }}
          >
            ED
          </span>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default HourlyTable;
