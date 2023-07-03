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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  Stack,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { Automobile, Contractor, Workorder } from "@prisma/client";
import EnhancedTableHead from "@/components/Table/EnhancedTableHead";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import Done from "@mui/icons-material/Done";
import FormSelect from "@/ui-component/FormSelect";
import dayjs, { Dayjs } from "dayjs";
import MonthSelect from "@/ui-component/MonthSelect";
import getAutomobile from "@/utils/getAutomobile";
import _ from "lodash";
import TextEditor from "@/ui-component/TextEditor";

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
  createHeadCells("date", "Date", false, false),
  createHeadCells("openingMeterReading", "Opening Meter Reading", false, false),
  createHeadCells("closingMeterReading", "Close Meter Reading", false, false),
  createHeadCells("totalRunning", "Total Running", false, false),
  createHeadCells(
    "hsdIssuedOrConsumed",
    "HSD Issued Or Consumed",
    false,
    false
  ),
  createHeadCells("maintenanceTime", "Maintenance Time", false, false),
  createHeadCells("breakdownTime", "Break Down Time", false, false),
  createHeadCells(
    "breakDownDaysCounted",
    "Breakdown Days Counted",
    false,
    false
  ),
  createHeadCells(
    "reasonBehindBreakDown",
    "Reason Behind Breakdown",
    true,
    false
  ),
  createHeadCells("remarks", "Remarks", false, false),
  createHeadCells("status", "Status", false, false),
];

interface EnhancedTableToolbarProps {
  contractors: Contractor[];
  workorders: Workorder[];
  contractor: string | undefined;
  setContractor: React.Dispatch<React.SetStateAction<string | undefined>>;
  month: string;
  monthChange: (value: Dayjs | null) => void;
  changes: any[];
  loading: boolean;
  handleSave: () => Promise<void>;
  handleDiscard: () => void;
  rate: string;
  setRate: React.Dispatch<React.SetStateAction<string>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    contractor,
    setContractor,
    contractors,
    month,
    monthChange,
    changes,
    loading,
    handleSave,
    handleDiscard,
    rate,
    setRate,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <FormSelect
          label="Contractor"
          value={contractor as string}
          handleChange={(e) => setContractor(e as string)}
          options={contractors.map((contractor) => ({
            label: contractor.contractorname,
            value: contractor.contractorId,
          }))}
        />
        <MonthSelect
          label="Select Month"
          value={dayjs(month, "MM/YYYY")}
          onChange={monthChange}
        />
        <FormSelect
          label="Rate"
          value={rate as string}
          handleChange={(v) => setRate(v as string)}
          options={[
            { label: "kms", value: "kms" },
            { label: "day", value: "day" },
            { label: "hrs", value: "hrs" },
          ]}
        />
      </Stack>
      {changes.length > 0 && (
        <Stack direction="row" spacing="1rem">
          <Button
            variant="contained"
            onClick={() => handleSave()}
            disabled={loading}
          >
            Save
            {loading && (
              <CircularProgress size={15} sx={{ ml: 1, color: "#364152" }} />
            )}
          </Button>
          <Button variant="outlined" disabled={loading} onClick={handleDiscard}>
            Cancel
          </Button>
        </Stack>
      )}
    </Toolbar>
  );
}

