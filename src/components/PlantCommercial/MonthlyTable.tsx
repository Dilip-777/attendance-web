import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Typography from "@mui/material/Typography";
import {
  Contractor,
  Department,
  Designations,
  Employee,
  SeperateSalary,
  Shifts,
  TimeKeeper,
} from "@prisma/client";
import dayjs from "dayjs";
import _ from "lodash";
import getEmployeesCalculation from "@/utils/getEmployeeacount";
import { Tooltip, IconButton } from "@mui/material";
import handleprint from "./printmonthly";
import axios from "axios";

interface HeadCell {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center" | "left";
  ceil?: boolean;
}

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

interface DepartmentDesignation extends Department {
  designations: DesignationwithSalary[];
}

interface EmployeeDepartmentDesignation extends Employee {
  department: Department;
  designation: Designations;
}

interface TableProps {
  contractor: Contractor;
  value: string;
  employees: EmployeeDepartmentDesignation[];
  departments: DepartmentDesignation[];
  ot: boolean;
  seperateSalarys: SeperateSalary[];
}

const MonthlyPlantCommercialTable = ({
  contractor,
  value,
  employees,
  departments,
  ot,
  seperateSalarys,
}: TableProps) => {
  console.log(departments);

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Record<string, string | number>[]>([]);
  const [total, setTotal] = React.useState(0);
  const [nettotal, setNettotal] = React.useState(0);

  const headcells: HeadCell[] = [
    { id: "employeeId", label: "ID" },
    { id: "name", label: "Name" },
    { id: "designation", label: "Designation" },
  ];

  const year = dayjs(value, "MM/YYYY").year();
  const month = dayjs(value, "MM/YYYY").month() + 1;
  const m = dayjs(`${year}-${month}`).daysInMonth();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    const date = `${i.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
    headcells.push({ id: date, label: i.toString().padStart(2, "0") });
  }

  const extraheadcells = [
    { id: "rate", label: "Rate" },
    { id: "amount", label: "Amount", ceil: true },
    { id: "othrs", label: "OT" },
    { id: "otamount", label: "OT Amount", ceil: true },
    { id: "totalamount", label: "Total Amount", ceil: true },
  ];
  headcells.push({ id: "total", label: "Total" });
  if (!ot) headcells.push(...extraheadcells);
  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${contractor.contractorId}&month=${value}`
    );

    const { rows, total, nettotal } = getEmployeesCalculation(
      res.data,
      dayjs(value, "MM/YYYY").month() + 1,
      dayjs(value, "MM/YYYY").year(),
      employees,
      ot,
      seperateSalarys
    );
    // const { rows, total1 } = getTotalAmountAndRows(
    //   timekeepers,
    //   dayjs(value, 'MM/YYYY').month() + 1,
    //   dayjs(value, 'MM/YYYY').year(),
    //   shifts,
    //   contractor,
    //   designations.filter((d) => d.departmentname === department.department),
    //   department,
    //   wrkhrs
    // );
    setRows(rows);
    setTotal(total as number);
    setNettotal(nettotal as number);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value, employees, departments]);

  return (
    <Stack spacing={3} p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          {ot ? "OT Hrs" : "Attendance"} of {contractor.contractorname}{" "}
          <span style={{ marginLeft: "5rem" }}>Month - Sept 2023</span>
        </Typography>
        <Tooltip title="Print" sx={{ alignSelf: "flex-end", mr: 3 }}>
          <IconButton
            onClick={() =>
              handleprint({
                rows,
                departments,
                month,
                contractor: contractor.contractorname,
                year,
                allcounts: [],
                total,
                netTotal: nettotal,
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
              {headcells.map((headCell) => (
                <TableCell
                  align="center"
                  sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                  colSpan={1}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rows.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.f8mw}>
                  {headcells.map((headcell) => (
                    <TableCell key={headcell.id} align={"center"}>
                      {headcell.ceil
                        ? Math.ceil(_.get(row, headcell.id) as number)
                        : _.get(row, headcell.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
            {!ot &&
              [
                { label: "Add 10%", value: Math.ceil(total * 0.1) },
                {
                  label: "Taxable Amount",
                  value: Math.ceil(total * 0.1 + nettotal),
                },
                {
                  label: "IGST 18%",
                  value: Math.ceil((total * 0.1 + nettotal) * 0.18),
                },
                {
                  label: "Total",
                  value: Math.ceil((total * 0.1 + nettotal) * 1.18),
                },
              ].map((item) => (
                <TableRow>
                  <TableCell colSpan={m + 5}></TableCell>
                  <TableCell
                    colSpan={3}
                    // align="left"
                    sx={{ fontWeight: "600" }}
                  >
                    {item.label}
                  </TableCell>
                  <TableCell align="center">{item.value}</TableCell>
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

export default MonthlyPlantCommercialTable;
