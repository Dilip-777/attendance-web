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
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Slide from "@mui/material/Slide";
import { Stack, styled } from "@mui/material/";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Department, Designations, User } from "@prisma/client";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import EditDesignation from "@/components/Admin/EditDesignation";
import _, { size } from "lodash";
import ImportDesignations from "@/components/importDesignations";
import Add from "@mui/icons-material/Add";
import AddSalary from "@/components/Admin/AddSalary";

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
  colspan?: number
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
    colspan: colspan,
  };
};

const headCells = [
  createHeadCells("id", "Id", false, false),
  createHeadCells("departmentname", "Department", false, false),
  createHeadCells("designation", "Designation", false, false),
  createHeadCells("gender", "Gender", false, false),
  createHeadCells("basicsalary", "Basic Salary", false, false),
  createHeadCells(
    "allowed_wrking_hr_per_day",
    "Allowed Working Hours",
    false,
    false
  ),
  createHeadCells(
    "basicsalary_in_duration",
    "Basic Salary In Duration",
    false,
    false
  ),
  createHeadCells("servicecharge", "Service Charge", false, false),
  createHeadCells("contractorsalary", "Contractor Salary", false, false),
  createHeadCells("action", "Action", false, false, 2),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  handleOpen: () => void;
  fetchDesignations: () => void;
  departments: Department[];
  handleReport: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, filter, setFilter, handleOpen, handleReport } = props;
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
          placeholder="Search designations..."
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
          <ImportDesignations
            fetchDesignations={props.fetchDesignations}
            departments={props.departments}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(103, 58, 183)",
              ":hover": { backgroundColor: "rgb(103, 58, 183)" },
            }}
            onClick={handleOpen}
          >
            {" "}
            + Add Designation
          </Button>
        </Stack>
      )}
    </Toolbar>
  );
}

export default function TimeKeeper({
  departments,
  contractors,
}: {
  departments: Department[];
  contractors: Contractor[];
}) {
  const [orderby, setOrderby] = React.useState("id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [designations, setDesignations] = React.useState<Designations[]>([]);
  const [designation, setDesignation] = React.useState<
    Designations | undefined
  >();
  const matches = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    setDesignation(undefined);
    setType("");
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = designations.map((n) => n.id);
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
  const fetchDesignations = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/designations");
    const data = await res.json();
    setDesignations(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchDesignations();
  }, []);

  const handleReport = () => {
    const tableRows = [
      [
        "ID",
        "Department",
        "Designation",
        "Gender",
        "Salary",
        "Allowed Working Hours",
        "Basic Salary In Duration",
        "Service Charge",
      ],
    ];

    try {
      designations.forEach((item) => {
        tableRows.push([
          item.id,
          item.departmentname,
          item.designation,
          item.gender,
          item.basicsalary.toString(),
          item.allowed_wrking_hr_per_day.toString(),
          item.basicsalary_in_duration,
          item.servicecharge?.toString() || "0",
        ]);
      });

      const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

      // Download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Designations.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - designations.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filter={filter}
          setFilter={setFilter}
          handleOpen={() => {
            setOpen(true);
            setDesignation(undefined);
            setType("designation");
          }}
          fetchDesignations={fetchDesignations}
          departments={departments}
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
              rowCount={designations.length}
              headCells={headCells}
              orderby={orderby}
              setOrderby={setOrderby}
              align="center"
            />
            <TableBody>
              {designations
                .filter((designation) =>
                  _.get(designation, orderby, "designation")
                    .toString()
                    .toLowerCase()
                    .includes(filter.toLowerCase())
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
                      <TableCell>{row.departmentname}</TableCell>
                      <TableCell>{row.designation}</TableCell>
                      <TableCell>{row.gender}</TableCell>
                      <TableCell>{row.basicsalary}</TableCell>
                      <TableCell>{row.allowed_wrking_hr_per_day}</TableCell>
                      <TableCell>{row.basicsalary_in_duration}</TableCell>
                      <TableCell>{row.servicecharge}</TableCell>
                      <TableCell align="center" sx={{ fontSize: "5px" }}>
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setType("salary");
                            setDesignation(row);
                          }}
                          sx={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                          }}
                          color="secondary"
                        >
                          <Add fontSize="small" />
                          Add Salary
                        </Button>
                      </TableCell>

                      <TableCell size="small" align="left">
                        <IconButton
                          onClick={() => {
                            setOpen(true);
                            setType("designation");
                            setDesignation(row);
                          }}
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>

                      <TableCell size="small" align="left">
                        <IconButton
                          onClick={async () => {
                            await axios.delete("/api/admin/designations", {
                              data: { id: row.id },
                            });
                            fetchDesignations();
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
                    height: 53 * emptyRows,
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
          count={designations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
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
          in={open}
          mountOnEnter
          unmountOnExit
        >
          <Box
            p={{ xs: 0, sm: 2 }}
            width={{ xs: "100%", sm: 400 }}
            height={{ xs: "70%", sm: "100%" }}
            top={{ xs: "30%", sm: "0" }}
            sx={style}
          >
            {type === "salary" && (
              <AddSalary
                handleClose={handleClose}
                contractors={contractors}
                designation={designation?.id || ""}
                fetchDesignations={fetchDesignations}
              />
            )}
            {type === "designation" && (
              <EditDesignation
                handleClose={handleClose}
                selectedDesignation={designation}
                departments={departments}
                fetchDesignations={fetchDesignations}
              />
            )}
          </Box>
        </Slide>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const contractors = await prisma.contractor.findMany();

  const departments = await prisma.department.findMany();

  if (!(session?.user?.role === "Admin" || session?.user?.role === "HR")) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        departments,
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
