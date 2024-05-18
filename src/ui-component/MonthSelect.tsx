import { Box, FormLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface props {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  label?: string;
  maxDate?: Dayjs | null;
}

export default function MonthSelect({
  value,
  onChange,
  label,
  maxDate = dayjs(),
}: props) {
  return (
    <Box display="flex" flexDirection="column">
      {label && <FormLabel sx={{ fontWeight: "700" }}>{label}</FormLabel>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {value ? (
          <DatePicker
            sx={{ minWidth: "15rem", maxWidth: { xs: 250, xl: 300 } }}
            views={["month", "year"]}
            value={value}
            onChange={(newValue) => onChange(newValue)}
            maxDate={maxDate}
          />
        ) : (
          <DatePicker
            sx={{ minWidth: "15rem" }}
            views={["month", "year"]}
            // value={value}
            onChange={(newValue) => onChange(newValue)}
            maxDate={maxDate}
          />
        )}
      </LocalizationProvider>
    </Box>
  );
}
