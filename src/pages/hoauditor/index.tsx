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
import { HOAuditor } from "@prisma/client";
import dayjs from "dayjs";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 40,
  marginRight: 30,

  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

interface Data1 {
  contractorname: string;
  employeeid: string;
  employeename: string;
  designation: string;
  department: string;
  gender: string;
  phone: number;
  emailid: string;
  basicsalaryinduration: string;
  basicsalary: string;
  gst: number;
  tds: number;
  allowedWorkinghoursperday: string;
  servicecharge: string;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Data {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

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

function stableSort<HOAuditor>(
  array: readonly HOAuditor[],
  comparator: (a: HOAuditor, b: HOAuditor) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [HOAuditor, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
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
  createHeadCells("contractorname", "Contractor Name", false, false),
  createHeadCells("workdescription", "Work Description", false, true),
  createHeadCells("startdate", "Start Date", false, false),
  createHeadCells("enddate", "End Date", false, false),
  createHeadCells("monthofInvoice", "Month of Invoice", false, false),
  createHeadCells("basicbillamount", "Basic Bill Amount", false, false),
  createHeadCells("serviceCharges", "Services Charge", false, false),
  createHeadCells("netbillAmount", "Net Bill Amount", true, false),
  createHeadCells("bankDetails", "Bank Details", false, false),
  createHeadCells("onetimeInvoice", "One Time Invoice", false, false),
  createHeadCells(
    "verifiedComplainces",
    "Verified the Complainces",
    false,
    false
  ),
  createHeadCells("workOrderAvailable", "Work Order Available", false, false),
  createHeadCells("licensesInPlace", "Licenses In Place", false, false),
  createHeadCells(
    "previousPayVerified",
    "Previous Month Pay verified",
    false,
    false
  ),
  createHeadCells(
    "detailssSentToAuditAndHo",
    "Details sent to Audit and HO",
    false,
    false
  ),
  createHeadCells("gstChallanAttached", "GST Challan Attached", false, false),
  createHeadCells("deductions", "Deductions", false, false),
  createHeadCells(
    "variationsInManPower",
    "Variations In Manpower",
    false,
    false
  ),
  createHeadCells(
    "machineOrRegisterMode",
    "Machine Or Register Mode",
    false,
    false
  ),
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data1
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

// function EnhancedTableHead(props: EnhancedTableProps) {
//   const {
//     onSelectAllClick,
//     order,
//     orderBy,
//     numSelected,
//     rowCount,
//     onRequestSort,
//   } = props;
//   const createSortHandler =
//     (property: keyof Data1) => (event: React.MouseEvent<unknown>) => {
//       onRequestSort(event, property);
//     };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding="checkbox">
//           <Checkbox
//             color="primary"
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={onSelectAllClick}
//             inputProps={{
//               "aria-label": "select all desserts",
//             }}
//           />
//         </TableCell>
//         {headCells1.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align={"center"}
//             padding={headCell.disablePadding ? "none" : "normal"}
//             sortDirection={orderBy === headCell.id ? order : false}
//             sx={{ fontWeight: "700" }}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id as keyof Data1)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === "desc" ? "sorted descending" : "sorted ascending"}
//                 </Box>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

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
          placeholder="Search Contactor..."
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
  hocommercial,
}: {
  hocommercial: HOAuditor[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data1>("contractorname");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState("");
  const router = useRouter();
  console.log(hocommercial);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data1
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = hocommercial.map((n) => n.contractorname);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  console.log(dayjs("03-01-2023", "MM-DD-YYYY").format("MMMM"));

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - hocommercial.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filtername={filterName}
          setFilterName={setFilterName}
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
              rowCount={hocommercial.length}
              headCells={headCells}
            />
            <TableBody>
              {hocommercial
                .filter((employee) =>
                  employee.contractorname
                    .toLowerCase()
                    .includes(filterName.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(
                    row.contractorname as string
                  );
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row.contractorname as string)
                      }
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
                        {row.contractorname}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.workDescription}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.fromDate}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.toDate}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {dayjs(row.monthOfInvoice, "MM-DD-YYYY")
                          .format("MMMM")
                          .toString() || "-"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.basicbillamount}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.serviceCharges}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.netbillAmount}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.bankDetails}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.onetimeInvoice ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.verifiedComplainces ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.workOrderAvailable ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.licensesInPlace ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.previousPayVerified ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.detailsSentToAuditAndHo ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.gstChallanAttached ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.deductions}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.variationsInManpower}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>
                        {row.manchineOrRegisterMode}
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
          count={hocommercial.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
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

  if (user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const hocommercial = await prisma.hOAuditor.findMany();
  return {
    props: {
      hocommercial,
    },
  };
};
