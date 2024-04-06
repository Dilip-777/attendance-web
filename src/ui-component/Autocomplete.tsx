import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface AutocompleteProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  label: string;
  options: { value: string; label: string }[];
}

export default function AutoComplete({
  value,
  setValue,
  label,
  options,
}: AutocompleteProps) {
  const v = options.find((c) => c.value === value);
  return (
    <Box sx={{ minWidth: 240 }}>
      {label && <FormLabel sx={{ fontWeight: "700" }}>{label}</FormLabel>}
      <Autocomplete
        options={options}
        value={v}
        onChange={(e, value) => setValue(value?.value as string)}
        clearIcon={null}
        disableClearable={true}
        renderInput={(params) => <TextField {...params} />}
        sx={{ maxWidth: { xs: 250, xl: 300 } }}
      />
    </Box>
  );
}
