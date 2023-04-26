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
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/";

import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import Search from "@mui/icons-material/Search";

import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { payoutTracker } from "@prisma/client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import Edit from "@mui/icons-material/Edit";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import EditPayout from "@/components/EditPayout";

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
  createHeadCells("contractorName", "Contractor Name", false, false),
  createHeadCells("workorderid", "Work Order", false, true),
  createHeadCells("month", "Month", false, true),
  createHeadCells("amount", "Amount", false, false),
  createHeadCells("gst", "GST", false, false),
  createHeadCells("tds", "TDS", false, false),
  createHeadCells("finalpayableamount", "Final Payble Amount", false, false),
  createHeadCells("deduction", "Deduction", false, false),
  createHeadCells("actualpaidoutmoney", "Paid Out Money", false, false),
  createHeadCells("balance", "Balance", false, false),
  createHeadCells("uploadreceipt", "Upload Receipt", false, false),
];

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
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState("");
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [open, setOpen] = React.useState(false);
  const [selectedrow, setSelectedRow] = React.useState<
    payoutTracker | undefined
  >();
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
  };

  const handleUpload = async (doc: any) => {
    await axios.put("/api/payouttracker", {
      id: doc.id,
      uploadreceipt: doc.data.file.newFilename,
    });
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
        <Box
          sx={{
            height: "5rem",
            display: "flex",
            p: 2,
            justifyContent: "space-between",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["month", "year"]}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            size="small"
            sx={{ m: 0.5 }}
            onClick={() => router.push("/finalamount")}
          >
            Add Payout Tracker
          </Button>
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
                payouttracker.filter((employee) =>
                  employee.contractorName
                    .toLowerCase()
                    .includes(filterName.toLowerCase())
                ).length
              }
              headCells={headCells}
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
                            handleClick(event, row.contractorName as string)
                          }
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
                      <TableCell align="center">{row.month}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="center">9</TableCell>
                      <TableCell align="center">9</TableCell>
                      <TableCell align="center">
                        {row.finalpayableamount}
                      </TableCell>
                      <TableCell align="center">{row.deduction}</TableCell>
                      <TableCell align="center">
                        {row.actualpaidoutmoney}
                      </TableCell>
                      <TableCell align="center">{row.balance}</TableCell>
                      <TableCell align="center">
                        {row.uploadreceipt ? (
                          <Typography
                            onClick={() => {
                              router.push(
                                `/uploadedFiles/${row.uploadreceipt}`
                              );
                            }}
                          >
                            View Receipt
                          </Typography>
                        ) : (
                          <UploadButtons
                            id={row.id}
                            handleUpload={handleUpload}
                          />
                        )}
                      </TableCell>
                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() => {
                            setOpen(true);
                            setSelectedRow(row);
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
      <EditPayout open={open} row={selectedrow} handleClose={handleClose} />
      {/* <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedRow(undefined);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{ display: "flex", justifyContent: " flex-end" }}
      >
        <Slide
          timeout={500}
          in={open}
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
                Edit Details
              </Typography>
              <Divider />
            </Stack>
          </Box>
        </Slide>
      </Modal> */}
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
