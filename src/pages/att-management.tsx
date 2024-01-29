import prisma from "@/lib/prisma";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import axios from "axios";
import FormSelect from "@/ui-component/FormSelect";
import Close from "@mui/icons-material/Close";
import Warning from "@mui/icons-material/Warning";

export default function AttedanceManagement({
  contractors,
}: {
  contractors: { label: string; value: string }[];
}) {
  const [contractorId, setContractorId] = useState<string>(
    contractors[0].value || ""
  );
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [status, setStatus] = useState<string>("NoChanges");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [type, setType] = useState<"success" | "error">("success");

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const getCount = async () => {
    setLoading(true);
    console.log(startDate, endDate);
    const dates = [];

    let currentDate = startDate;
    while (currentDate?.isBefore(endDate) || currentDate?.isSame(endDate)) {
      dates.push(currentDate.format("DD/MM/YYYY"));
      currentDate = currentDate.add(1, "day");
    }

    if (dates.length === 0) return;
    if (!contractorId) return;
    if (!status) return;
    try {
      const res = await axios.get(
        "/api/manager" +
          `?contractorId=${contractorId}` +
          `&dates=${dates}` +
          `&status=${status}`
      );

      setCount(res.data.count);
      setOpen1(true);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    console.log(startDate, endDate);
    const dates = [];

    let currentDate = startDate;
    while (currentDate?.isBefore(endDate) || currentDate?.isSame(endDate)) {
      dates.push(currentDate.format("DD/MM/YYYY"));
      currentDate = currentDate.add(1, "day");
    }

    if (dates.length === 0) return;
    if (!contractorId) return;
    if (!status) return;
    try {
      await axios.put("/api/manager", {
        contractorId: contractorId,
        dates: dates,
        status: status,
      });
      setType("success");
    } catch (err) {
      console.log(err);
      setType("error");
    }
    setOpen1(false);
    setOpen(true);
    setLoading(false);
  };

  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Typography variant="h3" sx={{ p: 2, m: 0, fontWeight: "500" }}>
        Attendance Management
      </Typography>
      <Stack spacing={2} direction="row" mt={2}>
        <Box sx={{ minWidth: 240 }}>
          <FormLabel>Select Contractor</FormLabel>
          <Autocomplete
            options={contractors}
            value={contractors.find((c) => c.value === contractorId) || null}
            onChange={(e, value) => setContractorId(value?.value as string)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ minWidth: 240, display: "flex", flexDirection: "column" }}>
            <FormLabel>Start Date</FormLabel>
            <DatePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={endDate}
              format="DD/MM/YYYY"
            />
          </Box>
          <Box sx={{ minWidth: 240, display: "flex", flexDirection: "column" }}>
            <FormLabel>End Date</FormLabel>
            <DatePicker
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate}
              format="DD/MM/YYYY"
            />
          </Box>
        </LocalizationProvider>
        <FormSelect
          value={status}
          handleChange={(e) => setStatus(e as string)}
          label="Status"
          options={[
            { label: "Approved", value: "Approved" },
            { label: "Rejected", value: "Rejected" },
            { label: "No Changes", value: "NoChanges" },
          ]}
          placeholder="Select Status"
          sx={{ maxWidth: 240 }}
        />
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => getCount()}
      >
        Delete Attendance
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        color="success"
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: type === "success" ? "success.main" : "error.main",
          },
        }}
        onClose={handleClose}
        message={
          type === "success"
            ? "Data Deleted Successfully"
            : "Error while Deleting Data"
        }
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </React.Fragment>
        }
      />
      <Dialog
        open={open1}
        onClose={() => setOpen1(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 1, fontSize: "1rem" }}>
          <IconButton>
            <Warning color="error" />
          </IconButton>
          Confirm the action
        </DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={() => setOpen1(false)}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>
            Are you sure, you want to delete the Attendance of {count} records?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ m: 1 }}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setOpen1(false)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={(event) => handleDelete()}
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
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (session?.user?.role !== "Manager") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany();

  return {
    props: {
      contractors: contractors.map((c) => ({
        label: c.contractorname,
        value: c.contractorId,
      })),
    },
  };
};
