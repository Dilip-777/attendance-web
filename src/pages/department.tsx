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
import { Add, Edit, NavigateBefore, Search } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import { Chip, FormControl, TextField, styled } from "@mui/material/";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import prisma from "@/lib/prisma";
import { Department, User } from "@prisma/client";
import EditUser from "@/components/Admin/EditUser";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";

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
  createHeadCells("id", "Id", false, false),
  createHeadCells("department", "Department", false, false),
  createHeadCells("designation", "Designations", false, false),
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  handleOpen: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, filter, setFilter, handleOpen } = props;
  const router = useRouter();

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
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search department..."
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
        <Button
          variant="contained"
          sx={{
            backgroundColor: "rgb(103, 58, 183)",
            ":hover": { backgroundColor: "rgb(103, 58, 183)" },
          }}
          onClick={handleOpen}
        >
          {" "}
          + Add Department
        </Button>
      )}
    </Toolbar>
  );
}

export default function TimeKeeper({ session }: { session: Session }) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<Department | null>(null);
  const [designations, setDesignations] = React.useState<string[]>(
    selectedDepartment?.designations || []
  );
  const [designation, setDesignation] = React.useState("");
  const [department, setDepartment] = React.useState(
    selectedDepartment?.department || ""
  );
  const router = useRouter();
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const matches = useMediaQuery("(min-width:600px)");

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setDepartment("");

    setSelectedDepartment(null);
  };

  const handleAddDepartment = async () => {
    const res = await axios
      .post("api/admin/department", {
        department,
      })
      .then((res) => {
        handleClose();
        fetchDepartments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelAddDesignations = async () => {
    console.log("designations", designations);
    console.log("department", selectedDepartment?.id);
    console.log("department", selectedDepartment?.department);
    console.log("department", selectedDepartment?.designations);

    const res = await axios
      .put("api/admin/department", {
        id: selectedDepartment?.id,
        designations: designations,
      })
      .then((res) => {
        handleClose();
        fetchDepartments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = departments.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const fetchDepartments = async () => {
    const res = await fetch("/api/admin/department");
    const data = await res.json();
    setDepartments(data);
  };

  console.log(departments);

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  console.log(designations);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - departments.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filter={filter}
          setFilter={setFilter}
          handleOpen={() => {
            setOpen(true);
            setSelectedDepartment(null);
            setDepartment("");
          }}
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
              onSelectAllClick={handleSelectAllClick}
              rowCount={departments.length}
              headCells={headCells}
            />
            <TableBody>
              {departments
                .filter((user) =>
                  user.department.toLowerCase().includes(filter.toLowerCase())
                )
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index: number) => {
                  const isItemSelected = isSelected(row.id as string);
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
                          onClick={(event) =>
                            handleClick(event, row.id as string)
                          }
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell id={labelId} scope="row" padding="none">
                        {row?.id}
                      </TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>
                        <Box display="flex">
                          {row.designations.length === 0 && (
                            <Box display="flex" alignItems="center">
                              <Typography>No Designations</Typography>
                            </Box>
                          )}
                          {row.designations.map((designation) => (
                            <Chip sx={{ mx: 1 }} label={designation} />
                          ))}
                          <IconButton
                            sx={{ color: "rgb(103, 58, 183)" }}
                            onClick={() => {
                              setSelectedDepartment(row);
                              setDesignations(row.designations);
                              setOpen1(true);
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() => {
                            setSelectedDepartment(row);

                            setOpen(true);
                          }}
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
          count={departments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
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
                Add{" "}
                {open
                  ? "Depatrment"
                  : `Designation for ${selectedDepartment?.department}`}
              </Typography>
              <Divider />
              {open1 && (
                <Box display="flex" alignItems="center" flexWrap="wrap" mt={2}>
                  {designations.map((designation) => (
                    <Chip
                      label={designation}
                      sx={{ m: 1 }}
                      onDelete={() => {
                        setDesignations(
                          designations.filter((des) => des !== designation)
                        );
                      }}
                    />
                  ))}
                </Box>
              )}
              {open1 && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Stack width="100%" direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      label="Designation"
                      variant="outlined"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      // fullWidth
                      onClick={() => {
                        setDesignations([...designations, designation]);
                        setDesignation("");
                      }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={handelAddDesignations}
                    sx={{ mt: 5 }}
                  >
                    Submit
                  </Button>
                </FormControl>
              )}
              {open && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Stack width="100%" spacing={2}>
                    <TextField
                      label="Department"
                      variant="outlined"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleAddDepartment}
                    >
                      Submit
                    </Button>
                  </Stack>
                </FormControl>
              )}
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const departments = await prisma.user.findMany();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });

  if (user?.role !== "Admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session: JSON.stringify(session),
        departments: departments,
      },
    };
  }
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
