import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";

interface props {
  value: string | number;
  handleChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  label?: string;
}

export default function FormSelect({
  value,
  handleChange,
  options,
  label,
}: props) {
  return (
    <FormControl sx={{ minWidth: "15rem" }}>
      {label && <FormLabel sx={{ fontWeight: "700" }}>{label}</FormLabel>}
      <Select value={value} onChange={(e) => handleChange(e.target.value)}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
