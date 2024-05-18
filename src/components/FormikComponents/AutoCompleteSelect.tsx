import {
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";

interface Props {
  name: string;
  label: string;
  placeHolder: string;
  disabled?: boolean;
  options: { value: string; label: string }[];
  sx?: Object;
}

const AutoCompleteSelect: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,
  options,
  sx,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  if (field.value) {
    const option = options.find((option) => option.value === field.value);
    if (option === undefined) {
      setFieldValue(name, "", false);
    }
  }

  const { onChange, value, ...fieldWithoutOnChange } = field;
  return (
    <FormControl
      fullWidth
      error={isError}
      disabled={disabled}
      sx={{ my: 2, maxWidth: { xs: 250, xl: 300 }, width: "100%" }}
    >
      <FormLabel color="secondary" sx={{ fontWeight: "700", my: 0.5 }}>
        {label}
      </FormLabel>
      <Autocomplete
        options={options}
        value={options.find((c) => c.value === field.value)}
        onChange={(e, value) => setFieldValue(name, (value as any).value)}
        clearIcon={null}
        disableClearable={true}
        renderInput={(params) => <TextField {...params} />}
        {...fieldWithoutOnChange}
        {...props}
      />

      {isError && (
        <FormHelperText sx={{ color: "#f44336" }}>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default AutoCompleteSelect;
