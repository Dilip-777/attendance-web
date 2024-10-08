import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import {
  Contractor,
  Department,
  Designations,
  FixedDesignations,
  FixedValues,
  SeperateSalary,
  Shifts,
  TimeKeeper,
  Workorder,
  payoutTracker,
} from "@prisma/client";
import { Box, Divider, FormControl, MenuItem, Select } from "@mui/material";
import getTotalAmountAndRows from "@/utils/getmonthlycount";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

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

export const FormSelect = ({
  value,
  setValue,
  options,
}: {
  value: number | string;
  setValue: React.Dispatch<React.SetStateAction<number>> | any;
  options: { value: number | string; label: string }[];
}) => {
  return (
    <FormControl fullWidth variant="outlined">
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value as number)}
        placeholder="Select"
        // defaultValue={value}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface DesignationsWtihSalary extends Designations {
  seperateSalary: SeperateSalary[];
}

export default function PlantCommercial({
  workorders,
  designations,
  departments,
  shifts,
  contractors,
}: {
  workorders: Workorder[];
  designations: DesignationsWtihSalary[];
  departments: Department[];
  shifts: Shifts[];
  contractors: Contractor[];
}) {
  const [value, setValue] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [timekeepers, setTimekeepers] = React.useState<TimeKeeper[]>([]);
  const [payouts, setPayouts] = React.useState<payoutTracker[]>([]);
  const [rows, setRows] = React.useState([] as Data[]);
  const [fixedValues, setFixedValues] = React.useState<
    (FixedValues & {
      designations: FixedDesignations[];
    })[]
  >([]);

  const fetchFixedValues = async () => {
    const res = await axios.get(`/api/fixedvalues?month=${value}`);
    setFixedValues(res.data);
  };

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(`/api/gettimekeeper?month=${value}`);
    setTimekeepers(res.data);
    setLoading(false);
  };

  const fetchPayouts = async () => {
    setLoading(true);
    const res = await axios.get(`/api/payouttracker?month=${value}`);
    setPayouts(res.data);
    setLoading(false);
  };

  const getAttendance = (contractorname: string, contractorId: string) => {
    console.log(timekeepers.filter((t) => t.contractorname === contractorname));

    let total = 0;
    const totals = [];

    departments.forEach((d) => {
      const { totalnetPayable } = getTotalAmountAndRows(
        timekeepers.filter(
          (t) =>
            t.contractorname === contractorname && t.department === d.department
        ),
        dayjs(value, "MM/YYYY").month() + 1,
        dayjs(value, "MM/YYYY").year(),
        contractorId,
        contractors.find(
          (c) => c.contractorname === contractorname
        ) as Contractor,
        designations.filter((da) => da.departmentname === d.department),
        fixedValues.find((f) => f.contractorId === contractorId)?.designations
      );
      total += totalnetPayable || 0;
      totals.push(totalnetPayable || 0);
    });

    totals.push(total);
    return totals;
  };

  React.useEffect(() => {
    fetchTimekeepers();
    fetchPayouts();
    fetchFixedValues();
  }, [value]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddRecord = async (
    amount: number,
    contractorName: string,
    contractorId: number
  ) => {
    await axios.post(`/api/payouttracker`, {
      amount: Math.floor(amount),
      contractorName,
      contractorId: contractorId?.toString(),
      month: value,
      gst: 9,
      tds: 9,
      finalpayableamount: Math.floor(amount + amount * 0.18),
    });
    fetchPayouts();
  };

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format("MM/YYYY") || "");

  return (
    <Paper sx={{ width: "100%" }}>
      <Box
        sx={{
          height: "5rem",
          display: "flex",
          p: 3,
          justifyContent: "flex-start",
          mb: 2,
        }}
      >
        <MonthSelect
          label="Select Date"
          value={dayjs(value, "MM/YYYY")}
          onChange={onChange}
        />
      </Box>

      <TableContainer
        sx={{
          maxHeight: 500,
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
            <TableRow>
              <TableCell align="center">Work Order Id</TableCell>
              <TableCell align="center">Contractor Name</TableCell>
              <TableCell align="center">Month</TableCell>

              {/* <TableCell align="center">8HR</TableCell>
              <TableCell align="center">12HR</TableCell>
              <TableCell align="center">CCM</TableCell>
              <TableCell align="center">LRF</TableCell>
              <TableCell align="center">Colony</TableCell> */}
              {departments.map((d) => (
                <TableCell align="center">{d.department}</TableCell>
              ))}
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              workorders
                .filter((w) => w.startDate.includes(value))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center" colSpan={1}>
                        {row.id}
                      </TableCell>
                      <TableCell align="center" colSpan={1}>
                        {row.contractorName}
                      </TableCell>
                      <TableCell align="center" colSpan={1}>
                        {dayjs(row.startDate, "DD/MM/YYYY").format("MM/YYYY")}
                      </TableCell>
                      {getAttendance(row.contractorName, row.contractorId).map(
                        (a) => (
                          <TableCell align="center" colSpan={1}>
                            {a}
                          </TableCell>
                        )
                      )}
                      <TableCell
                        align="center"
                        colSpan={1}
                        onClick={() =>
                          handleAddRecord(
                            getAttendance(
                              row.contractorName,
                              row.contractorId
                            )[5],
                            row.contractorName,
                            parseInt(row.contractorId)
                          )
                        }
                      >
                        {payouts.find(
                          (p) => p.contractorName === row.contractorName
                        )
                          ? "Update Record"
                          : "Add Record"}
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const designations = await prisma.designations.findMany({
    include: {
      seperateSalary: true,
    },
  });
  const departments = await prisma.department.findMany();
  const workorders = await prisma.workorder.findMany();
  const shifts = await prisma.shifts.findMany();
  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      workorders,
      designations,
      departments,
      shifts,
      contractors,
    },
  };
};
