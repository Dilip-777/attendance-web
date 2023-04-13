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
import { Edit, NavigateBefore, Search } from "@mui/icons-material";
import {
  Backdrop,
  CircularProgress,
  Divider,
  InputAdornment,
  Modal,
  OutlinedInput,
  Slide,
  Stack,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  Comment,
  Contractor,
  Employee,
  TimeKeeper,
  Upload,
} from "@prisma/client";
import axios from "axios";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { FormSelect } from "./pc8hr/[id]";

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 40,
  marginRight: 30,

  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

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
  createHeadCells("employeeid", "Employee ID", false, false),
  createHeadCells("employeename", "Employee Name", false, false),
  createHeadCells("machineintime", "Machine In Time", false, false),
  createHeadCells("machineouttime", "Machine Out Time", false, false),
  createHeadCells("machineshift", "Machine Shift", false, false),
  createHeadCells("attendance", "Attendance", true, false),
  createHeadCells("attendancedance", "Attendance Date", true, false),
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
  createHeadCells("designation", "Designation", false, false),
  createHeadCells("gender", "Gender", false, false),
  createHeadCells("comment", "Comment", false, false),
  createHeadCells("uploaddocument", "Upload Document", false, false),
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TimeKeeper
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
    (property: keyof TimeKeeper) => (event: React.MouseEvent<unknown>) => {
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
              onClick={createSortHandler(headCell.id as keyof TimeKeeper)}
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
  contractorName: string;
  setContractorName: React.Dispatch<React.SetStateAction<string>>;
  contractors: { value: string; label: string }[];
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, contractorName, setContractorName, contractors } = props;

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
        <Box sx={{ minWidth: 190 }}>
          <FormSelect
            options={[
              { value: "all", label: "All Contractors" },
              ...contractors,
            ]}
            value={contractorName}
            setValue={setContractorName}
          />
        </Box>
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

