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
interface Column {
  id:
    | "date"
    | "ele"
    | "lco"
    | "tman"
    | "filter"
    | "po"
    | "bco"
    | "srfilter"
    | "incharge"
    | "mo"
    | "shiftinch"
    | "gc"
    | "svr"
    | "sbo"
    | "lman"
    | "forman"
    | "tmesson"
    | "lmes"
    | "jrele"
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
  lco: "LCO",
  tman: "TMAN",
  filter: "FILTER",
  po: "PO",
  bco: "BCO",
  srfilter: "SRFILTER",
  incharge: "INCHARGE",
  mo: "MO",
  shiftinch: "SHIFTINCH",
  gc: "GC",
  svr: "SVR",
  sbo: "SBO",
  lman: "LMAN",
  forman: "FORMAN",
  tmesson: "TMESSON",
  lmes: "LMES",
  jrele: "JRELE",
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
    id: "lco",
    label: "LCO",
    minWidth: 100,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "tman",
    label: "T-Man",
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
    id: "po",
    label: "PO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "bco",
    label: "BCO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "srfilter",
    label: "SR-Filter",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "incharge",
    label: "Incharge",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "mo",
    label: "MO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "shiftinch",
    label: "Shift-Inch",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "gc",
    label: "GC",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "tmesson",
    label: "T-Mess On",
    minWidth: 100,
    align: "center",
    border: true,
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
    id: "sbo",
    label: "SBO",
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
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "lman",
    label: "LMAN",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "forman",
    label: "Forman",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "jrele",
    label: "JR ELE",
    minWidth: 100,
    align: "center",
    border: true,
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
  lco: number;
  tman: number;
  filter: number;
  po: number;
  bco: number;
  srfilter: number;
  incharge: number;
  mo: number;
  shiftinch: number;
  gc: number;
  tmesson: number;
  svr: number;
  sbo: number;
  lmes: number;
  lman: number;
  forman: number;
  jrele: number;
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
    const ele = getCount(filtered, "8MW");
    const lco = getCount(filtered, "8MW");
    const tman = getCount(filtered, "20MW");
    const filter = getCount(filtered, "20WM");
    const po = getCount(filtered, "DM Plant");
    const bco = getCount(filtered, "QC");
    const srfilter = getCount(filtered, "STORE");
    const incharge = getCount(filtered, "K-7 & 1-6PROC");
    const mo = getCount(filtered, "K-7 & 1-6PROC");
    const shiftinch = getCount(filtered, "RHMS");
    const gc = getCount(filtered, "PS");
    const tmesson = getCount(filtered, "HK & Garden");
    const svr = getCount(filtered, "SVR");
    const sbo = getCount(filtered, "SBO");
    const lmes = getCount(filtered, "LMES");
    const lman = getCount(filtered, "LMAN");
    const forman = getCount(filtered, "FORMAN");
    const jrele = getCount(filtered, "JR ELE");
    const helper = getCount(filtered, "HELPER");
    const total =
      ele +
      lco +
      tman +
      filter +
      po +
      bco +
      srfilter +
      incharge +
      mo +
      shiftinch +
      gc +
      tmesson +
      svr +
      sbo +
      lmes +
      lman +
      forman +
      jrele +
      helper;
    return {
      date,
      ele,
      lco,
      tman,
      filter,
      po,
      bco,
      srfilter,
      incharge,
      mo,
      shiftinch,
      gc,
      tmesson,
      svr,
      sbo,
      lmes,
      lman,
      forman,
      jrele,
      helper,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance = {
      date: "Total Attendance",
      ele: 0,
      lco: 0,
      tman: 0,
      filter: 0,
      po: 0,
      bco: 0,
      srfilter: 0,
      incharge: 0,
      mo: 0,
      shiftinch: 0,
      gc: 0,
      tmesson: 0,
      svr: 0,

      sbo: 0,
      lmes: 0,
      lman: 0,
      forman: 0,
      jrele: 0,
      helper: 0,
      total: 0,
    };

    rows.forEach((row) => {
      totalAttendance.ele += row.ele;
      totalAttendance.lco += row.lco;
      totalAttendance.tman += row.tman;
      totalAttendance.filter += row.filter;
      totalAttendance.po += row.po;
      totalAttendance.bco += row.bco;
      totalAttendance.srfilter += row.srfilter;
      totalAttendance.incharge += row.incharge;
      totalAttendance.mo += row.mo;
      totalAttendance.shiftinch += row.shiftinch;
      totalAttendance.gc += row.gc;
      totalAttendance.tmesson += row.tmesson;
      totalAttendance.svr += row.svr;
      totalAttendance.sbo += row.sbo;
      totalAttendance.lmes += row.lmes;
      totalAttendance.lman += row.lman;
      totalAttendance.forman += row.forman;
      totalAttendance.jrele += row.jrele;
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
      lco: 0,
      tman: 0,
      filter: 0,
      po: 0,
      bco: 0,
      srfilter: 0,
      incharge: 0,
      mo: 0,
      shiftinch: 0,
      gc: 0,
      tmesson: 0,
      svr: 0,
      sbo: 0,
      lmes: 0,
      lman: 0,
      forman: 0,
      jrele: 0,
      helper: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.designation === "ELE") {
        totalOvertime.ele += Number(item.manualovertime);
      }
      if (item.designation === "LCO") {
        totalOvertime.lco += Number(item.manualovertime);
      }

      if (item.designation === "TMAN") {
        totalOvertime.tman += Number(item.manualovertime);
      }
      if (item.designation === "PO") {
        totalOvertime.po += Number(item.manualovertime);
      }
      if (item.designation === "BCO") {
        totalOvertime.bco += Number(item.manualovertime);
      }
      if (item.designation === "SRFILTER") {
        totalOvertime.srfilter += Number(item.manualovertime);
      }
      if (item.designation === "INCHARGE") {
        totalOvertime.incharge += Number(item.manualovertime);
      }
      if (item.designation === "MO") {
        totalOvertime.mo += Number(item.manualovertime);
      }
      if (item.designation === "SHIFTINCH") {
        totalOvertime.shiftinch += Number(item.manualovertime);
      }
      if (item.designation === "GC") {
        totalOvertime.gc += Number(item.manualovertime);
      }
      if (item.designation === "TMESSON") {
        totalOvertime.tmesson += Number(item.manualovertime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime);
      }
      if (item.designation === "SBO") {
        totalOvertime.sbo += Number(item.manualovertime);
      }
      if (item.designation === "LMES") {
        totalOvertime.lmes += Number(item.manualovertime);
      }
      if (item.designation === "LMAN") {
        totalOvertime.lman += Number(item.manualovertime);
      }
      if (item.designation === "FORMAN") {
        totalOvertime.forman += Number(item.manualovertime);
      }
      if (item.designation === "JRELE") {
        totalOvertime.jrele += Number(item.manualovertime);
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
      lco: totalAttendance.lco * rate.lco,
      tman: totalAttendance.tman * rate.tman,
      filter: totalAttendance.filter * rate.filter,
      po: totalAttendance.po * rate.po,
      bco: totalAttendance.bco * rate.bco,
      srfilter: totalAttendance.srfilter * rate.srfilter,
      incharge: totalAttendance.incharge * rate.incharge,
      mo: totalAttendance.mo * rate.mo,
      shiftinch: totalAttendance.shiftinch * rate.shiftinch,
      gc: totalAttendance.gc * rate.gc,
      tmesson: totalAttendance.tmesson * rate.tmesson,
      svr: totalAttendance.svr * rate.svr,
      sbo: totalAttendance.sbo * rate.sbo,
      lmes: totalAttendance.lmes * rate.lmes,
      lman: totalAttendance.lman * rate.lman,
      forman: totalAttendance.forman * rate.forman,
      jrele: totalAttendance.jrele * rate.jrele,
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
      lco: (totalOvertime.lco * rate.lco) / 8,
      tman: (totalOvertime.tman * rate.tman) / 8,
      filter: (totalOvertime.filter * rate.filter) / 8,
      po: (totalOvertime.po * rate.po) / 8,
      bco: (totalOvertime.bco * rate.bco) / 8,
      srfilter: (totalOvertime.srfilter * rate.srfilter) / 8,
      incharge: (totalOvertime.incharge * rate.incharge) / 8,
      mo: (totalOvertime.mo * rate.mo) / 8,
      shiftinch: (totalOvertime.shiftinch * rate.shiftinch) / 8,
      gc: (totalOvertime.gc * rate.gc) / 8,
      tmesson: (totalOvertime.tmesson * rate.tmesson) / 8,
      svr: (totalOvertime.svr * rate.svr) / 8,
      sbo: (totalOvertime.sbo * rate.sbo) / 8,
      lmes: (totalOvertime.lmes * rate.lmes) / 8,
      lman: (totalOvertime.lman * rate.lman) / 8,
      forman: (totalOvertime.forman * rate.forman) / 8,
      jrele: (totalOvertime.jrele * rate.jrele) / 8,
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
      lco: totalAmount.lco + totalOtAmount.lco,
      tman: totalAmount.tman + totalOtAmount.tman,
      filter: totalAmount.filter + totalOtAmount.filter,
      po: totalAmount.po + totalOtAmount.po,
      bco: totalAmount.bco + totalOtAmount.bco,
      srfilter: totalAmount.srfilter + totalOtAmount.srfilter,
      incharge: totalAmount.incharge + totalOtAmount.incharge,
      mo: totalAmount.mo + totalOtAmount.mo,
      shiftinch: totalAmount.shiftinch + totalOtAmount.shiftinch,
      gc: totalAmount.gc + totalOtAmount.gc,
      tmesson: totalAmount.tmesson + totalOtAmount.tmesson,
      svr: totalAmount.svr + totalOtAmount.svr,
      sbo: totalAmount.sbo + totalOtAmount.sbo,
      lmes: totalAmount.lmes + totalOtAmount.lmes,
      lman: totalAmount.lman + totalOtAmount.lman,
      forman: totalAmount.forman + totalOtAmount.forman,
      jrele: totalAmount.jrele + totalOtAmount.jrele,
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
    const rows = await getRows(month, year);
    setRows(rows);
    setLoading(false);
  };

  React.useEffect(() => {
    handleGetRows();
  }, [month, year]);

  const count = {
    date: "",
    ele: result["20WM"] || 0,
    lco: result.LCO || 0,
    tman: result.TMAN || 0,
    filter: result.FILTER || 0,
    po: result.PO || 0,
    bco: result.BCO || 0,
    srfilter: result.SRFILTER || 0,
    incharge: result.INCHARGE || 0,
    mo: result.MO || 0,
    shiftinch: result.SHIFTINCH || 0,
    gc: result.GC || 0,
    tmesson: result.TMESSON || 0,
    svr: result.SVR || 0,
    sbo: result.SBO || 0,
    lmes: result.LMES || 0,
    lman: result.LMAN || 0,
    forman: result.FORMAN || 0,
    jrele: result.JRELE || 0,
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.lco}>
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
              <TableCell rowSpan={15} />
              <TableCell colSpan={16}></TableCell>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={16}></TableCell>
              <TableCell colSpan={3}>SGST 9%</TableCell>
              <TableCell align="center">{total * 0.9}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={16}></TableCell>
              <TableCell colSpan={3}>CGST 9%</TableCell>
              <TableCell align="center">{total * 0.9}</TableCell>
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
      department: "CCM",
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

  const employees = await prisma.employee.findMany({
    where: {
      contractorId: id as string,
    },
  });
  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      employeeid: {
        in: employees.map((employee) => employee.id),
      },
      attendance: "1",
      department: "CCM",
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
