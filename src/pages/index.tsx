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
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
// import { Button } from "@mui/material/";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Close from "@mui/icons-material/Close";
import Done from "@mui/icons-material/Done";
import Search from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useRouter } from "next/router";
import { Comment, Contractor, TimeKeeper, Upload } from "@prisma/client";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
import {
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  styled,
} from "@mui/material";
import _, { set } from "lodash";
const ImportData = dynamic(() => import("@/components/import"));
const CustomModal = dynamic(
  () => import("@/components/Timekeeper/ViewCommentsDocuments")
);
const FormSelect = dynamic(() => import("@/ui-component/FormSelect"));
// import ImportData from "@/components/import";
// import FormSelect from "@/ui-component/FormSelect";
// import CustomModal from "@/components/Timekeeper/ViewCommentsDocuments";

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  // height: 40,
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
  createHeadCells("employeeid", "Employee ID", false, false),
  createHeadCells("employeename", "Employee Name", false, false),
  createHeadCells("machineintime", "Machine In Time", false, false),
  createHeadCells("machineouttime", "Machine Out Time", false, false),
  createHeadCells("machineduration", "Machine Total Duration", false, false),
  createHeadCells("machineshift", "Machine Shift", false, false),
  createHeadCells("attendance", "Attendance", true, false),
  createHeadCells("attendancedance", "Attendance Date", true, false),
  createHeadCells("machineovertime", "Machine Over Time", true, false),
  createHeadCells("machineleave", "Machine Leave", true, false),
  createHeadCells("manualintime", "Manual In Time", false, false),
  createHeadCells("manualouttime", "Manual Out Time", false, false),
  createHeadCells("manualduration", "Manual Total Duration", false, false),
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
  // createHeadCells("status", "Status", false, false),
  createHeadCells("comment", "Comment", false, false),
  createHeadCells("uploaddocument", "Upload Document", false, false),
];