export default function TimeKeeperTable({
  contractors,
  employees,
}: {
  contractors: Contractor[];
  employees: Employee[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TimeKeeper>("employeeid");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [timekeeper, setTimeKepeer] = React.useState<TimeKeeper[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [selected1, setSelected1] = React.useState<Comment[] | Upload[]>();
  const matches = useMediaQuery("(min-width:600px)");
  const [contractorName, setContractorName] = React.useState("all");

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setSelected1(undefined);
  };

  const handleOpen1 = async (id: string) => {
    setLoading(true);
    const comment = await axios.get(`/api/comment/${id}`);
    setSelected1(comment.data);
    setLoading(false);
    setOpen1(true);
  };

  const handleOpen = async (id: string) => {
    setLoading(true);
    const upload = await axios.get(`/api/document/${id}`);
    setSelected1(upload.data);
    setLoading(false);
    setOpen(true);
  };

  const fetchTimeKeeper = async () => {
    setLoading(true);
    const employeesid = employees
      .filter(
        (e) => contractorName === "all" || e.contractorId === contractorName
      )
      .map((e) => e.id);

    await axios
      .get("/api/timekeeper/gettimekeepers")
      .then((res) => {
        const timekeepers = res.data;
        setTimeKepeer(timekeepers);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchTimeKeeper();
  }, [contractorName]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TimeKeeper
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = timekeeper
        .filter(
          (t) => t.contractorname === contractorName || contractorName === "all"
        )
        .map((n) => n.employeeid);
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
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage -
            timekeeper.filter(
              (t) =>
                t.contractorname === contractorName || contractorName === "all"
            ).length
        )
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="90vh"
        >
          <CircularProgress sx={{ color: "#673ab7" }} />
        </Box>
      ) : (
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            contractorName={contractorName}
            setContractorName={setContractorName}
            contractors={contractors.map((c) => ({
              value: c.contractorname,
              label: c.contractorname,
            }))}
          />

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
                  timekeeper.filter(
                    (t) =>
                      t.contractorname === contractorName ||
                      contractorName === "all"
                  ).length
                }
              />

              <TableBody>
                {stableSort(
                  timekeeper.filter(
                    (t) =>
                      t.contractorname === contractorName ||
                      contractorName === "all"
                  ) as any,
                  getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.employeeid as string);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.employeeid}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            onClick={(event) =>
                              handleClick(event, row.employeeid as string)
                            }
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>

                        <TableCell align="center">{row.employeeid}</TableCell>
                        <TableCell align="center">{row.employeename}</TableCell>
                        <TableCell align="center">
                          {row.machineInTime}
                        </TableCell>
                        <TableCell align="center">
                          {row.machineOutTime}
                        </TableCell>
                        <TableCell align="center">
                          {row.machineshift || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.attendance || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.attendancedate || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.overtime || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.eleave || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.manualintime || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.manualouttime || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.manualshift || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.manualovertime || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.mleave || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.department || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.designation || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.gender || "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => handleOpen1(row.id as string)}
                        >
                          View
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => handleOpen(row.id as string)}
                        >
                          View
                        </TableCell>
                        <TableCell size="small" align="center">
                          <IconButton
                            onClick={() => router.push(`/details/${row.id}`)}
                            sx={{ m: 0 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {stableSort(
                  timekeeper.filter(
                    (t) =>
                      t.contractorname === contractorName ||
                      contractorName === "all"
                  ) as any,
                  getComparator(order, orderBy)
                ).length === 0 && (
                  <TableRow
                    style={{
                      height: 50,
                    }}
                  >
                    <TableCell colSpan={6}>No Data Found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={
              timekeeper.filter(
                (t) =>
                  t.contractorname === contractorName ||
                  contractorName === "all"
              ).length
            }
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open || open1}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{ display: "flex", justifyContent: " flex-end" }}
      >
        <Slide
          direction={matches ? "left" : "up"}
          timeout={500}
          in={open || open1}
          mountOnEnter
          unmountOnExit
        >
          <Box
            p={{ xs: 0, sm: 2 }}
            width={{ xs: "100%", sm: 400, md: 500 }}
            height={{ xs: "70%", sm: "100%" }}
            top={{ xs: "30%", sm: "0" }}
            sx={style}
          >
            <Stack sx={{ overflowY: "auto" }} p={3}>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    // zIndex: 2,
                    padding: "5px",

                    marginRight: "1rem",
                    background: "white",
                    ":hover": { background: "white" },
                  }}
                >
                  <NavigateBefore fontSize="large" />
                </IconButton>
                {open ? "Documents" : "Comments"}
              </Typography>
              <Divider />
              {selected1 && selected1?.length > 0 ? (
                open ? (
                  <Documents documents={selected1 as Upload[]} />
                ) : (
                  <Comments comments={selected1 as Comment[]} />
                )
              ) : (
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                  {open ? "No Documents" : "No Comments"}
                </Typography>
              )}
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </Box>
  );
}

const Documents = ({ documents }: { documents: Upload[] }) => {
  const router = useRouter();
  return (
    <Stack spacing={2} alignItems="flex-start" mt={2}>
      {documents.map((document) => (
        <Stack
          key={document.id}
          width="100%"
          sx={{ border: "2px solid #E3E8EF", borderRadius: "10px" }}
          alignItems="flex-start"
          spacing={1}
          p={2}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
            >
              {document.userName}
            </Typography>
            <Typography variant="subtitle2">{document.role}</Typography>
          </Stack>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(`/uploadedFiles/${document.document}`)}
          >
            Click to View to the Document
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const Comments = ({ comments }: { comments: Comment[] }) => {
  return (
    <Stack spacing={2} alignItems="flex-start" mt={2}>
      {comments.map((comment) => (
        <Stack
          key={comment.id}
          width="100%"
          sx={{ border: "2px solid #E3E8EF", borderRadius: "10px" }}
          alignItems="flex-start"
          spacing={1}
          p={2}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
            >
              {comment.userName}
            </Typography>
            <Typography variant="subtitle2">{comment.role}</Typography>
          </Stack>
          <Divider />
          <Typography>{comment.comment}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

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

  if (user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const contractors = await prisma.contractor.findMany();
  const employees = await prisma.employee.findMany();
  return {
    props: {
      contractors,
      employees,
    },
  };
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