export default function Vehiclelogbook({
  workorders,
  contractors,
}: {
  workorders: Workorder[];
  contractors: Contractor[];
}) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterName, setFilterName] = React.useState("");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedWorkorder, setSelectedWorkorder] = React.useState<
    string | undefined
  >(undefined);
  const [month, setMonth] = React.useState<string>(dayjs().format("MM/YYYY"));
  const [automobiles, setAutomobiles] = React.useState<Automobile[]>([]);
  const [changes, setChanges] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<any[]>([]);
  const [discard, setDiscard] = React.useState(false);
  const { data: session } = useSession();
  const [rate, setRate] = React.useState("kms");

  React.useEffect(() => {
    if (rate != "kms") {
      headCells[1] = {
        id: "startTime",
        label: "Start Time",
        included: false,
        numeric: false,
      };
      headCells[2] = {
        id: "endTime",
        label: "End Time",
        included: false,
        numeric: false,
      };
    } else {
      headCells[1] = {
        id: "openingMeterReading",
        label: "Opening Meter Reading",
        included: false,
        numeric: false,
      };
      headCells[2] = {
        id: "closingMeterReading",
        label: "Close Meter Reading",
        included: false,
        numeric: false,
      };
    }

    // if(rate )
    // setLoading(true);
    // if (rate != "kms") {
    //   headCells[1] = {
    //     id: "startTime",
    //     label: "Start Time",
    //     included: false,
    //     numeric: false,
    //   };
    //   headCells[2] = {
    //     id: "endtime",
    //     label: "End Time",
    //     included: false,
    //     numeric: false,
    //   };
    // } else {
    //   headCells[1] = {
    //     id: "openingMeterReading",
    //     label: "Opening Meter Reading",
    //     included: false,
    //     numeric: false,
    //   };
    //   headCells[2] = {
    //     id: "closingMeterReading",
    //     label: "Close Meter Reading",
    //     included: false,
    //     numeric: false,
    //   };
    // }
    // setLoading(false);
  }, [rate]);

  React.useEffect(() => {
    if (session?.user?.role === "PlantCommercial") {
      if (!headCells.find((headCell) => headCell.id === "action"))
        headCells.push(createHeadCells("action", "Action", false, true));
    }
  }, [session]);

  const handleClose = () => {
    setOpen(false);
    setSelectedWorkorder(undefined);
  };

  const [contractor, setContractor] = React.useState<string | undefined>(
    contractors.length > 0 ? contractors[0].contractorId : undefined
  );
  const [workorder, setWorkOrder] = React.useState<string | undefined>(
    rows.length > 0 ? workorders[0].id : undefined
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = workorders.map((n) => n.contractorName);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/vehiclelogbook", {
        changes,
        contractorId: parseInt(contractor as string),
        month: month,
      });
    } catch (error) {
      console.log(error);
    }
    await fetchAutomobiles();
    await fetchAutomobiles();
    // setLoading(false);
    setChanges([]);
  };

  const handleApprove = async (data: any) => {
    setLoading(true);
    try {
      await axios.put("/api/vehiclelogbook", {
        ...data,
        status: "Approved",
      });
    } catch (error) {
      console.log(error);
    }
    await fetchAutomobiles();
    // console.log(data, "jhghjgjghjgfghfghf");

    setLoading(false);
  };

  const handleReject = async (data: any) => {
    setLoading(true);
    // console.log(data);

    try {
      await axios.put("/api/vehiclelogbook", {
        id: data.id,
        contractorId: data.contractorId,

        workorderId: data.workorderId,
        status: "Rejected",
      });
    } catch (error) {
      console.log(error);
    }
    await fetchAutomobiles();
    setLoading(false);
  };

  console.log(changes);

  const handleDiscard = () => {
    setChanges([]);
    fetchAutomobiles();
    setDiscard(true);
  };

  const handleChange = (
    value: string,
    date: string,
    field: string,
    nextdate: string
  ) => {
    if (discard) {
      setDiscard(false);
    }
    let v: string | number = value;
    if (
      field === "openingMeterReading" ||
      field === "closingMeterReading" ||
      field === "breakDownDaysCounted" ||
      field === "totalRunning"
    ) {
      v = Number(value);
    }
    if (field === "closingMeterReading" || field === "endTime") {
      const nextIndex = changes.findIndex((e) => e.date === nextdate);
      if (nextIndex !== -1) {
        const newEditedValues = [...changes];
        if (field === "closingMeterReading")
          newEditedValues[nextIndex]["openingMeterReading"] = v;
        if (field === "endTime") newEditedValues[nextIndex]["startTime"] = v;

        setChanges(newEditedValues);
      } else {
        setChanges((c) => [
          ...c,
          {
            date: nextdate,
            ...rows.find((e) => e.date === nextdate),
            [field === "closingMeterReading"
              ? "openingMeterReading"
              : "startTime"]: v,
            contractorId: contractor as string,
          },
        ]);
      }
    }
    const index = changes.findIndex((e) => e.date === date);

    if (index === -1) {
      setChanges((c) => [
        ...c,
        {
          date: date,
          ...rows.find((e) => e.date === date),
          [field]: v,
          contractorId: contractor as string,
        },
      ]);
    } else {
      const newEditedValues = [...changes];
      newEditedValues[index][field] = v;
      setChanges(newEditedValues);
    }
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

  const fetchAutomobiles = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/vehiclelogbook?month=${month}&contractor=${contractor}`
    );
    setAutomobiles(res.data);
    const r = getAutomobile(
      res.data,
      dayjs(month, "MM/YYYY").month() + 1,
      dayjs(month, "MM/YYYY").year()
    );
    setRows(r);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAutomobiles();
  }, [contractor, month, rate]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  console.log(rows);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          contractors={contractors}
          workorders={workorders}
          contractor={contractor}
          setContractor={setContractor}
          month={month}
          monthChange={(value: Dayjs | null) =>
            setMonth(value?.format("MM/YYYY") || "")
          }
          changes={changes}
          loading={loading}
          handleSave={handleSave}
          handleDiscard={handleDiscard}
          rate={rate}
          setRate={setRate}
        />
        {/* <TextEditor /> */}
        <TableContainer
          sx={{
            maxHeight: "68vh",
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
              rowCount={rows.length}
              headCells={headCells}
              nocheckbox={true}
              align="center"
            />
            {!loading && (
              <TableBody>
                {rows
                  // .filter((employee) =>
                  //   employee.contractorName
                  //     .toLowerCase()
                  //     .includes(filterName.toLowerCase())
                  // )
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id as string);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox"></TableCell>

                        {headCells.map(
                          (cell, index) =>
                            !cell.included && (
                              <TableCell
                                id={labelId}
                                scope="row"
                                padding="none"
                                align="center"
                                sx={{ minWidth: 150 }}
                              >
                                <TextEditor
                                  handleChange={handleChange}
                                  field={cell.id}
                                  date={row.date}
                                  value={_.get(row, cell.id, "-")}
                                  type={
                                    cell.id === "openingMeterReading" ||
                                    cell.id === "closingMeterReading" ||
                                    cell.id === "totalRunning" ||
                                    cell.id === "breakDownDaysCounted"
                                      ? "number"
                                      : "text"
                                  }
                                  discard={discard}
                                  setDiscard={setDiscard}
                                />
                              </TableCell>
                            )
                        )}
                        {session?.user?.role === "PlantCommercial" &&
                          row.status === "Pending" && (
                            <TableCell size="small" align="center">
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{ color: "#673AB7" }}
                              >
                                <Button onClick={() => handleApprove(row)}>
                                  <Done sx={{ color: "#673AB7" }} />
                                </Button>
                                <Button onClick={() => handleReject(row)}>
                                  <Close sx={{ color: "#673AB7" }} />
                                </Button>
                              </Box>
                            </TableCell>
                          )}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
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
            Are you sure, you want to delete selected stream
          </Typography>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button color="primary" variant="outlined" onClick={handleClose}>
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

  if (session.user?.role === "Admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const workorders = await prisma.workorder.findMany();
  const contractors = await prisma.contractor.findMany();
  return {
    props: {
      workorders,
      contractors,
    },
  };
};
