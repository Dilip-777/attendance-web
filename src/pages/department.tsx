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
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Search from "@mui/icons-material/Search";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  styled,
} from "@mui/material/";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Department, Designations } from "@prisma/client";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import FormSelect from "@/ui-component/FormSelect";
import { extend, set } from "lodash";
import ImportDepartments from "@/components/importDepartment";

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

const createHeadCells = (
  id: string,
  label: string,
  numeric: boolean,
  included: boolean,
  colspan?: number,
  align?: "right" | "left" | "center"
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
    colspan: colspan,
    align: align,
  };
};

const headCells = [
  createHeadCells("id", "Id", false, false),
  createHeadCells("department", "Department", false, false),
  createHeadCells("basicsalary_in_duration", "Salary Duration", false, false),
  createHeadCells("designation", "Designations", false, false),
  createHeadCells("Action", "Action", false, false, 2, "center"),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  handleOpen: () => void;
  fetchDepartments: () => void;
  handleReport: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, filter, setFilter, handleOpen, handleReport } = props;

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
              theme.palette.secondary.main,
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
        <Stack direction="row" spacing={2}>
          <IconButton onClick={() => handleReport()}>
            <LocalPrintshopIcon />
          </IconButton>
          <ImportDepartments fetchDepartments={props.fetchDepartments} />
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
        </Stack>
      )}
    </Toolbar>
  );
}

interface DepartmentContractors extends Department {
  contractors: Contractor[];
}

export default function Departments({
  designations,
  contractors,
}: {
  designations: Designations[];
  contractors: Contractor[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<DepartmentContractors | null>(null);
  const [department, setDepartment] = React.useState(
    selectedDepartment?.department || ""
  );
  const [salaryduration, setSalaryDuration] = React.useState(
    selectedDepartment?.basicsalary_in_duration || ""
  );
  const router = useRouter();
  const [departments, setDepartments] = React.useState<DepartmentContractors[]>(
    []
  );
  const matches = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [selectedContractors, setSelectedContractors] = React.useState<
    Contractor[]
  >([]);
  const [value, setValue] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setDepartment("");

    setSelectedDepartment(null);
  };

  const handleAddDepartment = async () => {
    setError("");
    setLoading(true);
    if (selectedDepartment) {
      await axios
        .post("api/admin/department", {
          id: selectedDepartment?.id,
          department,
          salaryduration,
          contractors: selectedContractors,
        })
        .then((res) => {
          handleClose();
          fetchDepartments();
        })
        .catch((err) => {
          console.log(err.response.data.message, "Error Message");
          setError(err.message);
        });
      setLoading(false);
      return;
    }

    const res = await axios
      .post("api/admin/department", {
        department,
        salaryduration,
        contractors: selectedContractors,
      })
      .then((res) => {
        handleClose();
        fetchDepartments();
      })
      .catch((err) => {
        console.log(err.response.data.message, "Error Message");
        setError(err.response.data.message);
      });

    setDepartment("");
    setSalaryDuration("");
    setLoading(false);
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

  const handleReport = () => {
    const tableRows = [["ID", "Department", "Salary Duration", "Designations"]];

    try {
      departments.forEach((item) => {
        tableRows.push([
          item.id,
          item.department,
          item.basicsalary_in_duration || "",
          designations
            .filter((d) => d.departmentname === item.department)
            .map((d) => d.designation)
            .join(","),
        ]);
      });

      const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Departments.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDepartments = async () => {
    const res = await fetch("/api/admin/department");
    const data = await res.json();
    setDepartments(data);
  };

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

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
          fetchDepartments={fetchDepartments}
          handleReport={handleReport}
        />
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 16rem)",
            overflow: "auto",
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
                          color="secondary"
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
                      <TableCell>{row.basicsalary_in_duration}</TableCell>
                      <TableCell>
                        <Box display="flex">
                          {designations?.filter(
                            (d) => d.departmentname === row.department
                          ).length === 0 && (
                            <Box display="flex" alignItems="center">
                              <Typography>No Designations</Typography>
                            </Box>
                          )}
                          {designations
                            ?.filter((d) => d.departmentname === row.department)
                            .map((designation) => (
                              <Chip
                                sx={{ mx: 1 }}
                                label={designation.designation}
                              />
                            ))}
                        </Box>
                      </TableCell>

                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() => {
                            setSelectedDepartment(row);
                            setSelectedContractors(row.contractors);
                            setDepartment(row.department);
                            setSalaryDuration(
                              row.basicsalary_in_duration || ""
                            );
                            setOpen(true);
                          }}
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>

                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={async () => {
                            await axios.delete("/api/admin/department", {
                              data: { id: row.id },
                            });
                            fetchDepartments();
                          }}
                          sx={{ m: 0 }}
                        >
                          <Delete fontSize="small" />
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
                Add Department
              </Typography>
              <Divider />

              {open && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Stack width="100%" spacing={3}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel sx={{ fontWeight: "700" }}>
                        Department
                      </FormLabel>
                      <TextField
                        placeholder="Department"
                        variant="outlined"
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          setError("");
                        }}
                      />
                    </Box>
                    <FormSelect
                      label="Basic Salary In Duration"
                      value={salaryduration}
                      handleChange={(e) => {
                        setSalaryDuration(e as string);
                        setError("");
                      }}
                      options={[
                        { label: "Hourly", value: "Hourly" },
                        { label: "Daily", value: "Daily" },
                        { label: "Monthly", value: "Monthly" },
                      ]}
                    />
                    <Box>
                      <FormLabel sx={{ fontWeight: "700" }}>
                        Select Contractor
                      </FormLabel>
                      <Autocomplete
                        onChange={(event: any, newValue: string | null) => {
                          console.log(
                            newValue,
                            "New Value",
                            selectedContractors,
                            "Selected Contractors"
                          );

                          if (
                            !selectedContractors.find(
                              (d) => d.contractorname === newValue
                            )
                          ) {
                            const d = contractors.find(
                              (d) => d.contractorname === newValue
                            );
                            console.log(contractors);

                            console.log(d, "D");

                            if (d) {
                              setSelectedContractors([
                                ...selectedContractors,
                                d,
                              ]);
                            }
                          }
                          setValue("");
                        }}
                        value={value}
                        inputValue={value}
                        onInputChange={(event, newInputValue) => {
                          setValue(newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={[...contractors.map((c) => c.contractorname)]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select a Contractor"
                          />
                        )}
                        clearIcon={null}
                      />
                    </Box>
                    {error && (
                      <FormHelperText error={true}>{error}</FormHelperText>
                    )}
                    <Stack direction="row" flexWrap="wrap">
                      {selectedContractors.map((c) => (
                        <Chip
                          sx={{ my: 1, mx: 0.5 }}
                          key={c.contractorId}
                          label={c.contractorname}
                          onDelete={() =>
                            setSelectedContractors(
                              selectedContractors.filter(
                                (contractor) =>
                                  contractor.contractorId !== c.contractorId
                              )
                            )
                          }
                        />
                      ))}
                    </Stack>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleAddDepartment}
                      disabled={loading}
                    >
                      Submit'{" "}
                      {loading && (
                        <CircularProgress
                          size={15}
                          sx={{ ml: 1, color: "#364152" }}
                        />
                      )}
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

  if (!(session?.user?.role === "Admin" || session?.user?.role === "HR")) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const designations = await prisma.designations.findMany();
    const contractors = await prisma.contractor.findMany({
      include: {
        departments: true,
      },
    });
    return {
      props: {
        designations,
        contractors,
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
