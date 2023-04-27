import FormSelect from "@/ui-component/FormSelect";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Contractor, Employee } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

export default function ManPowerReport() {
  const [department, setDepartment] = useState("8HR");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/report?type=manpower&department=${department}`
    );
    console.log(res);

    const tableRows = [
      [
        "employeeid",
        "Employee",
        "Contractor Name",
        "Designation",
        "Department",
        "Gender",
        "Basic Salary",
        "Email",
      ],
    ];
    res.data.forEach((item: Employee) => {
      tableRows.push([
        item.employeeId.toString(),
        item.employeename,
        item.contractorname,
        item.designation,
        item.department,
        item.gender,
        item.basicsalary.toString(),
        item?.emailid as string,
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ManPowerReport.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Man Power Report</Typography>
      <Stack sx={{ maxWidth: "7rem" }} spacing={3}>
        <FormSelect
          value={department}
          handleChange={(v) => setDepartment(v as string)}
          options={[
            { value: "8HR", label: "8HR" },
            { value: "12HR", label: "12HR" },
            { value: "CCM", label: "CCM" },
            { value: "LRF", label: "LRF" },
            { value: "Colony", label: "Colony" },
          ]}
          label="Select  the Department"
        />
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Print
          {loading && (
            <CircularProgress size={15} sx={{ ml: 1, color: "#364152" }} />
          )}
        </Button>
      </Stack>
    </Stack>
  );
}
