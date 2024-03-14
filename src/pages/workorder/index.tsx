import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
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
  Autocomplete,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  //   Button,
  //   Dialog,
  //   DialogActions,
  //   DialogContent,
  //   DialogTitle,
  //   InputAdornment,
  //   OutlinedInput,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, Workorder } from "@prisma/client";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import MonthSelect from "@/ui-component/MonthSelect";
import dayjs, { Dayjs } from "dayjs";

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
  createHeadCells("id", "Work Order Id", false, false),
  createHeadCells("contractorname", "Contractor Name", false, false),
  createHeadCells("nature", "Nature", false, true),
  createHeadCells("startdate", "Start Date", false, false),
  createHeadCells("enddate", "End Date", false, false),
  createHeadCells("location", "Location", false, false),
  createHeadCells("workdescription", "Work Descrition", false, false),
  createHeadCells("repeatedOronetime", "Repeated Or one time", false, false),
  createHeadCells("amendmentdocument", "Amendment Document", true, false),
  createHeadCells("addendumDocument", "Addendum Document", false, false),
  createHeadCells("document", "Document", false, false),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  filtername: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
  contractors: Contractor[];
  selectedContractor: string;
  setSelectedContractor: React.Dispatch<React.SetStateAction<string>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    contractors,
    selectedContractor,
    setSelectedContractor,
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
        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Box sx={{ minWidth: 240 }}>
            <FormLabel sx={{ fontWeight: "700" }}>Select Contractor</FormLabel>
            <Autocomplete
              options={contractors.map((c) => ({
                value: c.contractorId || "",
                label: c.contractorname,
              }))}
              value={contractors
                .map((c) => ({
                  value: c.contractorId || "",
                  label: c.contractorname,
                }))
                .find((c) => c.value === selectedContractor)}
              onChange={(e, value) =>
                setSelectedContractor(value?.value as string)
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
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

export default function WorkOrder({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState("");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [workorder, setWorkOrder] = React.useState<Workorder[]>([]);
  const [selectedWorkorder, setSelectedWorkorder] = React.useState<
    string | undefined
  >(undefined);
  const theme = useTheme();
  const { data: session } = useSession();
  const [selectedContractor, setSelectedContractor] =
    React.useState<string>("");

  const handleClose = () => {
    setOpen(false);
    setSelectedWorkorder(undefined);
  };

  const fetchWorkorder = async () => {
    const res = await axios
      .get("/api/workorder?contractorId=" + selectedContractor)
      .then((res) => {
        setWorkOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetchWorkorder();
  }, [selectedContractor]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = workorder.map((n) => n.contractorName);
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - workorder.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filtername={filterName}
          setFilterName={setFilterName}
          contractors={contractors}
          selectedContractor={selectedContractor}
          setSelectedContractor={setSelectedContractor}
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
              rowCount={workorder.length}
              headCells={headCells}
            />
            <TableBody>
              {workorder
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                      <TableCell
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                        sx={{ minWidth: 150 }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.contractorName}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.nature}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.startDate}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.endDate}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.location}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.workDescription}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.repeatOrOneTime}
                      </TableCell>

                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.amendmentDocument ? (
                          <Typography
                            component="a"
                            href={`/api/upload?fileName=${row.amendmentDocument}`}
                            target="_blank"
                            sx={{
                              textDecoration: "none",
                              color: theme.palette.secondary.dark,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            View Document
                          </Typography>
                        ) : (
                          <Typography>No Document</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.addendumDocument ? (
                          <Typography
                            component="a"
                            href={`/api/upload?fileName=${row.addendumDocument}`}
                            target="_blank"
                            sx={{
                              textDecoration: "none",
                              color: theme.palette.secondary.dark,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            View Document
                          </Typography>
                        ) : (
                          <Typography>No Document</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.uploadDocument ? (
                          <Typography
                            component="a"
                            href={`/api/upload?fileName=${row.uploadDocument}`}
                            target="_blank"
                            sx={{
                              textDecoration: "none",
                              color: theme.palette.secondary.dark,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            View Document
                          </Typography>
                        ) : (
                          <Typography>No Document</Typography>
                        )}
                      </TableCell>
                      {session?.user?.role === "Corporate" && (
                        <>
                          <TableCell size="small" align="center">
                            <IconButton
                              onClick={() =>
                                router.push(`/workorder/${row.id}`)
                              }
                              sx={{ m: 0 }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell size="small" align="center">
                            <IconButton
                              onClick={() => {
                                setOpen(true);
                                setSelectedWorkorder(row.id);
                              }}
                              sx={{ m: 0 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {workorder.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No Data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={workorder.length}
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
            Are you sure, you want to delete selected Work Order
          </Typography>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button color="secondary" variant="outlined" onClick={handleClose}>
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

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (session.user?.role === "TimeKeeper") {
    return {
      redirect: {
        destination: "/timekeeper",
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

  const workorder = await prisma.workorder.findMany();

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      workorder,
      contractors,
    },
  };
};
