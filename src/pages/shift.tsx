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
import Search from "@mui/icons-material/Search";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Slide from "@mui/material/Slide";
import { CircularProgress, FormControl, Stack, styled } from "@mui/material/";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Department, Shift, User } from "@prisma/client";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import EditDesignation from "@/components/Admin/EditDesignation";
import _ from "lodash";
import ImportDesignations from "@/components/importDesignations";
import StyledSearch from "@/ui-component/stylesearch";
import SearchInput from "@/ui-component/stylesearch";
import EditShift from "@/components/Admin/EditShift";
import FormInput from "@/ui-component/FormInput";
import Close from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  overflowY: "auto",
  borderRadius: "15px",
  bgcolor: "background.paper",
  boxShadow: 24,
};

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
  createHeadCells("name", "Shift Name", false, false),
  createHeadCells("code", "Shift Code", false, false),
  createHeadCells("edit", "Action", false, false, 2),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  handleOpen: () => void;
  fetchShifts: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, filter, setFilter, handleOpen } = props;

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
        <SearchInput
          filter={filter}
          setFilter={setFilter}
          placeholder="Search Shifts..."
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(103, 58, 183)",
              ":hover": { backgroundColor: "rgb(103, 58, 183)" },
            }}
            onClick={handleOpen}
          >
            {" "}
            + Add Shift
          </Button>
        </Stack>
      )}
    </Toolbar>
  );
}

export default function Shifts({ shifts }: { shifts: Shift[] }) {
  const [orderby, setOrderby] = React.useState("name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [shift, setShift] = React.useState<Shift | undefined>();
  const matches = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [formValues, setFormValues] = React.useState({
    name: "",
    code: "",
  });

  React.useEffect(() => {
    setFormValues({
      name: shift?.name || "",
      code: shift?.code || "",
    });
  }, [shift]);

  const handleSubmit = async (e: any) => {
    setLoading(true);
    try {
      if (shift) {
        await axios.put("/api/shifts", {
          id: shift.id,
          ...formValues,
        });
      } else {
        await axios.post("/api/shifts", formValues);
      }
      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShift(undefined);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = shifts.map((n) => n.id);
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shifts.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filter={filter}
          setFilter={setFilter}
          handleOpen={() => {
            setOpen(true);
            setShift(undefined);
          }}
          fetchShifts={() => {
            router.replace(router.asPath);
          }}
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
              rowCount={shifts.length}
              headCells={headCells}
              orderby={orderby}
              setOrderby={setOrderby}
              align="center"
            />
            <TableBody>
              {shifts
                .filter((shift) =>
                  _.get(shift, orderby, "name")
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
                      <TableCell
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row?.id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.code}</TableCell>

                      <TableCell size="small" align="left">
                        <IconButton
                          onClick={() => {
                            setOpen(true);
                            setShift(row);
                          }}
                          sx={{ m: 0 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>

                      <TableCell size="small" align="left">
                        <IconButton
                          onClick={async () => {
                            await axios.delete("/api/shifts", {
                              data: { id: row.id },
                            });
                            router.replace(router.asPath);
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
          count={shifts.length}
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
            <FormControl sx={{ p: "1rem" }} fullWidth>
              <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", top: 13, right: 23 }}
              >
                <Close />
              </IconButton>
              <Typography variant="h3"> Add Shift </Typography>
              <FormInput
                label="Shift Name"
                placeholder="Enter Shift Name"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues((v) => ({
                    ...v,
                    name: e.target.value,
                  }))
                }
                sx={{ maxWidth: "100%" }}
              />
              <FormInput
                label="Shift Code"
                placeholder="Enter Shift Code"
                value={formValues.code}
                onChange={(e) =>
                  setFormValues((v) => ({
                    ...v,
                    code: e.target.value,
                  }))
                }
                sx={{ maxWidth: "100%" }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                onClick={handleSubmit}
                color="secondary"
                sx={{ mt: 2 }}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={15}
                    sx={{ ml: 1, color: "#364152" }}
                  />
                )}
              </Button>
            </FormControl>
          </Box>
        </Slide>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const shifts = await prisma.shift.findMany();

  if (session?.user?.role !== "Manager") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      shifts,
    },
  };
};
