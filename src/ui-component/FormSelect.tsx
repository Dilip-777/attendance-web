import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";

interface props extends SelectProps<string | number> {
  value: string | number;
  handleChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  label?: string;
  fullWidth?: boolean;
}

export default function FormSelect({
  value,
  handleChange,
  options,
  label,
  fullWidth,
  ...props
}: props) {
  return (
    <FormControl fullWidth={fullWidth} sx={{ minWidth: "15rem" }}>
      {label && <FormLabel sx={{ fontWeight: "700" }}>{label}</FormLabel>}
      <Select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
