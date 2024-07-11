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
import {
  Contractor,
  User,
  MeasurementItem,
  Workorder,
  Measurement,
  Project,
  BOQItem,
  BOQ,
  Qcs,
  BarBendingItem,
  BarBending,
  QcsBoq,
  QcsBoqItem,
} from "@prisma/client";
import EditUser from "@/components/Admin/EditUser";
// import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import _ from "lodash";
import FormSelect from "@/ui-component/FormSelect";
import PrintExcel from "@/components/PrintAbstractSheet";
import { getAbstractSheet } from "@/utils/civil/getAbstractSheet";
import dayjs from "dayjs";
import AutoComplete from "@/ui-component/Autocomplete";
import MonthSelect from "@/ui-component/MonthSelect";

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
  createHeadCells("prevQuantity", "Previous Bill Quantity", false, false, 15),
  createHeadCells("currentQuantity", "Current Bill Quantity", false, false, 15),
  createHeadCells("totalQuantity", "Total Quantity", false, false, 15),
  createHeadCells("balance", "Balance Quantity", false, false, 15),
  createHeadCells("prevBill", "Value of Previous Bill", false, false, 15),
  createHeadCells("currentBill", "Value of Current Bill", false, false, 15),
  createHeadCells("totalBill", "Value of Total Bill", false, false, 15),
  createHeadCells("balanceBill", "Balance Bill", false, false, 15),
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

interface worktype extends QcsBoq {
  measurementItems: MeasurementItem[];
  contractor: Contractor;
}

interface contractors extends Contractor {
  Qcs: (Qcs & { project: Project })[];
}

interface Boq extends QcsBoq {
  BOQItems: (QcsBoqItem & {
    measurementItems: (MeasurementItem & { measurement: Measurement })[];
    barBendingItems: (BarBendingItem & { barBending: BarBending })[];
  })[];
}

export default function AbstractSheet({
  contractors,
  contractorId,
  projectId,
}: {
  contractors: contractors[];
  contractorId: string;
  projectId: string;
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [month, setMonth] = React.useState(dayjs().format("MM/YYYY"));
  const [boqs, setBoqs] = React.useState<Boq[]>([]);

  const router = useRouter();

  const fetchBoqs = async () => {
    const res = await axios.get(
      "/api/civil/abstract?contractorId=" +
        contractorId +
        "&projectId=" +
        projectId
    );
    setBoqs(res.data?.BOQ ?? []);
  };

  React.useEffect(() => {
    fetchBoqs();
  }, [contractorId, projectId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const contractor1 = contractors.find((v) => v.contractorId === contractorId);
  const qcs =
    contractor1 && contractor1?.Qcs.length > 0
      ? contractor1?.Qcs.find((v) => v.projectId === projectId)
      : undefined;
  const info = [
    { value: contractor1?.contractorname, label: "Name of Contractor" },
    { value: qcs?.project?.name, label: "Nature of Work" },
    { value: qcs?.project?.place, label: "Location" },
  ];

  const rows = React.useMemo(
    () => getAbstractSheet({ boqs, month }),
    [boqs, month]
  );

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "1rem",
            alignItems: "center",
          }}
        >
          <Stack direction="column" spacing={3}>
            <Stack direction="row" spacing={3}>
              <AutoComplete
                setValue={(v) => {
                  const c = contractors.find((f) => f.contractorId === v);
                  router.push(
                    `/civil/abstract?contractorId=${v}&projectId=${c?.Qcs[0]?.projectId}`
                  );
                }}
                options={contractors.map((v) => ({
                  label: v.contractorname,
                  value: v.contractorId,
                }))}
                label="Contractor"
                value={contractorId}
              />
              <AutoComplete
                setValue={(v) => {
                  router.push(
                    `/civil/abstract?contractorId=${contractorId}&projectId=${v}`
                  );
                }}
                options={
                  contractor1?.Qcs.map((v) => ({
                    label: v.project.name,
                    value: v.projectId,
                  })) ?? []
                }
                label="Project"
                value={projectId}
              />
              <MonthSelect
                label="Select Month"
                value={dayjs(month, "MM/YYYY")}
                onChange={(e) => {
                  setMonth(e?.format("MM/YYYY") || "");
                }}
              />
            </Stack>

            {contractor1 && contractor1?.Qcs?.length > 0 && (
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
        </Box>
        <TableContainer
          sx={{
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
              numSelected={0}
              onSelectAllClick={() => {}}
              rowCount={boqs.length}
              headCells={headCells}
              align="center"
            />
            <TableBody>
              {rows.map((row) => (
                <>
                  <TableRow>
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
                  {row.BOQItems.map((item) => (
                    <TableRow>
                      {headCells.map((cell) => (
                        <TableCell
                          sx={{
                            maxHeight: "3rem",
                            width: cell.id === "description" ? "15rem" : "5rem",
                          }}
                          align="center"
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
          count={boqs.length}
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

  let { contractorId, projectId, month } = context.query;

  const contractors = await prisma.contractor.findMany({
    include: {
      Qcs: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!contractorId) {
    contractorId = contractors.filter((f) => f.Qcs.length > 0)[0]?.contractorId;
  }

  if (!projectId) {
    projectId = contractors.find((f) => f.contractorId === contractorId)?.Qcs[0]
      ?.projectId;
  }

  if (!month) {
    month = dayjs().format("MM/YYYY");
  }

  return {
    props: {
      contractors: contractors,
      projectId: projectId || null,
      contractorId: contractorId || null,
    },
  };
};
