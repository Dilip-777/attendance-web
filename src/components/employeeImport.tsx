import Close from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { Department, Designations } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import shortid from "shortid";
import * as XLSX from "xlsx";

function ImportData({
  departments,
  designations,
}: {
  departments: Department[];
  designations: Designations[];
}) {
  // on change states
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [key, setKey] = useState(0);

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

  const importing = async (data: any) => {
    const keys: string[] = [];

    const indices: number[] = [];

    data.forEach((d: any, index: number) => {
      const department = departments.find(
        (dept) => dept.department === d["Department"]
      );
      const designation = designations.find(
        (desc) => desc.designation === d["Designation"]
      );
      if (!department || !designation) {
        if (!indices.includes(index + 1)) {
          indices.push(index + 1);
        }
        if (!keys.includes("department or designation")) {
          keys.push("department or designation");
        }
      }
      [
        "Contractor Name",
        "Contractor ID",
        "Employee Name",
        "Employee ID",
        "Designation",
        "Department",
        "Phone Number",
      ].forEach((key) => {
        if (!d[key]) {
          if (keys.indexOf(key) === -1) {
            keys.push(key);
          }
          if (!indices.includes(index + 1)) {
            indices.push(index + 1);
          }
        }
      });
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
      const department = departments.find(
        (d) => d.department === data["Department"]
      );
      const designation = designations.find(
        (d) =>
          d.designation === data["Designation"] &&
          d.departmentId === department?.id
      );
      // if (!department || !designation) {
      //   return null;
      // }
      return {
        employeeId: data["Employee ID"].toString(),
        employeename: data["Employee Name"],
        contractorname: data["Contractor Name"],
        contractorId: data["Contractor ID"].toString(),
        designationId: designation?.id,
        departmentId: department?.id,
        gender: data["Gender"] || "Male",
        phone: data["Phone Number"]?.toString() || "",
        emailid: data["Email"] || "",
        basicsalary_in_duration: data["Basic Salary In Duration"] || "",
        basicsalary: data["basic Salary"] || 0,
        allowed_wrking_hr_per_day: data["Allowed Working Hours Per Day"] || 0,
        servicecharge: data["Service Charge"] || 0,
        gst: data["GST"] || 0,
        tds: data["TDS"] || 0,
      };
    });
    setLoading(true);
    console.log(body);

    const res = await axios
      .post("/api/importdata?type=employee", body)
      .then((res) => {
        setError(false);
        handleClick();
      })
      .catch((err) => {
        setMessage("Please Provide Valid Data");
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
          hidden
          key={key}
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

export default ImportData;
