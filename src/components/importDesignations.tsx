import Close from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

import axios from "axios";
import React, { useState } from "react";
import shortid from "shortid";
import * as XLSX from "xlsx";

function ImportDesignations({
  fetchDesignations,
}: {
  fetchDesignations: () => void;
}) {
  // on change states
  const [excelFile, setExcelFile] = useState<string | ArrayBuffer | null>(null);
  const [excelFileError, setExcelFileError] = useState<string | null>("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [message, setMessage] = useState("");

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  const fileType = ["application/vnd.xlsx", "application/vnd.ms-excel"];
  const handleFile = (e: any) => {
    let selectedFile = e.target.files[0];
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

    const keys: string[] = [];

    const indices: number[] = [];

    data.forEach((d: any, index: number) => {
      ["Department Id", "Department Name", "Designation", "Gender"].forEach(
        (key) => {
          if (!d[key]) {
            if (keys.indexOf(key) === -1) {
              keys.push(key);
            }
            if (!indices.includes(index + 1)) {
              indices.push(index + 1);
            }
          }
        }
      );
    });

    if (keys.length > 0) {
      setMessage(
        `Please check the following keys: ${keys.join(
          ", "
        )} at rows: ${indices.join(", ")}`
      );
      setError(true);
      handleClick();
      return;
    }

    const body = data.map((data: any) => {
      let id = data["Designation"];
      id = id.replace(/\s+/g, "").toLowerCase();
      if (data["Gender"] === "Male") {
        id = "m" + id;
      } else if (data["Gender"] === "Female") id = "f" + id;
      return {
        id: shortid.generate(),
        departmentId: data["Department Id"],
        designationid: id,
        departmentname: data["Department Name"],
        designation: data["Designation"],
        basicsalary: data["Basic Salary"] || 0,
        gender: data["Gender"] || "Both",
        allowed_wrking_hr_per_day: data["Allowed Working Hours Per Day"] || 0,
        servicecharge: data["Service Charge"],
        basicsalary_in_duration: data["Salary Duration"],
      };
    });
    setLoading(true);
    const res = await axios
      .post("/api/importdata?type=designation", body)
      .then((res) => {
        setError(false);
        fetchDesignations();
        handleClick();
      })
      .catch((err) => {
        setMessage(err.response.data.message || "Please Provide Valid Data");
        setError(true);
        handleClick();
      });
    setLoading(false);
  };

  // new Date(timeValue * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "rgb(103, 58, 183)",
          ":hover": { backgroundColor: "rgb(103, 58, 183)" },
        }}
        disabled={loading}
        component="label"
      >
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
          {error ? message : "Data Uploaded Successfully"}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default ImportDesignations;