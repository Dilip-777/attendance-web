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
import { Works, WorkItem, Contractor, Workorder } from "@prisma/client";
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

interface worktypes extends Works {
  workItems: WorkItem[];
  contractor: Contractor;
}

interface contractor extends Contractor {
  workorders: Workorder[];
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
  createHeadCells("nos", "Nos", true, false),
  createHeadCells("length", "Lenght (M)", true, false),
  createHeadCells("breadth", "Breadth (M)", true, false),
  createHeadCells("height", "Height (M)", true, false),
  createHeadCells("quantity", "Quantity", true, false),
  createHeadCells("remarks", "Remarks", false, false),
];

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function Row(props: { row: worktypes; handleOpen: (id: string) => void }) {
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
              onClick={() => router.push("/civil/measurement/" + row.id)}
              sx={{ m: 0 }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <Tooltip title="Add Work Item">
              <IconButton
                onClick={() => props.handleOpen(row.id)}
                sx={{ m: 0 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
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
                  {row.workItems.map((w) => (
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
  contractors: contractor[];
}) {
  // const [contractors, setContractors] = React.useState<Contractor[]>([]);
  const [open, setOpen] = React.useState(false);
  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0].contractorId : undefined
  );

  const [selected, setSelected] = React.useState("");

  const [works, setWorks] = React.useState<worktypes[]>([]);

  const router = useRouter();

  // const fetchContractors = async () => {
  //   const res = await axios.get("/api/hr/contractors");
  //   setContractors(res.data);
  //   setContractor(res.data[0]?.id);
  // };

  const fetchWorks = async () => {
    const res = await axios.get("/api/works?contractorid=" + contractor);
    setWorks(res.data);
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
  React.useEffect(() => {
    // fetchContractors();
    fetchWorks();
  }, [contractor]);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* <EnhancedTableToolbar
          numSelected={selected.length}
          filtername={props.filterName}
          setFilterName={props.setFilterName}
          handleClickReport={props.handleClickReport}
          type={props.type}
          upload={props.upload}
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
            {contractor1 && contractor1?.workorders.length > 0 && (
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
            onClick={() => router.push("/civil/measurement/add")}
            variant="contained"
          >
            Add
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "calc(100vh - 11rem)",
            pb: 10,
            overflowY: "auto",
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
          <Table aria-label="collapsible table">
            {/* <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead> */}
            <EnhancedTableHead
              headCells={headCells}
              numSelected={0}
              rowCount={0}
              align="center"
            />
            <TableBody>
              {works.length > 0 ? (
                works.map((row) => (
                  <Row
                    key={row.description}
                    row={row}
                    handleOpen={(id) => {
                      setOpen(true);
                      setSelected(id);
                    }}
                  />
                ))
              ) : contractors.find((v) => v.contractorId === contractor)
                  ?.workorders.length === 0 ? (
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
      <AddMeasurement
        open={open}
        handleClose={() => setOpen(false)}
        selected={contractor}
        works={works}
        contractor={contractor as string}
        selectedWork={selected}
        fetchWorks={fetchWorks}
      />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { id } = context.query;

  if (session?.user?.role !== "Civil") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany({
    include: {
      workorders: true,
    },
  });

  return {
    props: {
      contractors,
    },
  };
};
