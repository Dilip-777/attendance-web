import Head from "next/head";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Edit, Search } from "@mui/icons-material";
import {
  Button,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Employee, TimeKeeper, Workorder, payoutTracker } from "@prisma/client";
import getTotalAmountAndRows from "@/utils/get8hr";
import getCCM from "@/utils/getccm";
import getLRF from "@/utils/getlrf";
import getColony from "@/utils/getColony";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 40,
  marginRight: 30,

  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

interface Data1 {
  contractorid: string;
  contractorName: string;
  employeeid: string;
  employeename: string;
  designation: string;
  department: string;
  gender: string;
  phone: number;
  emailid: string;
  basicsalaryinduration: string;
  basicsalary: string;
  gst: number;
  tds: number;
  allowedWorkinghoursperday: string;
  servicecharge: string;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Data {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

function createData1(
  contractorid: string,
  contractorName: string,
  employeeid: string,
  employeename: string,
  designation: string,
  department: string,
  gender: string,
  phone: number,
  emailid: string,
  basicsalaryinduration: string,
  basicsalary: string,
  gst: number,
  tds: number,
  allowedWorkinghoursperday: string,
  servicecharge: string
): Data1 {
  return {
    contractorid,
    contractorName,
    employeeid,
    employeename,
    designation,
    department,
    gender,
    phone,
    emailid,
    basicsalaryinduration,
    basicsalary,
    gst,
    tds,
    allowedWorkinghoursperday,
    servicecharge,
  };
}

const payouttracker = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
  (i) =>
    createData1(
      "1",
      "Dilip",
      `${10 + i}`,
      `Employee${i}`,
      "designation",
      "department",
      "MALE",
      978898799 + i,
      `email${i}@gmail.com`,
      "30",
      "10000",
      10 + i,
      10 + i,
      "allowedWorkinghoursperday",
      "servicecharge"
    )
);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<Employee>(
  array: readonly Employee[],
  comparator: (a: Employee, b: Employee) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [Employee, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  disablePadding: boolean
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    disablePadding: disablePadding,
  };
};

const headCells1 = [
  createHeadCells("contractorName", "Contractor Name", false, false),
  createHeadCells("workorderid", "Work Order", false, true),
  createHeadCells("amount", "Amount", false, false),
  createHeadCells("gst", "GST", false, false),
  createHeadCells("tds", "TDS", false, false),
  createHeadCells("finalpayableamount", "Final Payble Amount", false, false),
  createHeadCells("uploadreceipt", "Upload Receipt", false, false),
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data1
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data1) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells1.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id as keyof Data1)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  filtername: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, filtername, setFilterName } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filtername}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Search Employee..."
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function Employees({
  payouttracker,
}: {
  payouttracker: payoutTracker[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data1>("contractorid");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState("");
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const router = useRouter();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data1
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleUpload = async (doc: any) => {
    await axios.put("/api/payouttracker", {
      id: doc.id,
      uploadreceipt: doc.data.file.newFilename,
    });
    // console.log(doc, doc.file.newFilename);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = payouttracker
        .filter((employee) =>
          employee.contractorName
            .toLowerCase()
            .includes(filterName.toLowerCase())
        )
        .map((n) => n.contractorName);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    contractorName: string
  ) => {
    const selectedIndex = selected.indexOf(contractorName);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, contractorName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (contractorName: string) =>
    selected.indexOf(contractorName) !== -1;

  // Avoid a layout jump when reaching the last page with empty payouttracker.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage -
            payouttracker.filter((employee) =>
              employee.contractorName
                .toLowerCase()
                .includes(filterName.toLowerCase())
            ).length
        )
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ height: "5rem", display: "flex", p: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              //   label={'"month" and "year"'}
              views={["month", "year"]}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              //   defaultValue={new Date()}
            />
            {/* </DemoContainer> */}
          </LocalizationProvider>
        </Box>
        {/* <EnhancedTableToolbar
          numSelected={selected.length}
          filtername={filterName}
          setFilterName={setFilterName}
        /> */}
        <TableContainer
          sx={{
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              height: 7,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bdbdbd",
              borderRadius: 2,
            },
          }}
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={
                payouttracker.filter((employee) =>
                  employee.contractorName
                    .toLowerCase()
                    .includes(filterName.toLowerCase())
                ).length
              }
            />
            <TableBody>
              {payouttracker
                .filter((employee) =>
                  employee.contractorName
                    .toLowerCase()
                    .includes(filterName.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(
                    row.contractorName as string
                  );
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row.contractorName as string)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.contractorName}
                      </TableCell>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">9</TableCell>
                      <TableCell align="center">9</TableCell>
                      <TableCell align="center">
                        {row.finalpayableamount}
                      </TableCell>
                      <TableCell align="center">
                        {row.uploadreceipt ? (
                          "View Receipt"
                        ) : (
                          <UploadButtons
                            id={row.id}
                            handleUpload={handleUpload}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            payouttracker.filter((employee) =>
              employee.contractorName
                .toLowerCase()
                .includes(filterName.toLowerCase())
            ).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

function UploadButtons({
  handleUpload,
  id,
}: {
  handleUpload: (doc: any) => void;
  id: string;
}) {
  const [value, setValue] = React.useState<any>();
  const [url, setUrl] = React.useState<string>("");
  const router = useRouter();
  const handleChange = async (e: any) => {
    const file1 = e.target.files[0];
    try {
      const formData = new FormData();
      formData.append("myFile", file1);
      setValue(file1);
      const { data } = await axios.post("/api/upload", formData);
      setUrl(`/uploadedFiles/${data.file.newFilename}`);
      handleUpload({ id, data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box onClick={() => value && router.push(url)}>
      {value ? (
        "View Receipt"
      ) : (
        <Button fullWidth component="label">
          Upload
          <input onChange={handleChange} hidden type="file" />
        </Button>
      )}
    </Box>
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

  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      NOT: {
        manualovertime: null,
      },
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

  const payouttracker = await prisma.payoutTracker.findMany();

  return {
    props: {
      payouttracker,
    },
  };
};