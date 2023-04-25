import FormSelect from "@/ui-component/FormSelect";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Contractor, Department, Employee } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

export default function DepartmentReport({
  departments,
}: {
  departments: Department[];
}) {
  const [department, setDepartment] = useState("8HR");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/report?type=department&department=${department}`
    );
    console.log(res);

    const tableRows = [
      [
        "contractorid",
        "Contractor Name",
        "Service Detail",
        "Supplier Detail",
        "Mobile Number",
        "Office Address",
        "Email",
      ],
    ];
    res.data.forEach((item: Contractor) => {
      tableRows.push([
        item.contractorId.toString(),
        item.contractorname,
        item.servicedetail,
        item.supplierdetail,
        item.mobilenumber,
        item.officeaddress || "-",
        (item?.emailid as string) || "-",
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "DepartmentReport.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Department Wise Report</Typography>
      <Stack sx={{ maxWidth: "7rem" }} spacing={3}>
        <FormSelect
          value={department}
          handleChange={(value) => setDepartment(value as string)}
          options={departments.map((item) => ({
            value: item.department,
            label: item.department,
          }))}
          label="Select the Department"
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
