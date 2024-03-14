import Delete from "@mui/icons-material/Delete";
import FilterList from "@mui/icons-material/FilterList";
import Search from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Autocomplete,
  Box,
  Button,
  FormLabel,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { alpha } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface EnhancedTableToolbarProps {
  filtername: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
  handleClickReport: () => void;
  selectedContractor: { value: string; label: string } | null;
  setSelectedContractor: React.Dispatch<
    React.SetStateAction<{ value: string; label: string } | null>
  >;
  contractors: { value: string; label: string }[];
  month: Dayjs;
  setMonth: React.Dispatch<React.SetStateAction<Dayjs>>;
}

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 50,
  marginRight: 30,
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    filtername,
    setFilterName,
    handleClickReport,
    selectedContractor,
    setSelectedContractor,
    contractors,
    month,
    setMonth,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={2}>
        <StyledSearch
          value={filtername}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Search ..."
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
        <Box sx={{ minWidth: 240 }}>
          <Autocomplete
            options={contractors}
            value={selectedContractor}
            onChange={(e, value) => setSelectedContractor(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Contractor" />
            )}
          />
        </Box>
        {month && setMonth && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["month", "year"]}
              value={month}
              onChange={(newValue) => {
                if (newValue) setMonth(newValue);
              }}
            />
          </LocalizationProvider>
        )}
      </Stack>
      <Stack direction="row" spacing={2}>
        <Tooltip title="Print">
          <IconButton onClick={handleClickReport}>
            <LocalPrintshopIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Toolbar>
  );
}
