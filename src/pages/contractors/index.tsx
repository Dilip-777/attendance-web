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
import { InputAdornment, OutlinedInput, styled } from "@mui/material";
import { useRouter } from "next/router";

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
  contractorname: string;
  employeeid: string;
  machineintime: string;
  machineouttime: string;
  machineshift: string;
  attendance: number;
  manchineovertime: number;
  machineleave: number;
  manualintime: string;
  manualouttime: string;
  manualshift: string;
  manualovertime: number;
  manualleave: number;
  deployeeofdepartment: string;
  gender: string;
  comment: string;
  uploaddocument: string;
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
  contractorname: string,
  employeeid: string,
  machineintime: string,
  machineouttime: string,
  machineshift: string,
  attendance: number,
  manchineovertime: number,
  machineleave: number,
  manualintime: string,
  manualouttime: string,
  manualshift: string,
  manualovertime: number,
  manualleave: number,
  deployeeofdepartment: string,
  gender: string,
  comment: string,
  uploaddocument: string
): Data1 {
  return {
    contractorid,
    contractorname,
    employeeid,
    machineintime,
    machineouttime,
    machineshift,
    attendance,
    manchineovertime,
    machineleave,
    manualintime,
    manualouttime,
    manualshift,
    manualovertime,
    manualleave,
    deployeeofdepartment,
    gender,
    comment,
    uploaddocument,
  };
}

const rows1 = [
  createData1(
    "1",
    "Name1",
    "1",
    "1",
    "1",
    "1",
    1,
    1,
    1,
    "1",
    "1",
    "1",
    1,
    1,
    "1",
    "1",
    "1",
    "1"
  ),
  createData1(
    "2",
    "Name2",
    "2",
    "2",
    "2",
    "2",
    2,
    2,
    2,
    "2",
    "2",
    "2",
    2,
    2,
    "2",
    "2",
    "2",
    "2"
  ),
  createData1(
    "3",
    "Name3",
    "3",
    "3",
    "3",
    "3",
    3,
    3,
    3,
    "3",
    "3",
    "3",
    3,
    3,
    "3",
    "3",
    "3",
    "3"
  ),
  createData1(
    "4",
    "Name4",
    "4",
    "4",
    "4",
    "4",
    4,
    4,
    4,
    "4",
    "4",
    "4",
    4,
    4,
    "4",
    "4",
    "4",
    "4"
  ),
  createData1(
    "5",
    "Name5",
    "5",
    "5",
    "5",
    "5",
    5,
    5,
    5,
    "5",
    "5",
    "5",
    5,
    5,
    "5",
    "5",
    "5",
    "5"
  ),
  createData1(
    "6",
    "Name6",
    "6",
    "6",
    "6",
    "6",
    6,
    6,
    6,
    "6",
    "6",
    "6",
    6,
    6,
    "6",
    "6",
    "6",
    "6"
  ),
  createData1(
    "7",
    "Name7",
    "7",
    "7",
    "7",
    "7",
    7,
    7,
    7,
    "7",
    "7",
    "7",
    7,
    7,
    "7",
    "7",
    "7",
    "7"
  ),
  createData1(
    "8",
    "Name8",
    "8",
    "8",
    "8",
    "8",
    8,
    8,
    8,
    "8",
    "8",
    "8",
    8,
    8,
    "8",
    "8",
    "8",
    "8"
  ),
  createData1(
    "9",
    "Name9",
    "9",
    "9",
    "9",
    "9",
    9,
    9,
    9,
    "9",
    "9",
    "9",
    9,
    9,
    "9",
    "9",
    "9",
    "9"
  ),
  createData1(
    "10",
    "Name10",
    "10",
    "10",
    "10",
    "10",
    10,
    10,
    10,
    "10",
    "10",
    "10",
    10,
    10,
    "10",
    "10",
    "10",
    "10"
  ),
  createData1(
    "11",
    "Name11",
    "11",
    "11",
    "11",
    "11",
    11,
    11,
    11,
    "11",
    "11",
    "11",
    11,
    11,
    "11",
    "11",
    "11",
    "11"
  ),
  createData1(
    "12",
    "Name12",
    "12",
    "12",
    "12",
    "12",
    12,
    12,
    12,
    "12",
    "12",
    "12",
    12,
    12,
    "12",
    "12",
    "12",
    "12"
  ),
  createData1(
    "13",
    "Name13",
    "13",
    "13",
    "13",
    "13",
    13,
    13,
    13,
    "13",
    "13",
    "13",
    13,
    13,
    "13",
    "13",
    "13",
    "13"
  ),
];

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

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

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
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
  createHeadCells("contractorid", "Contractor ID", true, true),
  createHeadCells("contractorname", "Contractor Name", false, false),
  createHeadCells("employeeid", "Employee ID", true, false),
  createHeadCells("machineintime", "Machine In Time", false, false),
  createHeadCells("machineouttime", "Machine Out Time", false, false),
  createHeadCells("machineshift", "Machine Shift", false, false),
  createHeadCells("attendance", "Attendance", true, false),
  createHeadCells("machineovertime", "Machine Over Time", true, false),
  createHeadCells("machineleave", "Machine Leave", true, false),
  createHeadCells("manualintime", "Manual In Time", false, false),
  createHeadCells("manualouttime", "Manual Out Time", false, false),
  createHeadCells("manualshift", "Manual Shift", false, false),
  createHeadCells("manualovertime", "Manual Over Time", true, false),
  createHeadCells("manualleave", "Manual Leave", true, false),
  createHeadCells(
    "deployeeofdepartment",
    "Deployee Of Department",
    false,
    false
  ),
  createHeadCells("gender", "Gender", false, false),
  createHeadCells("comment", "Comment", false, false),
  createHeadCells("uploaddocument", "Upload Document", false, false),
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
            align={headCell.numeric ? "right" : "left"}
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
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

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
          // value={filterName}
          // onChange={onFilterName}
          placeholder="Search Contractor..."
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

export default function TimeKeeper() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data1>("contractorid");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data1
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows1.map((n) => n.contractorname);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    contractorname: string
  ) => {
    const selectedIndex = selected.indexOf(contractorname);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, contractorname);
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

  const isSelected = (contractorname: string) =>
    selected.indexOf(contractorname) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows1, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.contractorname);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row.contractorname)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.contractorname}
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
                      <TableCell id={labelId} scope="row" padding="none">
                        {row.contractorname}
                      </TableCell>
                      <TableCell>{row.contractorid}</TableCell>
                      <TableCell align="center">{row.employeeid}</TableCell>
                      <TableCell align="center">{row.machineintime}</TableCell>
                      <TableCell align="center">{row.machineouttime}</TableCell>
                      <TableCell align="center">{row.machineshift}</TableCell>
                      <TableCell align="center">{row.attendance}</TableCell>
                      <TableCell align="center">
                        {row.manchineovertime}
                      </TableCell>
                      <TableCell align="center">{row.machineleave}</TableCell>
                      <TableCell align="center">{row.manualintime}</TableCell>
                      <TableCell align="center">{row.manualouttime}</TableCell>
                      <TableCell align="center">{row.manualshift}</TableCell>
                      <TableCell align="center">{row.manualovertime}</TableCell>
                      <TableCell align="center">{row.manualleave}</TableCell>
                      <TableCell align="center">
                        {row.deployeeofdepartment}
                      </TableCell>
                      <TableCell align="center">{row.gender}</TableCell>
                      <TableCell align="center">{row.comment}</TableCell>
                      <TableCell align="center">{row.uploaddocument}</TableCell>
                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() =>
                            router.push(`/details/${row.employeeid}`)
                          }
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
