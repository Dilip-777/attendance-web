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
import { Box, Button, FormLabel, Stack, styled } from "@mui/material";
import { alpha } from "@mui/material";
import { Contractor } from "@prisma/client";

interface EnhancedTableToolbarProps {
  numSelected: number;
  filtername: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
  handleClickReport?: () => void;
  upload?: React.ReactNode;
  handleOpen?: () => void;
  selected?: { value: string; label: string } | null;
  setSelected?: React.Dispatch<
    React.SetStateAction<{ value: string; label: string } | null>
  >;
  contractors?: Contractor[];
}

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 40,
  marginRight: 30,
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    filtername,
    setFilterName,
    handleClickReport,
    type,
    handleOpen,
    selected,
    setSelected,
    contractors,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.secondary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
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
          {/* <Box sx={{ minWidth: 240 }}>
            <Autocomplete
              options={contractors}
              value={
                contractors?.find((c) => c.label === contractorName) || null
              }
              onChange={(e, value) => setContractorName(value?.label as string)}
              renderInput={(params) => (
                <TextField {...params} label="Select Contractor" />
              )}
            />
          </Box> */}
        </Stack>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : handleClickReport || props.upload ? (
        <Stack direction="row" spacing={2}>
          {type === "contractor" && handleOpen && (
            <Tooltip title="Personalise Columns">
              <IconButton onClick={handleOpen}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}

          {handleClickReport && (
            <Tooltip title="Print">
              <IconButton onClick={handleClickReport}>
                <LocalPrintshopIcon />
              </IconButton>
            </Tooltip>
          )}

          {props.upload && (
            <Tooltip title="Upload">
              <Box>{props.upload}</Box>
            </Tooltip>
          )}
        </Stack>
      ) : props.upload ? (
        props.upload
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterList />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
