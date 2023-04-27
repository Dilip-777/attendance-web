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
import { useEffect, useState } from "react";

export default function DesignationReport({
  designations,
}: {
  designations: string[];
}) {
  const [designation, setDesignation] = useState("8MW");
  const [loading, setLoading] = useState(false);

  // const departments = [
  //   "8MW",
  //   "20MW",
  //   "DM Plant",
  //   "QC",
  //   "STORE",
  //   "K7",
  //   "RMHS",
  //   "PS",
  //   "HK GARDEN",
  //   "SVR",
  //   "ELE",
  //   "LCO",
  //   "TMAN",
  //   "FILTER",
  //   "PO",
  //   "BCO",
  //   "SRFILTER",
  //   "INCHARGE",
  //   "MO",
  //   "SHIFTINCH",
  //   "GC",
  //   "SBO",
  //   "LMAN",
  //   "TMES",
  //   "JRELE",
  //   "HELPER",
  //   "Colony",
  // ];

  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/report?type=designation&designation=${designation}`
    );
    console.log(res);

    const tableRows = [
      [
        "employeeid",
        "Employee",
        "Contractor Name",
        "Department",
        "Designation",
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
        item.department,
        item.designation,
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
    link.setAttribute("download", "DesignationReport.csv");
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
          value={designation}
          handleChange={(v) => setDesignation(v as string)}
          options={designations.map((d) => ({ value: d, label: d }))}
          label="Select  the Designation"
        />
        {/* <FormSelect
          value={designation}
          handleChange={(v) => setDesignation(v as string)}
          options={designations.map((item) => ({value: item, label: item}))})}
          label="Select  the Designation"
        /> */}
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
