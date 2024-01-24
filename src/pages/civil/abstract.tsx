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
import Edit from "@mui/icons-material/Edit";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import Search from "@mui/icons-material/Search";

import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
// import {
//   FormControl,
//   FormLabel,
//   Tab,
//   Tabs,
//   TextField,
//   styled,
// } from "@mui/material/";
import { TableHead, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Contractor, User, WorkItem, Workorder, Works } from "@prisma/client";
import EditUser from "@/components/Admin/EditUser";
// import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import _ from "lodash";
import FormSelect from "@/ui-component/FormSelect";
import PrintExcel from "@/components/PrintAbstractSheet";

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
  width?: number
) => {
  return {
    id: id,
    label: label,
    numeric: numeric,
    included: included,
    width: width,
  };
};

const headCells = [
  createHeadCells("itemcode", "Item Code", false, false),
  createHeadCells("description", "Item Description", false, false, 35),
  createHeadCells("unit", "Unit", false, false),
  createHeadCells("unitrate", "Unit Rate", false, false),
  createHeadCells(
    "previousBillQuantity",
    "Previous Bill Quantity",
    false,
    false,
    15
  ),
  createHeadCells("quantity", "Current Bill Quantity", false, false, 15),
  createHeadCells("totalQuantity", "Total Quantity", false, false, 15),
  createHeadCells(
    "valueofpreviousBill",
    "Value of Previous Bill",
    false,
    false,
    15
  ),
  createHeadCells(
    "valueofcurrentBill",
    "Value of Current Bill",
    false,
    false,
    15
  ),
  createHeadCells("valueofTotalBill", "Value of Total Bill", false, false, 15),
  createHeadCells("remarks", "Remarks", false, false, 15),
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, filter, setFilter } = props;
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
          placeholder="Search User..."
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      )}
    </Toolbar>
  );
}

interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
  included: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  nocheckbox?: boolean;

  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  headCells: HeadCell[];
  align?: "left" | "right" | "center";
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    numSelected,
    rowCount,
    headCells,
    nocheckbox,
    align,
  } = props;

  return (
    <TableHead sx={{ bgcolor: "#eeeeee" }}>
      <TableRow sx={{ bgcolor: "#eeeeee" }}>
        <TableCell sx={{ bgcolor: "#eeeeee" }} padding="checkbox">
          {onSelectAllClick && !nocheckbox && (
            <Checkbox
              color="secondary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={align || "left"}
            padding={"normal"}
            sx={{
              fontWeight: "600",
              bgcolor: "#eeeeee",
              minWidth: headCell.id === "description" ? "15rem" : "6rem",
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface worktype extends Works {
  workItems: WorkItem[];
  contractor: Contractor;
}

interface contractors extends Contractor {
  workorders: Workorder[];
}

export default function AbstractSheet({
  // workitems,
  workorders,
  contractors,
}: {
  // workitems: worktype[];
  workorders: Workorder[];
  contractors: contractors[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<worktype | null>(null);
  const matches = useMediaQuery("(min-width:600px)");
  const [value, setValue] = React.useState(0);
  const [password, setPassword] = React.useState("");
  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0].contractorId : undefined
  );
  const [workitems, setWorkItems] = React.useState<worktype[]>([]);

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const resetPassword = async () => {
    await axios
      .post("/api/admin/resetpassword", {
        id: selectedUser?.id,
        password,
      })
      .then((res) => {
        handleClose();
        setPassword("");
        setValue(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = workitems.map((n) => n.id);
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

  const contractor1 = contractors.find((v) => v.contractorId === contractor);
  const workorder =
    contractor1 && contractor1?.workorders.length > 0
      ? contractor1?.workorders[0]
      : undefined;
  const info = [
    { value: contractor1?.contractorname, label: "Name of Contractor" },
    { value: workorder?.nature, label: "Nature of Work" },
    { value: workorder?.location, label: "Location" },
  ];

  const fetchWorkItems = async () => {
    const res = await axios.get("/api/workitem?contractorId=" + contractor);
    console.log(res.data);
    setWorkItems(res.data);
  };

  React.useEffect(() => {
    fetchWorkItems();
  }, [contractor]);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty workitems.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - workitems.length) : 0;

  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        height: "85vh",
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
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* <EnhancedTableToolbar
          numSelected={selected.length}
          filter={filter}
          setFilter={setFilter}
        /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "1rem",
            alignItems: "center",
          }}
        >
          <Stack direction="column" spacing={3}>
            <FormSelect
              handleChange={(v) => setContractor(v as string)}
              options={contractors.map((v) => ({
                label: v.contractorname,
                value: v.contractorId,
              }))}
              label="Contractor"
              value={
                (contractor as string) ||
                (contractors.length > 0 ? contractors[0].contractorId : "")
              }
            />
            {contractor1 && contractor1?.workorders?.length > 0 && (
              <Stack direction="column" spacing={2}>
                {info.map((v) => (
                  <Stack direction="row" spacing={2}>
                    <Typography
                      sx={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        minWidth: "12rem",
                      }}
                    >
                      {v.label}:
                    </Typography>
                    <Typography sx={{ fontSize: "1rem" }}>{v.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
          {/* <Button
            variant="contained"
            onClick={() => {
              PrintExcel({
                works: workitems,
                headcells: headCells,
              });
              console.log("clicked");
            }}
          >
            Print
          </Button> */}
          <PrintExcel
            works={workitems}
            headcells={headCells}
            info={info}
            // contractor={contractor}
          />
        </Box>
        <TableContainer
          sx={{
            // maxHeight: "calc(100vh - 16rem)",
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
            stickyHeader
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={workitems.length}
              headCells={headCells}
              align="center"
            />
            <TableBody>
              {workitems.map((row) => (
                <>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) =>
                          handleClick(event, row.id as string)
                        }
                        color="secondary"
                        // checked={isItemSelected}
                        // inputProps={{
                        //   "aria-labelledby": labelId,
                        // }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "700" }}
                      // colSpan={10}
                      align="center"
                    >
                      {row.itemcode}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxHeight: "3rem",
                        width: "15rem",
                        fontWeight: "700",
                      }}
                    >
                      {row.description}
                    </TableCell>
                  </TableRow>
                  {row.workItems.map((item) => (
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) =>
                            handleClick(event, item.id as string)
                          }
                          color="secondary"
                          sx={{ mt: "auto" }}
                          // checked={isItemSelected}
                          // inputProps={{
                          //   "aria-labelledby": labelId,
                          // }}
                        />
                      </TableCell>
                      {headCells.map((cell) => (
                        <TableCell
                          sx={{
                            maxHeight: "3rem",
                            width: cell.id === "description" ? "15rem" : "5rem",
                          }}
                        >
                          {_.get(item, cell.id, "-")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={workitems.length}
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

  if (session?.user?.role !== "Civil") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const workitems = await prisma.workItem.findMany();

  const workorders = await prisma.workorder.findMany();
  const contractors = await prisma.contractor.findMany({
    include: {
      workorders: true,
    },
  });

  //   if (session?.user?.role !== "Admin") {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   } else {
  return {
    props: {
      workitems: workitems,
      workorders: workorders,
      contractors: contractors,
    },
  };
  //   }
};

// <Head>
//   <title>Attendance</title>
//   <meta name="description" content="Generated by create next app" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <link rel="icon" href="/favicon.ico" />
// </Head>
