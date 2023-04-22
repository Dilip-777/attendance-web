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
import { TimeKeeper } from "@prisma/client";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
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

const columns: Column[] = [
  {
    id: "date",
    label: "",
    minWidth: 80,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m8",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "f8",
    label: "F",
    minWidth: 50,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m20",
    label: "M",
    minWidth: 50,
    align: "center",

    format: (value: number) => value.toString(),
  },
  {
    id: "f20",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "dm",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "qc",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "store",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "k7m",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "k7f",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "rmhs",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "ps",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "hk",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "svr",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
];

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

const FormSelect = ({
  value,
  setValue,
  options,
}: {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  options: { value: number; label: string }[];
}) => {
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value as number)}
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

export default function PlantCommercial({
  timekeeper,
  name,
}: {
  timekeeper: TimeKeeper[];
  name: string;
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [month, setMonth] = React.useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([] as Data[]);
  const [total, setTotal] = React.useState(0);

  const getCount = (
    data: TimeKeeper[],
    designation: string,
    gender: string
  ) => {
    return data.filter(
      (item) => item.designation === designation && item.gender === gender
    ).length;
  };

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
    const m8 = getCount(filtered, "8MW", "Male");
    const f8 = getCount(filtered, "8MW", "Female");
    const m20 = getCount(filtered, "20MW", "Male");
    const f20 = getCount(filtered, "20WM", "Female");
    const dm = getCount(filtered, "DM Plant", "Male");
    const qc = getCount(filtered, "QC", "Male");
    const store = getCount(filtered, "STORE", "Male");
    const k7m = getCount(filtered, "K-7 & 1-6PROC", "Male");
    const k7f = getCount(filtered, "K-7 & 1-6PROC", "Female");
    const rmhs = getCount(filtered, "RHMS", "Male");
    const ps = getCount(filtered, "PS", "Female");
    const hk = getCount(filtered, "HK & Garden", "Male");
    const svr = getCount(filtered, "SVR", "Male");
    const total =
      m8 + f8 + m20 + f20 + dm + qc + store + k7m + k7f + rmhs + ps + hk + svr;
    return {
      date,
      m8,
      f8,
      m20,
      f20,
      dm,
      qc,
      store,
      k7m,
      k7f,
      rmhs,
      ps,
      hk,
      svr,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance: Data = {
      date: "Total Attendance",
      m8: 0,
      f8: 0,
      m20: 0,
      f20: 0,
      dm: 0,
      qc: 0,
      store: 0,
      k7m: 0,
      k7f: 0,
      rmhs: 0,
      ps: 0,
      hk: 0,
      svr: 0,
      total: 0,
    };
    rows.forEach((row) => {
      totalAttendance.m8 += row.m8;
      totalAttendance.f8 += row.f8;
      totalAttendance.m20 += row.m20;
      totalAttendance.f20 += row.f20;
      totalAttendance.dm += row.dm;
      totalAttendance.qc += row.qc;
      totalAttendance.k7m += row.k7m;
      totalAttendance.k7f += row.k7f;
      totalAttendance.rmhs += row.rmhs;
      totalAttendance.ps += row.ps;
      totalAttendance.hk += row.hk;
      totalAttendance.svr += row.svr;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }

  console.log(loading);

  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      m8: 0,
      f8: 0,
      m20: 0,
      f20: 0,
      dm: 0,
      qc: 0,
      store: 0,
      k7m: 0,
      k7f: 0,
      rmhs: 0,
      ps: 0,
      hk: 0,
      svr: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.designation === "8MW") {
        item.gender === "Male"
          ? (totalOvertime.m8 += Number(item.manualovertime))
          : (totalOvertime.f8 += Number(item.manualovertime));
      }
      if (item.designation === "20MW") {
        item.gender === "Male"
          ? (totalOvertime.m20 += Number(item.manualovertime))
          : (totalOvertime.f20 += Number(item.manualovertime));
      }
      if (item.designation === "DM Plant") {
        totalOvertime.dm += Number(item.manualovertime);
      }
      if (item.designation === "QC") {
        totalOvertime.qc += Number(item.manualovertime);
      }
      if (item.designation === "STORE") {
        totalOvertime.store += Number(item.manualovertime);
      }
      if (item.designation === "K-7 & 1-6PROC") {
        item.gender === "Male"
          ? (totalOvertime.k7m += Number(item.manualovertime))
          : (totalOvertime.k7f += Number(item.manualovertime));
      }
      if (item.designation === "RHMS") {
        totalOvertime.rmhs += Number(item.manualovertime);
      }
      if (item.designation === "PS") {
        totalOvertime.ps += Number(item.manualovertime);
      }
      if (item.designation === "HK & Garden") {
        totalOvertime.hk += Number(item.manualovertime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime);
      }
      totalOvertime.total += Number(item.manualovertime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      m8: totalAttendance.m8 * rate.m8,
      f8: totalAttendance.f8 * rate.f8,
      m20: totalAttendance.m20 * rate.m20,
      f20: totalAttendance.f20 * rate.f20,
      dm: totalAttendance.dm * rate.dm,
      qc: totalAttendance.qc * rate.qc,
      store: totalAttendance.store * rate.store,
      k7m: totalAttendance.k7m * rate.k7m,
      k7f: totalAttendance.k7f * rate.k7f,
      rmhs: totalAttendance.rmhs * rate.rmhs,
      ps: totalAttendance.ps * rate.ps,
      hk: totalAttendance.hk * rate.hk,
      svr: totalAttendance.svr * rate.svr,
      total: 0,
    };
    const total = Object.values(totalAmount)
      .filter((value) => typeof value === "number")
      .reduce((a, b) => Number(a) + Number(b), 0);
    return {
      ...totalAmount,
      total,
    };
  };

  const getTotalOtAmount = (totalOvertime: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "OT Amount",
      m8: (totalOvertime.m8 * rate.m8) / 12,
      f8: (totalOvertime.f8 * rate.f8) / 12,
      m20: (totalOvertime.m20 * rate.m20) / 12,
      f20: (totalOvertime.f20 * rate.f20) / 12,
      dm: (totalOvertime.dm * rate.dm) / 12,
      qc: (totalOvertime.qc * rate.qc) / 12,
      store: (totalOvertime.store * rate.store) / 12,
      k7m: (totalOvertime.k7m * rate.k7m) / 12,
      k7f: (totalOvertime.k7f * rate.k7f) / 12,
      rmhs: (totalOvertime.rmhs * rate.rmhs) / 12,
      ps: (totalOvertime.ps * rate.ps) / 12,
      hk: (totalOvertime.hk * rate.hk) / 12,
      svr: (totalOvertime.svr * rate.svr) / 12,
      total: 0,
    };
    const total = Object.values(totalAmount)
      .filter((value) => typeof value === "number")
      .reduce((a, b) => Number(a) + Number(b), 0);
    return {
      ...totalAmount,
      total,
    };
  };

  const getTotalAmount = (totalAmount: Data, totalOtAmount: Data) => {
    const netAmount: Data = {
      date: "Total Amount",
      m8: totalAmount.m8 + totalOtAmount.m8,
      f8: totalAmount.f8 + totalOtAmount.f8,
      m20: totalAmount.m20 + totalOtAmount.m20,
      f20: totalAmount.f20 + totalOtAmount.f20,
      dm: totalAmount.dm + totalOtAmount.dm,
      qc: totalAmount.qc + totalOtAmount.qc,
      store: totalAmount.store + totalOtAmount.store,
      k7m: totalAmount.k7m + totalOtAmount.k7m,
      k7f: totalAmount.k7f + totalOtAmount.k7f,
      rmhs: totalAmount.rmhs + totalOtAmount.rmhs,
      ps: totalAmount.ps + totalOtAmount.ps,
      hk: totalAmount.hk + totalOtAmount.hk,
      svr: totalAmount.svr + totalOtAmount.svr,
      total: totalAmount.total + totalOtAmount.total,
    };
    return netAmount;
  };

  const getCPAmount = (cp: Data, totalAttendance: Data) => {
    const cpAmount: Data = {
      date: "CP Amount",
      m8: cp.m8 * totalAttendance.m8,
      f8: cp.f8 * totalAttendance.f8,
      m20: cp.m20 * totalAttendance.m20,
      f20: cp.f20 * totalAttendance.f20,
      dm: cp.dm * totalAttendance.dm,
      qc: cp.qc * totalAttendance.qc,
      store: cp.store * totalAttendance.store,
      k7m: cp.k7m * totalAttendance.k7m,
      k7f: cp.k7f * totalAttendance.k7f,
      rmhs: cp.rmhs * totalAttendance.rmhs,
      ps: cp.ps * totalAttendance.ps,
      hk: cp.hk * totalAttendance.hk,
      svr: cp.svr * totalAttendance.svr,
      total: 0,
    };
    const total = Object.values(cpAmount)
      .filter((value) => typeof value === "number")
      .reduce((a, b) => Number(a) + Number(b), 0);
    return {
      ...cpAmount,
      total,
    };
  };

  async function getRows(month: number, year: number) {
    setLoading(true);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const rows: Data[] = [];

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, "0")}-${month
        .toString()
        .padStart(2, "0")}-${year}`;
      rows.push(getData(date));
    }

    const totalAttendance = getTotalAttendanceRecord(rows as Data[]);
    rows.push(totalAttendance);
    const rates = {
      date: "Rate",
      m8: 325,
      f8: 305,
      m20: 325,
      f20: 305,
      dm: 325,
      qc: 325,
      store: 325,
      k7m: 325,
      k7f: 305,
      rmhs: 325,
      ps: 305,
      hk: 325,
      svr: 365,
      total: 0,
    };
    rows.push(rates);
    const Amount = getAmount(totalAttendance, rates);
    rows.push(Amount);

    const data = timekeeper.filter((entry) => {
      const entryMonth = parseInt(entry.attendancedate.split("-")[1]);
      const entryYear = parseInt(entry.attendancedate.split("-")[2]);
      return entryMonth === month && entryYear === year;
    });

    const totalOvertime = getTotalOvertimeRecord(data);
    rows.push(totalOvertime);

    const totalOtAmount = getTotalOtAmount(totalOvertime, rates);
    rows.push(totalOtAmount);

    const totalAmount = getTotalAmount(Amount, totalOtAmount);
    rows.push(totalAmount);

    const cp = {
      date: "CP",
      m8: 30.5,
      f8: 27.5,
      m20: 30.5,
      f20: 27.5,
      dm: 30.5,
      qc: 30.5,
      store: 30.5,
      k7m: 30.5,
      k7f: 27.5,
      rmhs: 30.5,
      ps: 27.5,
      hk: 30.5,
      svr: 34.5,
      total: 0,
    };
    rows.push(cp);

    const cpAmount = getCPAmount(cp, totalAttendance);
    rows.push(cpAmount);

    setTotal(totalAmount.total + cpAmount.total);

    return rows;
  }

  const handleGetRows = async () => {
    setLoading(true);
    const rows = await getRows(month, year);
    setRows(rows);
    setLoading(false);
  };

  React.useEffect(() => {
    handleGetRows();
  }, [month, year]);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [
    { value: 2019, label: "2019" },
    { value: 2020, label: "2020" },
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
    { value: 2023, label: "2023" },
  ];

  const date = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedDate = formatter.format(date);
  console.log(formattedDate);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <Box sx={{ height: "5rem", display: "flex", p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormSelect value={month} setValue={setMonth} options={months} />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormSelect value={year} setValue={setYear} options={years} />
          </Grid>
        </Grid>
        <Typography variant="h4" sx={{ width: "15rem" }}>
          Contractor : {name}
        </Typography>
      </Box>
      <TableContainer
        sx={{
          maxHeight: 500,
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
            <TableRow>
              <TableCell align="center" colSpan={1}>
                Date
              </TableCell>
              <TableCell align="center" colSpan={2}>
                8 MW
              </TableCell>
              <TableCell align="center" colSpan={2}>
                12 MW
              </TableCell>
              <TableCell align="center" colSpan={1}>
                DM Plant
              </TableCell>
              <TableCell align="center" colSpan={1}>
                QC
              </TableCell>
              <TableCell align="center" colSpan={1}>
                Store
              </TableCell>
              <TableCell align="center" colSpan={2}>
                K-7 & 1-6PROC
              </TableCell>
              <TableCell align="center" colSpan={1}>
                RMHS
              </TableCell>
              <TableCell align="center" colSpan={1}>
                PS
              </TableCell>
              <TableCell align="center" colSpan={1}>
                HK & Garden
              </TableCell>
              <TableCell align="center" colSpan={1}>
                SVR
              </TableCell>
              <TableCell align="center" colSpan={1}>
                TOTAL
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.f8}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell rowSpan={10} />
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3}>SGST 9%</TableCell>
              <TableCell align="center">{total * 1.09}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3}>CGST 9%</TableCell>
              <TableCell align="center">{total * 1.09}</TableCell>
            </TableRow>
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

  const { id } = context.query;

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
  const contractor = await prisma.contractor.findUnique({
    where: {
      id: id as string,
    },
  });
  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      contractorname: contractor?.contractorname,
      attendance: "1",
      department: "12HR",
      approvedByTimekeeper: true,
      NOT: {
        status: "Pending",
      },
    },
  });
  return {
    props: {
      timekeeper,
      name: contractor?.contractorname,
    },
  };
};
