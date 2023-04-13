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
  FormLabel,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import getTotalAmountAndRows from "@/utils/get8hr";
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
    <FormControl fullWidth variant="outlined" size="small">
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

export default function PlantCommercial({
  timekeeper,
}: {
  timekeeper: TimeKeeper[];
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [month, setMonth] = React.useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([] as Data[]);
  const [total, setTotal] = React.useState(0);

  const handleGetRows = async () => {
    setLoading(true);
    const { rows, total1 } = await getTotalAmountAndRows(
      timekeeper,
      month,
      year
    );
    setRows(rows);
    setTotal(total1);
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
              <TableCell align="center">{total * 0.9}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
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
  const contractor = await prisma.contractor.findUnique({
    where: {
      id: id as string,
    },
  });
  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      contractorname: contractor?.contractorname,
      attendance: "1",
      department: "8HR",
      NOT: {
        manualovertime: null,
      },
    },
  });
  return {
    props: {
      timekeeper,
    },
  };
};