import Close from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { Contractor } from "@prisma/client";
import axios from "axios";
import _ from "lodash";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Typography } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function ImportData({
  contractors,
  type,
}: {
  contractors: Contractor[];
  type?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [contractor, setContractor] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<any[]>([]);

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
        setOpenModal(true);
        setData(data);
        // importing(data);
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

  const getDate = (excelDate: number | string) => {
    let d = 0;
    let date: Date;
    if (typeof excelDate === "string") {
      date = new Date(excelDate);
    } else {
      date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    }
    // const excelDate = 44986;
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const importing = async (data: any[]) => {
    console.log(data);

    const keys: string[] = [];

    const indices: number[] = [];

    data.forEach((d: any, index: number) => {
      [
        "Employee Name",
        "Employee Code",
        "Designation",
        "Department",
        "Att Status",
        "Attendance Date",
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

    const getAttendance = (attendance: string) => {
      if (attendance === "Present" || attendance === "P") {
        return "1";
      } else if (attendance === "1/2Present" || attendance === "1/2P") {
        return "0.5";
      } else {
        return "0";
      }
    };

    const selected = contractors.find((c) => c.contractorId === contractor);

    console.log(data, "data");

    const body = data.map((data: any) => {
      return {
        contractorid: selected?.contractorId,
        contractorname: selected?.contractorname,
        employeeid: _.get(data, "Employee Code")?.toString(),
        employeename: _.get(data, "Employee Name"),
        designation: data.Designation,
        department: data.Department,
        machineInTime: _.get(data, "In Time", "00:00"),
        machineOutTime: _.get(data, "Out Time", "00:00"),
        machineshift: _.get(data, "Shift Code") || "-",
        attendance: getAttendance(_.get(data, "Att Status")) || "0",
        // attendance: _.get(data, "Att Status")?.toString() || "0",
        attendancedate: getDate(_.get(data, "Attendance Date"))?.toString(),
        overtime:
          parseFloat(_.get(data, "Over Time", "00:00")?.slice(0, 2)) || 0,
        machineduration: _.get(data, "Duration", "00:00"),
        eleave: data.e_leave || "0",
        gender: data.gender || "Male",
      };
    });

    setLoading(true);
    if (type === "update") {
      const res = await axios
        .post("/api/importdata?type=timekeeper&update=true", body)
        .then((res) => {
          setError(false);
          handleClick();
          // set
        })
        .catch((err) => {
          setMessage("Please Provide Valid Data");
          setError(true);
          handleClick();
        });
    } else {
      const res = await axios
        .post("/api/importdata?type=timekeeper", body)
        .then((res) => {
          setError(false);
          handleClick();
          // set
        })
        .catch((err) => {
          setMessage("Please Provide Valid Data");
          setError(true);
          handleClick();
        });
    }
    // console.log(body);

    setLoading(false);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography sx={{ cursor: "pointer" }} component="label">
        {type === "update" ? "Update" : "Upload"}
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
      </Typography>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setContractor(null);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Select the Contractor</FormLabel>
                <Select
                  placeholder="Select the Contractor"
                  value={contractor}
                  onChange={(e) => setContractor(e.target.value as string)}
                >
                  {contractors
                    .map((c) => ({
                      value: c.contractorId,
                      label: c.contractorname,
                    }))
                    ?.map((option) => (
                      <MenuItem value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                disabled={Boolean(!contractor)}
                onClick={() => {
                  importing(data);
                  setOpenModal(false);
                  setContractor(null);
                }}
              >
                {type === "update" ? "Update" : "Upload"}
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Stack>
  );
}

export default ImportData;
