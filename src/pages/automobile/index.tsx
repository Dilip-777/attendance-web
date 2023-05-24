import Head from "next/head";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import CircularProgress from "@mui/material/CircularProgress";
import Search from "@mui/icons-material/Search";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  OutlinedInput,
  Stack,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Automobile, Contractor, Workorder } from "@prisma/client";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import FormSelect from "@/ui-component/FormSelect";
import dayjs, { Dayjs } from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import getAutomobile from "@/utils/getAutomobile";
import _ from "lodash";

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

function stableSort<Workorder>(
  array: readonly Workorder[],
  comparator: (a: Workorder, b: Workorder) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [Workorder, number]
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
  included: boolean
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
  };
};

const headCells = [
  createHeadCells("date", "Date", false, false),
  createHeadCells("openingMeterReading", "Opening Meter Reading", false, false),
  createHeadCells("closingMeterReading", "Close Meter Reading", false, true),
  createHeadCells("totalRunning", "Total Running", false, false),
  createHeadCells(
    "hsdIssuedOrConsumed",
    "HSD Issued Or Consumed",
    false,
    false
  ),
  createHeadCells("maintenancetime", "Maintenance Time", false, false),
  createHeadCells("breakdownTime", "Break Down Time", false, false),
  createHeadCells(
    "breakDownDaysCounted",
    "Breakdown Days Counted",
    false,
    false
  ),
  createHeadCells(
    "reasonBehindBreakDown",
    "Reason Behind Breakdown",
    true,
    false
  ),
  createHeadCells("remarks", "Remarks", false, false),
  createHeadCells("status", "Status", false, false),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  filtername: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
  contractors: Contractor[];
  workorders: Workorder[];
  contractor: string | undefined;
  setContractor: React.Dispatch<React.SetStateAction<string | undefined>>;
  workorder: string | undefined;
  setWorkorder: React.Dispatch<React.SetStateAction<string | undefined>>;
  month: string;
  monthChange: (value: Dayjs | null) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    contractor,
    setContractor,
    contractors,
    workorder,
    setWorkorder,
    workorders,
    month,
    monthChange,
  } = props;

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
        // <StyledSearch
        //   value={filtername}
        //   onChange={(e) => setFilterName(e.target.value)}
        //   placeholder="Search Workorder..."
        //   startAdornment={
        //     <InputAdornment position="start">
        //       <Search />
        //     </InputAdornment>
        //   }
        // />
        <Stack direction="row" alignItems="center" spacing={2}>
          <FormSelect
            label="Contractor"
            value={contractor as string}
            // onChange={(e) => setContractor(e.target.value as string)}
            handleChange={(e) => setContractor(e as string)}
            options={contractors.map((contractor) => ({
              label: contractor.contractorname,
              value: contractor.contractorId,
            }))}
          />
          <MonthSelect
            label="Select Date"
            value={dayjs(month, "MM/YYYY")}
            onChange={monthChange}
          />
        </Stack>
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

export default function Vehiclelogbook({
  workorders,
  contractors,
}: {
  workorders: Workorder[];
  contractors: Contractor[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState("");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedWorkorder, setSelectedWorkorder] = React.useState<
    string | undefined
  >(undefined);
  const [month, setMonth] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [automobiles, setAutomobiles] = React.useState<Automobile[]>([]);
  const [rows, setRows] = React.useState<any[]>([]);

  const handleClose = () => {
    setOpen(false);
    setSelectedWorkorder(undefined);
  };
  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0].contractorId : undefined
  );
  const [workorder, setWorkOrder] = React.useState<string | undefined>(
    rows.length > 0 ? workorders[0].id : undefined
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = workorders.map((n) => n.contractorName);
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

  const isSelected = (contractorName: string) =>
    selected.indexOf(contractorName) !== -1;

  const deleteWorkorder = async (id: string) => {
    setLoading(true);
    const res = await axios
      .delete("/api/workorder", { data: { id: id } })
      .then((res) => {
        router.replace(router.asPath);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const fetchAutomobiles = async () => {
    const res = await axios.get(
      `/api/vehiclelogbook?month=${month}&contractor=${contractor}`
    );
    setAutomobiles(res.data);
    const r = getAutomobile(
      res.data,
      dayjs(month, "MM/YYYY").month() + 1,
      dayjs(month, "MM/YYYY").year()
    );
    setRows(r);
  };

  console.log(rows);

  React.useEffect(() => {
    fetchAutomobiles();
  }, [contractor, month]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filtername={filterName}
          setFilterName={setFilterName}
          contractors={contractors}
          workorders={workorders}
          contractor={contractor}
          setContractor={setContractor}
          workorder={workorder}
          setWorkorder={setWorkOrder}
          month={month}
          monthChange={(value: Dayjs | null) =>
            setMonth(value?.format("MM/YYYY") || "")
          }
        />
        <TableContainer
          sx={{
            maxHeight: 440,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              height: 10,
              width: 9,
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
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
              headCells={headCells}
              nocheckbox={true}
              align="center"
            />
            <TableBody>
              {rows
                // .filter((employee) =>
                //   employee.contractorName
                //     .toLowerCase()
                //     .includes(filterName.toLowerCase())
                // )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id as string);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      {headCells.map((cell, index) => (
                        <TableCell
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                          sx={{ minWidth: 150 }}
                        >
                          {_.get(row, cell.id, "-")}
                        </TableCell>
                      ))}

                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() => router.push(`/workorders/${row.id}`)}
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 1, fontSize: "1rem" }}>
          Confirm the action
        </DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>
            Are you sure, you want to delete selected stream
          </Typography>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button color="primary" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={() => deleteWorkorder(selectedWorkorder as string)}
            variant="contained"
            disabled={loading}
          >
            Confirm
            {loading && (
              <CircularProgress size={15} sx={{ ml: 1, color: "#364152" }} />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const workorders = await prisma.workorder.findMany();
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const contractors = await prisma.contractor.findMany();
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
  return {
    props: {
      workorders,
      contractors,
    },
  };
};
