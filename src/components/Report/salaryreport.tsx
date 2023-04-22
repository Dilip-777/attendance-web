import FormSelect from "@/ui-component/FormSelect";
import MonthSelect from "@/ui-component/MonthSelect";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Contractor, Employee, payoutTracker } from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

export default function SalaryReport({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [contractor, setContractor] = useState(
    contractors[0].contractorname || ""
  );
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/report?type=salary&contractor=${contractor}`
    );
    console.log(res);

    const tableRows = [
      [
        "Contractor Id",
        "Contractor Name",
        "Month",
        "Final Amount",
        "Net Payable",
        "Deduction",
        "Actual Paid Out Money",
        "Balance",
      ],
    ];
    res.data.forEach((item: payoutTracker) => {
      tableRows.push([
        item.contractorId.toString(),
        item.contractorName,
        item.month,
        item.amount.toString(),
        item.finalpayableamount.toString(),
        item.deduction.toString(),
        item.actualpaidoutmoney.toString(),
        item.balance.toString(),
      ]);
    });
    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Contractor_Payout.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Salary Report</Typography>
      <Stack sx={{ maxWidth: "7rem" }} spacing={3}>
        <FormSelect
          value={contractor}
          handleChange={(v) => setContractor(v as string)}
          options={contractors.map((contractor) => ({
            value: contractor.contractorname as string,
            label: contractor.contractorname,
          }))}
          label="Contractor"
        />
        <Button
          sx={{ maxWidth: "7rem" }}
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          Print
          {loading && (
            <CircularProgress size={15} sx={{ ml: 1, color: "#364152" }} />
          )}
        </Button>
      </Stack>
    </Stack>
  );
}
