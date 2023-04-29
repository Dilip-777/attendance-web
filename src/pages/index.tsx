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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material/";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import Close from "@mui/icons-material/Close";
import Done from "@mui/icons-material/Done";

import { useRouter } from "next/router";
import { Comment, Contractor, TimeKeeper, Upload } from "@prisma/client";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { FormSelect } from "./pc8hr/[id]";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import ImportData from "@/components/import";

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

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
  createHeadCells("status", "Status", false, false),
  createHeadCells("comment", "Comment", false, false),
  createHeadCells("uploaddocument", "Upload Document", false, false),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  contractorName: string;
  value: Dayjs;
  setValue: React.Dispatch<React.SetStateAction<Dayjs>>;
  setContractorName: React.Dispatch<React.SetStateAction<string>>;
  contractors: { value: string; label: string }[];
  handleApprove: () => void;
  showApprove: boolean;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    contractorName,
    setContractorName,
    contractors,
    value,
    setValue,
    handleApprove,
    showApprove,
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
        <Stack spacing={2} direction="row" alignItems="center">
          <Box sx={{ minWidth: 240 }}>
            <FormSelect
              options={[
                { value: "all", label: "All Contractors" },
                ...contractors,
              ]}
              value={contractorName}
              setValue={setContractorName}
            />
          </Box>
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
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack direction="row" spacing={2}>
          <ImportData />
          {value.month() < dayjs().month() &&
            showApprove &&
            contractorName !== "all" && (
              <Button sx={{ mr: 3 }} onClick={handleApprove}>
                Approve
              </Button>
            )}
        </Stack>
      )}
    </Toolbar>
  );
}

export default function TimeKeeperTable({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TimeKeeper>("employeeid");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [timekeeper, setTimeKepeer] = React.useState<TimeKeeper[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [selected1, setSelected1] = React.useState<Comment[] | Upload[]>();
  const matches = useMediaQuery("(min-width:600px)");
  const [contractorName, setContractorName] = React.useState("all");
  const [value, setValue] = React.useState<Dayjs>(dayjs());
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

  const handleApprove = async (id: string) => {
    setLoading(true);
    await axios
      .put(`/api/timekeeper/${id}`)
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
      .delete(`/api/timekeeper/${id}`)
      .then((res) => {
        fetchTimeKeeper();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchTimeKeeper = async () => {
    if (timekeeper.length === 0) {
      setLoading(true);
    }

    await axios
      .get(
        `/api/timekeeper/gettimekeepers?month=${value?.format(
          "MM/YYYY"
        )}&role=${session?.user?.role}`
      )
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
  }, [value, session]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = timekeeper
        .filter(
          (t) => t.contractorname === contractorName || contractorName === "all"
        )
        .map((n) => n.employeeid.toString());
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

  const isSelected = (contractorname: string) =>
    selected.indexOf(contractorname) !== -1;

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
  //  const d = new Date("00:00" * 24 * 60 * 60 * 1000)
  //   .toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   })
  //   ?.toString();

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
          />

          <TableContainer
            sx={{
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                height: 10,
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
                rowCount={
                  timekeeper.filter(
                    (t) =>
                      t.contractorname === contractorName ||
                      contractorName === "all"
                  ).length
                }
                headCells={extraHeadCells}
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
                  .filter((t) => t.status !== "Pending")
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
                        key={row.id}
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

                        <TableCell align="left">{row.employeeid}</TableCell>
                        <TableCell align="left">{row.employeename}</TableCell>
                        <TableCell align="left">{row.machineInTime}</TableCell>
                        <TableCell align="left">{row.machineOutTime}</TableCell>
                        <TableCell align="left">
                          {row.machineduration || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.machineshift || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.attendance || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.attendancedate || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.overtime || "-"}
                        </TableCell>
                        <TableCell align="left">{row.eleave || "-"}</TableCell>
                        <TableCell align="left">
                          {row.manualintime || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.manualouttime || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.manualduration || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.manualshift || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.manualovertime || "-"}
                        </TableCell>
                        <TableCell align="left">{row.mleave || "-"}</TableCell>
                        <TableCell align="left">
                          {row.department || "-"}
                        </TableCell>
                        <TableCell align="left">
                          {row.designation || "-"}
                        </TableCell>
                        <TableCell align="left">{row.gender || "-"}</TableCell>
                        <TableCell align="left">{row.status || "-"}</TableCell>
                        <TableCell
                          align="left"
                          onClick={() => handleOpen1(row.id as string)}
                        >
                          View
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => handleOpen(row.id as string)}
                        >
                          View
                        </TableCell>
                        {session?.user?.role === "HR" && (
                          <>
                            <TableCell align="left">
                              {row.status || "Pending"}
                            </TableCell>
                            <TableCell align="left">
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
                        <TableCell size="small" align="left">
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
            count={
              timekeeper.filter(
                (t) =>
                  (t.contractorname === contractorName ||
                    contractorName === "all") &&
                  t.status !== "Pending"
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

  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      contractors,
    },
  };
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
