import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import {
  Contractor,
  BarBending,
  BarBendingItem,
  Workorder,
  Project,
  Qcs,
} from "@prisma/client";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import FormSelect from "@/ui-component/FormSelect";
import AddMeasurement from "@/components/Civil/addmeasurement";
import axios from "axios";
import _, { set } from "lodash";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import AddBarBending from "@/components/Civil/AddBarbending";

interface barbendingtypes extends BarBending {
  barbendingItems: BarBendingItem[];
  contractor: Contractor;
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
  createHeadCells("description", "Work Description", false, false),
  createHeadCells("contractorid", "Contractor", false, false),
  createHeadCells("date", "Date", false, false),
  createHeadCells("totalAmount", "Total Amount", true, false),

  createHeadCells("action", "Action", false, true),
];

const headcells1 = [
  createHeadCells("barmark", "Bar Mark", false, false),
  createHeadCells("description", "Work Description", false, false),
  createHeadCells("diamark", "Dia Mark", false, false),
  createHeadCells("noofequipment", "No of Equipments", true, false),
  createHeadCells("costperequipment", "Per Equipment", true, false),
  createHeadCells("totalcost", "Total Used", true, false),
  createHeadCells("a", "A (M)", true, false),
  createHeadCells("b", "B (M)", true, false),
  createHeadCells("c", "C (M)", true, false),
  createHeadCells("d", "D (M)", true, false),
  createHeadCells("e", "E (M)", true, false),
  createHeadCells("f", "F (M)", true, false),
  createHeadCells("g", "G (M)", true, false),
  createHeadCells("h", "H (M)", true, false),
  createHeadCells("cuttinglength", "Cutting Length", true, false),
  createHeadCells("totalLength", "Total Length", true, false),
  createHeadCells("unitweight", "Unit Weight", true, false),
  createHeadCells("totalweight", "Total Weight", true, false),
  createHeadCells("remarks", "Remarks", false, false),
];

interface contractors extends Contractor {
  Qcs: (Qcs & { project: Project })[];
}

function Row(props: {
  row: barbendingtypes;
  handleOpen: (id: string) => void;
}) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.description}
        </TableCell>
        <TableCell align="center">{row.contractor.contractorname}</TableCell>
        <TableCell align="center">{row.startDate || "-"}</TableCell>
        <TableCell align="center">{row.totalAmount}</TableCell>
        <TableCell size="small" align="right">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              onClick={() => router.push("/civil/barbending/" + row.id)}
              sx={{ m: 0 }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Stack>
        </TableCell>

        {/* <TableCell size="small" align="center">
          <Tooltip title="Add Work Item">
            <IconButton onClick={() => props.handleOpen(row.id)} sx={{ m: 0 }}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell> */}
        {/* <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                my: 1,
                overflowX: "auto",
                maxWidth: "calc(100vw - 400px)",
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
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#eeeeee", overflowX: "auto" }}>
                    {headcells1.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={"center"}
                        sx={{
                          fontWeight: "600",
                          bgcolor: "#eeeeee",
                        }}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.barbendingItems.map((w) => (
                    <TableRow key={w.id}>
                      {headcells1.map((headCell) => (
                        <TableCell align="center">
                          {_.get(w, headCell.id, "-")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Measurement({
  contractors,
}: {
  contractors: contractors[];
}) {
  const [open, setOpen] = React.useState(false);
  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0].contractorId : undefined
  );

  const [selected, setSelected] = React.useState("");

  const [barbending, setBarBending] = React.useState<barbendingtypes[]>([]);

  const router = useRouter();

  const contractor1 = contractors.find((v) => v.contractorId === contractor);
  const qcs =
    contractor1 && contractor1?.Qcs.length > 0
      ? contractor1?.Qcs[0]
      : undefined;
  const info = [
    { value: contractor1?.contractorname, label: "Name of Contractor" },
    { value: qcs?.project?.name, label: "Nature of Work" },
    { value: qcs?.project?.place, label: "Location" },
  ];

  const fetchBarBending = async () => {
    const res = await axios.get("/api/barbending?contractorid=" + contractor);
    setBarBending(res.data);
  };
  React.useEffect(() => {
    // fetchContractors();
    fetchBarBending();
  }, [contractor]);
  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
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
            {contractor1 && contractor1?.Qcs.length > 0 && (
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
          <Button
            onClick={() => router.push("/civil/barbending/add")}
            variant="contained"
          >
            Add
          </Button>
        </Box>
        <TableContainer
          sx={{
            // maxHeight: "calc(100vh - 11rem)",
            pb: 10,
            px: 2,
            // overflowY: "auto",
            // overflowX: "hidden",
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
          component={Paper}
        >
          <Table aria-label="collapsible table">
            <EnhancedTableHead
              headCells={headCells}
              numSelected={0}
              rowCount={0}
              align="center"
            />
            <TableBody>
              {barbending.length > 0 ? (
                barbending.map((row) => (
                  <Row
                    key={row.description}
                    row={row}
                    handleOpen={(id) => {
                      setOpen(true);
                      setSelected(id);
                    }}
                  />
                ))
              ) : contractors.find((v) => v.contractorId === contractor)?.Qcs
                  .length === 0 ? (
                <TableRow>
                  <TableCell align="left" colSpan={6}>
                    No Work Orders
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell align="left" colSpan={6}>
                    Nothing found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { id } = context.query;
  if (!session?.user?.role.includes('Civil')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany({
    where: {
      servicedetail: "Civil",
    },
    include: {
      Qcs: {
        include: {
          project: true,
        },
      },
    },
  });

  return {
    props: {
      contractors,
    },
  };
};
