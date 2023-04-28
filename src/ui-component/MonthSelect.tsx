import { Box, FormLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface props {
  value: Dayjs;
  onChange: (value: Dayjs | null) => void;
  label?: string;
}

export default function MonthSelect({ value, onChange, label }: props) {
  return (
    <Box display="flex" flexDirection="column">
      {label && <FormLabel sx={{ fontWeight: "700" }}>{label}</FormLabel>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ minWidth: "15rem" }}
          views={["month", "year"]}
          value={value}
          onChange={(newValue) => onChange(newValue)}
        />
      </LocalizationProvider>
    </Box>
  );
}
