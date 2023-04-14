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
import { Box, FormControl, Grid, MenuItem, Select } from "@mui/material";
import getLRF from "@/utils/getlrf";
interface Column {
  id:
    | "date"
    | "ele"
    | "filter"
    | "srfilter"
    | "svr"
    | "lmes"
    | "helper"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

const designation = {
  date: "",
  ele: "ELE",
  filter: "JRFILTER",
  srfilter: "SRFILTER",
  svr: "SVR",
  lmes: "LMES",
  helper: "HELPER",
  total: "TOTAL",
};

const columns: Column[] = [
  {
    id: "date",
    label: "Date",
    minWidth: 150,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "ele",
    label: "ELE",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "filter",
    label: "Filter",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "srfilter",
    label: "SR Filter",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "svr",
    label: "SVR",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "lmes",
    label: "LMES",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "helper",
    label: "Helper",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "Total",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
];

interface Data {
  date: string;
  ele: number;
  filter: number;
  srfilter: number;
  svr: number;
  lmes: number;
  helper: number;
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

export default function PlantCommercialCCM({
  timekeeper,
  result,
}: {
  timekeeper: TimeKeeper[];
  result: any;
}) {
  console.log(timekeeper);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [month, setMonth] = React.useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([] as Data[]);
  const [total, setTotal] = React.useState(0);

  const getCount = (data: TimeKeeper[], designation: string) => {
    return data.filter((item) => item.designation === designation).length;
  };

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
    const ele = getCount(filtered, "ELE");
    const filter = getCount(filtered, "JRFILTER");
    const srfilter = getCount(filtered, "SRFILTER");
    const lmes = getCount(filtered, "LMES");
    const svr = getCount(filtered, "SVR");
    const helper = getCount(filtered, "HELPER");
    const total = ele + filter + srfilter + lmes + svr + helper;
    return {
      date,
      ele,
      filter,
      srfilter,
      svr,
      lmes,
      helper,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance = {
      date: "Total Attendance",
      ele: 0,
      filter: 0,
      srfilter: 0,
      lmes: 0,
      svr: 0,
      helper: 0,
      total: 0,
    };

    rows.forEach((row) => {
      totalAttendance.ele += row.ele;
      totalAttendance.filter += row.filter;
      totalAttendance.srfilter += row.srfilter;
      totalAttendance.svr += row.svr;
      totalAttendance.lmes += row.lmes;
      totalAttendance.helper += row.helper;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }

  console.log(loading);

  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      ele: 0,
      filter: 0,
      srfilter: 0,
      svr: 0,
      lmes: 0,
      helper: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.designation === "ELE") {
        totalOvertime.ele += Number(item.manualovertime);
      }
      if (item.designation === "JRFILTER") {
        totalOvertime.filter += Number(item.manualovertime);
      }
      if (item.designation === "SRFILTER") {
        totalOvertime.srfilter += Number(item.manualovertime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime);
      }

      if (item.designation === "LMES") {
        totalOvertime.lmes += Number(item.manualovertime);
      }
      if (item.designation === "HELPER") {
        totalOvertime.helper += Number(item.manualovertime);
      }

      totalOvertime.total += Number(item.manualovertime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      ele: totalAttendance.ele * rate.ele,
      filter: totalAttendance.filter * rate.filter,
      srfilter: totalAttendance.srfilter * rate.srfilter,
      lmes: totalAttendance.lmes * rate.lmes,
      svr: totalAttendance.svr * rate.svr,
      helper: totalAttendance.helper * rate.helper,
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
      ele: (totalOvertime.ele * rate.ele) / 8,
      filter: (totalOvertime.filter * rate.filter) / 8,
      srfilter: (totalOvertime.srfilter * rate.srfilter) / 8,
      lmes: (totalOvertime.lmes * rate.lmes) / 8,
      svr: (totalOvertime.svr * rate.svr) / 8,
      helper: (totalOvertime.helper * rate.helper) / 8,
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
      ele: totalAmount.ele + totalOtAmount.ele,
      filter: totalAmount.filter + totalOtAmount.filter,
      srfilter: totalAmount.srfilter + totalOtAmount.srfilter,
      svr: totalAmount.svr + totalOtAmount.svr,
      lmes: totalAmount.lmes + totalOtAmount.lmes,
      helper: totalAmount.helper + totalOtAmount.helper,
      total: totalAmount.total + totalOtAmount.total,
    };
    return netAmount;
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
    const l = rows.length - 1;
    const rates = {
      date: "Rate",
      ele: 31500 / l,
      lco: 20000 / l,
      tman: 19000 / l,
      filter: 21500 / l,
      po: 16000 / l,
      bco: 17000 / l,
      srfilter: 26500 / l,
      incharge: 26500 / l,
      mo: 21400 / l,
      shiftinch: 19500 / l,
      gc: 17000 / l,
      tmesson: 18000 / l,
      svr: 18000 / l,
      sbo: 18000 / l,
      lmes: 18000 / l,
      lman: 18000 / l,
      forman: 18000 / l,
      jrele: 18000 / l,
      helper: 18000 / l,
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

    setTotal(totalAmount.total);

    return rows;
  }

  const handleGetRows = async () => {
    setLoading(true);
    const { rows, total1 } = getLRF(timekeeper, month, year);
    setRows(rows);
    setTotal(total1);
    setLoading(false);
  };

  React.useEffect(() => {
    handleGetRows();
  }, [month, year]);

  const count = {
    date: "",
    ele: result.ELE || 0,
    filter: result.JRFILTER || 0,
    srfilter: result.SRFILTER || 0,
    svr: result.SVR || 0,
    lmes: result.LMES || 0,
    helper: result.HELPER || 0,
    total: 0,
  };

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
      </Box>
      <TableContainer
        sx={{
          // maxHeight: 500,
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
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}{" "}
                  {!(column.id === "date" || column.id === "total") && (
                    <span>{`(${count[column.id]})`}</span>
                  )}
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value).slice(0, 7)
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
              <TableCell rowSpan={7} />
              <TableCell colSpan={3}></TableCell>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell colSpan={3}>SGST 9%</TableCell>
              <TableCell align="center">{total * 1.09}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
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

  const employeeCountsByDesignation = await prisma.employee.groupBy({
    by: ["designation"],
    where: {
      contractorId: id as string,
      department: "LRF",
    },
    _count: {
      id: true,
    },
  });

  console.log(employeeCountsByDesignation);

  // Create a new object that maps the designation to the employee count
  const result: { [key: string]: number | string } = { date: "2", total: 2 };
  employeeCountsByDesignation.forEach((group) => {
    const designation = group.designation;
    const count = group._count.id;
    result[designation] = count;
  });

  const contractor = await prisma.contractor.findUnique({
    where: {
      id: id as string,
    },
  });
  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      contractorname: contractor?.contractorname,
      attendance: "1",
      department: "LRF",
      NOT: {
        manualovertime: null,
      },
    },
  });

  return {
    props: {
      timekeeper,
      result,
    },
  };
};
