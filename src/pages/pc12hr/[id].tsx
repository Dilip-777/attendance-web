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
import { Contractor, TimeKeeper } from "@prisma/client";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import getTotalAmountAndRows from "@/utils/get8hr";
import dayjs, { Dayjs } from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import axios from "axios";
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
  contractor,
}: {
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

  const sgst = Math.floor(total * 0.09);

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${contractor.contractorId}&month=${value}&department=12HR`
    );
    const { rows, total1 } = getTotalAmountAndRows(
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

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format("MM/YYYY") || "");

  return (
    <Paper sx={{ width: "100%" }}>
      <Box sx={{ height: "5rem", display: "flex", p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <MonthSelect value={dayjs(value, "MM/YYYY")} onChange={onChange} />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4" sx={{ width: "20rem" }}>
            Contractor Name :{" "}
            <span style={{ fontWeight: "500" }}>
              {contractor.contractorname}
            </span>
          </Typography>
          <Typography variant="h4" sx={{ width: "20rem" }}>
            Department : <span style={{ fontWeight: "500" }}>12HR</span>
          </Typography>
        </Stack>
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
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#e0e0e0" }}>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                Date
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={2}
              >
                8 MW
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={2}
              >
                12 MW
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                DM Plant
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                QC
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                Store
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={2}
              >
                K-7 & 1-6PROC
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                RMHS
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                PS
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                HK & Garden
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                SVR
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                colSpan={1}
              >
                TOTAL
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    fontWeight: "600",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              rows
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
              <TableCell colSpan={3} sx={{ fontWeight: "600" }}>
                Total
              </TableCell>
              <TableCell align="center">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: "600" }}>
                SGST 9%
              </TableCell>
              <TableCell align="center">{sgst}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: "600" }}>
                CGST 9%
              </TableCell>
              <TableCell align="center">{sgst}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: "600" }}>
                Service Charge
              </TableCell>
              <TableCell align="center">
                {contractor.servicecharge || 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}></TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: "600" }}>
                Total Net Amount
              </TableCell>
              <TableCell align="center">
                {total + sgst + sgst + (contractor.servicecharge || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
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
  return {
    props: {
      contractor: contractor,
    },
  };
};
