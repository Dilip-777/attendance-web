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
import { Contractor, Project, BOQ, BOQItem, Qcs } from "@prisma/client";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import FormSelect from "@/ui-component/FormSelect";
import AddMeasurement from "@/components/Civil/addmeasurement";
import axios from "axios";
import _ from "lodash";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import AutoComplete from "@/ui-component/Autocomplete";

interface BOQWithItems extends BOQ {
  BOQItems: BOQItem[];
}

interface contractor extends Contractor {
  Qcs: (Qcs & { project: Project })[];
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
  createHeadCells("totalQuantity", "Total Quantity", true, false),
  createHeadCells("totalAmount", "Total Amount", true, false),
  createHeadCells("action", "Action", false, true),
];

const headcells1 = [
  createHeadCells("description", "Work Description", false, false),
  createHeadCells("unit", "Unit", false, false),
  createHeadCells("unitrate", "Rate", true, false),

  createHeadCells("quantity", "Quantity", true, false),
  createHeadCells("remarks", "Remarks", false, false),
];

function Row(props: { row: BOQWithItems; handleOpen: (id: string) => void }) {
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
        <TableCell align="center">contractor</TableCell>
        <TableCell align="center">{row.totalQuantity}</TableCell>
        <TableCell align="center">{row.totalAmount}</TableCell>
        <TableCell size="small" align="right">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              onClick={() => router.push("/civil/boq/" + row.id)}
              sx={{ m: 0 }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <Tooltip title="Add Measurement Item">
              <IconButton
                onClick={() => props.handleOpen(row.id)}
                sx={{ m: 0 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#eeeeee" }}>
                    {headcells1.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={"center"}
                        sx={{
                          fontWeight: "600",
                          bgcolor: "#eeeeee",
                          height: "4rem",
                        }}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.BOQItems.map((w) => (
                    <TableRow key={w.id}>
                      {headcells1.map((headCell) => (
                        <TableCell sx={{ py: "15px" }} align="center">
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

export default function Measurements({
  boq,
  projects,
  projectId,
}: {
  projects: Project[];
  boq: BOQWithItems[];

  projectId: string;
}) {
  // const [contractors, setContractors] = React.useState<Contractor[]>([]);
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = React.useState("");

  const router = useRouter();

  // const fetchWorks = async () => {
  //   const res = await axios.get("/api/works?contractorid=" + contractor);
  //   setWorks(res.data);
  // };

  // React.useEffect(() => {
  //   fetchWorks();
  // }, [contractor]);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          maxHeight: "calc(100vh - 6rem)",
          overflowY: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            height: 10,
            width: 9,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "1rem",
            alignItems: "center",
          }}
        >
          <Stack direction="column" spacing={3}>
            <Stack direction="row" spacing={2}>
              <AutoComplete
                setValue={(v) => {
                  router.push(`/civil/boq?projectId=${v}`);
                }}
                options={projects.map((v) => ({
                  label: v.name,
                  value: v.id,
                }))}
                label="Project"
                value={projectId}
              />
            </Stack>
            {/* {contractor1 && contractor1?.Qcs.length > 0 && (
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
            )} */}
          </Stack>
          <Button
            onClick={() => router.push("/civil/boq/add")}
            variant="contained"
            color="secondary"
          >
            Add
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{}}>
          <Table aria-label="collapsible table">
            <EnhancedTableHead
              headCells={headCells}
              numSelected={0}
              rowCount={0}
              align="center"
            />
            <TableBody>
              {boq.length > 0 ? (
                boq.map((row) => (
                  <Row
                    key={row.description}
                    row={row}
                    handleOpen={(id) => {
                      setOpen(true);
                      setSelected(id);
                    }}
                  />
                ))
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
      {/* <AddMeasurement
        open={open}
        handleClose={() => setOpen(false)}
        selected={contractor}
        works={works}
        contractor={contractor as string}
        selectedWork={selected}
        fetchWorks={fetchWorks}
      /> */}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  let { projectId } = context.query;

  if (session?.user?.role !== "Civil") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const projects = await prisma.project.findMany();

  if (projects.length === 0) {
    return {
      redirect: {
        destination: "/civil/project",
        permanent: false,
      },
    };
  }

  const where: any = {};

  if (projectId) {
    where.projectId = projectId as string;
  }

  const boq = await prisma.bOQ.findMany({
    where: where,
    include: {
      BOQItems: true,
    },
  });

  return {
    props: {
      boq,
      projectId: (projectId as string) || null,
      projects,
    },
  };
};
