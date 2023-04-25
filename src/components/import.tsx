import { Close } from "@mui/icons-material";
import { Button, IconButton, Snackbar, Stack } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";

function ImportData() {
  // on change states
  const [excelFile, setExcelFile] = useState<string | ArrayBuffer | null>(null);
  const [excelFileError, setExcelFileError] = useState<string | null>("");
  const [open, setOpen] = useState(false);

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
      //   } else {
      //     setExcelFileError("Please select only excel file types");
      //     setExcelFile(null);
      //   }
      // } else {
      //   console.log("plz select your file");
      // }
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
        contractorid: data.contractor_id.toString(),
        contractorname: data.contractor_name,
        employeeid: data.employee_id.toString(),
        employeename: data.employee_name,
        designation: data.designation,
        department: data.department,
        machineInTime:
          new Date(data.machine_intime * 24 * 60 * 60 * 1000)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toString() || "8:00",
        machineOutTime:
          new Date(data.machine_outtime * 24 * 60 * 60 * 1000)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toString() || "17:00",
        machineshift: data.shift || "day",
        attendance: data.attendence.toString(),
        attendancedate: getDate(data.entry_date).toString(),
        overtime: data.overtime.toString(),
        eleave: data.e_leave || "0",
        gender: data.gender || "M",
      };
    });

    const res = await axios.post("/api/test", body).then((res) => {
      console.log(res);
      handleClick();
    });
  };

  // new Date(timeValue * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // submit function
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      importing(data);

      setExcelData(data as any);
    } else {
      setExcelData(null);
    }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button variant="contained" component="label">
        Upload
        <input
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
        message="Uploaded Successfully"
        action={action}
      />
    </Stack>
    // <div className="container">
    //   <div className="form">
    //     <form className="form-group" autoComplete="off" onSubmit={handleSubmit}>
    //       <label>
    //         <h5>Upload Excel file</h5>
    //       </label>
    //       <br></br>
    //       <input
    //         type="file"
    //         className="form-control"
    //         onChange={handleFile}
    //         required
    //       ></input>
    //       {excelFileError && (
    //         <div className="text-danger" style={{ marginTop: 5 + "px" }}>
    //           {excelFileError}
    //         </div>
    //       )}
    //       <button
    //         type="submit"
    //         className="btn btn-success"
    //         style={{ marginTop: 5 + "px" }}
    //       >
    //         Submit
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
}

export default ImportData;