interface EnhancedTableToolbarProps {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  contractorName: string;
  value: Dayjs;
  setValue: React.Dispatch<React.SetStateAction<Dayjs>>;
  setContractorName: React.Dispatch<React.SetStateAction<string>>;
  contractors: { value: string; label: string }[];
  handleApprove: () => void;
  showApprove: boolean;
  contractorlist: Contractor[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  handledownload: () => void;
  fetchTimeKeeper: () => void;
  attendanceDate: Dayjs | null;
  setAttendancedate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    selected,
    setSelected,
    contractorName,
    setContractorName,
    contractors,
    value,
    setValue,
    handleApprove,
    contractorlist,
    setFilter,
    filter,
    handledownload,
    fetchTimeKeeper,
    attendanceDate,
    setAttendancedate,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const router = useRouter();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteTimeKeeper = async (ids: string[]) => {
    await axios
      .delete(`/api/timekeeper`, {
        data: {
          ids: ids,
        },
      })
      .then((res) => {
        fetchTimeKeeper();
        setSelected([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { data: session } = useSession();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
        ...(selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Stack spacing={2} direction="row" alignItems="center">
          <StyledSearch
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search ..."
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
          <Box sx={{ minWidth: 240 }}>
            <FormSelect
              options={[
                { value: "all", label: "All Contractors" },
                ...contractors,
              ]}
              value={contractorName}
              handleChange={(e) => setContractorName(e as string)}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["day", "month", "year"]}
              format="DD/MM/YYYY"
              value={attendanceDate}
              onChange={(newValue) => setAttendancedate(newValue as Dayjs)}
              // value={value}
              // onChange={(newValue) => {
              //   if (newValue) setValue(newValue);
              // }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["month", "year"]}
              value={value}
              onChange={(newValue) => {
                if (newValue) setValue(newValue);
              }}
            />
          </LocalizationProvider>
        </Stack>
      )}
      {selected.length > 0 ? (
        <Stack direction="row" spacing={2}>
          {selected.length === 1 && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => router.push(`/details/${selected[0]}`)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                deleteTimeKeeper(selected);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          {/* <ImportData contractors={contractorlist} /> */}
          <div>
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            {/* <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Dashboard
            </Button> */}
            {value.month() < dayjs().month() &&
              session?.user?.role === "TimeKeeper" && (
                <Button sx={{ mr: 3 }} onClick={handleApprove}>
                  Approve
                </Button>
              )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem sx={{ cursor: "pointer" }}>
                <ImportData contractors={contractorlist} />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handledownload();
                }}
              >
                Download
              </MenuItem>
              {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
            </Menu>
          </div>
        </Stack>
      )}
    </Toolbar>
  );
}

export default function TimeKeeperTable({}: // contractors,
{
  // contractors: Contractor[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("employeeid");
  const [filter, setFilter] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [timekeeper, setTimeKepeer] = React.useState<TimeKeeper[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [selected1, setSelected1] = React.useState<Comment[] | Upload[]>();
  const [contractors, setContractors] = React.useState<Contractor[]>([]);
  const matches = useMediaQuery("(min-width:600px)");
  const [contractorName, setContractorName] = React.useState("all");
  const [value, setValue] = React.useState<Dayjs>(dayjs());
  const [attendancedate, setAttendancedate] = React.useState<Dayjs | null>(
    null
  );
  const [debouncedFilter, setDebouncedFilter] = React.useState("");

  const [count, setCount] = React.useState(0);
  const { data: session } = useSession();

  const headcell1 = createHeadCells("status", "Status", false, true);
  const headcell2 = createHeadCells("action", "Action", false, true);

  const extraHeadCells =
    session?.user?.role === "HR"
      ? [...headCells, headcell1, headcell2]
      : [...headCells];
  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setSelected1(undefined);
  };

  const handleOpen1 = async (id: string) => {
    // setLoading(true);
    const comment = await axios.get(`/api/comment/${id}`);
    setOpen1(true);
    setSelected1(comment.data);
    // setLoading(false);
  };

  const handleOpen = async (id: string) => {
    // setLoading(true);
    const upload = await axios.get(`/api/document/${id}`);
    setSelected1(upload.data);
    // setLoading(false);
    setOpen(true);
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    await axios
      .put(`/api/timekeeper/${id}`, {
        status: "Approved",
      })
      .then((res) => {
        fetchTimeKeeper();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    await axios
      .put(`/api/timekeeper/${id}`, {
        status: "Rejected",
      })
      .then((res) => {
        fetchTimeKeeper();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // await axios
    //   .delete(`/api/timekeeper/${id}`)
    //   .then((res) => {
    //     fetchTimeKeeper();
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //   });
  };

  const fetchContrators = async () => {
    await axios
      .get("/api/hr/contractors")
      .then((res) => {
        const contractors = res.data;
        setContractors(contractors);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 500); // Adjust the delay time as needed (e.g., 500 milliseconds)

    return () => clearTimeout(debounceTimeout);
  }, [filter]);

  const fetchTimeKeeper = async () => {
    if (!debouncedFilter) setLoading(true);
    else setLoading(false);
    await axios
      .get(
        `/api/timekeeper/gettimekeepers?month=${value?.format(
          "MM/YYYY"
        )}&role=${session?.user
          ?.role}&page=${page}&rowsPerPage=${rowsPerPage}&contractorname=${contractorName}&attendancedate=${
          attendancedate ? attendancedate.format("DD/MM/YYYY") : ""
        }&orderBy=${orderBy}&filter=${debouncedFilter}`
      )
      .then((res) => {
        setTimeKepeer(res.data.data);
        setCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTimeKeeper();
  }, [
    value,
    session,
    rowsPerPage,
    page,
    contractorName,
    attendancedate,
    orderBy,
    debouncedFilter,
  ]);

  React.useEffect(() => {
    fetchContrators();
  }, []);

  const handleClick = (event: React.MouseEvent<unknown>, row: string) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const showApprove = () => {
    const timekeeper1 = timekeeper.filter(
      (t) => t.contractorname === contractorName || contractorName === "all"
    );
    if (session?.user?.role === "TimeKeeper") {
      if (timekeeper1.find((t) => !t.approvedByTimekeeper)) {
        return timekeeper1.find((t) => t.status === "Pending") ? false : true;
      } else return false;
    } else return false;
  };

  const handleClickReport = () => {
    const tableRows = [
      [
        "Contractor ID",
        "Contractor Name",
        "Employee ID",
        "Employee Name",
        "Machine In Time",
        "Machine Out Time",
        "Machine Total Duration",
        "Machine Shift",
        "Attendance",
        "Attendance Date",
        "Machine Over Time",
        "Machine Leave",
        "Manual In Time",
        "Manual Out Time",
        "Manual Total Duration",
        "Manual Shift",
        "Manual Over Time",
        "Manual Leave",
        "Deployee Of Department",
        "Designation",
        "Gender",
        "Status",
      ],
    ];
    timekeeper.forEach((item) => {
      tableRows.push([
        item.contractorid || "-",
        item.contractorname || "-",
        item.employeeid.toString(),
        item.employeename || "-",
        item.machineInTime,
        item.machineOutTime || "-",
        item.machineduration || "-",
        item.machineshift || "-",
        item?.attendance,
        item.attendancedate || "-",
        item.overtime?.toString() || "-",
        item.mleave || "-",
        item.manualintime?.toString() || "-",
        item.manualouttime?.toString() || "-",
        item.manualduration || "-",
        item.manualshift || "-",
        item.manualovertime || "-",
        item.mleave || "-",
        item.department?.toString() || "-",
        item.designation?.toString() || "-",
        item?.gender || "-",
        item.status || "-",
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "TimeKeeper.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            contractorlist={contractors}
            selected={selected}
            setSelected={setSelected}
            contractorName={contractorName}
            setContractorName={setContractorName}
            contractors={
              contractors?.map((c) => ({
                value: c.contractorname,
                label: c.contractorname,
              })) || []
            }
            value={value}
            setValue={setValue}
            showApprove={showApprove()}
            handleApprove={async () => {
              await axios.put(`/api/timekeeper/approve`, {
                month: value.format("MM/YYYY"),
                contractorname: contractorName,
              });
              fetchTimeKeeper();
            }}
            filter={filter}
            setFilter={setFilter}
            handledownload={handleClickReport}
            fetchTimeKeeper={fetchTimeKeeper}
            attendanceDate={attendancedate}
            setAttendancedate={setAttendancedate}
          />

          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 16rem)",
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                height: 10,
                width: 10,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: 2,
              },
            }}
          >
            <Table
              stickyHeader
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={0}
                // onSelectAllClick={handleSelectAllClick}
                rowCount={
                  timekeeper.filter(
                    (t) =>
                      t.contractorname === contractorName ||
                      contractorName === "all"
                  ).length
                }
                headCells={extraHeadCells}
                orderby={orderBy}
                setOrderby={setOrderBy}
              />

              <TableBody>
                {stableSort(timekeeper as any, getComparator(order, orderBy))
                  .filter((t) => t.status !== "Pending")
                  .map((row, index) => {
                    const isItemSelected = !!isSelected(row.id as string);

                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer", position: "relative" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            onClick={(event) =>
                              handleClick(event, row.id as string)
                            }
                            checked={!!isSelected(row.id as string)}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>

                        <TableCell>{row.employeeid}</TableCell>
                        <TableCell>{row.employeename}</TableCell>
                        <TableCell>{row.machineInTime}</TableCell>
                        <TableCell>{row.machineOutTime}</TableCell>
                        <TableCell>{row.machineduration || "-"}</TableCell>
                        <TableCell>{row.machineshift || "-"}</TableCell>
                        <TableCell>{row.attendance || "-"}</TableCell>
                        <TableCell>{row.attendancedate || "-"}</TableCell>
                        <TableCell>{row.overtime || "-"}</TableCell>
                        <TableCell>{row.eleave || "-"}</TableCell>
                        <TableCell>{row.manualintime || "-"}</TableCell>
                        <TableCell>{row.manualouttime || "-"}</TableCell>
                        <TableCell>{row.manualduration || "-"}</TableCell>
                        <TableCell>{row.manualshift || "-"}</TableCell>
                        <TableCell>{row.manualovertime || "-"}</TableCell>
                        <TableCell>{row.mleave || "-"}</TableCell>
                        <TableCell>{row.department || "-"}</TableCell>
                        <TableCell>{row.designation || "-"}</TableCell>
                        <TableCell>{row.gender || "-"}</TableCell>
                        <TableCell>{row.status || "-"}</TableCell>

                        <TableCell
                          onClick={() => handleOpen1(row.id as string)}
                        >
                          View
                        </TableCell>
                        <TableCell onClick={() => handleOpen(row.id as string)}>
                          View
                        </TableCell>
                        {session?.user?.role === "HR" && (
                          <>
                            <TableCell>{row.status || "Pending"}</TableCell>
                            <TableCell>
                              {!row.status ? (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  sx={{ color: "#673AB7" }}
                                >
                                  <Button
                                    onClick={() =>
                                      handleApprove(row.id as string)
                                    }
                                  >
                                    <Done sx={{ color: "#673AB7" }} />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleReject(row.id as string)
                                    }
                                  >
                                    <Close sx={{ color: "#673AB7" }} />
                                  </Button>
                                </Box>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell size="small">
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
                ).filter((t) => t.status !== "Pending").length === 0 && (
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <CustomModal
        open={open}
        open1={open1}
        handleClose={handleClose}
        selected1={selected1}
      />
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

  if (session.user?.role === "Civil") {
    return {
      redirect: {
        destination: "/civil/measurement",
        permanent: false,
      },
    };
  }

  if (session.user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  if (session.user?.role === "Stores") {
    return {
      redirect: {
        destination: "/store",
        permanent: false,
      },
    };
  }

  if (session.user?.role === "Safety") {
    return {
      redirect: {
        destination: "/safety",
        permanent: false,
      },
    };
  }

  if (session.user?.role === "Automobile") {
    return {
      redirect: {
        destination: "/vehiclelogbook",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
