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
import {
  Edit,
  Launch,
  PanoramaFishEye,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Backdrop,
  Button,
  Fade,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Stack,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import { Contractor } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const options = [
  { link: "/pc8hr", label: "8HR" },
  { link: "/pc12hr", label: "12HR" },
  { link: "plccm", label: "CCM" },
  { link: "pclrf", label: "LRF" },
  { link: "colony", label: "Colony" },
];

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
  const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
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
  createHeadCells("contractorid", "Contractor ID", true, true),
  createHeadCells("contractorname", "Contractor Name", false, false),
  createHeadCells("serviceDetail", "Service Detail", true, false),
  createHeadCells("supplierDetail", "Supplier Detail", true, false),
  createHeadCells("telephone", "telephone Number", true, false),
  createHeadCells("emailid", "Email", true, false),
  createHeadCells("mobileNumber", "Mobile Number", true, false),
  createHeadCells("officeaddress", "Office Address", false, false),
  createHeadCells("website", "Website", false, false),
  createHeadCells("organisationType", "Organisation Type", false, false),
  createHeadCells("isCertified", "Is Certified", false, false),
  createHeadCells("uniquenumber", "Unique Number", false, false),
  createHeadCells("registrationNumber", "Registration Number", true, false),
  createHeadCells(
    "firstregistrationNumber",
    "First Registration Number",
    false,
    false
  ),
  createHeadCells("deliveryProcedure", "Delivery Procedure", false, false),
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Contractor
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
    (property: keyof Contractor) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  const { data: session } = useSession();

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
              onClick={createSortHandler(headCell.id as keyof Contractor)}
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
        {session?.user?.role !== "HR" && (
          <TableCell align="center">View Attendance</TableCell>
        )}
        {(session?.user?.role === "HoCommercialAuditor" ||
          session?.user?.role === "Corporate") && (
          <TableCell align="center">Ho Commercial Form</TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

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
          placeholder="Search Contractor..."
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

export default function TimeKeeper({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Contractor>("id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const { data: session } = useSession();
  const [contractorId, setContractorId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    setContractorId("");
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Contractor
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = contractors?.map((n) => n.contractorname);
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

  // Avoid a layout jump when reaching the last page with empty contractors?.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contractors?.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              numSelected={selected?.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={contractors?.length}
            />
            <TableBody>
              {stableSort(contractors as any, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const isItemSelected = isSelected(row.contractorname as any);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.contractorname}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        onClick={(event) =>
                          handleClick(event, row.contractorname as any)
                        }
                        padding="checkbox"
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell id={labelId} scope="row" padding="none">
                        {row.contractorname}
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="center">{row.servicedetail}</TableCell>
                      <TableCell align="center">{row.supplierdetail}</TableCell>
                      <TableCell align="center">
                        {row.telephonenumber}
                      </TableCell>
                      <TableCell align="center">{row.emailid}</TableCell>
                      <TableCell align="center">{row.mobilenumber}</TableCell>
                      <TableCell align="center">{row.officeaddress}</TableCell>
                      <TableCell align="center">{row.website}</TableCell>
                      <TableCell align="center">
                        {row.organisationtype}
                      </TableCell>
                      <TableCell align="center">
                        {row.isocertified ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center">{row.uniquenumber}</TableCell>
                      <TableCell align="center">
                        {row.registration_number}
                      </TableCell>
                      <TableCell align="center">
                        {row.first_registration_number}
                      </TableCell>
                      <TableCell align="center">
                        {row.delivery_procedure}
                      </TableCell>
                      {session?.user?.role !== "HR" && (
                        <TableCell
                          onClick={() => {
                            setContractorId(row.id as string);
                            setOpen(true);
                          }}
                          align="center"
                        >
                          <IconButton sx={{ m: 0 }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}
                      {(session?.user?.role === "HoCommercialAuditor" ||
                        session?.user?.role === "Corporate") && (
                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              router.push(`/hoauditor/${row.id}`);
                            }}
                            sx={{ m: 0 }}
                          >
                            <Launch fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}

                      <TableCell size="small" align="center">
                        <IconButton
                          onClick={() => router.push(`/contractors/${row.id}`)}
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
          count={contractors?.length}
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
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Select the Designation</FormLabel>
                <Select
                  placeholder="Select the designation"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                >
                  {options?.map((option) => (
                    <MenuItem value={option.link}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                disabled={Boolean(!value)}
                onClick={() => router.push(`/${value}/${contractorId}`)}
              >
                View Attendance
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const contractors = await prisma.contractor.findMany();
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
