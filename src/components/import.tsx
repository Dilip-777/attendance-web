import Close from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";

function ImportData() {
  // on change states
  const [excelFile, setExcelFile] = useState<string | ArrayBuffer | null>(null);
  const [excelFileError, setExcelFileError] = useState<string | null>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  const fileType = ["application/vnd.xlsx", "application/vnd.ms-excel"];
  const handleFile = (e: any) => {
    let selectedFile = e.target.files[0];
    console.log(selectedFile);
    console.log(e.target.files);

    if (selectedFile) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        console.log(e.target?.result);

        const workbook = XLSX.read(e.target?.result, { type: "buffer" });

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);
        importing(data);
      };
      setKey(key + 1);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const getDate = (excelDate: number) => {
    // const excelDate = 44986;
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const importing = async (data: any) => {
    console.log(data);

    const body = data.map((data: any) => {
      return {
        contractorid: data.contractor_id?.toString(),
        contractorname: data.contractor_name,
        employeeid: data.employee_id?.toString(),
        employeename: data.employee_name,
        designation: data.designation,
        department: data.department,
        machineInTime: data.machine_intime
          ? data.machine_intime === 0
            ? "00:00"
            : new Date(data.machine_intime * 24 * 60 * 60 * 1000)
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                ?.toString()
          : "Invalid Entry Time",
        machineOutTime: data.machine_outtime
          ? data.machine_outtime === 0
            ? "00:00"
            : new Date(data.machine_outtime * 24 * 60 * 60 * 1000)
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                ?.toString()
          : "Invalid Entry Time",
        machineshift: data.shift || "day",
        attendance: data.attendence?.toString() || "0",
        attendancedate: getDate(data.entry_date)?.toString(),
        overtime: data.overtime?.toString() || "0",
        machineduration: data.machine_duration
          ? data.machine_duration === 0
            ? "00:00"
            : new Date(data.machine_duration * 24 * 60 * 60 * 1000)
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                  timeZone: "UTC", // or specify the time zone you want to display
                })
                ?.toString()
          : "-",
        eleave: data.e_leave || "0",
        gender: data.gender || "M",
      };
    });
    setLoading(true);
    const res = await axios
      .post("/api/importdata?type=timekeeper", body)
      .then((res) => {
        setError(false);
        handleClick();
        // set
      })
      .catch((err) => {
        setError(true);
        handleClick();
      });

    setLoading(false);
  };

  // new Date(timeValue * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button disabled={loading} variant="contained" component="label">
        Upload
        {loading && (
          <CircularProgress size={15} sx={{ ml: 1, color: "#364152" }} />
        )}
        <input
          key={key}
          hidden
          type="file"
          className="form-control"
          onChange={handleFile}
          required
        />
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
      >
        <Alert
          onClose={handleClose}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error ? "Please Provide Valid Data" : "Data Uploaded Successfully"}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default ImportData;
