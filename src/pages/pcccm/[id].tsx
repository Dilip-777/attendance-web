import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, TimeKeeper } from "@prisma/client";
import { Box, FormControl, Grid, MenuItem, Select } from "@mui/material";
import getCCM from "@/utils/getccm";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import MonthSelect from "@/ui-component/MonthSelect";
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
  result,
  contractor,
}: {
  result: any;
  contractor: Contractor;
}) {
  const [value, setValue] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [month, setMonth] = React.useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([] as Data[]);
  const [total, setTotal] = React.useState(0);

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${contractor.contractorId}&month=${value}&department=CCM`
    );
    const { rows, total1 } = getCCM(
      res.data,
      dayjs(value, "MM/YYYY").month() + 1,
      dayjs(value, "MM/YYYY").year()
    );
    setRows(rows);
    setTotal(total1);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimekeepers();
  }, [value]);

  const count = {
    date: "",
    ele: result.ELE || 0,
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <MonthSelect
              label="Select Date"
              value={dayjs(value, "MM/YYYY")}
              onChange={onChange}
            />
          </Grid>
        </Grid>
        <Typography variant="h4" sx={{ width: "15rem" }}>
          Contractor : {contractor.contractorname}
        </Typography>
      </Box>
      <TableContainer
        sx={{
          // maxHeight: 500,
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
              <TableCell align="center">{Math.floor(total * 1.09)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={16}></TableCell>
              <TableCell colSpan={3}>CGST 9%</TableCell>
              <TableCell align="center">{Math.floor(total * 1.09)}</TableCell>
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

  const employeeCountsByDesignation = await prisma.employee.groupBy({
    by: ["designation"],
    where: {
      contractorId: contractor?.contractorId as number,
      department: "CCM",
    },
    _count: {
      id: true,
    },
  });

  const result: { [key: string]: number | string } = { date: "2", total: 2 };
  employeeCountsByDesignation.forEach((group) => {
    const designation = group.designation;
    const count = group._count.id;
    result[designation] = count;
  });

  return {
    props: {
      result,
      contractor,
    },
  };
};
