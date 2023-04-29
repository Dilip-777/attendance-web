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
import { Contractor, TimeKeeper, Workorder } from "@prisma/client";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import getTotalAmountAndRows from "@/utils/get8hr";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
interface Column {
  id:
    | "date"
    | "m8mw"
    | "f8mw"
    | "m20mw"
    | "f20mw"
    | "mdmplant"
    | "mqc"
    | "mstore"
    | "mk7"
    | "fk7"
    | "mrmhs"
    | "fps"
    | "mhk"
    | "msvr"
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
    id: "m8mw",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "f8mw",
    label: "F",
    minWidth: 50,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m20mw",
    label: "M",
    minWidth: 50,
    align: "center",

    format: (value: number) => value.toString(),
  },
  {
    id: "f20mw",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "mdmplant",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "mqc",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "mstore",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "mk7",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "fk7",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "mrmhs",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "fps",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "mhk",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "msvr",
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
  m8mw: number;
  f8mw: number;
  m20mw: number;
  f20mw: number;
  mdmplant: number;
  mqc: number;
  mstore: number;
  mk7: number;
  fk7: number;
  mrmhs: number;
  fps: number;
  mhk: number;
  msvr: number;
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

export default function PlantCommercial({
  contractor,
}: {
  contractor: Contractor;
}) {
  const [value, setValue] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([] as Data[]);
  const [total, setTotal] = React.useState(0);

  const sgst = Math.floor(total * 0.09);

  const fetchTimekeepers = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${contractor.contractorId}&month=${value}&department=8HR`
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
              // label="Select Date"
              value={dayjs(value, "MM/YYYY")}
              onChange={onChange}
            />
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
            Department : <span style={{ fontWeight: "500" }}>8HR</span>
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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.f8mw}
                    >
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
  const workorders = await prisma.workorder.findMany({
    where: {
      contractorId: id as string,
    },
  });
  return {
    props: {
      workorders,
      contractor,
    },
  };
};
